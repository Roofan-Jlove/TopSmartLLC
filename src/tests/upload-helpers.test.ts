import { describe, expect, it } from 'vitest';
import { matchesFileSignature } from '@/lib/magic-bytes';
import { generateReferenceId } from '@/lib/reference-id';
import { checkRateLimit } from '@/lib/rate-limit';
import { escapeHtml, sanitizeFilename, uniqueFilenames } from '@/lib/sanitize';
import { filterIncomingFiles, getExtension, isAllowedExtension } from '@/lib/schemas/files';

const MB = 1024 * 1024;

describe('file rules', () => {
  it('allows documents and images, rejects executables and scripts', () => {
    for (const name of ['a.pdf', 'b.DOCX', 'c.png', 'd.jpeg', 'e.zip']) expect(isAllowedExtension(name)).toBe(true);
    for (const name of ['a.exe', 'b.js', 'c.svg', 'd.html', 'e.bat', 'noextension', '.env']) {
      expect(isAllowedExtension(name)).toBe(false);
    }
  });

  it('reads the last extension only', () => {
    expect(getExtension('report.final.PDF')).toBe('pdf');
    expect(getExtension('invoice.pdf.exe')).toBe('exe');
  });

  it('filterIncomingFiles enforces type, count and total size with clear messages', () => {
    const existing = [{ name: 'a.pdf', size: 3 * MB }];
    const result = filterIncomingFiles(
      existing,
      [
        { name: 'ok.png', size: 0.5 * MB },
        { name: 'virus.exe', size: 10 },
        { name: 'huge.pdf', size: 2 * MB },
        { name: 'empty.txt', size: 0 },
      ],
      4 * MB,
    );
    expect(result.accepted.map((f) => f.name)).toEqual(['ok.png']);
    expect(result.errors).toEqual([
      "virus.exe isn't an allowed file type.",
      'Attachments must be 4 MB or less in total. Share larger files with a link instead.',
      'empty.txt is empty.',
    ]);
  });

  it('filterIncomingFiles caps the number of files at 5', () => {
    const six = Array.from({ length: 6 }, (_, i) => ({ name: `f${i}.pdf`, size: 10 }));
    const result = filterIncomingFiles([], six, 4 * MB);
    expect(result.accepted).toHaveLength(5);
    expect(result.errors).toEqual(['You can attach up to 5 files.']);
  });
});

describe('magic bytes', () => {
  const bytes = (...values: number[]) => Uint8Array.from(values);

  it('accepts matching signatures', () => {
    expect(matchesFileSignature('a.pdf', new TextEncoder().encode('%PDF-1.7'))).toBe(true);
    expect(matchesFileSignature('a.jpg', bytes(0xff, 0xd8, 0xff, 0xe0))).toBe(true);
    expect(matchesFileSignature('a.docx', bytes(0x50, 0x4b, 0x03, 0x04, 0))).toBe(true);
    expect(matchesFileSignature('a.doc', bytes(0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1))).toBe(true);
    expect(matchesFileSignature('a.txt', new TextEncoder().encode('hello'))).toBe(true);
    expect(matchesFileSignature('a.webp', new TextEncoder().encode('RIFF\0\0\0\0WEBPVP8 '))).toBe(true);
  });

  it('rejects renamed or malformed files', () => {
    const exe = bytes(0x4d, 0x5a, 0x90, 0x00);
    expect(matchesFileSignature('photo.png', exe)).toBe(false);
    expect(matchesFileSignature('notes.txt', exe)).toBe(false);
    expect(matchesFileSignature('data.csv', bytes(0x61, 0x00, 0x62))).toBe(false);
    expect(matchesFileSignature('a.pdf', new Uint8Array())).toBe(false);
    expect(matchesFileSignature('a.exe', exe)).toBe(false);
  });
});

describe('sanitize', () => {
  it('strips paths and unsafe characters but keeps the extension', () => {
    expect(sanitizeFilename('C:\\Users\\me\\brief.pdf')).toBe('brief.pdf');
    expect(sanitizeFilename('../../etc/passwd.txt')).toBe('passwd.txt');
    // The extension is normalized to lower case.
    expect(sanitizeFilename('we<ird>:na"me?.PNG')).toBe('weirdname.png');
  });

  it('falls back to a safe name and caps length', () => {
    expect(sanitizeFilename('....pdf')).toBe('attachment.pdf');
    expect(sanitizeFilename(`${'a'.repeat(300)}.pdf`).length).toBeLessThanOrEqual(100);
  });

  it('makes duplicate names unique', () => {
    expect(uniqueFilenames(['a.pdf', 'A.pdf', 'b.png', 'a.pdf'])).toEqual(['a.pdf', 'A-2.pdf', 'b.png', 'a-3.pdf']);
  });

  it('escapes HTML', () => {
    expect(escapeHtml(`<script>alert("x")</script> & 'y'`)).toBe(
      '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;y&#39;',
    );
  });
});

describe('reference id and rate limit', () => {
  it('generates TSL-YYYYMMDD-XXXXXX ids that differ', () => {
    const id = generateReferenceId(new Date('2026-11-09T10:00:00Z'));
    expect(id).toMatch(/^TSL-20261109-[A-HJ-NP-Z2-9]{6}$/);
    expect(generateReferenceId()).not.toBe(generateReferenceId());
  });

  it('blocks after the limit and recovers after the window', () => {
    const key = 'rate-test';
    const t0 = 1_000_000;
    for (let i = 0; i < 3; i++) expect(checkRateLimit(key, 3, t0 + i).allowed).toBe(true);
    const blocked = checkRateLimit(key, 3, t0 + 10);
    expect(blocked.allowed).toBe(false);
    expect(checkRateLimit(key, 3, t0 + 61_000).allowed).toBe(true);
  });
});

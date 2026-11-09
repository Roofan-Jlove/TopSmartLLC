import { getExtension } from './schemas/files';

const MAX_NAME_LENGTH = 100;

/** Removes paths, control characters and risky symbols, keeps the extension, caps length. */
export function sanitizeFilename(original: string): string {
  const base = original.split(/[\\/]/).pop() ?? '';
  const ext = getExtension(base);
  const stem = (ext ? base.slice(0, base.length - ext.length - 1) : base)
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f<>:"|?*]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^\.+/, '')
    .trim();
  const safeStem = stem || 'attachment';
  const suffix = ext ? `.${ext}` : '';
  return `${safeStem.slice(0, MAX_NAME_LENGTH - suffix.length)}${suffix}`;
}

/** Appends -2, -3 ... so two attachments never share a name. */
export function uniqueFilenames(names: string[]): string[] {
  const seen = new Map<string, number>();
  return names.map((name) => {
    const key = name.toLowerCase();
    const count = (seen.get(key) ?? 0) + 1;
    seen.set(key, count);
    if (count === 1) return name;
    const ext = getExtension(name);
    const stem = ext ? name.slice(0, name.length - ext.length - 1) : name;
    return `${stem}-${count}${ext ? `.${ext}` : ''}`;
  });
}

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);
}

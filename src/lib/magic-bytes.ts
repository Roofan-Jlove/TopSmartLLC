import { getExtension } from './schemas/files';

const startsWith = (buffer: Uint8Array, signature: number[], offset = 0) =>
  signature.every((byte, index) => buffer[offset + index] === byte);

const ascii = (text: string) => Array.from(text).map((char) => char.charCodeAt(0));

const ZIP_SIGNATURES = [
  [0x50, 0x4b, 0x03, 0x04],
  [0x50, 0x4b, 0x05, 0x06],
  [0x50, 0x4b, 0x07, 0x08],
];

/**
 * Confirms the file's leading bytes match its extension, so a renamed
 * executable or script cannot pass as an image or document.
 */
export function matchesFileSignature(filename: string, buffer: Uint8Array): boolean {
  const ext = getExtension(filename);
  if (buffer.length === 0) return false;

  switch (ext) {
    case 'pdf':
      return startsWith(buffer, ascii('%PDF'));
    case 'png':
      return startsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case 'jpg':
    case 'jpeg':
      return startsWith(buffer, [0xff, 0xd8, 0xff]);
    case 'gif':
      return startsWith(buffer, ascii('GIF87a')) || startsWith(buffer, ascii('GIF89a'));
    case 'webp':
      return startsWith(buffer, ascii('RIFF')) && startsWith(buffer, ascii('WEBP'), 8);
    case 'doc':
    case 'xls':
    case 'ppt':
      return startsWith(buffer, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
    case 'docx':
    case 'xlsx':
    case 'pptx':
    case 'zip':
      return ZIP_SIGNATURES.some((signature) => startsWith(buffer, signature));
    case 'rtf':
      return startsWith(buffer, ascii('{\\rtf'));
    case 'txt':
    case 'csv': {
      // Plain text must not contain NUL bytes or look like an executable ("MZ", ELF).
      const head = buffer.subarray(0, 8192);
      if (head.includes(0)) return false;
      return !startsWith(head, ascii('MZ')) && !startsWith(head, [0x7f, 0x45, 0x4c, 0x46]);
    }
    default:
      return false;
  }
}

/** Attachment rules shared by the browser (fast feedback) and the server (enforcement). See docs/API_AND_DATA_FLOW.md section 3. */

export const MAX_FILES = 5;
export const DEFAULT_MAX_UPLOAD_MB = 4;

export const ALLOWED_FILE_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  txt: 'text/plain',
  csv: 'text/csv',
  rtf: 'application/rtf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  zip: 'application/zip',
};

export const ACCEPT_ATTRIBUTE = Object.keys(ALLOWED_FILE_TYPES)
  .map((ext) => `.${ext}`)
  .join(',');

export const ALLOWED_EXTENSIONS_LABEL = 'PDF, Word, Excel, PowerPoint, images, TXT, CSV, ZIP';

export function getExtension(filename: string): string {
  const index = filename.lastIndexOf('.');
  return index < 0 ? '' : filename.slice(index + 1).toLowerCase();
}

export function isAllowedExtension(filename: string): boolean {
  return Object.prototype.hasOwnProperty.call(ALLOWED_FILE_TYPES, getExtension(filename));
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const fileMessages = {
  type: (name: string) => `${name} isn't an allowed file type.`,
  empty: (name: string) => `${name} is empty.`,
  count: `You can attach up to ${MAX_FILES} files.`,
  size: (maxBytes: number) =>
    `Attachments must be ${Math.round((maxBytes / (1024 * 1024)) * 10) / 10} MB or less in total. Share larger files with a link instead.`,
  corrupt: (name: string) => `${name} appears to be corrupted or isn't what its extension says.`,
} as const;

export type FileLike = { name: string; size: number };

/**
 * Browser-side check when adding files. Returns the files that can be kept
 * and a human-readable message for each rejection.
 */
export function filterIncomingFiles<T extends FileLike>(
  existing: FileLike[],
  incoming: T[],
  maxBytes: number,
): { accepted: T[]; errors: string[] } {
  const accepted: T[] = [];
  const errors: string[] = [];
  let count = existing.length;
  let total = existing.reduce((sum, file) => sum + file.size, 0);

  for (const file of incoming) {
    if (!isAllowedExtension(file.name)) errors.push(fileMessages.type(file.name));
    else if (file.size === 0) errors.push(fileMessages.empty(file.name));
    else if (count >= MAX_FILES) errors.push(fileMessages.count);
    else if (total + file.size > maxBytes) errors.push(fileMessages.size(maxBytes));
    else {
      accepted.push(file);
      count += 1;
      total += file.size;
    }
  }
  return { accepted, errors: Array.from(new Set(errors)) };
}

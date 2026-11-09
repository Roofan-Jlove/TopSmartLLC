// No 0/O/1/I so an ID read over the phone or email cannot be misread.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** TSL-YYYYMMDD-XXXXXX */
export function generateReferenceId(now: Date = new Date()): string {
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const code = Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join('');
  return `TSL-${date}-${code}`;
}

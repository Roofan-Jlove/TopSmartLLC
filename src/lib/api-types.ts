/** Response shapes of POST /api/contact. See docs/API_AND_DATA_FLOW.md section 5. */

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'PAYLOAD_TOO_LARGE'
  | 'FILE_TYPE_NOT_ALLOWED'
  | 'RATE_LIMITED'
  | 'INVALID_REQUEST'
  | 'DISPATCH_FAILED';

export type ContactSuccess = { ok: true; referenceId: string; attachmentsReceived: number };

export type ContactError = {
  ok: false;
  error: { code: ApiErrorCode; message: string; fields?: Record<string, string> };
};

export type ContactResponse = ContactSuccess | ContactError;

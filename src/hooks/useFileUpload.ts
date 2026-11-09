'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { filterIncomingFiles } from '@/lib/schemas/files';

export type AttachedFile = {
  id: string;
  file: File;
  /** Object URL for image thumbnails. Revoked when the file is removed. */
  previewUrl?: string;
};

let counter = 0;

/** Attachment state with the same rules the server enforces (type, count, total size). */
export function useFileUpload(maxBytes: number) {
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const filesRef = useRef<AttachedFile[]>([]);
  filesRef.current = files;

  const addFiles = useCallback(
    (incoming: File[]) => {
      const current = filesRef.current;
      const { accepted, errors: rejected } = filterIncomingFiles(
        current.map((item) => item.file),
        incoming,
        maxBytes,
      );
      setErrors(rejected);
      if (accepted.length === 0) return;
      const added = accepted.map<AttachedFile>((file) => ({
        id: `file-${++counter}`,
        file,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      }));
      setFiles([...current, ...added]);
    },
    [maxBytes],
  );

  const removeFile = useCallback((id: string) => {
    setFiles((current) => {
      const target = current.find((item) => item.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return current.filter((item) => item.id !== id);
    });
    setErrors([]);
  }, []);

  const setServerError = useCallback((message: string) => setErrors([message]), []);
  const clearErrors = useCallback(() => setErrors([]), []);

  const reset = useCallback(() => {
    filesRef.current.forEach((item) => item.previewUrl && URL.revokeObjectURL(item.previewUrl));
    setFiles([]);
    setErrors([]);
  }, []);

  // Release object URLs when the form unmounts.
  useEffect(
    () => () => {
      filesRef.current.forEach((item) => item.previewUrl && URL.revokeObjectURL(item.previewUrl));
    },
    [],
  );

  const totalBytes = files.reduce((sum, item) => sum + item.file.size, 0);

  return { files, errors, totalBytes, addFiles, removeFile, setServerError, clearErrors, reset };
}

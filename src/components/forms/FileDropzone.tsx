'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { AttachedFile } from '@/hooks/useFileUpload';
import { ACCEPT_ATTRIBUTE, ALLOWED_EXTENSIONS_LABEL, MAX_FILES, formatBytes } from '@/lib/schemas/files';
import { cn } from '@/lib/utils';
import { FilePreviewList } from './FilePreviewList';

type FileDropzoneProps = {
  files: AttachedFile[];
  errors: string[];
  totalBytes: number;
  maxBytes: number;
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
};

export function FileDropzone({ files, errors, totalBytes, maxBytes, onAdd, onRemove }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const labelId = useId();
  const hintId = useId();
  const usedPercent = Math.min(100, Math.round((totalBytes / maxBytes) * 100));

  // Paste screenshots or copied files straight into the form.
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const pasted = Array.from(event.clipboardData?.files ?? []);
      if (pasted.length > 0) onAdd(pasted);
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [onAdd]);

  return (
    <div>
      <p id={labelId} className="mb-1.5 text-sm font-medium">
        Attachments <span className="font-normal text-muted">(optional)</span>
      </p>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          onAdd(Array.from(event.dataTransfer.files));
        }}
        className={cn(
          'rounded-md border-2 border-dashed p-6 text-center transition',
          dragging ? 'border-brand bg-bg-subtle' : 'border-border bg-surface',
        )}
      >
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-bg-subtle text-brand">
          <Icon name="upload" size={24} />
        </span>
        <p className="mt-3 font-medium">Drag and drop files here, or paste an image</p>
        <p id={hintId} className="mt-1 text-sm text-muted">
          {ALLOWED_EXTENSIONS_LABEL}. Up to {MAX_FILES} files, {formatBytes(maxBytes)} in total.
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT_ATTRIBUTE}
          tabIndex={-1}
          className="sr-only"
          aria-labelledby={labelId}
          aria-describedby={hintId}
          onChange={(event) => {
            onAdd(Array.from(event.target.files ?? []));
            event.target.value = '';
          }}
        />
        <Button variant="secondary" className="mt-4" onClick={() => inputRef.current?.click()}>
          Browse files
        </Button>
      </div>

      <div className="mt-3" aria-hidden="true">
        <div className="h-1.5 overflow-hidden rounded-full bg-border">
          <div
            className={cn('h-full rounded-full transition-all duration-300', usedPercent >= 90 ? 'bg-warning' : 'bg-brand')}
            style={{ width: `${usedPercent}%` }}
          />
        </div>
      </div>
      <p className="mt-1.5 text-xs text-muted">
        {formatBytes(totalBytes)} of {formatBytes(maxBytes)} used · {files.length} of {MAX_FILES} files
      </p>

      {errors.length > 0 ? (
        <ul role="alert" className="mt-3 space-y-1 text-sm text-danger">
          {errors.map((message) => (
            <li key={message} className="flex items-start gap-1.5">
              <Icon name="close" size={16} className="mt-0.5 shrink-0" />
              {message}
            </li>
          ))}
        </ul>
      ) : null}

      <FilePreviewList files={files} onRemove={onRemove} />
      <p role="status" className="sr-only">
        {files.length === 0 ? 'No files attached.' : `${files.length} ${files.length === 1 ? 'file' : 'files'} attached.`}
      </p>
    </div>
  );
}

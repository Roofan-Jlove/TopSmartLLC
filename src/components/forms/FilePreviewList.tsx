import { Icon } from '@/components/ui/Icon';
import type { AttachedFile } from '@/hooks/useFileUpload';
import { formatBytes, getExtension } from '@/lib/schemas/files';

type FilePreviewListProps = {
  files: AttachedFile[];
  onRemove: (id: string) => void;
};

export function FilePreviewList({ files, onRemove }: FilePreviewListProps) {
  if (files.length === 0) return null;

  return (
    <ul className="mt-4 space-y-2" aria-label="Attached files">
      {files.map(({ id, file, previewUrl }) => (
        <li key={id} className="flex items-center gap-3 rounded-md border border-border bg-surface p-2.5 pr-3">
          {previewUrl ? (
            // Blob URLs from the user's own device cannot use next/image.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt={`Preview of ${file.name}`} className="h-12 w-12 shrink-0 rounded-sm object-cover" />
          ) : (
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-bg-subtle text-xs font-bold uppercase text-brand"
              aria-hidden="true"
            >
              {getExtension(file.name).slice(0, 4)}
            </span>
          )}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">{file.name}</span>
            <span className="block text-xs text-muted">{formatBytes(file.size)}</span>
          </span>
          <button
            type="button"
            onClick={() => onRemove(id)}
            aria-label={`Remove ${file.name}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-bg-subtle hover:text-danger"
          >
            <Icon name="close" size={20} />
          </button>
        </li>
      ))}
    </ul>
  );
}

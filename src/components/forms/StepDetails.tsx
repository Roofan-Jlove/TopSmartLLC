'use client';

import type { UseFormReturn } from 'react-hook-form';
import { TextArea, TextField } from '@/components/ui/Field';
import type { useFileUpload } from '@/hooks/useFileUpload';
import type { LeadInput } from '@/lib/schemas/lead';
import { FileDropzone } from './FileDropzone';

type StepDetailsProps = {
  form: UseFormReturn<LeadInput>;
  upload: ReturnType<typeof useFileUpload>;
  maxBytes: number;
};

export function StepDetails({ form, upload, maxBytes }: StepDetailsProps) {
  const { register, watch, formState } = form;
  const length = (watch('description') ?? '').length;

  return (
    <div className="space-y-6">
      <div>
        <TextArea
          label="Tell us about your project"
          placeholder="What are you building or writing? Who is it for? Any examples you like, features you need or deadlines we should know about?"
          error={formState.errors.description?.message}
          hint="The more detail, the more accurate our reply. At least 20 characters."
          {...register('description')}
        />
        <p className="mt-1 text-right text-xs text-muted" aria-hidden="true">
          {length.toLocaleString('en-US')} / 5,000
        </p>
      </div>

      <TextField
        label="Reference links"
        optional
        type="text"
        inputMode="url"
        placeholder="Your current website, Google Drive or Dropbox folder, competitor examples"
        hint="For files larger than the upload limit, paste a share link here."
        error={formState.errors.links?.message}
        {...register('links')}
      />

      <FileDropzone
        files={upload.files}
        errors={upload.errors}
        totalBytes={upload.totalBytes}
        maxBytes={maxBytes}
        onAdd={upload.addFiles}
        onRemove={upload.removeFile}
      />
    </div>
  );
}

// frontend/src/components/admin/cover-upload-field.tsx
'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { resolveMediaUrl, uploadReadingCover } from '@/lib/reading-services';
import { getApiErrorMessage } from '@/lib/api-error';
import { toast } from '@/store/toast-store';

export function CoverUploadField({
  value,
  onChange,
  onError,
}: {
  value: string;
  onChange: (url: string) => void;
  onError?: (message: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const preview = resolveMediaUrl(value);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadReadingCover(file);
      onChange(res.url);
      toast.success('Cover зураг upload хийлээ');
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Зураг upload амжилтгүй');
      onError?.(msg);
      toast.error(msg);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-mist-200">Cover зураг</p>
      <div className="flex flex-wrap items-start gap-4">
        <div className="relative h-40 w-28 overflow-hidden rounded-xl border border-ink-600 bg-ink-800">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Cover" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1 p-2 text-center text-xs text-mist-500">
              <ImagePlus className="h-6 w-6" />
              Зураггүй
            </div>
          )}
          {preview && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-1 top-1 rounded-md bg-ink-950/80 p-1 text-mist-300 hover:text-danger"
              title="Устгах"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => void handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-ink-600 bg-ink-800 px-4 py-2.5 text-sm text-mist-100 hover:border-brand/40 hover:text-brand disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImagePlus className="h-4 w-4" />
            )}
            {uploading ? 'Upload хийж байна…' : 'Зураг сонгох'}
          </button>
          <p className="text-xs text-mist-500">JPG, PNG, WebP, GIF · хамгийн ихдээ 5MB</p>
          {value && (
            <p className="truncate font-mono text-[11px] text-mist-500" title={value}>
              {value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

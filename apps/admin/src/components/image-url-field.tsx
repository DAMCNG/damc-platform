"use client";

import * as React from "react";
import { CldUploadWidget } from "next-cloudinary";
import { UploadCloud } from "lucide-react";
import { FormField, inputClass } from "@/components/form-field";
import { cn } from "@damc/ui";

const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUD_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && UPLOAD_PRESET);

/**
 * A plain image-URL text input, plus an "Upload" button that opens the Cloudinary
 * widget and fills the input in for you. Works as an uncontrolled field (like every
 * other form field in this app) — the upload just sets the DOM value directly.
 * If Cloudinary isn't configured (see .env.example), the button is hidden and this
 * behaves like an ordinary URL field.
 */
export function ImageUrlField({
  id,
  name,
  label = "Image URL",
  hint,
  defaultValue,
}: {
  id: string;
  name: string;
  label?: string;
  hint?: string;
  defaultValue?: string | null;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <FormField label={label} htmlFor={id} hint={hint}>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          id={id}
          name={name}
          defaultValue={defaultValue ?? ""}
          className={cn(inputClass, "flex-1")}
          placeholder="https://... or upload one"
        />
        {CLOUD_CONFIGURED && (
          <CldUploadWidget
            uploadPreset={UPLOAD_PRESET}
            onSuccess={(result) => {
              if (typeof result.info === "object" && result.info && "secure_url" in result.info && inputRef.current) {
                inputRef.current.value = result.info.secure_url as string;
              }
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-ink/12 px-3 text-xs font-semibold text-ink transition-colors hover:border-gold-deep hover:text-gold-deep dark:border-parchment/15 dark:text-parchment dark:hover:text-gold-bright"
              >
                <UploadCloud size={14} /> Upload
              </button>
            )}
          </CldUploadWidget>
        )}
      </div>
    </FormField>
  );
}

/**
 * Same idea as ImageUrlField, but for a one-URL-per-line textarea (e.g. the
 * gallery's multi-photo field). Each successful upload appends a new line
 * instead of replacing the textarea's contents.
 */
export function ImageUrlTextareaField({
  id,
  name,
  label,
  hint,
  rows = 3,
}: {
  id: string;
  name: string;
  label: string;
  hint?: string;
  rows?: number;
}) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  return (
    <FormField label={label} htmlFor={id} hint={hint}>
      <div className="space-y-2">
        <textarea ref={textareaRef} id={id} name={name} rows={rows} className={inputClass} />
        {CLOUD_CONFIGURED && (
          <CldUploadWidget
            uploadPreset={UPLOAD_PRESET}
            onSuccess={(result) => {
              if (typeof result.info === "object" && result.info && "secure_url" in result.info && textareaRef.current) {
                const current = textareaRef.current.value.trim();
                textareaRef.current.value = current
                  ? `${current}\n${result.info.secure_url}`
                  : (result.info.secure_url as string);
              }
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="flex items-center gap-1.5 rounded-lg border border-ink/12 px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-gold-deep hover:text-gold-deep dark:border-parchment/15 dark:text-parchment dark:hover:text-gold-bright"
              >
                <UploadCloud size={14} /> Upload a photo
              </button>
            )}
          </CldUploadWidget>
        )}
      </div>
    </FormField>
  );
}

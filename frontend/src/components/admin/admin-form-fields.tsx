export const selectClass =
  'w-full rounded-xl border border-ink-500 bg-ink-800 px-4 py-3 text-base text-mist-50 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-50';

export const textareaClass =
  'w-full rounded-xl border border-ink-500 bg-ink-800 px-4 py-3 text-base text-mist-50 placeholder:text-mist-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40';

export function FormField({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-mist-200">
        {label}
        {required && <span className="ml-1 text-danger">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-mist-400">{hint}</p>}
    </div>
  );
}

export function FormError({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
      {message}
    </div>
  );
}

export function FormSuccess({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-verb/30 bg-verb/10 px-4 py-3 text-sm text-verb">
      {message}
    </div>
  );
}

export function PrerequisiteWarning({
  message,
  actionHref,
  actionLabel,
}: {
  message: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="rounded-xl border border-verb/30 bg-verb/5 p-4">
      <p className="text-sm font-medium text-verb">Өмнөх алхам шаардлагатай</p>
      <p className="mt-1 text-sm text-mist-300">{message}</p>
      <a href={actionHref} className="mt-3 inline-block text-sm font-medium text-brand hover:underline">
        {actionLabel} →
      </a>
    </div>
  );
}

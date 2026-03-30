import { FormEvent, useState } from "react";
import { Plus, X } from "lucide-react";

type TaskEditorProps = {
  submitLabel: string;
  initialValue?: string;
  onSubmit: (title: string) => Promise<void>;
  onCancel?: () => void;
  disabled?: boolean;
  disabledMessage?: string;
};

export function TaskEditor({
  submitLabel,
  initialValue = "",
  onSubmit,
  onCancel,
  disabled = false,
  disabledMessage,
}: TaskEditorProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (disabled) {
      return;
    }
    const title = value.trim();
    if (!title) {
      setError("Title is required");
      return;
    }
    setError(null);
    await onSubmit(title);
    if (!initialValue) {
      setValue("");
    }
  }

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <div className="flex flex-wrap overflow-hidden rounded-full border border-soft bg-surface-subtle bg-white">
        <input
          className="min-w-56 flex-1 bg-transparent px-5 py-3 text-base text-ink-strong outline-none placeholder:text-ink-soft"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          maxLength={200}
          placeholder="Task title"
          disabled={disabled}
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-accent-blue px-6 py-3 text-base font-semibold tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
        >
          <Plus size={18} aria-hidden />
          {submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-muted bg-surface-muted px-4 py-3 text-sm font-medium text-ink-soft"
            onClick={onCancel}
          >
            <X size={15} aria-hidden />
            Cancel
          </button>
        ) : null}
      </div>
      {error ? <p className="text-xs text-error">{error}</p> : null}
      {disabled && disabledMessage ? <p className="text-xs text-warning">{disabledMessage}</p> : null}
    </form>
  );
}

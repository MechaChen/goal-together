import { FormEvent, useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";

type GoalTitleEditorProps = {
  initialTitle: string;
  onSave: (title: string) => Promise<void>;
  onCancel: () => void;
};

export function GoalTitleEditor({
  initialTitle,
  onSave,
  onCancel,
}: GoalTitleEditorProps) {
  const [value, setValue] = useState(initialTitle);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Title is required");
      return;
    }
    try {
      setError(null);
      await onSave(trimmed);
    } catch (errorValue) {
      setError(
        errorValue instanceof Error ? errorValue.message : "Failed to save title",
      );
    }
  }

  return (
    <form className="mt-1 space-y-1" onSubmit={(event) => void handleSubmit(event)}>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          className="min-w-44 flex-1 rounded-full border border-soft bg-white px-4 py-2 text-sm text-ink-strong outline-none placeholder:text-ink-soft"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              onCancel();
            }
          }}
          maxLength={200}
          placeholder="Goal title"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1 rounded-full bg-accent-blue px-3 py-2 text-xs font-semibold text-white"
        >
          <Check size={14} aria-hidden />
          Save
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-full border border-muted bg-surface-muted px-3 py-2 text-xs font-medium text-ink-soft"
          onClick={onCancel}
        >
          <X size={14} aria-hidden />
          Cancel
        </button>
      </div>
      {error ? <p className="text-xs text-error">{error}</p> : null}
    </form>
  );
}

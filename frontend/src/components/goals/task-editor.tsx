import { FormEvent, useState } from "react";
import { Plus, X } from "lucide-react";

type TaskEditorProps = {
  submitLabel: string;
  initialValue?: string;
  onSubmit: (title: string) => Promise<void>;
  onCancel?: () => void;
};

export function TaskEditor({ submitLabel, initialValue = "", onSubmit, onCancel }: TaskEditorProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
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
      <div className="flex flex-wrap overflow-hidden rounded-full border border-[#dfd6cf] bg-[var(--panel-soft)]">
        <input
          className="min-w-56 flex-1 bg-transparent px-5 py-3 text-base text-[var(--ink-strong)] outline-none placeholder:text-[var(--ink-soft)]"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          maxLength={200}
          placeholder="Task title"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-blue)] px-6 py-3 text-base font-semibold tracking-wide text-white"
        >
          <Plus size={18} aria-hidden />
          {submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-[#d8cdc5] bg-[#eee7e1] px-4 py-3 text-sm font-medium text-[var(--ink-soft)]"
            onClick={onCancel}
          >
            <X size={15} aria-hidden />
            Cancel
          </button>
        ) : null}
      </div>
      {error ? <p className="text-xs text-[#b95858]">{error}</p> : null}
    </form>
  );
}

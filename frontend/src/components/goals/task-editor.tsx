import { FormEvent, useState } from "react";

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
      <div className="flex gap-2">
        <input
          className="flex-1 rounded border border-slate-300 px-2 py-1"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          maxLength={200}
          placeholder="Task title"
        />
        <button type="submit" className="rounded bg-slate-900 px-3 py-1 text-sm text-white">
          {submitLabel}
        </button>
        {onCancel ? (
          <button type="button" className="rounded border border-slate-300 px-3 py-1 text-sm" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </form>
  );
}

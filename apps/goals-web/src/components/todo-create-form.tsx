import { FormEvent, useState } from "react";

type Props = {
  disabled: boolean;
  onCreate: (target: string) => Promise<void>;
};

export function TodoCreateForm({ disabled, onCreate }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Main target is required.");
      return;
    }
    setError(null);
    try {
      await onCreate(trimmed);
      setValue("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create todo.");
    }
  }

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium text-slate-700" htmlFor="main-target">
        Main target
      </label>
      <div className="flex gap-2">
        <input
          id="main-target"
          className="flex-1 rounded border border-slate-300 px-3 py-2"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Write your main target"
          maxLength={200}
        />
        <button
          type="submit"
          disabled={disabled}
          className="rounded bg-slate-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          Add
        </button>
      </div>
      {disabled ? <p className="text-xs text-amber-700">Maximum of 5 todos reached.</p> : null}
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </form>
  );
}

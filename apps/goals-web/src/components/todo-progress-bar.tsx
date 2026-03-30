import type { ProgressSummary } from "../services/todo-api.types";

type Props = {
  progress: ProgressSummary;
};

export function TodoProgressBar({ progress }: Props) {
  return (
    <section className="space-y-2 rounded border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between text-sm text-slate-700">
        <span>Progress</span>
        <span>{progress.label}</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded bg-slate-200">
        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${progress.percentage}%` }} />
      </div>
      <p className="text-xs text-slate-500">{progress.percentage}%</p>
    </section>
  );
}

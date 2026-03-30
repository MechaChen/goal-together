type TasksProgressPanelProps = {
  completedCount: number;
  totalCount: number;
  percentage: number;
  label: string;
};

export function TasksProgressPanel({
  completedCount,
  totalCount,
  percentage,
  label,
}: TasksProgressPanelProps) {
  return (
    <div className="space-y-2 rounded-2xl py-3">
      <div className="flex items-center justify-between text-sm font-semibold text-ink-strong">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-surface-list">
        <div
          className="h-full rounded-full bg-accent-orange transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-sm font-medium text-ink-soft">
        {completedCount}/{totalCount}
      </p>
    </div>
  );
}

import type { MainGoalItem } from "../../services/reward-hierarchy.types";

type ContextSelectorsProps = {
  items: MainGoalItem[];
  selectedMainGoalId: string | null;
  selectedSubGoalId: string | null;
  onSelectMainGoal: (id: string | null) => void;
  onSelectSubGoal: (id: string | null) => void;
};

export function ContextSelectors({
  items,
  selectedMainGoalId,
  selectedSubGoalId,
  onSelectMainGoal,
  onSelectSubGoal,
}: ContextSelectorsProps) {
  const selectedMainGoal = items.find((goal) => goal.id === selectedMainGoalId) ?? null;
  const subGoals = selectedMainGoal?.sub_goals ?? [];

  return (
    <section className="rounded border border-slate-200 bg-white p-3">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm text-slate-700">
          <span className="font-medium">Main Goal Context</span>
          <select
            className="w-full rounded border border-slate-300 px-2 py-1"
            value={selectedMainGoalId ?? ""}
            onChange={(event) => onSelectMainGoal(event.target.value || null)}
          >
            <option value="">Select main goal</option>
            {items.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm text-slate-700">
          <span className="font-medium">Sub Goal Context</span>
          <select
            className="w-full rounded border border-slate-300 px-2 py-1"
            value={selectedSubGoalId ?? ""}
            onChange={(event) => onSelectSubGoal(event.target.value || null)}
            disabled={!selectedMainGoal}
          >
            <option value="">Select sub goal</option>
            {subGoals.map((subGoal) => (
              <option key={subGoal.id} value={subGoal.id}>
                {subGoal.title}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}

import { FormEvent, useState } from "react";

import type { MainGoalItem } from "../services/reward-hierarchy.types";

type MainGoalsPageProps = {
  items: MainGoalItem[];
  selectedMainGoalId: string | null;
  onCreateMainGoal: (title: string, description?: string) => Promise<void>;
  onOpenSubGoals: (id: string) => void;
  onOpenRewardHistory: () => void;
};

export function MainGoalsPage({
  items,
  selectedMainGoalId,
  onCreateMainGoal,
  onOpenSubGoals,
  onOpenRewardHistory,
}: MainGoalsPageProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }
    await onCreateMainGoal(trimmed, description.trim() || undefined);
    setTitle("");
    setDescription("");
  }

  return (
    <section className="space-y-3 rounded border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-slate-900">Main Goals</h2>
      <div>
        <button className="rounded bg-slate-100 px-3 py-1 text-sm text-slate-900" onClick={onOpenRewardHistory}>
          Reward History
        </button>
      </div>
      <form className="space-y-2" onSubmit={(event) => void handleSubmit(event)}>
        <input
          className="w-full rounded border border-slate-300 px-2 py-1"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Main goal title"
        />
        <textarea
          className="w-full rounded border border-slate-300 px-2 py-1"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Description"
          rows={2}
        />
        <button className="rounded bg-slate-900 px-3 py-1 text-sm text-white" type="submit">
          Add main goal
        </button>
      </form>

      {items.length === 0 ? <p className="text-sm text-slate-500">No main goals yet.</p> : null}
      <ul className="space-y-2">
        {items.map((goal) => (
          <li key={goal.id} className="rounded border border-slate-200">
            <button className="w-full p-2 text-left" onClick={() => onOpenSubGoals(goal.id)}>
              <p className="font-medium text-slate-800">{goal.title}</p>
              <p className="text-xs text-slate-500">{goal.description ?? "No description"}</p>
              {selectedMainGoalId === goal.id ? <p className="pt-1 text-xs text-emerald-700">Active context</p> : null}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

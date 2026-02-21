import { FormEvent, useState } from "react";
import { CircleCheck, Circle, Plus, History } from "lucide-react";

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
    <section className="space-y-4 rounded-[32px] border border-[#ddd5ce] bg-[var(--panel-bg)] p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--ink-strong)]">Main Goals</h2>
        <button
          className="inline-flex items-center gap-2 rounded-full border border-[#d8cdc5] bg-[#eee7e1] px-3 py-1 text-sm font-medium text-[var(--ink-soft)]"
          onClick={onOpenRewardHistory}
        >
          <History size={16} aria-hidden />
          Reward History
        </button>
      </div>
      <form className="space-y-2" onSubmit={(event) => void handleSubmit(event)}>
        <div className="flex overflow-hidden rounded-full border border-[#dfd6cf] bg-[var(--panel-soft)]">
          <input
            className="flex-1 bg-transparent px-5 py-3 text-base text-[var(--ink-strong)] outline-none placeholder:text-[var(--ink-soft)]"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What do you need to do?"
          />
          <button
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-blue)] px-6 py-3 text-base font-semibold tracking-wide text-white"
            type="submit"
          >
            <Plus size={18} aria-hidden />
            ADD
          </button>
        </div>
        <textarea
          className="w-full rounded-2xl border border-[#dfd6cf] bg-[var(--panel-soft)] px-4 py-2 text-sm text-[var(--ink-strong)] outline-none placeholder:text-[var(--ink-soft)]"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Optional description"
          rows={2}
        />
      </form>

      {items.length === 0 ? <p className="text-sm text-[var(--ink-soft)]">No main goals yet.</p> : null}
      <ul className="space-y-2 rounded-[28px] bg-[#e8e1db] px-4 py-3">
        {items.map((goal) => (
          <li key={goal.id} className="border-b border-[var(--accent-line)] last:border-none">
            <button className="w-full py-2 text-left" onClick={() => onOpenSubGoals(goal.id)}>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-[var(--accent-orange)]">
                  {selectedMainGoalId === goal.id ? <CircleCheck size={24} /> : <Circle size={24} className="text-[#6f7377]" />}
                </span>
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      selectedMainGoalId === goal.id ? "text-[#9da0a3] line-through" : "text-[var(--ink-strong)]"
                    }`}
                  >
                    {goal.title}
                  </p>
                  <p className="text-xs text-[var(--ink-soft)]">{goal.description ?? "No description"}</p>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

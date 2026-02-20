import { useState } from "react";

import { HierarchySidebar } from "../components/layout/hierarchy-sidebar";
import type { MainGoalItem } from "../services/reward-hierarchy.types";

type SubGoalsPageProps = {
  items: MainGoalItem[];
  selectedMainGoalId: string | null;
  selectedSubGoalId: string | null;
  onCreateSubGoal: (mainGoalId: string, title: string) => Promise<void>;
  onSelectMainGoal: (id: string) => void;
  onOpenTasks: (id: string) => void;
  onBackToMain: () => void;
};

export function SubGoalsPage({
  items,
  selectedMainGoalId,
  selectedSubGoalId,
  onCreateSubGoal,
  onSelectMainGoal,
  onOpenTasks,
  onBackToMain,
}: SubGoalsPageProps) {
  const [title, setTitle] = useState("");
  const mainGoal = items.find((goal) => goal.id === selectedMainGoalId) ?? null;

  return (
    <section className="flex flex-col gap-4 md:flex-row">
      <HierarchySidebar
        title="Main Goals"
        items={items.map((goal) => ({ id: goal.id, title: goal.title }))}
        selectedId={selectedMainGoalId}
        emptyText="No main goals yet."
        onSelect={onSelectMainGoal}
        onBackToMain={onBackToMain}
      />
      <div className="flex-1 space-y-3 rounded border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">
          {mainGoal ? `Sub Goals for ${mainGoal.title}` : "Sub Goals"}
        </h2>
        {!mainGoal ? <p className="text-sm text-slate-500">Choose a Main Goal in the sidebar.</p> : null}
        {mainGoal ? (
          <>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const trimmed = title.trim();
                if (!trimmed) {
                  return;
                }
                void onCreateSubGoal(mainGoal.id, trimmed);
                setTitle("");
              }}
            >
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded border border-slate-300 px-2 py-1"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Sub goal title"
                />
                <button className="rounded bg-slate-900 px-3 py-1 text-sm text-white" type="submit">
                  Add
                </button>
              </div>
            </form>

            <ul className="space-y-2">
              {mainGoal.sub_goals.map((subGoal) => (
                <li key={subGoal.id} className="rounded border border-slate-200">
                  <button className="w-full p-2 text-left" onClick={() => onOpenTasks(subGoal.id)}>
                    <p className="font-medium text-slate-800">{subGoal.title}</p>
                    {selectedSubGoalId === subGoal.id ? <p className="pt-1 text-xs text-emerald-700">Active context</p> : null}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </section>
  );
}

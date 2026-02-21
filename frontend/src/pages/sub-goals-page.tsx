import { useState } from "react";
import { Circle, CircleCheck, Plus } from "lucide-react";

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
      <div className="flex-1 space-y-4 rounded-[32px] border border-[#ddd5ce] bg-[var(--panel-bg)] p-4 md:p-6">
        <h2 className="text-lg font-semibold text-[var(--ink-strong)]">
          {mainGoal ? `Sub Goals for ${mainGoal.title}` : "Sub Goals"}
        </h2>
        {!mainGoal ? <p className="text-sm text-[var(--ink-soft)]">Choose a Main Goal in the sidebar.</p> : null}
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
              <div className="flex overflow-hidden rounded-full border border-[#dfd6cf] bg-[var(--panel-soft)]">
                <input
                  className="flex-1 bg-transparent px-5 py-3 text-base text-[var(--ink-strong)] outline-none placeholder:text-[var(--ink-soft)]"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Sub goal title"
                />
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-blue)] px-6 py-3 text-base font-semibold tracking-wide text-white"
                  type="submit"
                >
                  <Plus size={18} aria-hidden />
                  ADD
                </button>
              </div>
            </form>

            <ul className="space-y-2 rounded-[24px] bg-[#e8e1db] px-4 py-3">
              {mainGoal.sub_goals.map((subGoal) => (
                <li key={subGoal.id} className="border-b border-[var(--accent-line)] last:border-none">
                  <button className="w-full py-2 text-left" onClick={() => onOpenTasks(subGoal.id)}>
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 text-[var(--accent-orange)]">
                        {selectedSubGoalId === subGoal.id ? (
                          <CircleCheck size={24} />
                        ) : (
                          <Circle size={24} className="text-[#6f7377]" />
                        )}
                      </span>
                      <div className="flex-1">
                        <p className={`font-medium ${selectedSubGoalId === subGoal.id ? "text-[#9da0a3] line-through" : "text-[var(--ink-strong)]"}`}>
                          {subGoal.title}
                        </p>
                      </div>
                    </div>
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

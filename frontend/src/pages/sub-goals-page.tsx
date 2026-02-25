import { useEffect, useState } from "react";
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
  isSidebarOpen: boolean;
  onCloseSidebar: () => void;
};

export function SubGoalsPage({
  items,
  selectedMainGoalId,
  selectedSubGoalId,
  onCreateSubGoal,
  onSelectMainGoal,
  onOpenTasks,
  onBackToMain,
  isSidebarOpen,
  onCloseSidebar,
}: SubGoalsPageProps) {
  const [title, setTitle] = useState("");
  const mainGoal = items.find((goal) => goal.id === selectedMainGoalId) ?? null;

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseSidebar();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSidebarOpen, onCloseSidebar]);

  return (
    <section className="relative">
      {isSidebarOpen ? (
        <>
          <button
            aria-label="Close sidebar overlay"
            className="fixed inset-0 z-30 bg-transparent"
            onClick={onCloseSidebar}
            type="button"
          />
          <div
            className="fixed left-4 top-32 z-40 w-[320px] max-w-[calc(100vw-2rem)]"
            id="hierarchy-sidebar-panel"
          >
            <HierarchySidebar
              title="Main Goals"
              items={items.map((goal) => ({ id: goal.id, title: goal.title }))}
              selectedId={selectedMainGoalId}
              emptyText="No main goals yet."
              onSelect={(id) => {
                onSelectMainGoal(id);
                onCloseSidebar();
              }}
              onBackToMain={() => {
                onBackToMain();
                onCloseSidebar();
              }}
            />
          </div>
        </>
      ) : null}
      <div className="flex-1 space-y-4 rounded-[32px] border border-panel bg-surface-card p-4 md:p-6">
        <h2 className="text-lg font-semibold text-ink-strong">
          {mainGoal ? `Sub Goals for ${mainGoal.title}` : "Sub Goals"}
        </h2>
        {!mainGoal ? (
          <p className="text-sm text-ink-soft">
            Choose a Main Goal in the sidebar.
          </p>
        ) : null}
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
              <div className="flex overflow-hidden rounded-full border border-soft bg-white">
                <input
                  className="flex-1 bg-transparent px-5 py-3 text-base text-ink-strong outline-none placeholder:text-ink-soft"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Sub goal title"
                />
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-accent-blue px-6 py-3 text-base font-semibold tracking-wide text-white"
                  type="submit"
                >
                  <Plus size={18} aria-hidden />
                  ADD
                </button>
              </div>
            </form>

            <ul className="space-y-2 rounded-[24px] bg-surface-list px-4 py-3">
              {mainGoal.sub_goals.length === 0 ? (
                <li className="py-2 text-sm text-ink-soft">
                  No sub goals yet. Add one above to get started.
                </li>
              ) : null}
              {mainGoal.sub_goals.map((subGoal) => (
                <li
                  key={subGoal.id}
                  className="border-b border-line-soft last:border-none"
                >
                  <button
                    className="w-full py-2 text-left"
                    onClick={() => onOpenTasks(subGoal.id)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 text-accent-orange">
                        {selectedSubGoalId === subGoal.id ? (
                          <CircleCheck size={24} />
                        ) : (
                          <Circle size={24} className="text-ink-icon" />
                        )}
                      </span>
                      <div className="flex-1">
                        <p
                          className={`font-medium ${selectedSubGoalId === subGoal.id ? "text-ink-disabled line-through" : "text-ink-strong"}`}
                        >
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

import { useEffect, useMemo, useState } from "react";
import { ListTodo } from "lucide-react";

import { HierarchySidebar } from "../components/layout/hierarchy-sidebar";
import { TaskEditor } from "../components/goals/task-editor";
import type {
  AppToastKind,
  BulkConfirmDraftTasksResult,
  CompleteTaskResult,
} from "../services/reward-hierarchy.types";
import { TaskRow } from "../components/goals/task-row";
import type { MainGoalItem } from "../services/reward-hierarchy.types";

type TasksPageProps = {
  items: MainGoalItem[];
  selectedMainGoalId: string | null;
  selectedSubGoalId: string | null;
  completionHint: string | null;
  onCreateTask: (subGoalId: string, title: string) => Promise<void>;
  onUpdateTask: (taskId: string, title: string) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onConfirmDraftTasks: (
    subGoalId: string,
  ) => Promise<BulkConfirmDraftTasksResult>;
  onCompleteTask: (taskId: string) => Promise<CompleteTaskResult>;
  onCompletionHint: (hint: string | null) => void;
  onNotify: (kind: AppToastKind, message: string) => void;
  onSelectSubGoal: (id: string) => void;
  onBackToMain: () => void;
  isSidebarOpen: boolean;
  onCloseSidebar: () => void;
};

export function TasksPage({
  items,
  selectedMainGoalId,
  selectedSubGoalId,
  completionHint,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onConfirmDraftTasks,
  onCompleteTask,
  onCompletionHint,
  onNotify,
  onSelectSubGoal,
  onBackToMain,
  isSidebarOpen,
  onCloseSidebar,
}: TasksPageProps) {
  const selectedMainGoal = useMemo(
    () => items.find((goal) => goal.id === selectedMainGoalId) ?? null,
    [items, selectedMainGoalId],
  );

  const subGoals = selectedMainGoal?.sub_goals ?? [];

  const subGoal = useMemo(() => {
    return subGoals.find((entry) => entry.id === selectedSubGoalId) ?? null;
  }, [subGoals, selectedSubGoalId]);

  const [error, setError] = useState<string | null>(null);
  const isTaskLimitReached = !!subGoal && subGoal.tasks.length >= 5;
  const taskLimitMessage =
    "Task limit reached (5 per sub goal). Delete a task to add a new one.";
  const progress = useMemo(() => {
    if (!subGoal) {
      return { completedCount: 0, totalCount: 0, percentage: 0 };
    }
    const totalCount = subGoal.tasks.length;
    const completedCount = subGoal.tasks.filter(
      (task) => task.is_completed,
    ).length;
    const percentage =
      totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
    return { completedCount, totalCount, percentage };
  }, [subGoal]);

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
              title="Sub Goals"
              items={subGoals.map((item) => ({
                id: item.id,
                title: item.title,
              }))}
              selectedId={selectedSubGoalId}
              emptyText={
                selectedMainGoal
                  ? "No sub goals for this main goal yet."
                  : "Choose a main goal first."
              }
              onSelect={(id) => {
                onSelectSubGoal(id);
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
        <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-ink-strong">
          <ListTodo size={19} aria-hidden />
          <span>{subGoal ? `Tasks for ${subGoal.title}` : "Tasks"}</span>
        </h2>
        {!subGoal ? (
          <p className="text-sm text-ink-soft">
            Choose a Sub Goal in the sidebar.
          </p>
        ) : null}
        {subGoal ? (
          <div className="space-y-2">
            <div className="space-y-2 rounded-2xl  py-3">
              <div className="flex items-center justify-between text-sm font-semibold text-ink-strong">
                <span>Progress</span>
                <span>{progress.percentage}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-surface-list">
                <div
                  className="h-full rounded-full bg-accent-orange transition-all duration-500 ease-out"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <p className="text-sm font-medium text-ink-soft">
                {progress.completedCount}/{progress.totalCount}
              </p>
            </div>
            <TaskEditor
              submitLabel="Add task"
              disabled={isTaskLimitReached}
              disabledMessage={taskLimitMessage}
              onSubmit={async (title) => {
                if (isTaskLimitReached) {
                  setError(taskLimitMessage);
                  return;
                }
                try {
                  await onCreateTask(subGoal.id, title);
                  setError(null);
                } catch (err) {
                  setError(
                    err instanceof Error
                      ? err.message
                      : "Failed to create task",
                  );
                }
              }}
            />
            <button
              type="button"
              className="inline-flex items-center rounded-full border border-muted bg-surface-muted px-4 py-2 text-sm font-medium text-ink-strong disabled:cursor-not-allowed disabled:opacity-60"
              disabled={subGoal.tasks.every(
                (task) => task.lifecycle_state !== "draft",
              )}
              onClick={async () => {
                try {
                  const result = await onConfirmDraftTasks(subGoal.id);
                  if (result.confirmed_count > 0) {
                    onNotify(
                      "success",
                      `Confirmed ${result.confirmed_count} draft task(s).`,
                    );
                  } else {
                    onNotify("info", "No draft tasks to confirm.");
                  }
                  setError(null);
                } catch (err) {
                  const message =
                    err instanceof Error
                      ? err.message
                      : "Failed to confirm draft tasks";
                  onNotify("error", message);
                  setError(message);
                }
              }}
            >
              Confirm Draft Tasks
            </button>
          </div>
        ) : null}
        {error ? <p className="text-sm text-error-strong">{error}</p> : null}
        {subGoal ? (
          <div className="space-y-2 rounded-[24px] bg-surface-list px-4 py-3">
            {subGoal.tasks.length === 0 ? (
              <p className="py-2 text-sm text-ink-soft">
                No tasks yet. Add one above to get started.
              </p>
            ) : null}
            {subGoal.tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                completionHint={completionHint}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
                onComplete={async (taskId) => {
                  try {
                    const result = await onCompleteTask(taskId);
                    onCompletionHint(result.hint);
                  } catch (err) {
                    setError(
                      err instanceof Error
                        ? err.message
                        : "Failed to complete task",
                    );
                  }
                }}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

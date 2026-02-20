import { useMemo, useState } from "react";

import { HierarchySidebar } from "../components/layout/hierarchy-sidebar";
import { TaskEditor } from "../components/goals/task-editor";
import { toRewardQueueItems } from "../services/reward-event-adapter";
import { enqueueRewardModals } from "../services/reward-modal-queue.service";
import type { CompleteTaskResult } from "../services/reward-hierarchy.types";
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
  onConfirmTask: (taskId: string) => Promise<void>;
  onCompleteTask: (taskId: string) => Promise<CompleteTaskResult>;
  onCompletionHint: (hint: string | null) => void;
  onSelectSubGoal: (id: string) => void;
  onBackToMain: () => void;
};

export function TasksPage({
  items,
  selectedMainGoalId,
  selectedSubGoalId,
  completionHint,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onConfirmTask,
  onCompleteTask,
  onCompletionHint,
  onSelectSubGoal,
  onBackToMain,
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

  return (
    <section className="flex flex-col gap-4 md:flex-row">
      <div className="w-full space-y-3 md:w-72">
        <HierarchySidebar
          title="Sub Goals"
          items={subGoals.map((item) => ({ id: item.id, title: item.title }))}
          selectedId={selectedSubGoalId}
          emptyText={selectedMainGoal ? "No sub goals for this main goal yet." : "Choose a main goal first."}
          onSelect={onSelectSubGoal}
          onBackToMain={onBackToMain}
        />
      </div>

      <div className="flex-1 space-y-3 rounded border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">{subGoal ? `Tasks for ${subGoal.title}` : "Tasks"}</h2>
        {!subGoal ? <p className="text-sm text-slate-500">Choose a Sub Goal in the sidebar.</p> : null}
        {subGoal ? <TaskEditor submitLabel="Add task" onSubmit={(title) => onCreateTask(subGoal.id, title)} /> : null}
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {subGoal ? (
          <div className="space-y-2">
            {subGoal.tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                completionHint={completionHint}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
                onConfirm={onConfirmTask}
                onComplete={async (taskId) => {
                  try {
                    const result = await onCompleteTask(taskId);
                    onCompletionHint(result.hint);
                    if (!result.hint) {
                      enqueueRewardModals(toRewardQueueItems(result));
                    }
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Failed to complete task");
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

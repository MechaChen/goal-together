import type { MainGoalItem } from "../../services/reward-hierarchy.types";
import { TaskEditor } from "./task-editor";
import { TaskRow } from "./task-row";

type GoalTreeProps = {
  items: MainGoalItem[];
  completionHint: string | null;
  onCreateSubGoal: (mainGoalId: string, title: string) => Promise<void>;
  onCreateTask: (subGoalId: string, title: string) => Promise<void>;
  onUpdateTask: (taskId: string, title: string) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onConfirmTask: (taskId: string) => Promise<void>;
  onCompleteTask: (taskId: string) => Promise<void>;
};

export function GoalTree({
  items,
  completionHint,
  onCreateSubGoal,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onConfirmTask,
  onCompleteTask,
}: GoalTreeProps) {
  if (items.length === 0) {
    return <p className="rounded border border-dashed border-slate-300 p-4 text-sm">No goals yet.</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((goal) => (
        <section key={goal.id} className="rounded border border-slate-300 bg-white p-4">
          <h3 className="text-lg font-semibold text-slate-900">{goal.title}</h3>
          {goal.description ? <p className="text-sm text-slate-600">{goal.description}</p> : null}

          <div className="mt-3 rounded bg-slate-50 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Add sub goal</p>
            <TaskEditor submitLabel="Add sub goal" onSubmit={(title) => onCreateSubGoal(goal.id, title)} />
          </div>

          <div className="mt-4 space-y-3">
            {goal.sub_goals.map((subGoal) => (
              <article key={subGoal.id} className="rounded border border-slate-200 p-3">
                <h4 className="font-medium text-slate-800">{subGoal.title}</h4>

                <div className="mt-2 rounded bg-slate-50 p-2">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Add draft task</p>
                  <TaskEditor submitLabel="Add task" onSubmit={(title) => onCreateTask(subGoal.id, title)} />
                </div>

                <div className="mt-2 space-y-2">
                  {subGoal.tasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      completionHint={completionHint}
                      onUpdate={onUpdateTask}
                      onDelete={onDeleteTask}
                      onConfirm={onConfirmTask}
                      onComplete={onCompleteTask}
                    />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

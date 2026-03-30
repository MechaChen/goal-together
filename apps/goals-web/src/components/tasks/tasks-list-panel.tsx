import type { TaskItem } from "../../services/reward-hierarchy.types";
import { TaskRow } from "../goals/task-row";

type TasksListPanelProps = {
  tasks: TaskItem[];
  completionHint: string | null;
  emptyText: string;
  onUpdateTask: (taskId: string, title: string) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onCompleteTask: (taskId: string) => Promise<void>;
};

function EmptyTasksState({ text }: { text: string }) {
  return <p className="py-2 text-sm text-ink-soft">{text}</p>;
}

export function TasksListPanel({
  tasks,
  completionHint,
  emptyText,
  onUpdateTask,
  onDeleteTask,
  onCompleteTask,
}: TasksListPanelProps) {
  return (
    <div className="space-y-2 rounded-[24px] bg-surface-list px-4 py-3">
      {tasks.length === 0 ? <EmptyTasksState text={emptyText} /> : null}
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          completionHint={completionHint}
          onUpdate={onUpdateTask}
          onDelete={onDeleteTask}
          onComplete={onCompleteTask}
        />
      ))}
    </div>
  );
}

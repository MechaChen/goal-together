import { useState } from "react";
import { Circle, CircleCheck, Pencil, Trash2 } from "lucide-react";
import type { TaskItem } from "../../services/reward-hierarchy.types";
import { TaskEditor } from "./task-editor";

type TaskRowProps = {
  task: TaskItem;
  onComplete: (taskId: string) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  onUpdate: (taskId: string, title: string) => Promise<void>;
  completionHint: string | null;
};

function isDraftTask(task: TaskItem): boolean {
  return task.lifecycle_state === "draft";
}

function getCompleteButtonLabel(task: TaskItem): string {
  return task.is_completed
    ? `Task ${task.title} completed`
    : `Complete task ${task.title}`;
}

function getTaskTitleClass(task: TaskItem): string {
  return `font-medium ${task.is_completed ? "text-ink-disabled line-through" : "text-ink-strong"}`;
}

type TaskStatusControlProps = {
  task: TaskItem;
  onComplete: (taskId: string) => Promise<void>;
};

function TaskStatusControl({ task, onComplete }: TaskStatusControlProps) {
  if (isDraftTask(task)) {
    return (
      <span aria-hidden>
        {task.is_completed ? (
          <CircleCheck size={24} />
        ) : (
          <Circle size={24} className="text-ink-icon cursor-not-allowed" />
        )}
      </span>
    );
  }

  return (
    <button
      type="button"
      className={`inline-flex rounded-full ${task.is_completed ? "cursor-not-allowed text-ink-disabled" : "text-accent-orange"}`}
      aria-label={getCompleteButtonLabel(task)}
      disabled={task.is_completed}
      onClick={() => {
        if (!task.is_completed) {
          void onComplete(task.id);
        }
      }}
    >
      {task.is_completed ? (
        <CircleCheck size={24} className="text-accent-orange" />
      ) : (
        <Circle size={24} className="text-ink-icon" />
      )}
    </button>
  );
}

type TaskMetaProps = {
  task: TaskItem;
};

function TaskMeta({ task }: TaskMetaProps) {
  return (
    <div className="flex-1">
      <p className={getTaskTitleClass(task)}>{task.title}</p>
      <p className="text-xs text-ink-soft">
        State: {task.lifecycle_state} ·{" "}
        {task.is_completed ? "completed" : "not completed"}
      </p>
    </div>
  );
}

type DraftTaskActionsProps = {
  task: TaskItem;
  onStartEdit: () => void;
  onDelete: (taskId: string) => Promise<void>;
};

function DraftTaskActions({
  task,
  onStartEdit,
  onDelete,
}: DraftTaskActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        className="inline-flex items-center gap-1 rounded-full border border-muted bg-surface-muted px-3 py-1 text-xs font-medium text-ink-soft"
        onClick={onStartEdit}
      >
        <Pencil size={13} aria-hidden />
        Edit
      </button>
      <button
        className="inline-flex items-center gap-1 rounded-full border border-danger bg-danger-bg px-3 py-1 text-xs font-medium text-danger-text"
        onClick={() => void onDelete(task.id)}
      >
        <Trash2 size={13} aria-hidden />
        Delete
      </button>
    </div>
  );
}

type ConfirmedTaskNotesProps = {
  task: TaskItem;
};

function ConfirmedTaskNotes({ task }: ConfirmedTaskNotesProps) {
  return (
    <div className="space-y-1 text-right">
      <p className="text-[11px] text-ink-soft">
        Confirmed tasks cannot be deleted.
      </p>
      {task.is_completed ? (
        <p className="text-[11px] text-ink-soft">
          This task is already completed.
        </p>
      ) : null}
    </div>
  );
}

type TaskCompletionHintProps = {
  task: TaskItem;
  completionHint: string | null;
};

function TaskCompletionHint({ task, completionHint }: TaskCompletionHintProps) {
  if (!completionHint || task.lifecycle_state !== "confirmed") {
    return null;
  }
  return <p className="mt-2 text-xs text-warning">Hint: {completionHint}</p>;
}

type TaskEditSectionProps = {
  task: TaskItem;
  onUpdate: (taskId: string, title: string) => Promise<void>;
  onClose: () => void;
};

function TaskEditSection({ task, onUpdate, onClose }: TaskEditSectionProps) {
  return (
    <div className="mt-2">
      <TaskEditor
        submitLabel="Save"
        initialValue={task.title}
        onSubmit={async (title) => {
          await onUpdate(task.id, title);
          onClose();
        }}
        onCancel={onClose}
      />
    </div>
  );
}

export function TaskRow({
  task,
  onComplete,
  onDelete,
  onUpdate,
  completionHint,
}: TaskRowProps) {
  const [editing, setEditing] = useState(false);
  const isDraft = isDraftTask(task);

  return (
    <div className="border-b border-line-soft py-2 last:border-none">
      <div className="flex items-start gap-6">
        <div className="mt-0.5 text-accent-orange">
          <TaskStatusControl task={task} onComplete={onComplete} />
        </div>
        <TaskMeta task={task} />

        {isDraft ? (
          <DraftTaskActions
            task={task}
            onStartEdit={() => setEditing(true)}
            onDelete={onDelete}
          />
        ) : (
          <ConfirmedTaskNotes task={task} />
        )}
      </div>

      <TaskCompletionHint task={task} completionHint={completionHint} />

      {editing ? (
        <TaskEditSection
          task={task}
          onUpdate={onUpdate}
          onClose={() => setEditing(false)}
        />
      ) : null}
    </div>
  );
}

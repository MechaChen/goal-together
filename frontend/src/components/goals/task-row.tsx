import { useState } from "react";
import { Circle, CircleCheck, Pencil, Trash2, ShieldCheck } from "lucide-react";
import type { TaskItem } from "../../services/reward-hierarchy.types";
import { TaskEditor } from "./task-editor";

type TaskRowProps = {
  task: TaskItem;
  onConfirm: (taskId: string) => Promise<void>;
  onComplete: (taskId: string) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  onUpdate: (taskId: string, title: string) => Promise<void>;
  completionHint: string | null;
};

export function TaskRow({
  task,
  onConfirm,
  onComplete,
  onDelete,
  onUpdate,
  completionHint,
}: TaskRowProps) {
  const [editing, setEditing] = useState(false);
  const isDraft = task.lifecycle_state === "draft";

  return (
    <div className="border-b border-line-soft py-2 last:border-none">
      <div className="flex items-start gap-6">
        <div className={`mt-0.5 text-accent-orange`}>
          {isDraft ? (
            <span aria-hidden>
              {task.is_completed ? (
                <CircleCheck size={24} />
              ) : (
                <Circle
                  size={24}
                  className="text-ink-icon cursor-not-allowed"
                />
              )}
            </span>
          ) : (
            <button
              type="button"
              className={`inline-flex rounded-full ${task.is_completed ? "cursor-not-allowed text-ink-disabled" : "text-accent-orange"}`}
              aria-label={
                task.is_completed
                  ? `Task ${task.title} completed`
                  : `Complete task ${task.title}`
              }
              disabled={task.is_completed}
              onClick={() => {
                if (!task.is_completed) {
                  void onComplete(task.id);
                }
              }}
            >
              {task.is_completed ? (
                <CircleCheck
                  size={24}
                  className="text-accent-orange"
                />
              ) : (
                <Circle size={24} className="text-ink-icon" />
              )}
            </button>
          )}
        </div>
        <div className="flex-1">
          <p
            className={`font-medium ${task.is_completed ? "text-ink-disabled line-through" : "text-ink-strong"}`}
          >
            {task.title}
          </p>
          <p className="text-xs text-ink-soft">
            State: {task.lifecycle_state} ·{" "}
            {task.is_completed ? "completed" : "not completed"}
          </p>
        </div>

        {isDraft ? (
          <>
            <button
              className="inline-flex items-center gap-1 rounded-full border border-muted bg-surface-muted px-3 py-1 text-xs font-medium text-ink-soft"
              onClick={() => setEditing(true)}
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
            <button
              className="inline-flex items-center gap-1 rounded-full border border-success bg-success-bg px-3 py-1 text-xs font-medium text-success-text"
              onClick={() => void onConfirm(task.id)}
            >
              <ShieldCheck size={13} aria-hidden />
              Confirm
            </button>
          </>
        ) : (
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
        )}
      </div>

      {completionHint && task.lifecycle_state === "confirmed" ? (
        <p className="mt-2 text-xs text-warning">Hint: {completionHint}</p>
      ) : null}

      {editing ? (
        <div className="mt-2">
          <TaskEditor
            submitLabel="Save"
            initialValue={task.title}
            onSubmit={async (title) => {
              await onUpdate(task.id, title);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        </div>
      ) : null}
    </div>
  );
}

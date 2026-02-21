import { useState } from "react";
import { CheckCheck, Circle, CircleCheck, Pencil, Trash2, ShieldCheck } from "lucide-react";
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

export function TaskRow({ task, onConfirm, onComplete, onDelete, onUpdate, completionHint }: TaskRowProps) {
  const [editing, setEditing] = useState(false);
  const isDraft = task.lifecycle_state === "draft";

  return (
    <div className="border-b border-[var(--accent-line)] py-2 last:border-none">
      <div className="flex items-start gap-2">
        <div className="mt-0.5 text-[var(--accent-orange)]">
          {task.is_completed ? <CircleCheck size={24} /> : <Circle size={24} className="text-[#6f7377]" />}
        </div>
        <div className="flex-1">
          <p className={`font-medium ${task.is_completed ? "text-[#9da0a3] line-through" : "text-[var(--ink-strong)]"}`}>{task.title}</p>
          <p className="text-xs text-[var(--ink-soft)]">
            State: {task.lifecycle_state} · {task.is_completed ? "completed" : "not completed"}
          </p>
        </div>

          {isDraft ? (
          <>
            <button
              className="inline-flex items-center gap-1 rounded-full border border-[#d8cdc5] bg-[#eee7e1] px-3 py-1 text-xs font-medium text-[var(--ink-soft)]"
              onClick={() => setEditing(true)}
            >
              <Pencil size={13} aria-hidden />
              Edit
            </button>
            <button
              className="inline-flex items-center gap-1 rounded-full border border-[#e4c6c3] bg-[#f1dfdd] px-3 py-1 text-xs font-medium text-[#b86864]"
              onClick={() => void onDelete(task.id)}
            >
              <Trash2 size={13} aria-hidden />
              Delete
            </button>
            <button
              className="inline-flex items-center gap-1 rounded-full border border-[#b9d9c7] bg-[#ddece4] px-3 py-1 text-xs font-medium text-[#4f8f6f]"
              onClick={() => void onConfirm(task.id)}
            >
              <ShieldCheck size={13} aria-hidden />
              Confirm
            </button>
          </>
        ) : (
          <div className="space-y-1 text-right">
            <button
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                task.is_completed ? "cursor-not-allowed bg-[#d1d1d1] text-[#8f8f8f]" : "bg-[var(--accent-orange)] text-white"
              }`}
              disabled={task.is_completed}
              aria-disabled={task.is_completed}
              onClick={() => {
                if (!task.is_completed) {
                  void onComplete(task.id);
                }
              }}
            >
              <CheckCheck size={13} aria-hidden />
              {task.is_completed ? "Completed" : "Complete"}
            </button>
            <p className="text-[11px] text-[var(--ink-soft)]">Confirmed tasks cannot be deleted.</p>
            {task.is_completed ? <p className="text-[11px] text-[var(--ink-soft)]">This task is already completed.</p> : null}
          </div>
        )}
      </div>

      {completionHint && task.lifecycle_state === "confirmed" ? (
        <p className="mt-2 text-xs text-[#be8a31]">Hint: {completionHint}</p>
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

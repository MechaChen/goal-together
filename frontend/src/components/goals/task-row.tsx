import { useState } from "react";
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

  return (
    <div className="rounded border border-slate-200 p-3">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <p className="font-medium text-slate-800">{task.title}</p>
          <p className="text-xs text-slate-500">
            State: {task.lifecycle_state} · {task.is_completed ? "completed" : "not completed"}
          </p>
        </div>

        {task.lifecycle_state === "draft" ? (
          <>
            <button className="rounded bg-blue-600 px-2 py-1 text-xs text-white" onClick={() => setEditing(true)}>
              Edit
            </button>
            <button className="rounded bg-rose-600 px-2 py-1 text-xs text-white" onClick={() => void onDelete(task.id)}>
              Delete
            </button>
            <button className="rounded bg-emerald-600 px-2 py-1 text-xs text-white" onClick={() => void onConfirm(task.id)}>
              Confirm
            </button>
          </>
        ) : (
          <div className="space-y-1 text-right">
            <button
              className={`rounded px-2 py-1 text-xs text-white ${
                task.is_completed ? "cursor-not-allowed bg-slate-300 text-slate-500" : "bg-slate-900"
              }`}
              disabled={task.is_completed}
              aria-disabled={task.is_completed}
              onClick={() => {
                if (!task.is_completed) {
                  void onComplete(task.id);
                }
              }}
            >
              {task.is_completed ? "Completed" : "Complete"}
            </button>
            <p className="text-[11px] text-slate-500">Confirmed tasks cannot be deleted.</p>
            {task.is_completed ? <p className="text-[11px] text-slate-500">This task is already completed.</p> : null}
          </div>
        )}
      </div>

      {completionHint && task.lifecycle_state === "confirmed" ? (
        <p className="mt-2 text-xs text-amber-700">Hint: {completionHint}</p>
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

import { useState } from "react";
import type { TodoItem } from "../services/todo-api.types";

type Props = {
  todo: TodoItem;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, mainTarget: string) => Promise<void>;
};

export function TodoListItem({ todo, onToggle, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(todo.main_target);

  return (
    <li className="flex items-center gap-3 rounded border border-slate-200 bg-white p-3">
      <input type="checkbox" checked={todo.is_completed} onChange={() => void onToggle(todo.id)} />
      {editing ? (
        <input
          className="flex-1 rounded border border-slate-300 px-2 py-1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : (
        <span className={`flex-1 ${todo.is_completed ? "line-through text-slate-400" : "text-slate-800"}`}>
          {todo.main_target}
        </span>
      )}
      {editing ? (
        <button
          className="rounded bg-blue-600 px-2 py-1 text-xs text-white"
          onClick={() => {
            setEditing(false);
            void onUpdate(todo.id, value);
          }}
        >
          Save
        </button>
      ) : (
        <button className="rounded bg-slate-200 px-2 py-1 text-xs" onClick={() => setEditing(true)}>
          Edit
        </button>
      )}
      <button className="rounded bg-red-600 px-2 py-1 text-xs text-white" onClick={() => void onDelete(todo.id)}>
        Delete
      </button>
    </li>
  );
}

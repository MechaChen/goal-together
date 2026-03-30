import type { TodoItem } from "../services/todo-api.types";
import { TodoListItem } from "./todo-list-item";

type Props = {
  items: TodoItem[];
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, mainTarget: string) => Promise<void>;
};

export function TodoList({ items, onToggle, onDelete, onUpdate }: Props) {
  if (items.length === 0) {
    return <p className="rounded border border-dashed border-slate-300 p-4 text-sm text-slate-500">No todos yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((todo) => (
        <TodoListItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </ul>
  );
}

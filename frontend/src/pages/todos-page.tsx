import { useEffect, useMemo, useState } from "react";
import { TodoCreateForm } from "../components/todo-create-form";
import { TodoList } from "../components/todo-list";
import { TodoProgressBar } from "../components/todo-progress-bar";
import { todoApi } from "../services/todo-api.client";
import type { ProgressSummary, TodoItem } from "../services/todo-api.types";

const EMPTY_PROGRESS: ProgressSummary = {
  total_count: 0,
  completed_count: 0,
  percentage: 0,
  label: "0/0",
};

export function TodosPage() {
  const [items, setItems] = useState<TodoItem[]>([]);
  const [progress, setProgress] = useState<ProgressSummary>(EMPTY_PROGRESS);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const [list, stats] = await Promise.all([todoApi.list(), todoApi.progress()]);
    setItems(list.items);
    setProgress(stats);
  }

  useEffect(() => {
    void refresh().catch((e) => setError(e instanceof Error ? e.message : "Failed to load todos"));
  }, []);

  const atCapacity = useMemo(() => items.length >= 5, [items.length]);

  async function create(target: string) {
    await todoApi.create(target);
    await refresh();
  }

  async function toggle(id: string) {
    await todoApi.toggle(id);
    await refresh();
  }

  async function remove(id: string) {
    await todoApi.delete(id);
    await refresh();
  }

  async function update(id: string, mainTarget: string) {
    await todoApi.update(id, { main_target: mainTarget });
    await refresh();
  }

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Todo With Target</h1>
        <p className="text-sm text-slate-600">Maximum 5 todos. Track progress in real time.</p>
      </header>
      <TodoProgressBar progress={progress} />
      <TodoCreateForm disabled={atCapacity} onCreate={create} />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <TodoList items={items} onToggle={toggle} onDelete={remove} onUpdate={update} />
    </main>
  );
}

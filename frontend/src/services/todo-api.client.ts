import type { ProgressSummary, TodoItem, TodoListResponse } from "./todo-api.types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body.message ?? message;
    } catch {
      // no-op
    }
    throw new Error(message);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}

export const todoApi = {
  list: () => request<TodoListResponse>("/todos"),
  create: (main_target: string) => request<TodoItem>("/todos", { method: "POST", body: JSON.stringify({ main_target }) }),
  update: (id: string, payload: Partial<Pick<TodoItem, "main_target" | "is_completed">>) =>
    request<TodoItem>(`/todos/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  toggle: (id: string) => request<TodoItem>(`/todos/${id}/toggle`, { method: "POST" }),
  delete: (id: string) => request<void>(`/todos/${id}`, { method: "DELETE" }),
  progress: () => request<ProgressSummary>("/progress"),
};

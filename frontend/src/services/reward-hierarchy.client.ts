import type {
  ApiErrorShape,
  CompleteTaskResult,
  HierarchyResponse,
  MainGoalItem,
  RewardHistoryResponse,
  SubGoalItem,
  TaskItem,
  WalletSummary,
} from "./reward-hierarchy.types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });

  if (!res.ok) {
    let parsed: ApiErrorShape | null = null;
    try {
      parsed = (await res.json()) as ApiErrorShape;
    } catch {
      // no-op
    }
    const message = parsed?.message ?? `Request failed (${res.status})`;
    const code = parsed?.code ?? "REQUEST_FAILED";
    throw new ApiError(message, code);
  }

  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}

export const rewardHierarchyApi = {
  listTree: () => request<HierarchyResponse>("/main-goals"),
  createMainGoal: (title: string, description?: string) =>
    request<MainGoalItem>("/main-goals", {
      method: "POST",
      body: JSON.stringify({ title, description }),
    }),
  createSubGoal: (mainGoalId: string, title: string) =>
    request<SubGoalItem>(`/main-goals/${mainGoalId}/sub-goals`, {
      method: "POST",
      body: JSON.stringify({ title }),
    }),
  createDraftTask: (subGoalId: string, title: string) =>
    request<TaskItem>(`/sub-goals/${subGoalId}/tasks`, {
      method: "POST",
      body: JSON.stringify({ title }),
    }),
  updateTask: (taskId: string, title: string) =>
    request<TaskItem>(`/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({ title }),
    }),
  deleteTask: (taskId: string) =>
    request<void>(`/tasks/${taskId}`, {
      method: "DELETE",
    }),
  confirmTask: (taskId: string) =>
    request<TaskItem>(`/tasks/${taskId}/confirm`, {
      method: "POST",
    }),
  completeTask: async (taskId: string): Promise<CompleteTaskResult> => {
    try {
      return await request<CompleteTaskResult>(`/tasks/${taskId}/complete`, {
        method: "POST",
      });
    } catch (error) {
      if (error instanceof ApiError && error.message.includes("already completed previously")) {
        return {
          task_reward: 0,
          extra_reward: 0,
          extra_reward_type: null,
          extra_reward_message: null,
          rewarded_completion_count: 0,
          wallet_balance: 0,
          hint: "already completed previously",
          task: {
            id: taskId,
            sub_goal_id: "",
            title: "",
            lifecycle_state: "confirmed",
            is_completed: true,
            first_rewarded_completion_at: null,
          },
        };
      }
      throw error;
    }
  },
  wallet: () => request<WalletSummary>("/wallet"),
  rewardHistory: () => request<RewardHistoryResponse>("/rewards/history"),
};

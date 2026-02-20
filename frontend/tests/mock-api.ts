import type { MainGoalItem, RewardEvent } from "../src/services/reward-hierarchy.types";

export type CompletionResponse = {
  task_reward: number;
  milestone_reward: number;
  milestone_applied: boolean;
  rewarded_completion_count: number;
  wallet_balance: number;
  hint: string | null;
  task: {
    id: string;
    sub_goal_id: string;
    title: string;
    lifecycle_state: "draft" | "confirmed";
    is_completed: boolean;
    first_rewarded_completion_at: string | null;
  };
};

export function createMockTree(): MainGoalItem[] {
  return [
    {
      id: "g1",
      title: "Main Goal 1",
      description: "Desc",
      sub_goals: [
        {
          id: "s1",
          main_goal_id: "g1",
          title: "Sub Goal 1",
          tasks: [
            {
              id: "t1",
              sub_goal_id: "s1",
              title: "Task 1",
              lifecycle_state: "confirmed",
              is_completed: false,
              first_rewarded_completion_at: null,
            },
          ],
        },
      ],
    },
  ];
}

export function installMockApi(options?: {
  tree?: MainGoalItem[];
  completions?: CompletionResponse[];
  history?: RewardEvent[];
}) {
  const tree = options?.tree ?? createMockTree();
  const completionQueue = [...(options?.completions ?? [])];
  const history = options?.history ? [...options.history] : [];

  const originalFetch = globalThis.fetch;

  globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = (init?.method ?? "GET").toUpperCase();

    const respond = (status: number, body: unknown) =>
      new Response(body === null ? null : JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
      });

    if (url.endsWith("/main-goals") && method === "GET") {
      return respond(200, { items: tree });
    }

    if (url.endsWith("/main-goals") && method === "POST") {
      const payload = JSON.parse(String(init?.body ?? "{}")) as { title?: string; description?: string };
      tree.push({
        id: `g${tree.length + 1}`,
        title: payload.title ?? `Main Goal ${tree.length + 1}`,
        description: payload.description ?? null,
        sub_goals: [],
      });
      return respond(201, tree[tree.length - 1]);
    }

    if (url.includes("/main-goals/") && url.endsWith("/sub-goals") && method === "POST") {
      const mainGoalId = url.split("/main-goals/")[1].split("/")[0];
      const payload = JSON.parse(String(init?.body ?? "{}")) as { title?: string };
      const mainGoal = tree.find((item) => item.id === mainGoalId);
      if (!mainGoal) {
        return respond(404, { message: "main goal not found", code: "NOT_FOUND" });
      }
      const subGoal = {
        id: `s${mainGoal.sub_goals.length + 1}-${mainGoal.id}`,
        main_goal_id: mainGoal.id,
        title: payload.title ?? "Sub Goal",
        tasks: [],
      };
      mainGoal.sub_goals.push(subGoal);
      return respond(201, subGoal);
    }

    if (url.includes("/sub-goals/") && url.endsWith("/tasks") && method === "POST") {
      const subGoalId = url.split("/sub-goals/")[1].split("/")[0];
      const payload = JSON.parse(String(init?.body ?? "{}")) as { title?: string };
      for (const goal of tree) {
        const subGoal = goal.sub_goals.find((item) => item.id === subGoalId);
        if (subGoal) {
          const task = {
            id: `t${subGoal.tasks.length + 1}-${subGoal.id}`,
            sub_goal_id: subGoal.id,
            title: payload.title ?? "Task",
            lifecycle_state: "draft" as const,
            is_completed: false,
            first_rewarded_completion_at: null,
          };
          subGoal.tasks.push(task);
          return respond(201, task);
        }
      }
      return respond(404, { message: "sub goal not found", code: "NOT_FOUND" });
    }

    if (url.includes("/tasks/") && url.endsWith("/confirm") && method === "POST") {
      const taskId = url.split("/tasks/")[1].split("/")[0];
      for (const goal of tree) {
        for (const subGoal of goal.sub_goals) {
          const task = subGoal.tasks.find((item) => item.id === taskId);
          if (task) {
            task.lifecycle_state = "confirmed";
            return respond(200, task);
          }
        }
      }
      return respond(404, { message: "task not found", code: "NOT_FOUND" });
    }

    if (url.includes("/tasks/") && url.endsWith("/complete") && method === "POST") {
      const taskId = url.split("/tasks/")[1].split("/")[0];
      const next = completionQueue.shift();
      if (!next) {
        return respond(409, { message: "already completed previously", code: "CONFLICT_ERROR" });
      }
      if (!next.hint) {
        history.unshift({
          id: `e-${Date.now()}`,
          event_type: "TASK_COMPLETE",
          token_amount: next.task_reward,
          task_id: taskId,
          rewarded_completion_counter: next.rewarded_completion_count,
          created_at: new Date().toISOString(),
        });
      }
      return respond(200, next);
    }

    if (url.includes("/tasks/") && method === "PATCH") {
      return respond(200, {});
    }

    if (url.includes("/tasks/") && method === "DELETE") {
      return new Response(null, { status: 204 });
    }

    if (url.endsWith("/rewards/history") && method === "GET") {
      return respond(200, { items: history });
    }

    if (url.endsWith("/wallet") && method === "GET") {
      return respond(200, { user_id: "default-user", balance: 100, rewarded_completion_count: 5 });
    }

    return respond(404, { message: `Unhandled route: ${method} ${url}`, code: "NOT_FOUND" });
  }) as typeof fetch;

  return {
    restore() {
      globalThis.fetch = originalFetch;
    },
  };
}

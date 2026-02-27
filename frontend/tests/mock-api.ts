import type { MainGoalItem, RewardEvent } from "../src/services/reward-hierarchy.types";

export type CompletionResponse = {
  task_reward: number;
  extra_reward: number;
  extra_reward_type: "SUBGOAL_NEAR_COMPLETE" | "SUBGOAL_COMPLETE" | null;
  extra_reward_message: string | null;
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
      is_completed: false,
      completed_at: null,
      sub_goals: [
        {
          id: "s1",
          main_goal_id: "g1",
          title: "Sub Goal 1",
          is_completed: false,
          completed_at: null,
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
  confirmDraftDelayMs?: number;
}) {
  const tree = options?.tree ?? createMockTree();
  const completionQueue = [...(options?.completions ?? [])];
  const history = options?.history ? [...options.history] : [];
  let walletBalance = 100;

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
        is_completed: false,
        completed_at: null,
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
        is_completed: false,
        completed_at: null,
        tasks: [],
      };
      mainGoal.sub_goals.push(subGoal);
      return respond(201, subGoal);
    }

    if (url.includes("/main-goals/") && url.endsWith("/complete") && method === "POST") {
      const mainGoalId = url.split("/main-goals/")[1].split("/")[0];
      const mainGoal = tree.find((item) => item.id === mainGoalId);
      if (!mainGoal) {
        return respond(404, { message: "main goal not found", code: "NOT_FOUND" });
      }
      const completedSubGoals = mainGoal.sub_goals.filter((item) => item.is_completed).length;
      const totalSubGoals = mainGoal.sub_goals.length;
      const percentage = totalSubGoals === 0 ? 0 : Math.round((completedSubGoals / totalSubGoals) * 100);
      if (totalSubGoals === 0 || completedSubGoals < totalSubGoals) {
        return respond(409, {
          message: `cannot complete main goal yet: ${percentage}% (${completedSubGoals}/${totalSubGoals}) sub goals completed`,
          code: "CONFLICT_ERROR",
        });
      }
      mainGoal.is_completed = true;
      mainGoal.completed_at = new Date().toISOString();
      walletBalance += 500;
      history.unshift({
        id: `e-${Date.now()}`,
        event_type: "MAIN_GOAL_MANUAL_COMPLETE",
        token_amount: 500,
        task_id: null,
        rewarded_completion_counter: null,
        created_at: new Date().toISOString(),
      });
      return respond(200, {
        main_goal_id: mainGoal.id,
        is_completed: true,
        completed_at: mainGoal.completed_at,
        reward_granted: true,
        reward_amount: 500,
        wallet_balance: walletBalance,
        progress: {
          completed_count: completedSubGoals,
          total_count: totalSubGoals,
          percentage,
        },
      });
    }

    if (url.includes("/main-goals/") && method === "DELETE") {
      const mainGoalId = url.split("/main-goals/")[1].split("/")[0];
      const mainGoal = tree.find((item) => item.id === mainGoalId);
      if (!mainGoal) {
        return respond(404, { message: "main goal not found", code: "NOT_FOUND" });
      }
      const hasConfirmed = mainGoal.sub_goals.some((subGoal) =>
        subGoal.tasks.some((task) => task.lifecycle_state === "confirmed"),
      );
      if (hasConfirmed) {
        return respond(409, { message: "main goal with confirmed tasks cannot be deleted", code: "CONFLICT_ERROR" });
      }
      const index = tree.findIndex((item) => item.id === mainGoalId);
      tree.splice(index, 1);
      return new Response(null, { status: 204 });
    }

    if (url.includes("/sub-goals/") && method === "DELETE") {
      const subGoalId = url.split("/sub-goals/")[1].split("/")[0];
      for (const goal of tree) {
        const subGoal = goal.sub_goals.find((item) => item.id === subGoalId);
        if (!subGoal) {
          continue;
        }
        const hasConfirmed = subGoal.tasks.some((task) => task.lifecycle_state === "confirmed");
        if (hasConfirmed) {
          return respond(409, { message: "sub goal with confirmed tasks cannot be deleted", code: "CONFLICT_ERROR" });
        }
        goal.sub_goals = goal.sub_goals.filter((item) => item.id !== subGoalId);
        return new Response(null, { status: 204 });
      }
      return respond(404, { message: "sub goal not found", code: "NOT_FOUND" });
    }

    if (url.includes("/sub-goals/") && url.endsWith("/complete") && method === "POST") {
      const subGoalId = url.split("/sub-goals/")[1].split("/")[0];
      for (const goal of tree) {
        const subGoal = goal.sub_goals.find((item) => item.id === subGoalId);
        if (!subGoal) {
          continue;
        }
        const completedTasks = subGoal.tasks.filter((task) => task.is_completed).length;
        const totalTasks = subGoal.tasks.length;
        const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
        if (totalTasks === 0 || completedTasks < totalTasks) {
          return respond(409, {
            message: `cannot complete sub goal yet: ${percentage}% (${completedTasks}/${totalTasks}) tasks completed`,
            code: "CONFLICT_ERROR",
          });
        }
        subGoal.is_completed = true;
        subGoal.completed_at = new Date().toISOString();
        walletBalance += 200;
        history.unshift({
          id: `e-${Date.now()}`,
          event_type: "SUBGOAL_MANUAL_COMPLETE",
          token_amount: 200,
          task_id: null,
          rewarded_completion_counter: null,
          created_at: new Date().toISOString(),
        });
        return respond(200, {
          sub_goal_id: subGoal.id,
          is_completed: true,
          completed_at: subGoal.completed_at,
          reward_granted: true,
          reward_amount: 200,
          wallet_balance: walletBalance,
          progress: {
            completed_count: completedTasks,
            total_count: totalTasks,
            percentage,
          },
        });
      }
      return respond(404, { message: "sub goal not found", code: "NOT_FOUND" });
    }

    if (url.includes("/sub-goals/") && url.endsWith("/tasks/confirm-drafts") && method === "POST") {
      const subGoalId = url.split("/sub-goals/")[1].split("/")[0];
      if (options?.confirmDraftDelayMs && options.confirmDraftDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, options.confirmDraftDelayMs));
      }
      for (const goal of tree) {
        const subGoal = goal.sub_goals.find((item) => item.id === subGoalId);
        if (!subGoal) {
          continue;
        }
        let confirmedCount = 0;
        let alreadyConfirmedCount = 0;
        for (const task of subGoal.tasks) {
          if (task.lifecycle_state === "draft") {
            task.lifecycle_state = "confirmed";
            confirmedCount += 1;
          } else {
            alreadyConfirmedCount += 1;
          }
        }
        return respond(200, {
          sub_goal_id: subGoalId,
          confirmed_count: confirmedCount,
          already_confirmed_count: alreadyConfirmedCount,
          total_tasks_count: subGoal.tasks.length,
        });
      }
      return respond(404, { message: "sub goal not found", code: "NOT_FOUND" });
    }

    if (url.includes("/sub-goals/") && url.endsWith("/tasks") && method === "POST") {
      const subGoalId = url.split("/sub-goals/")[1].split("/")[0];
      const payload = JSON.parse(String(init?.body ?? "{}")) as { title?: string };
      for (const goal of tree) {
        const subGoal = goal.sub_goals.find((item) => item.id === subGoalId);
        if (subGoal) {
          if (subGoal.is_completed) {
            return respond(409, { message: "completed sub goal cannot add tasks", code: "CONFLICT_ERROR" });
          }
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
      for (const goal of tree) {
        for (const subGoal of goal.sub_goals) {
          const task = subGoal.tasks.find((item) => item.id === taskId);
          if (task) {
            task.is_completed = true;
            const totalTasks = subGoal.tasks.length;
            const completedTasks = subGoal.tasks.filter((entry) => entry.is_completed).length;
            if (totalTasks > 0 && completedTasks === totalTasks) {
              subGoal.is_completed = true;
              subGoal.completed_at = new Date().toISOString();
            }
            break;
          }
        }
      }
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
      return respond(200, { user_id: "default-user", balance: walletBalance, rewarded_completion_count: 5 });
    }

    return respond(404, { message: `Unhandled route: ${method} ${url}`, code: "NOT_FOUND" });
  }) as typeof fetch;

  return {
    restore() {
      globalThis.fetch = originalFetch;
    },
  };
}

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { App } from "../src/app";
import type { MainGoalItem } from "../src/services/reward-hierarchy.types";
import { installMockApi, type CompletionResponse } from "./mock-api";

const first: CompletionResponse = {
  task_reward: 10,
  extra_reward: 0,
  extra_reward_type: null,
  extra_reward_message: null,
  rewarded_completion_count: 1,
  wallet_balance: 10,
  hint: null,
  task: {
    id: "t1",
    sub_goal_id: "s1",
    title: "Task 1",
    lifecycle_state: "confirmed",
    is_completed: true,
    first_rewarded_completion_at: new Date().toISOString(),
  },
};

const second: CompletionResponse = {
  task_reward: 10,
  extra_reward: 30,
  extra_reward_type: "SUBGOAL_NEAR_COMPLETE",
  extra_reward_message: "Almost there! Enjoy a treat.",
  rewarded_completion_count: 5,
  wallet_balance: 60,
  hint: null,
  task: {
    id: "t2",
    sub_goal_id: "s1",
    title: "Task 2",
    lifecycle_state: "confirmed",
    is_completed: true,
    first_rewarded_completion_at: new Date().toISOString(),
  },
};

let restore: (() => void) | null = null;

function createTreeWithTwoConfirmedTasks(): MainGoalItem[] {
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
            {
              id: "t2",
              sub_goal_id: "s1",
              title: "Task 2",
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

afterEach(() => {
  restore?.();
  restore = null;
});

describe("reward modal queue", () => {
  it("shows queued rewards in FIFO order", async () => {
    restore = installMockApi({ tree: createTreeWithTwoConfirmedTasks(), completions: [first, second] }).restore;
    window.history.replaceState({}, "", "/tasks/main-goal-1-g1/sub-goal-1-s1");

    render(<App />);

    await waitFor(() => expect(screen.getByRole("heading", { name: "Tasks for Sub Goal 1" })).toBeTruthy());

    await userEvent.click(screen.getByRole("button", { name: "Complete task Task 1" }));
    await userEvent.click(screen.getByRole("button", { name: "Complete task Task 2" }));

    await waitFor(() => expect(screen.getByText("+10 tokens")).toBeTruthy());
    expect(screen.getByText('Completed task: "Task 1"')).toBeTruthy();

    await new Promise((resolve) => setTimeout(resolve, 3200));

    await waitFor(() => expect(screen.getByText("+10 tokens")).toBeTruthy());
    expect(screen.getByText('Completed task: "Task 2"')).toBeTruthy();

    await new Promise((resolve) => setTimeout(resolve, 3200));

    await waitFor(() => expect(screen.getByText("+30 tokens")).toBeTruthy());
    expect(screen.getByText("Almost there! Enjoy a treat.")).toBeTruthy();
  }, 13000);
});

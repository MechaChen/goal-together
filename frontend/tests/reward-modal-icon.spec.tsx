import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { App } from "../src/app";
import { rewardModalQueueStore } from "../src/services/reward-modal-queue.store";
import { installMockApi, type CompletionResponse } from "./mock-api";

const reward: CompletionResponse = {
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

const nearCompleteReward: CompletionResponse = {
  task_reward: 0,
  extra_reward: 30,
  extra_reward_type: "SUBGOAL_NEAR_COMPLETE",
  extra_reward_message: "Almost there! Enjoy a treat.",
  rewarded_completion_count: 3,
  wallet_balance: 30,
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

const subGoalCompleteReward: CompletionResponse = {
  task_reward: 0,
  extra_reward: 50,
  extra_reward_type: "SUBGOAL_COMPLETE",
  extra_reward_message: "You Snailed it! Awesome job",
  rewarded_completion_count: 4,
  wallet_balance: 80,
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

let restore: (() => void) | null = null;

afterEach(() => {
  restore?.();
  restore = null;
  rewardModalQueueStore.clear();
});

describe("reward modal icon", () => {
  it("renders token icon inside modal", async () => {
    restore = installMockApi({ completions: [reward] }).restore;
    window.location.hash = "#/tasks/main-goal-1-g1/sub-goal-1-s1";

    render(<App />);

    await waitFor(() => expect(screen.getByRole("heading", { name: "Tasks for Sub Goal 1" })).toBeTruthy());
    await userEvent.click(screen.getByRole("button", { name: "Complete task Task 1" }));

    await waitFor(() => expect(screen.getByRole("img", { name: "Reward token" })).toBeTruthy());
  });

  it("renders fighting logo for near-complete bonus", async () => {
    restore = installMockApi({ completions: [nearCompleteReward] }).restore;
    window.location.hash = "#/tasks/main-goal-1-g1/sub-goal-1-s1";

    render(<App />);

    await waitFor(() => expect(screen.getByRole("heading", { name: "Tasks for Sub Goal 1" })).toBeTruthy());
    await userEvent.click(screen.getByRole("button", { name: "Complete task Task 1" }));

    await waitFor(() => expect(screen.getByRole("img", { name: "Near complete reward" })).toBeTruthy());
    expect(screen.getByRole("img", { name: "Reward token" })).toBeTruthy();
    expect(screen.getByText("Almost there! Enjoy a treat.")).toBeTruthy();
  });

  it("renders congratulation logo for complete bonus", async () => {
    restore = installMockApi({ completions: [subGoalCompleteReward] }).restore;
    window.location.hash = "#/tasks/main-goal-1-g1/sub-goal-1-s1";

    render(<App />);

    await waitFor(() => expect(screen.getByRole("heading", { name: "Tasks for Sub Goal 1" })).toBeTruthy());
    await userEvent.click(screen.getByRole("button", { name: "Complete task Task 1" }));

    await waitFor(() => expect(screen.getByRole("img", { name: "Sub goal complete reward" })).toBeTruthy());
    expect(screen.getByRole("img", { name: "Reward token" })).toBeTruthy();
    expect(screen.getByText("You Snailed it! Awesome job")).toBeTruthy();
  });
});

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { App } from "../src/app";
import { installMockApi, type CompletionResponse } from "./mock-api";

const reward: CompletionResponse = {
  task_reward: 10,
  milestone_reward: 0,
  milestone_applied: false,
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

let restore: (() => void) | null = null;

afterEach(() => {
  restore?.();
  restore = null;
});

describe("reward modal icon", () => {
  it("renders token icon inside modal", async () => {
    restore = installMockApi({ completions: [reward] }).restore;
    window.location.hash = "#/tasks/main-goal-1-g1/sub-goal-1-s1";

    render(<App />);

    await waitFor(() => expect(screen.getByRole("heading", { name: "Tasks for Sub Goal 1" })).toBeTruthy());
    await userEvent.click(screen.getByRole("button", { name: "Complete" }));

    await waitFor(() => expect(screen.getByRole("img", { name: "Reward token" })).toBeTruthy());
  });
});

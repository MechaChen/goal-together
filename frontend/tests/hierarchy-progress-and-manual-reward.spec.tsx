import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { App } from "../src/app";
import { rewardModalQueueStore } from "../src/services/reward-modal-queue.store";
import type { MainGoalItem } from "../src/services/reward-hierarchy.types";
import { installMockApi } from "./mock-api";

let restore: (() => void) | null = null;

afterEach(() => {
  restore?.();
  restore = null;
  rewardModalQueueStore.clear();
});

function createProgressTree(): MainGoalItem[] {
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
          is_completed: true,
          completed_at: new Date().toISOString(),
          tasks: [
            {
              id: "t1",
              sub_goal_id: "s1",
              title: "Task 1",
              lifecycle_state: "confirmed",
              is_completed: true,
              first_rewarded_completion_at: new Date().toISOString(),
            },
            {
              id: "t2",
              sub_goal_id: "s1",
              title: "Task 2",
              lifecycle_state: "draft",
              is_completed: false,
              first_rewarded_completion_at: null,
            },
          ],
        },
        {
          id: "s2",
          main_goal_id: "g1",
          title: "Sub Goal 2",
          is_completed: false,
          completed_at: null,
          tasks: [
            {
              id: "t3",
              sub_goal_id: "s2",
              title: "Task 3",
              lifecycle_state: "confirmed",
              is_completed: false,
              first_rewarded_completion_at: null,
            },
            {
              id: "t4",
              sub_goal_id: "s2",
              title: "Task 4",
              lifecycle_state: "draft",
              is_completed: true,
              first_rewarded_completion_at: null,
            },
          ],
        },
        {
          id: "s3",
          main_goal_id: "g1",
          title: "Sub Goal 3",
          is_completed: false,
          completed_at: null,
          tasks: [],
        },
      ],
    },
  ];
}

function createSubGoalCompleteTree(): MainGoalItem[] {
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
              is_completed: true,
              first_rewarded_completion_at: new Date().toISOString(),
            },
          ],
        },
      ],
    },
  ];
}

function createMainGoalCompleteTree(): MainGoalItem[] {
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
          is_completed: true,
          completed_at: new Date().toISOString(),
          tasks: [],
        },
      ],
    },
  ];
}

describe("hierarchy row progress and manual completion reward modal", () => {
  it("shows main goal and sub goal progress digits", async () => {
    restore = installMockApi({ tree: createProgressTree() }).restore;
    window.location.hash = "#/main-goals";

    render(<App />);

    await waitFor(() => expect(screen.getByRole("heading", { name: "Main Goals" })).toBeTruthy());
    expect(screen.getByText("33% · 1/3")).toBeTruthy();

    await userEvent.click(screen.getAllByRole("button", { name: /Main Goal 1/i }).at(-1)!);
    await waitFor(() => expect(screen.getByRole("heading", { name: "Sub Goals for Main Goal 1" })).toBeTruthy());
    expect(screen.getByText("100% · 1/1")).toBeTruthy();
    expect(screen.getByText("0% · 0/1")).toBeTruthy();
    expect(screen.getByText("0% · 0/0")).toBeTruthy();
  });

  it("shows reward modal after sub goal manual completion", async () => {
    restore = installMockApi({ tree: createSubGoalCompleteTree() }).restore;
    window.location.hash = "#/sub-goals/main-goal-1-g1";

    render(<App />);

    await waitFor(() => expect(screen.getByRole("heading", { name: "Sub Goals for Main Goal 1" })).toBeTruthy());
    await userEvent.click(screen.getByRole("button", { name: "Complete sub goal Sub Goal 1" }));

    await waitFor(() => expect(screen.getByTestId("reward-modal")).toBeTruthy());
    expect(screen.getByRole("img", { name: "Sub goal completed reward" })).toBeTruthy();
    expect(screen.getByText("+200 tokens")).toBeTruthy();
    expect(screen.getByText("Sub goal completed")).toBeTruthy();
  });

  it("shows reward modal after main goal manual completion", async () => {
    restore = installMockApi({ tree: createMainGoalCompleteTree() }).restore;
    window.location.hash = "#/main-goals";

    render(<App />);

    await waitFor(() => expect(screen.getByRole("heading", { name: "Main Goals" })).toBeTruthy());
    await userEvent.click(screen.getByRole("button", { name: "Complete main goal Main Goal 1" }));

    await waitFor(() => expect(screen.getByTestId("reward-modal")).toBeTruthy());
    expect(screen.getByRole("img", { name: "Main goal completed reward" })).toBeTruthy();
    expect(screen.getByText("+500 tokens")).toBeTruthy();
    expect(screen.getByText("Main goal completed")).toBeTruthy();
  });
});

import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { App } from "../src/app";
import type { MainGoalItem } from "../src/services/reward-hierarchy.types";
import { installMockApi } from "./mock-api";

let restore: (() => void) | null = null;

afterEach(() => {
  restore?.();
  restore = null;
});

function createTreeWithFiveTasks(): MainGoalItem[] {
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
              lifecycle_state: "draft",
              is_completed: false,
              first_rewarded_completion_at: null,
            },
            {
              id: "t2",
              sub_goal_id: "s1",
              title: "Task 2",
              lifecycle_state: "draft",
              is_completed: false,
              first_rewarded_completion_at: null,
            },
            {
              id: "t3",
              sub_goal_id: "s1",
              title: "Task 3",
              lifecycle_state: "confirmed",
              is_completed: false,
              first_rewarded_completion_at: null,
            },
            {
              id: "t4",
              sub_goal_id: "s1",
              title: "Task 4",
              lifecycle_state: "confirmed",
              is_completed: true,
              first_rewarded_completion_at: null,
            },
            {
              id: "t5",
              sub_goal_id: "s1",
              title: "Task 5",
              lifecycle_state: "draft",
              is_completed: false,
              first_rewarded_completion_at: null,
            },
          ],
        },
      ],
    },
  ];
}

function createTreeWithCompletedSubGoal(): MainGoalItem[] {
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
          completed_at: "2026-02-26T00:00:00.000000+00:00",
          tasks: [
            {
              id: "t1",
              sub_goal_id: "s1",
              title: "Task 1",
              lifecycle_state: "confirmed",
              is_completed: true,
              first_rewarded_completion_at: "2026-02-26T00:00:00.000000+00:00",
            },
          ],
        },
      ],
    },
  ];
}

function createTreeWithNoTasks(): MainGoalItem[] {
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
          tasks: [],
        },
      ],
    },
  ];
}

describe("tasks limit", () => {
  it("disables task creation and shows the 5-task limit message", async () => {
    restore = installMockApi({ tree: createTreeWithFiveTasks() }).restore;
    window.history.replaceState({}, "", "/tasks/main-goal-1-g1/sub-goal-1-s1");

    render(<App />);

    await waitFor(() => expect(screen.getByRole("heading", { name: "Tasks for Sub Goal 1" })).toBeTruthy());
    expect(screen.getByText("Task limit reached (5 per sub goal). Delete a task to add a new one.")).toBeTruthy();

    const input = screen.getByPlaceholderText("Task title") as HTMLInputElement;
    const addButton = screen.getByRole("button", { name: "Add task" }) as HTMLButtonElement;
    expect(input.disabled).toBe(true);
    expect(addButton.disabled).toBe(true);
  });

  it("disables task creation for completed sub goals", async () => {
    restore = installMockApi({ tree: createTreeWithCompletedSubGoal() }).restore;
    window.history.replaceState({}, "", "/tasks/main-goal-1-g1/sub-goal-1-s1");

    render(<App />);

    await waitFor(() => expect(screen.getByRole("heading", { name: "Tasks for Sub Goal 1" })).toBeTruthy());
    expect(screen.getByText("Completed sub goal cannot add tasks.")).toBeTruthy();

    const input = screen.getByPlaceholderText("Task title") as HTMLInputElement;
    const addButton = screen.getByRole("button", { name: "Add task" }) as HTMLButtonElement;
    expect(input.disabled).toBe(true);
    expect(addButton.disabled).toBe(true);
  });

  it("shows disabled Confirm Draft Tasks when there are no tasks", async () => {
    restore = installMockApi({ tree: createTreeWithNoTasks() }).restore;
    window.history.replaceState({}, "", "/tasks/main-goal-1-g1/sub-goal-1-s1");

    render(<App />);

    await waitFor(() => expect(screen.getByRole("heading", { name: "Tasks for Sub Goal 1" })).toBeTruthy());
    const confirmButton = screen.getByRole("button", { name: "Confirm Draft Tasks" }) as HTMLButtonElement;
    expect(confirmButton.disabled).toBe(true);
  });
});

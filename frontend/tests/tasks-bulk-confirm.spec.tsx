import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { App } from "../src/app";
import type { MainGoalItem } from "../src/services/reward-hierarchy.types";
import { installMockApi } from "./mock-api";

let restore: (() => void) | null = null;

afterEach(() => {
  restore?.();
  restore = null;
});

function createTreeWithDraftTasks(): MainGoalItem[] {
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
          ],
        },
      ],
    },
  ];
}

describe("tasks bulk confirm", () => {
  it("confirms all draft tasks at once and shows success toast", async () => {
    restore = installMockApi({ tree: createTreeWithDraftTasks() }).restore;
    window.location.hash = "#/tasks/main-goal-1-g1/sub-goal-1-s1";

    render(<App />);

    await waitFor(() => expect(screen.getByRole("heading", { name: "Tasks for Sub Goal 1" })).toBeTruthy());
    await userEvent.click(screen.getByRole("button", { name: "Confirm Draft Tasks" }));

    await waitFor(() => expect(screen.getByText("Confirmed 2 draft task(s).")).toBeTruthy());
  });
});

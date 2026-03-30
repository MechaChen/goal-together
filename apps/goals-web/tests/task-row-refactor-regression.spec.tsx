import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TaskRow } from "../src/components/goals/task-row";
import type { TaskItem } from "../src/services/reward-hierarchy.types";

const draftTask: TaskItem = {
  id: "d1",
  sub_goal_id: "s1",
  title: "Draft task",
  lifecycle_state: "draft",
  is_completed: false,
  first_rewarded_completion_at: null,
};

const confirmedTask: TaskItem = {
  id: "c1",
  sub_goal_id: "s1",
  title: "Confirmed task",
  lifecycle_state: "confirmed",
  is_completed: false,
  first_rewarded_completion_at: null,
};

describe("task row refactor regression", () => {
  it("keeps draft actions and does not invoke complete on draft task", async () => {
    const onComplete = vi.fn().mockResolvedValue(undefined);
    const onDelete = vi.fn().mockResolvedValue(undefined);

    render(
      <TaskRow
        task={draftTask}
        completionHint={null}
        onUpdate={vi.fn().mockResolvedValue(undefined)}
        onDelete={onDelete}
        onComplete={onComplete}
      />,
    );

    expect(screen.getByRole("button", { name: "Edit" })).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalledWith("d1");
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("shows completion hint only for confirmed task", () => {
    const { rerender } = render(
      <TaskRow
        task={confirmedTask}
        completionHint="already completed previously"
        onUpdate={vi.fn().mockResolvedValue(undefined)}
        onDelete={vi.fn().mockResolvedValue(undefined)}
        onComplete={vi.fn().mockResolvedValue(undefined)}
      />,
    );

    expect(screen.getByText("Hint: already completed previously")).toBeTruthy();

    rerender(
      <TaskRow
        task={draftTask}
        completionHint="already completed previously"
        onUpdate={vi.fn().mockResolvedValue(undefined)}
        onDelete={vi.fn().mockResolvedValue(undefined)}
        onComplete={vi.fn().mockResolvedValue(undefined)}
      />,
    );

    expect(screen.queryByText("Hint: already completed previously")).toBeNull();
  });
});

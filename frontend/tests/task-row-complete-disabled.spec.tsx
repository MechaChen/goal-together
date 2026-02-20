import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TaskRow } from "../src/components/goals/task-row";
import type { TaskItem } from "../src/services/reward-hierarchy.types";

const baseTask: TaskItem = {
  id: "t1",
  sub_goal_id: "s1",
  title: "Example task",
  lifecycle_state: "confirmed",
  is_completed: false,
  first_rewarded_completion_at: null,
};

describe("task row complete button state", () => {
  it("keeps complete enabled for uncompleted confirmed task", async () => {
    const onComplete = vi.fn().mockResolvedValue(undefined);

    render(
      <TaskRow
        task={{ ...baseTask, is_completed: false }}
        completionHint={null}
        onUpdate={vi.fn().mockResolvedValue(undefined)}
        onDelete={vi.fn().mockResolvedValue(undefined)}
        onConfirm={vi.fn().mockResolvedValue(undefined)}
        onComplete={onComplete}
      />,
    );

    const button = screen.getByRole("button", { name: "Complete" }) as HTMLButtonElement;
    expect(button.disabled).toBe(false);

    await userEvent.click(button);
    expect(onComplete).toHaveBeenCalledWith("t1");
  });

  it("disables complete for already completed confirmed task", async () => {
    const onComplete = vi.fn().mockResolvedValue(undefined);

    render(
      <TaskRow
        task={{ ...baseTask, is_completed: true }}
        completionHint={null}
        onUpdate={vi.fn().mockResolvedValue(undefined)}
        onDelete={vi.fn().mockResolvedValue(undefined)}
        onConfirm={vi.fn().mockResolvedValue(undefined)}
        onComplete={onComplete}
      />,
    );

    const button = screen.getByRole("button", { name: "Completed" }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(screen.getByText("This task is already completed.")).toBeTruthy();

    await userEvent.click(button);
    expect(onComplete).not.toHaveBeenCalled();
  });
});

import { screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { clearLaunchState, renderAppAt, setLastOpenedTasksContext } from "./navigation-launch.utils";

let restore: (() => void) | null = null;

afterEach(() => {
  restore?.();
  restore = null;
  clearLaunchState();
});

describe("startup invalid last tasks fallback", () => {
  it("falls back to default tasks page when saved context is invalid", async () => {
    setLastOpenedTasksContext({
      route: "/tasks/main-goal-x-g999/sub-goal-z-s999",
      main_segment: "main-goal-x-g999",
      sub_segment: "sub-goal-z-s999",
      saved_at: new Date().toISOString(),
      schema_version: 1,
    });

    restore = renderAppAt("#/").restore;

    await waitFor(() => expect(screen.getByRole("heading", { name: "Tasks" })).toBeTruthy());
  });
});


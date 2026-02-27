import { screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { clearLaunchState, renderAppAt, setLastOpenedTasksContext } from "./navigation-launch.utils";

let restore: (() => void) | null = null;

afterEach(() => {
  restore?.();
  restore = null;
  clearLaunchState();
});

describe("startup explicit route precedence", () => {
  it("does not override explicit non-root route", async () => {
    setLastOpenedTasksContext({
      route: "/tasks/main-goal-1-g1/sub-goal-1-s1",
      main_segment: "main-goal-1-g1",
      sub_segment: "sub-goal-1-s1",
      saved_at: new Date().toISOString(),
      schema_version: 1,
    });

    restore = renderAppAt("/reward-history").restore;

    await waitFor(() => expect(screen.getByText("No reward events yet.")).toBeTruthy());
  });
});

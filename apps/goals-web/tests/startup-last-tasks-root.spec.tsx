import { screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { setLastOpenedTasksContext, renderAppAt, clearLaunchState } from "./navigation-launch.utils";

let restore: (() => void) | null = null;

afterEach(() => {
  restore?.();
  restore = null;
  clearLaunchState();
});

describe("startup last tasks root", () => {
  it("restores saved tasks route when opening from root", async () => {
    setLastOpenedTasksContext({
      route: "/tasks/main-goal-1-g1/sub-goal-1-s1",
      main_segment: "main-goal-1-g1",
      sub_segment: "sub-goal-1-s1",
      saved_at: new Date().toISOString(),
      schema_version: 1,
    });

    restore = renderAppAt("/").restore;

    await waitFor(() => expect(screen.getByRole("heading", { name: "Tasks for Sub Goal 1" })).toBeTruthy());
  });
});


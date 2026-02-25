import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { clearLaunchState, renderAppAt } from "./navigation-launch.utils";

let restore: (() => void) | null = null;

afterEach(() => {
  restore?.();
  restore = null;
  clearLaunchState();
});

describe("navbar toggle no navigation", () => {
  it("does not change route when toggling navigation", async () => {
    restore = renderAppAt("#/tasks/main-goal-1-g1/sub-goal-1-s1").restore;
    await waitFor(() => expect(screen.getByRole("heading", { name: "Tasks for Sub Goal 1" })).toBeTruthy());
    const initialHash = window.location.hash;

    await userEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));
    await userEvent.click(screen.getByRole("button", { name: "Hide sidebar" }));

    expect(window.location.hash).toBe(initialHash);
  });
});

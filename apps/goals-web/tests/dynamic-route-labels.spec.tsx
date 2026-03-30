import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { App } from "../src/app";
import { installMockApi } from "./mock-api";

let restore: (() => void) | null = null;

afterEach(() => {
  restore?.();
  restore = null;
});

describe("dynamic route labels", () => {
  it("uses name-id routes and dynamic labels for selected hierarchy", async () => {
    restore = installMockApi().restore;
    window.history.replaceState({}, "", "/tasks/main-goal-1-g1/sub-goal-1-s1");

    render(<App />);

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Tasks for Sub Goal 1" }),
      ).toBeTruthy(),
    );
    expect(window.location.pathname).toBe(
      "/tasks/main-goal-1-g1/sub-goal-1-s1",
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Toggle sidebar" }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Back to Sub Goals page" }),
    );
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Sub Goals for Main Goal 1" }),
      ).toBeTruthy(),
    );
    expect(window.location.pathname).toBe("/sub-goals/main-goal-1-g1");

    await userEvent.click(
      screen.getByRole("button", { name: "Toggle sidebar" }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Back to Main Page" }),
    );
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Main Goals" })).toBeTruthy(),
    );
    expect(window.location.pathname).toBe("/main-goals");
  });
});

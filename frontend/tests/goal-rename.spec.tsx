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

describe("goal rename", () => {
  it("renames a main goal from row more menu", async () => {
    restore = installMockApi().restore;
    window.history.replaceState({}, "", "/main-goals");

    render(<App />);

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Main Goals" })).toBeTruthy(),
    );

    await userEvent.click(screen.getAllByRole("button", { name: "More actions" })[0]);
    await userEvent.click(screen.getByRole("menuitem", { name: "Rename" }));
    await userEvent.clear(screen.getByDisplayValue("Main Goal 1"));
    await userEvent.type(screen.getByPlaceholderText("Goal title"), "Fitness Goal");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(screen.getByText("Fitness Goal")).toBeTruthy());
    await waitFor(() =>
      expect(
        (globalThis.fetch as unknown as { mock: { calls: unknown[][] } }).mock.calls.some(
          ([input, init]) =>
            String(input).includes("/main-goals/g1") &&
            String((init as RequestInit | undefined)?.method).toUpperCase() === "PATCH",
        ),
      ).toBe(true),
    );
  });

  it("renames a sub goal from row more menu", async () => {
    restore = installMockApi().restore;
    window.history.replaceState({}, "", "/sub-goals/main-goal-1-g1");

    render(<App />);

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Sub Goals for Main Goal 1" }),
      ).toBeTruthy(),
    );

    await userEvent.click(screen.getAllByRole("button", { name: "More actions" })[0]);
    await userEvent.click(screen.getByRole("menuitem", { name: "Rename" }));
    await userEvent.clear(screen.getByDisplayValue("Sub Goal 1"));
    await userEvent.type(screen.getByPlaceholderText("Goal title"), "Milestone Alpha");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(screen.getByText("Milestone Alpha")).toBeTruthy());
    await waitFor(() =>
      expect(
        (globalThis.fetch as unknown as { mock: { calls: unknown[][] } }).mock.calls.some(
          ([input, init]) =>
            String(input).includes("/sub-goals/s1") &&
            String((init as RequestInit | undefined)?.method).toUpperCase() === "PATCH",
        ),
      ).toBe(true),
    );
  });
});

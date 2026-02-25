import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { App } from "../src/app";
import { installMockApi } from "./mock-api";

let restore: (() => void) | null = null;

afterEach(() => {
  restore?.();
  restore = null;
  vi.restoreAllMocks();
});

describe("delete guards in UI", () => {
  it("shows conflict toast when deleting main goal with confirmed tasks", async () => {
    restore = installMockApi().restore;
    vi.spyOn(window, "confirm").mockReturnValue(true);
    window.location.hash = "#/main-goals";

    render(<App />);

    await waitFor(() => expect(screen.getByRole("heading", { name: "Main Goals" })).toBeTruthy());
    await userEvent.click(screen.getAllByRole("button", { name: "More actions" })[0]);
    await userEvent.click(screen.getByRole("menuitem", { name: "Delete" }));

    await waitFor(() => expect(screen.getByText("main goal with confirmed tasks cannot be deleted")).toBeTruthy());
  });

  it("shows conflict toast when deleting sub goal with confirmed tasks", async () => {
    restore = installMockApi().restore;
    vi.spyOn(window, "confirm").mockReturnValue(true);
    window.location.hash = "#/sub-goals/main-goal-1-g1";

    render(<App />);

    await waitFor(() => expect(screen.getByRole("heading", { name: "Sub Goals for Main Goal 1" })).toBeTruthy());
    await userEvent.click(screen.getAllByRole("button", { name: "More actions" })[0]);
    await userEvent.click(screen.getByRole("menuitem", { name: "Delete" }));

    await waitFor(() => expect(screen.getByText("sub goal with confirmed tasks cannot be deleted")).toBeTruthy());
  });
});

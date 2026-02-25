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

describe("tasks context gating", () => {
  it("opens tasks from selected sub goal", async () => {
    restore = installMockApi().restore;
    window.location.hash = "#/main-goals";

    render(<App />);

    await waitFor(() => expect(screen.getAllByRole("button", { name: /Main Goal 1/i }).length).toBeGreaterThan(0));
    await userEvent.click(screen.getAllByRole("button", { name: /Main Goal 1/i }).at(-1)!);
    await waitFor(() => expect(screen.getByRole("heading", { name: "Sub Goals for Main Goal 1" })).toBeTruthy());

    await userEvent.click(screen.getAllByRole("button", { name: /Sub Goal 1/i }).at(-1)!);
    await waitFor(() => expect(screen.getByRole("heading", { name: "Tasks for Sub Goal 1" })).toBeTruthy());
  });
});

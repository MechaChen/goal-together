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

describe("navigation pages", () => {
  it("renders dedicated pages through navigation", async () => {
    restore = installMockApi().restore;
    window.location.hash = "#/main-goals";

    render(<App />);

    await waitFor(() => expect(screen.getByRole("heading", { name: "Main Goals" })).toBeTruthy());
    await userEvent.click(screen.getByRole("button", { name: "Reward History" }));
    await waitFor(() => expect(screen.getByText("No reward events yet.")).toBeTruthy());
    await userEvent.click(screen.getByRole("button", { name: "Back to Main Page" }));

    window.location.hash = "#/sub-goals";
    await waitFor(() => expect(screen.getByRole("heading", { name: "Sub Goals" })).toBeTruthy());

    window.location.hash = "#/tasks";
    await waitFor(() => expect(screen.getByRole("heading", { name: "Tasks" })).toBeTruthy());
  });
});

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
    window.history.replaceState({}, "", "/main-goals");

    render(<App />);

    await waitFor(() => expect(screen.getByRole("heading", { name: "Main Goals" })).toBeTruthy());
    await userEvent.click(screen.getByRole("button", { name: "Reward History" }));
    await waitFor(() => expect(screen.getByText("No reward events yet.")).toBeTruthy());
    await userEvent.click(screen.getByRole("button", { name: "Back to Main Page" }));

    await userEvent.click(screen.getByRole("button", { name: /^Main Goal 1/ }));
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Sub Goals for Main Goal 1" })).toBeTruthy()
    );

    await userEvent.click(screen.getByRole("button", { name: /^Sub Goal 1/ }));
    await waitFor(() => expect(screen.getByRole("heading", { name: "Tasks for Sub Goal 1" })).toBeTruthy());
  });
});

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

describe("navbar toggle button", () => {
  it("opens and closes sidebar from header left button", async () => {
    restore = renderAppAt("/sub-goals").restore;
    await waitFor(() => expect(screen.getByRole("heading", { name: "Sub Goals" })).toBeTruthy());

    const button = screen.getByRole("button", { name: "Toggle sidebar" });
    await userEvent.click(button);
    expect(screen.getByText("Back to Main Page")).toBeTruthy();

    await userEvent.click(screen.getByRole("button", { name: "Hide sidebar" }));
    expect(screen.queryByText("Back to Main Page")).toBeNull();
  });
});

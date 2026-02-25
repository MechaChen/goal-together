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

describe("navbar resets hidden on reload", () => {
  it("starts hidden after rerender/reload", async () => {
    const first = renderAppAt("#/sub-goals");
    restore = first.restore;
    await waitFor(() => expect(screen.getByRole("heading", { name: "Sub Goals" })).toBeTruthy());
    await userEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));
    expect(screen.getByText("Back to Main Page")).toBeTruthy();

    first.unmount();
    renderAppAt("#/sub-goals");

    await waitFor(() => expect(screen.getByRole("heading", { name: "Sub Goals" })).toBeTruthy());
    expect(screen.queryByText("Back to Main Page")).toBeNull();
  });
});

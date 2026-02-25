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

describe("navbar toggle accessibility", () => {
  it("exposes accessible expanded state changes", async () => {
    restore = renderAppAt("#/sub-goals").restore;
    await waitFor(() => expect(screen.getByRole("heading", { name: "Sub Goals" })).toBeTruthy());

    const toggle = screen.getByRole("button", { name: "Toggle sidebar" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");

    await userEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Hide sidebar" }).getAttribute("aria-expanded")).toBe("true");
  });
});

import { screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { clearLaunchState, renderAppAt } from "./navigation-launch.utils";

let restore: (() => void) | null = null;

afterEach(() => {
  restore?.();
  restore = null;
  clearLaunchState();
});

describe("navbar default hidden", () => {
  it("hides sidebar panel on first render", async () => {
    restore = renderAppAt("/sub-goals").restore;
    await waitFor(() => expect(screen.getByRole("heading", { name: "Sub Goals" })).toBeTruthy());
    expect(screen.queryByText("Back to Main Page")).toBeNull();
  });
});

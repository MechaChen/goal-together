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

describe("sub goals context gating", () => {
  it("requires main goal context", async () => {
    restore = installMockApi().restore;
    window.location.hash = "#/sub-goals";

    render(<App />);

    await waitFor(() => expect(screen.getByRole("heading", { name: "Sub Goals" })).toBeTruthy());
    expect(screen.getByText(/Choose a Main Goal in the sidebar/)).toBeTruthy();

    await userEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));
    await userEvent.click(screen.getByRole("button", { name: "Main Goal 1" }));

    await waitFor(() => expect(screen.getByRole("heading", { name: "Sub Goals for Main Goal 1" })).toBeTruthy());
  });
});

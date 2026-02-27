import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { App } from "../src/app";
import { installMockApi } from "./mock-api";

let restore: (() => void) | null = null;

afterEach(() => {
  restore?.();
  restore = null;
});

describe("reward history empty state", () => {
  it("shows explicit empty state", async () => {
    restore = installMockApi({ history: [] }).restore;
    window.history.replaceState({}, "", "/reward-history");

    render(<App />);

    await waitFor(() => expect(screen.getByText("No reward events yet.")).toBeTruthy());
  });
});

import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { App } from "../src/app";
import { installMockApi } from "./mock-api";

let restore: (() => void) | null = null;

afterEach(() => {
  restore?.();
  restore = null;
});

describe("reward history populated state", () => {
  it("shows reward history entries", async () => {
    restore = installMockApi({
      history: [
        {
          id: "e1",
          event_type: "TASK_COMPLETE",
          token_amount: 10,
          task_id: "t1",
          rewarded_completion_counter: 1,
          created_at: new Date().toISOString(),
        },
      ],
    }).restore;
    window.location.hash = "#/reward-history";

    render(<App />);

    await waitFor(() => expect(screen.getByText("TASK_COMPLETE +10")).toBeTruthy());
  });
});

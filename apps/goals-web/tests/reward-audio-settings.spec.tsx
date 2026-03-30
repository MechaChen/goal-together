import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { App } from "../src/app";
import { installMockApi } from "./mock-api";

let restore: (() => void) | null = null;

afterEach(() => {
  restore?.();
  restore = null;
});

describe("reward audio settings", () => {
  it("opens the modal and resets a custom slot", async () => {
    restore = installMockApi({
      rewardAudioSettings: {
        slots: [
          {
            kind: "normal",
            has_custom_audio: true,
            file_url: "/reward-audio/normal/file?ts=1",
            original_filename: "coin.mp3",
            mime_type: "audio/mpeg",
            file_size_bytes: 12,
            updated_at: new Date().toISOString(),
          },
          {
            kind: "bonus",
            has_custom_audio: false,
            file_url: null,
            original_filename: null,
            mime_type: null,
            file_size_bytes: null,
            updated_at: null,
          },
        ],
      },
    }).restore;
    window.history.replaceState({}, "", "/main-goals");

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Main Goals" })).toBeTruthy();
    });
    await userEvent.click(screen.getByRole("button", { name: "Reward Audio" }));

    expect(screen.getByRole("dialog", { name: "Reward audio settings" })).toBeTruthy();
    expect(screen.getAllByText(/coin.mp3/).length).toBeGreaterThan(0);
    expect(screen.getByTitle("coin.mp3")).toBeTruthy();

    expect(screen.getAllByText("Choose file").length).toBe(2);
    expect(screen.getByRole("button", { name: "Reset" })).toBeTruthy();

    await userEvent.click(screen.getByRole("button", { name: "Reset" }));

    await waitFor(() => {
      expect(screen.getAllByText("Using default app sound.").length).toBe(4);
    });
  });

  it("previews reward audio from the modal", async () => {
    const play = vi.fn().mockResolvedValue(undefined);
    const originalAudio = globalThis.Audio;
    const audioMock = vi.fn().mockImplementation(() => ({
      preload: "auto",
      volume: 0.7,
      currentTime: 0,
      play,
    }));
    vi.stubGlobal("Audio", audioMock);

    restore = installMockApi().restore;
    window.history.replaceState({}, "", "/main-goals");

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Main Goals" })).toBeTruthy();
    });
    await userEvent.click(screen.getByRole("button", { name: "Reward Audio" }));
    expect(screen.getAllByText("Choose file").length).toBe(2);
    await userEvent.click(screen.getAllByRole("button", { name: "Preview" })[0]);

    expect(play).toHaveBeenCalled();

    vi.stubGlobal("Audio", originalAudio);
  });
});

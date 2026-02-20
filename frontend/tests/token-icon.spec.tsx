import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TokenIcon } from "../src/components/rewards/token-icon";

describe("token icon", () => {
  it("renders accessible svg token", () => {
    render(<TokenIcon label="Lego token" />);
    expect(screen.getByRole("img", { name: "Lego token" })).toBeTruthy();
  });
});

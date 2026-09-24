import { describe, test, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { TrueFocus } from "./TrueFocus";

afterEach(() => {
  cleanup();
});

describe("TrueFocus", () => {
  test("renders every word sharp before any hover", () => {
    render(<TrueFocus text="Mon Expertise" />);

    const words = screen.getAllByTestId("true-focus-word");
    expect(words).toHaveLength(2);
    for (const w of words) {
      expect(w.className).not.toContain("blur");
    }
  });

  test("blurs the other words while one is hovered, sharp again on leave", () => {
    render(<TrueFocus text="Mon Expertise" />);

    const [first, second] = screen.getAllByTestId("true-focus-word");
    fireEvent.mouseEnter(second);
    expect(second.className).not.toContain("blur");
    expect(first.className).toContain("blur");

    fireEvent.mouseLeave(second);
    expect(first.className).not.toContain("blur");
    expect(second.className).not.toContain("blur");
  });
});

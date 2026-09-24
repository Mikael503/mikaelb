import { describe, test, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { TrueFocus } from "./TrueFocus";

type Callback = (entries: { isIntersecting: boolean }[]) => void;
const observerCallbacks: Callback[] = [];

class FakeIntersectionObserver {
  constructor(cb: Callback) {
    observerCallbacks.push(cb);
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

function fireIntersecting(isIntersecting: boolean) {
  act(() => {
    observerCallbacks.at(-1)?.([{ isIntersecting }]);
  });
}

beforeEach(() => {
  observerCallbacks.length = 0;
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
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
    fireIntersecting(true);

    const [first, second] = screen.getAllByTestId("true-focus-word");
    fireEvent.mouseEnter(second);
    expect(second.className).not.toContain("blur");
    expect(first.className).toContain("blur");

    fireEvent.mouseLeave(second);
    expect(first.className).not.toContain("blur");
    expect(second.className).not.toContain("blur");
  });

  test("keeps words hidden before entering the viewport", () => {
    render(<TrueFocus text="Mon Expertise" />);

    const words = screen.getAllByTestId("true-focus-word");
    for (const w of words) {
      expect(w.style.opacity).toBe("0");
    }
  });

  test("reveals words with a stagger delay once intersecting", () => {
    render(<TrueFocus text="Mon Expertise" />);
    fireIntersecting(true);

    const [first, second] = screen.getAllByTestId("true-focus-word");
    expect(first.style.opacity).toBe("1");
    expect(second.style.opacity).toBe("1");
    expect(second.style.transitionDelay).not.toBe(first.style.transitionDelay);
  });
});

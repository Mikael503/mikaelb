import { describe, test, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, act, cleanup } from "@testing-library/react";
import { ScrollReveal } from "./ScrollReveal";

type Callback = (entries: { isIntersecting: boolean }[]) => void;
let observerCallback: Callback | null = null;

class FakeIntersectionObserver {
  constructor(cb: Callback) {
    observerCallback = cb;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

function fireIntersecting(isIntersecting: boolean) {
  act(() => {
    observerCallback?.([{ isIntersecting }]);
  });
}

beforeEach(() => {
  observerCallback = null;
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("ScrollReveal", () => {
  test("keeps children hidden before they enter the viewport", () => {
    render(
      <ScrollReveal>
        <p>Contenu</p>
      </ScrollReveal>
    );

    const wrapper = screen.getByText("Contenu").parentElement;
    expect(wrapper?.className).toContain("opacity-0");
  });

  test("reveals children once they enter the viewport", () => {
    render(
      <ScrollReveal>
        <p>Contenu</p>
      </ScrollReveal>
    );

    fireIntersecting(true);

    const wrapper = screen.getByText("Contenu").parentElement;
    expect(wrapper?.className).toContain("opacity-100");
    expect(wrapper?.className).not.toContain("opacity-0");
  });
});

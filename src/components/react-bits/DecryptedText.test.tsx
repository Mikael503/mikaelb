import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, act, cleanup } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { DecryptedText } from "./DecryptedText";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("DecryptedText", () => {
  test("shows scrambled characters instead of the final text on first render", () => {
    vi.useFakeTimers();
    render(<DecryptedText text="Dev" speed={50} />);

    const resolved = screen.getByLabelText("Dev", { exact: true });
    expect(resolved.textContent).not.toBe("Dev");
  });

  test("reveals the exact final text once the animation completes", () => {
    vi.useFakeTimers();
    render(<DecryptedText text="Dev" speed={50} />);

    act(() => {
      vi.advanceTimersByTime(50 * 3 + 1000);
    });

    // Le texte est réparti sur plusieurs spans : on vérifie le contenu résolu
    const resolved = screen.getByLabelText("Dev", { exact: true });
    expect(resolved.textContent).toBe("Dev");
  });

  test("renders deterministic output on the server (no hydration mismatch)", () => {
    const first = renderToString(<DecryptedText text="Dev" />);
    const second = renderToString(<DecryptedText text="Dev" />);

    expect(first).toBe(second);
  });
});

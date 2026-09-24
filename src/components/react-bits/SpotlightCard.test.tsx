import { describe, test, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { SpotlightCard } from "./SpotlightCard";

afterEach(() => {
  cleanup();
});

describe("SpotlightCard", () => {
  test("renders its children", () => {
    render(
      <SpotlightCard>
        <p>Contenu carte</p>
      </SpotlightCard>
    );

    expect(screen.getByText("Contenu carte")).toBeInTheDocument();
  });

  test("moves the spotlight to the cursor position on mouse move", () => {
    const { container } = render(
      <SpotlightCard>
        <p>Contenu carte</p>
      </SpotlightCard>
    );

    const card = container.firstElementChild as HTMLElement;
    fireEvent.mouseMove(card, { clientX: 60, clientY: 40 });

    expect(card.style.getPropertyValue("--spot-x")).toBe("60px");
    expect(card.style.getPropertyValue("--spot-y")).toBe("40px");
  });

  test("forwards the ref to the card element", () => {
    let node: HTMLDivElement | null = null;
    const { container } = render(
      <SpotlightCard ref={(el: HTMLDivElement | null) => { node = el; }}>
        <p>Contenu carte</p>
      </SpotlightCard>
    );

    expect(node).toBe(container.firstElementChild);
    expect(node?.className).toContain("spotlight-card");
  });
});

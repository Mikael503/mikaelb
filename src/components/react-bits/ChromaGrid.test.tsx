import { describe, test, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ChromaGrid } from "./ChromaGrid";

afterEach(() => {
  cleanup();
});

describe("ChromaGrid", () => {
  test("renders its children", () => {
    render(
      <ChromaGrid>
        <p>Contenu projet</p>
      </ChromaGrid>
    );

    expect(screen.getByText("Contenu projet")).toBeInTheDocument();
  });

  test("moves the chromatic glow to the cursor position on mouse move", () => {
    const { container } = render(
      <ChromaGrid>
        <p>Contenu projet</p>
      </ChromaGrid>
    );

    const grid = container.firstElementChild as HTMLElement;
    expect(grid.className).toContain("chroma-grid");
    fireEvent.mouseMove(grid, { clientX: 80, clientY: 30 });

    expect(grid.style.getPropertyValue("--chroma-x")).toBe("80px");
    expect(grid.style.getPropertyValue("--chroma-y")).toBe("30px");
  });
});

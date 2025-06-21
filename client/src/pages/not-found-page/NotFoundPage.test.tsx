import { MemoryRouter } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";

const renderNotFoundPage = () => {
  render(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>
  );
};

describe("NotFoundPage", () => {
  test("renders the not found page", () => {
    renderNotFoundPage();

    const heading = screen.getByRole("heading", { name: /404|not found/i });
    expect(heading).toBeInTheDocument();
  });

  test("renders the go back home button and button has correct href", () => {
    renderNotFoundPage();

    const button = screen.getByRole("link", { name: /back|home/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/");
  });
});

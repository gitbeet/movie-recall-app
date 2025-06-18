import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the search button", () => {
    render(<App />);
    const searchButton = screen.getByRole("button", { name: "Find My Movie" });
    expect(searchButton).toBeInTheDocument();
  });
});

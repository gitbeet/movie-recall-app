import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import App from "../../App";
import userEvent from "@testing-library/user-event";

describe("Search Page", () => {
  test("renders the search input and button", () => {
    render(<App />);
    const searchInput = screen.getByTestId("movie-search-input");
    const searchButton = screen.getByRole("button", { name: /find my movie/i });
    expect(searchInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  test("allows typing in the search input", async () => {
    render(<App />);
    const searchInput = screen.getByTestId("movie-search-input");
    await userEvent.type(searchInput, "space adventure");
    expect(searchInput).toHaveValue("space adventure");
  });

  test("disables the search button when loading or input is empty and enables it when input is not empty and not loading", async () => {
    render(<App />);
    const searchInput = screen.getByTestId("movie-search-input");
    const searchButton = screen.getByRole("button", { name: /find my movie/i });
    expect(searchButton).toBeDisabled();
    await userEvent.type(searchInput, "space adventure");
    expect(searchButton).not.toBeDisabled();
  });
});

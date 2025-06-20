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

  test("the search returns the correct number of results", async () => {
    render(<App />);

    const searchInput = screen.getByTestId("movie-search-input");
    const searchButton = screen.getByRole("button", { name: /find my movie/i });

    await userEvent.type(searchInput, "space adventure");
    await userEvent.click(searchButton);

    const results = await screen.findAllByTestId("movie-card");

    expect(results).toHaveLength(10);
  });

  test.only("the search returns the correct mock data for the results", async () => {
    render(<App />);

    const searchInput = screen.getByTestId("movie-search-input");
    const searchButton = screen.getByRole("button", { name: /find my movie/i });

    await userEvent.type(searchInput, "mock search");
    await userEvent.click(searchButton);

    const titleResults = await screen.findAllByTestId("movie-card-title");
    const descriptionResults = await screen.findAllByTestId(
      "movie-card-description"
    );
    const posterResults = await screen.findAllByTestId("movie-card-poster");

    titleResults.forEach((result) => {
      expect(result).toHaveTextContent(/^Mock Movie \d+$/i);
    });
    descriptionResults.forEach((result) => {
      expect(result).toHaveTextContent(/^A mock movie description \d+$/i);
    });
    posterResults.forEach((result) => {
      expect(result).toHaveAttribute(
        "src",
        expect.stringContaining("https://via.placeholder.com/150?text=Poster")
      );
    });
  });
});

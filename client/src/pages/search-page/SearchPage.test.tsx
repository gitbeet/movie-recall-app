import { render, screen } from "@/test-utils";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SearchPage from "./SearchPage";
import userEvent from "@testing-library/user-event";
import { describe, test, expect } from "vitest";
import MovieDetailsPage from "../movie-details-page/MovieDetailsPage";

describe("Search Page", () => {
  const renderSearchPage = () =>
    render(
      <MemoryRouter>
        <Routes>
          <Route
            path="/"
            element={<SearchPage />}
          />
          <Route
            path="/movie/:id"
            element={<MovieDetailsPage />}
          />
        </Routes>
      </MemoryRouter>
    );

  test("renders the search input and button", () => {
    renderSearchPage();
    const searchInput = screen.getByRole("textbox", {
      name: /movie description/i,
    });
    const searchButton = screen.getByRole("button", { name: /find my movie/i });
    expect(searchInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  test("allows typing in the search input", async () => {
    renderSearchPage();
    const searchInput = screen.getByRole("textbox", {
      name: /movie description/i,
    });
    await userEvent.type(searchInput, "space adventure");
    expect(searchInput).toHaveValue("space adventure");
  });

  test("disables the search button when loading or input is empty and enables it when input is not empty and not loading", async () => {
    renderSearchPage();
    const searchInput = screen.getByRole("textbox", {
      name: /movie description/i,
    });
    const searchButton = screen.getByRole("button", { name: /find my movie/i });
    expect(searchButton).toBeDisabled();
    await userEvent.type(searchInput, "space adventure");
    expect(searchButton).not.toBeDisabled();
  });

  test("the search returns the correct mock data for the results", async () => {
    renderSearchPage();
    const searchInput = screen.getByRole("textbox", {
      name: /movie description/i,
    });
    const searchButton = screen.getByRole("button", { name: /find my movie/i });
    await userEvent.type(searchInput, "mock search");
    await userEvent.click(searchButton);
    const titleResults = await screen.findAllByTestId("movie-card-title");
    const descriptionResults = await screen.findAllByTestId(
      "movie-card-description"
    );
    titleResults.forEach((result) => {
      expect(result).toHaveTextContent(/^Mock Movie \d+$/i);
    });
    descriptionResults.forEach((result) => {
      expect(result).toHaveTextContent(/^A mock movie description \d+$/i);
    });
  });

  test("navigates to movie details page on card click", async () => {
    renderSearchPage();

    const searchInput = screen.getByRole("textbox", {
      name: /movie description/i,
    });
    const searchButton = screen.getByRole("button", { name: /find my movie/i });

    await userEvent.type(searchInput, "mock search");
    await userEvent.click(searchButton);

    const movieCards = await screen.findAllByTestId("movie-card");

    await userEvent.click(movieCards[0]);

    expect(await screen.findByTestId("movie-details-page")).toBeInTheDocument();
  });
});

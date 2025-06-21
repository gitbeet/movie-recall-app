import { render, screen } from "../../test-utils";
import { describe, expect, test } from "vitest";
import MovieDetailsPage from "./movie-details-page";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import * as FavoritesContext from "@/context/favorites-context";
import { vi } from "vitest";

// Mock FavoritesContext to prevent real fetches and async effects
vi.spyOn(FavoritesContext, "useFavorites").mockReturnValue({
  user: null,
  favorites: [],
  addToFavorites: vi.fn(),
  removeFromFavorites: vi.fn(),
  isInFavorites: vi.fn(),
  loading: false,
  fetchFavorites: vi.fn(),
  refetchUser: vi.fn(),
});

const renderMovieDetailsPage = () => {
  render(
    <MemoryRouter initialEntries={["/movie/1"]}>
      <Routes>
        <Route
          path="/movie/:id"
          element={<MovieDetailsPage />}
        />
      </Routes>
    </MemoryRouter>
  );
};

describe("Movie Details Page", () => {
  test("renders skeleton loading state", () => {
    renderMovieDetailsPage();

    const skeleton = screen.getByTestId("movie-details-skeleton");

    expect(skeleton).toBeInTheDocument();
  });

  test("renders movie details container when movie details are loaded", async () => {
    renderMovieDetailsPage();
    const movieDetails = await screen.findByTestId("movie-details-page");
    expect(movieDetails).toBeInTheDocument();
  });

  test("renders back to homepage button", async () => {
    renderMovieDetailsPage();
    const backToHomepageButton = await screen.findByRole("button", {
      name: /back to homepage/i,
    });
    expect(backToHomepageButton).toBeInTheDocument();
  });

  test("renders movie poster", async () => {
    renderMovieDetailsPage();
    const poster = await screen.findByRole("img", {
      name: /mock movie 1 poster/i,
    });
    expect(poster).toBeInTheDocument();
  });

  test("renders the movie title and title has correct text", async () => {
    renderMovieDetailsPage();
    const title = await screen.findByRole("heading", { name: /mock movie/i });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Mock Movie 1");
  });

  test("renders the movie release year and release year has correct text", async () => {
    renderMovieDetailsPage();
    const releaseYear = await screen.findByTestId("movie-release-year");
    expect(releaseYear).toBeInTheDocument();
    expect(releaseYear).toHaveTextContent("2025");
  });

  test("renders the crew members and crew members have correct text", async () => {
    renderMovieDetailsPage();
    const crewMembers = await screen.findByTestId("crew-member");
    expect(crewMembers).toBeInTheDocument();
    expect(crewMembers).toHaveTextContent("Mock Crew Member 1");
  });

  test("renders the movie rating and vote count and both have correct text", async () => {
    renderMovieDetailsPage();
    const rating = await screen.findByTestId("movie-rating");
    const voteCount = await screen.findByTestId("movie-vote-count");

    expect(rating).toBeInTheDocument();
    expect(rating).toHaveTextContent("7.5");

    expect(voteCount).toBeInTheDocument();
    expect(voteCount).toHaveTextContent("100");
  });

  test("renders the movie description and description has correct text", async () => {
    renderMovieDetailsPage();
    const description = await screen.findByTestId("movie-description");
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent("Mock Movie Description 1");
  });

  test("renders the movie genres and genres have correct text", async () => {
    renderMovieDetailsPage();
    const genres = await screen.findAllByTestId("movie-genre");
    expect(genres).toHaveLength(2);
    expect(genres[0]).toHaveTextContent("Mock Movie Genre 1");
    expect(genres[1]).toHaveTextContent("Mock Movie Genre 2");
  });

  test("renders trailer button", async () => {
    renderMovieDetailsPage();
    const trailerButton = await screen.findByRole("button", {
      name: /watch trailer/i,
    });
    expect(trailerButton).toBeInTheDocument();
  });

  test("renders add to watchlist button", async () => {
    renderMovieDetailsPage();
    const addToWatchlistButton = await screen.findByRole("button", {
      name: /add to watchlist/i,
    });
    expect(addToWatchlistButton).toBeInTheDocument();
  });

  test("renders imdb link and link has correct href", async () => {
    renderMovieDetailsPage();
    const imdbLink = await screen.findByRole("link", {
      name: /imdb/i,
    });
    expect(imdbLink).toBeInTheDocument();
    expect(imdbLink).toHaveAttribute(
      "href",
      "https://www.imdb.com/title/tt1234567/"
    );
  });

  test("renders share button", async () => {
    renderMovieDetailsPage();
    const shareButton = await screen.findByRole("button", {
      name: /share/i,
    });
    expect(shareButton).toBeInTheDocument();
  });

  test("renders cast members and cast members have correct number of members", async () => {
    renderMovieDetailsPage();
    const castMembers = await screen.findAllByTestId("cast-member");
    expect(castMembers).toHaveLength(2);
  });

  test("renders gallery images and gallery has correct number of images", async () => {
    renderMovieDetailsPage();
    const images = await screen.findAllByTestId("movie-image");
    expect(images).toHaveLength(1);
  });
});

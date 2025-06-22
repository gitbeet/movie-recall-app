import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MovieCard, { type MovieCardProps } from "./movie-card";
import { MemoryRouter } from "react-router-dom";

const mockMovie: MovieCardProps = {
  id: 1,
  title: "Mock Movie Title",
  description: "Mock Movie Description",
  posterUrl: "https://via.placeholder.com/150",
  releaseYear: "2000",
  topPick: "top",
};
const renderMovieCard = (props: Partial<MovieCardProps> = {}) => {
  const defaultProps = mockMovie;

  render(
    <MemoryRouter>
      <MovieCard
        {...defaultProps}
        {...props}
      />
    </MemoryRouter>
  );
};

describe("movie-card", () => {
  describe("renders the UI elements correctly", () => {
    test("renders the movie card poster", () => {
      renderMovieCard();
      const movieCardPoster = screen.getByRole("img", {
        name: `${mockMovie.title} poster`,
      });
      expect(movieCardPoster).toBeInTheDocument();
      expect(movieCardPoster).toHaveAttribute("src", mockMovie.posterUrl);
      expect(movieCardPoster).toHaveAttribute(
        "alt",
        `${mockMovie.title} poster`
      );
    });

    test("renders no movie poster text when posterUrl is not provided", () => {
      renderMovieCard({ posterUrl: "" });
      const noMoviePosterText = screen.getByText("No poster available");
      expect(noMoviePosterText).toBeInTheDocument();
    });

    test("renders the movie card title", () => {
      renderMovieCard();
      const movieCardTitle = screen.getByTestId("movie-card-title");
      expect(movieCardTitle).toBeInTheDocument();
      expect(movieCardTitle).toHaveTextContent(mockMovie.title);
    });

    test("renders the movie card release year", () => {
      renderMovieCard();
      const movieCardReleaseYear = screen.getByTestId(
        "movie-card-release-year"
      );
      expect(movieCardReleaseYear).toBeInTheDocument();
      expect(movieCardReleaseYear).toHaveTextContent(mockMovie.releaseYear!);
    });

    test("renders the movie card description", () => {
      renderMovieCard();
      const movieCardDescription = screen.getByTestId("movie-card-description");
      expect(movieCardDescription).toBeInTheDocument();
      expect(movieCardDescription).toHaveTextContent(mockMovie.description);
    });

    test("renders the top pick badge when topPick is 'top'", () => {
      renderMovieCard();
      const topPickBadge = screen.getByTestId("movie-card-badge");
      expect(topPickBadge).toBeInTheDocument();
      expect(topPickBadge).toHaveTextContent("Top Pick");
    });

    test("renders the second pick badge when topPick is 'second'", () => {
      renderMovieCard({ topPick: "second" });
      const secondPickBadge = screen.getByTestId("movie-card-badge");
      expect(secondPickBadge).toBeInTheDocument();
      expect(secondPickBadge).toHaveTextContent("2nd");
    });

    test("renders the third pick badge when topPick is 'third'", () => {
      renderMovieCard({ topPick: "third" });
      const thirdPickBadge = screen.getByTestId("movie-card-badge");
      expect(thirdPickBadge).toBeInTheDocument();
      expect(thirdPickBadge).toHaveTextContent("3rd");
    });

    test("renders no badge when topPick is not provided", () => {
      renderMovieCard({ topPick: undefined });
      const noBadge = screen.queryByTestId("movie-card-badge");
      expect(noBadge).not.toBeInTheDocument();
    });
  });
});

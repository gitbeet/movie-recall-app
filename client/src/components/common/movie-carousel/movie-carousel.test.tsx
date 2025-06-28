import { describe, expect, test } from "vitest";
import MovieCarousel, { type MovieCarouselProps } from "./movie-carousel";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const defaultProps: MovieCarouselProps = {
  movies: [
    {
      id: 1,
      title: "Mock Movie 1",
      description: "Mock Description 1",
      posterUrl: "https://via.placeholder.com/1",
    },
    {
      id: 2,
      title: "Mock Movie 2",
      description: "Mock Description 2",
      posterUrl: "https://via.placeholder.com/2",
    },
    {
      id: 3,
      title: "Mock Movie 3",
      description: "Mock Description 3",
      posterUrl: "https://via.placeholder.com/3",
    },
  ],
};

const renderMovieCarousel = (props?: Partial<MovieCarouselProps>) => {
  render(
    <MemoryRouter>
      <MovieCarousel
        {...defaultProps}
        {...props}
      />
    </MemoryRouter>
  );
};

describe("movie-carousel", () => {
  test("renders the movie carousel with the correct number of movies", () => {
    renderMovieCarousel();
    const movieCarousel = screen.getAllByTestId("movie-card");
    expect(movieCarousel).toHaveLength(defaultProps.movies.length);
  });

  test("renders the movie carousel with the correct movies", () => {
    renderMovieCarousel();
    defaultProps.movies.forEach((movie) => {
      const movieCard = screen.getByText(movie.title);
      expect(movieCard).toBeInTheDocument();
    });
  });
});

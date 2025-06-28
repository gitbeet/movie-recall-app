import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import CastCarousel, { type CastCarouselProps } from "./cast-carousel";

const defaultProps: CastCarouselProps = {
  cast: [
    {
      id: 1,
      name: "Mock Cast Member 1",
      character: "Mock Character 1",
      profileUrl: "https://via.placeholder.com/1",
    },
    {
      id: 2,
      name: "Mock Cast Member 2",
      character: "Mock Character 2",
      profileUrl: "https://via.placeholder.com/2",
    },
    {
      id: 3,
      name: "Mock Cast Member 3",
      character: "Mock Character 3",
      profileUrl: "https://via.placeholder.com/3",
    },
  ],
};

const renderCastCarousel = (props?: Partial<CastCarouselProps>) => {
  render(
    <CastCarousel
      {...defaultProps}
      {...props}
    />
  );
};

describe("cast-carousel", () => {
  test("renders the cast carousel with the correct number of cast members", () => {
    renderCastCarousel();
    const castCarousel = screen.getAllByTestId("cast-member");
    expect(castCarousel).toHaveLength(defaultProps.cast.length);
  });

  test("renders the cast carousel with the correct cast members", () => {
    renderCastCarousel();
    const castCarousel = screen.getAllByTestId("cast-member");
    expect(castCarousel).toHaveLength(defaultProps.cast.length);
    defaultProps.cast.forEach((cast, index) => {
      const castMember = castCarousel[index];
      expect(castMember).toHaveTextContent(cast.name);
    });
  });
});

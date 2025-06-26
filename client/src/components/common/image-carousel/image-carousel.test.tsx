import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import ImageCarousel from "./image-carousel";

const images = [
  "https://via.placeholder.com/1",
  "https://via.placeholder.com/2",
  "https://via.placeholder.com/3",
];

const renderImageCarousel = () => {
  render(<ImageCarousel images={images} />);
};

describe("image-carousel", () => {
  test("renders the correct number of images", () => {
    renderImageCarousel();
    const movieImages = screen.getAllByRole("img", {
      name: /carousel image/i,
    });
    expect(movieImages).toHaveLength(images.length);
  });

  test("images have the correct src", () => {
    renderImageCarousel();
    const movieImages = screen.getAllByRole("img", {
      name: /carousel image/i,
    });
    movieImages.forEach((image, index) => {
      expect(image).toHaveAttribute("src", images[index]);
    });
  });

  test("images have the correct alt", () => {
    renderImageCarousel();
    const movieImages = screen.getAllByRole("img", {
      name: /carousel image/i,
    });
    movieImages.forEach((image, index) => {
      expect(image).toHaveAttribute("alt", `Carousel image ${index + 1}`);
    });
  });

  test("clicking on an image opens the image modal", async () => {
    renderImageCarousel();
    const movieImages = screen.getAllByTestId("movie-image");
    movieImages[0].click();
    const modalImage = await screen.findByRole("img", {
      name: "Enlarged view",
    });
    expect(modalImage).toBeInTheDocument();
  });
});

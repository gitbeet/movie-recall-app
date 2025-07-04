import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import ImageCarousel from "./image-carousel";
import userEvent from "@testing-library/user-event";

const images = [
  "https://via.placeholder.com/1",
  "https://via.placeholder.com/2",
  "https://via.placeholder.com/3",
];

const renderImageCarousel = () => {
  render(<ImageCarousel images={images} />);
  return {
    user: userEvent.setup(),
  };
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

  test("navigates to the next image in the modal", async () => {
    const { user } = renderImageCarousel();
    const movieImages = screen.getAllByTestId("movie-image");
    await user.click(movieImages[0]);

    const modalImage = await screen.findByRole("img", {
      name: "Enlarged view",
    });
    expect(modalImage).toHaveAttribute("src", images[0]);

    const nextButton = screen.getByRole("button", { name: "Next image" });
    await user.click(nextButton);
    expect(modalImage).toHaveAttribute("src", images[1]);
  });

  test("navigates to the previous image in the modal", async () => {
    const { user } = renderImageCarousel();
    const movieImages = screen.getAllByTestId("movie-image");
    await user.click(movieImages[1]);

    const modalImage = await screen.findByRole("img", {
      name: "Enlarged view",
    });
    expect(modalImage).toHaveAttribute("src", images[1]);

    const prevButton = screen.getByRole("button", { name: "Previous image" });
    await user.click(prevButton);
    expect(modalImage).toHaveAttribute("src", images[0]);
  });

  test("wraps around when navigating past the last image", async () => {
    const { user } = renderImageCarousel();
    const movieImages = screen.getAllByTestId("movie-image");
    await user.click(movieImages[images.length - 1]);

    const modalImage = await screen.findByRole("img", {
      name: "Enlarged view",
    });
    expect(modalImage).toHaveAttribute("src", images[images.length - 1]);

    const nextButton = screen.getByRole("button", { name: "Next image" });
    await user.click(nextButton);
    expect(modalImage).toHaveAttribute("src", images[0]);
  });

  test("wraps around when navigating before the first image", async () => {
    const { user } = renderImageCarousel();
    const movieImages = screen.getAllByTestId("movie-image");
    await user.click(movieImages[0]);

    const modalImage = await screen.findByRole("img", {
      name: "Enlarged view",
    });
    expect(modalImage).toHaveAttribute("src", images[0]);

    const prevButton = screen.getByRole("button", { name: "Previous image" });
    await user.click(prevButton);
    expect(modalImage).toHaveAttribute("src", images[images.length - 1]);
  });
});

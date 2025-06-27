import { describe, expect, test, vi } from "vitest";
import ImageModal, { type ImageModalProps } from "./image-modal";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const renderImageModal = (props?: Partial<ImageModalProps>) => {
  const defaultProps: ImageModalProps = {
    imageUrl: "https://via.placeholder.com/1",
    onClose: () => {},
    onNext: () => {},
    onPrev: () => {},
  };

  render(
    <ImageModal
      {...defaultProps}
      {...props}
    />
  );
};

describe("image-modal", () => {
  test("renders the image and has the correct src", () => {
    renderImageModal();
    const image = screen.getByRole("img", { name: /enlarged view/i });
    expect(image).toBeInTheDocument();
  });

  test("the image has the correct  alt text", () => {
    renderImageModal();
    const image = screen.getByRole("img", { name: /enlarged view/i });
    expect(image).toHaveAttribute("alt", "Enlarged view");
  });

  test("renders the close button", () => {
    renderImageModal();
    const closeButton = screen.getByRole("button", {
      name: /close image view/i,
    });
    expect(closeButton).toBeInTheDocument();
  });

  test("the onClose function is called when the close button is clicked", async () => {
    const onClose = vi.fn();
    renderImageModal({ onClose });
    const closeButton = screen.getByRole("button", {
      name: /close image view/i,
    });
    await userEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("the onClose function is called when the escape key is pressed", async () => {
    const onClose = vi.fn();
    renderImageModal({ onClose });
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("renders the previous button", () => {
    renderImageModal();
    const previousButton = screen.getByRole("button", {
      name: /previous image/i,
    });
    expect(previousButton).toBeInTheDocument();
  });

  test("the onPrev function is called when the previous button is clicked", async () => {
    const onPrev = vi.fn();
    renderImageModal({ onPrev });
    const previousButton = screen.getByRole("button", {
      name: /previous image/i,
    });
    await userEvent.click(previousButton);
    expect(onPrev).toHaveBeenCalled();
    expect(onPrev).toHaveBeenCalledTimes(1);
  });

  test("renders the next button", () => {
    renderImageModal();
    const nextButton = screen.getByRole("button", { name: /next image/i });
    expect(nextButton).toBeInTheDocument();
  });

  test("the onNext function is called when the next button is clicked", async () => {
    const onNext = vi.fn();
    renderImageModal({ onNext });
    const nextButton = screen.getByRole("button", { name: /next image/i });
    await userEvent.click(nextButton);
    expect(onNext).toHaveBeenCalled();
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});

import { describe, expect, test, vi } from "vitest";
import TrailerModal, { type TrailerModalProps } from "./trailer-modal";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const defaultProps: TrailerModalProps = {
  trailerUrl: "https://www.youtube.com/watch?v=movie-trailer",
  onClose: () => {},
};

const renderTrailerModal = (props?: Partial<TrailerModalProps>) => {
  render(
    <TrailerModal
      {...defaultProps}
      {...props}
    />
  );
};

describe("trailer-modal", () => {
  test("renders the trailer iframe", () => {
    renderTrailerModal();
    const trailerModal = screen.getByTitle(/movie trailer/i);
    expect(trailerModal).toBeInTheDocument();
  });

  test("the trailer iframe has the correct url", () => {
    renderTrailerModal();
    const trailerModal = screen.getByTitle(/movie trailer/i);
    expect(trailerModal).toHaveAttribute("src", defaultProps.trailerUrl);
  });

  test("the onClose function is called when escape key is pressed", async () => {
    const onClose = vi.fn();
    renderTrailerModal({ onClose });
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("the onClose function is called when clicking outside the trailer iframe", async () => {
    const onClose = vi.fn();
    renderTrailerModal({ onClose });
    const modal = screen.getByRole("dialog");
    await userEvent.click(modal);
    expect(onClose).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("the onClose function is not called when clicking on the trailer content", async () => {
    const onClose = vi.fn();
    renderTrailerModal({ onClose });
    const modalContent = screen.getByTestId("trailer-modal-content");
    await userEvent.click(modalContent);
    expect(onClose).not.toHaveBeenCalled();
  });
});

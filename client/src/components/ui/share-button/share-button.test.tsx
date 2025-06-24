import { describe, test, expect } from "vitest";
import { ShareButton } from "./share-button";
import { render, screen } from "@/test-utils";
import userEvent from "@testing-library/user-event";

describe("share-button", () => {
  test("renders the share button", () => {
    render(<ShareButton />);
    const shareButton = screen.getByRole("button", { name: /share/i });
    expect(shareButton).toBeInTheDocument();
  });

  test("renders the share dropdown when the share button is clicked", async () => {
    render(<ShareButton />);
    const shareButton = screen.getByRole("button", { name: /share/i });
    await userEvent.click(shareButton);
    const shareDropdown = screen.getByRole("dialog", {
      name: /share options/i,
    });
    expect(shareDropdown).toBeInTheDocument();
  });

  test("closes the share dropdown when the share button is clicked again after it is opened", async () => {
    render(<ShareButton />);
    const shareButton = screen.getByRole("button", { name: /share/i });
    await userEvent.click(shareButton);
    const shareDropdown = screen.getByRole("dialog", {
      name: /share options/i,
    });
    await userEvent.click(shareButton);
    expect(shareDropdown).not.toBeInTheDocument();
  });

  test("closes the share dropdown when clicking outside of it", async () => {
    render(
      <div>
        <ShareButton />
        <div data-testid="outside-click-target"></div>
      </div>
    );
    const shareButton = screen.getByRole("button", { name: /share/i });
    await userEvent.click(shareButton);
    const shareDropdown = screen.getByRole("dialog", {
      name: /share options/i,
    });
    const outsideClickTarget = screen.getByTestId("outside-click-target");
    await userEvent.click(outsideClickTarget);
    expect(shareDropdown).not.toBeInTheDocument();
  });
});

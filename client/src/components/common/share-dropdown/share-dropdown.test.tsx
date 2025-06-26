import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@/test-utils"; // Using screen is key
import { Popover, PopoverContent } from "../../ui/popover";
import { ShareDropdown } from "./share-dropdown";
import userEvent from "@testing-library/user-event";

const renderShareDropdown = () => {
  render(
    <Popover open>
      <PopoverContent>
        <ShareDropdown
          url="mock-url"
          title="mock-title"
        />
      </PopoverContent>
    </Popover>
  );
};

describe("share-dropdown", () => {
  test("displays facebook share link and the link has the correct href", async () => {
    renderShareDropdown();

    const facebookLink = await screen.findByRole("link", { name: /facebook/i });

    expect(facebookLink).toBeInTheDocument();
    expect(facebookLink).toHaveAttribute(
      "href",
      "https://www.facebook.com/sharer/sharer.php?u=mock-url"
    );
  });

  test("displays x share link and the link has the correct href", async () => {
    renderShareDropdown();

    const xLink = await screen.findByRole("link", { name: /x/i });

    expect(xLink).toBeInTheDocument();
    expect(xLink).toHaveAttribute(
      "href",
      "https://twitter.com/intent/tweet?url=mock-url&text=mock-title"
    );
  });

  test("displays linkedin share link and the link has the correct href", async () => {
    renderShareDropdown();

    const linkedinLink = await screen.findByRole("link", { name: /linkedin/i });

    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/sharing/share-offsite/?url=mock-url"
    );
  });

  test("displays email share link and the link has the correct href", async () => {
    renderShareDropdown();

    const emailLink = await screen.findByRole("link", { name: /email/i });

    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute(
      "href",
      "mailto:?subject=mock-title&body=mock-url"
    );
  });

  test("displays copy link and the link has the correct href", async () => {
    renderShareDropdown();

    const copyLink = await screen.findByRole("button", { name: /copy/i });

    expect(copyLink).toBeInTheDocument();
    expect(copyLink).toHaveTextContent(/copy/i);
  });

  test("pressing copy link copies the url to the clipboard", async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    renderShareDropdown();

    const copyButton = await screen.findByRole("button", {
      name: /copy link/i,
    });

    await userEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("mock-url");
  });
});

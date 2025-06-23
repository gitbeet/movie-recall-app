import { render, screen, waitFor } from "@/test-utils";
import { describe, expect, test } from "vitest";
import MobileMenu from "./mobile-menu";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import {
  mockUseFavoritesLoggedIn,
  mockUseFavoritesLoggedOut,
} from "@/pages/favorites-page/favortes-page.test";

const renderMobileMenu = () => {
  render(
    <MemoryRouter>
      <MobileMenu />
    </MemoryRouter>
  );
};

describe("mobile-menu", () => {
  test("renders the menu button", () => {
    renderMobileMenu();
    const menuButton = screen.getByLabelText("Open menu");
    expect(menuButton).toBeInTheDocument();
  });

  test("opens the menu when the open menu button is clicked", async () => {
    renderMobileMenu();
    const menuButton = screen.getByLabelText("Open menu");
    await userEvent.click(menuButton);

    const mobileMenu = screen.getByTestId("mobile-menu");
    expect(mobileMenu).toBeInTheDocument();
  });

  test("closes the menu when the close menu button is clicked", async () => {
    renderMobileMenu();
    const menuButton = screen.getByLabelText("Open menu");
    await userEvent.click(menuButton);

    const closeButton = screen.getByLabelText("Close menu");
    await userEvent.click(closeButton);

    // Wait for the menu to close with animation
    await waitFor(
      () => {
        const mobileMenu = screen.queryByTestId("mobile-menu");
        expect(mobileMenu).not.toBeInTheDocument();
      },
      // animation duration is 350ms
      { timeout: 400 }
    );
  });

  test("renders the backdrop when the menu is open", async () => {
    renderMobileMenu();
    const menuButton = screen.getByLabelText("Open menu");
    await userEvent.click(menuButton);

    const backdrop = screen.getByTestId("mobile-menu-backdrop");
    expect(backdrop).toBeInTheDocument();
  });

  test("closes the menu when the backdrop is clicked", async () => {
    renderMobileMenu();
    const menuButton = screen.getByLabelText("Open menu");
    await userEvent.click(menuButton);

    const backdrop = screen.getByTestId("mobile-menu-backdrop");
    await userEvent.click(backdrop);

    // Wait for the menu to close with animation
    await waitFor(
      () => {
        const mobileMenu = screen.queryByTestId("mobile-menu");
        expect(mobileMenu).not.toBeInTheDocument();
      },
      // animation duration is 350ms
      { timeout: 400 }
    );
  });

  test("renders the toggle theme button", async () => {
    renderMobileMenu();

    const menuButton = screen.getByLabelText("Open menu");
    await userEvent.click(menuButton);

    const toggleThemeButton = screen.getByLabelText("Toggle dark mode");
    expect(toggleThemeButton).toBeInTheDocument();
  });

  test("renders the sign in button when the user is not logged in", async () => {
    mockUseFavoritesLoggedOut();
    renderMobileMenu();
    const menuButton = screen.getByLabelText("Open menu");
    await userEvent.click(menuButton);

    const signInButton = screen.getByRole("button", { name: /sign in/i });
    expect(signInButton).toBeInTheDocument();
  });

  test("renders the sign out button when the user is logged in", async () => {
    mockUseFavoritesLoggedIn();
    renderMobileMenu();
    const menuButton = screen.getByLabelText("Open menu");
    await userEvent.click(menuButton);

    const signOutButton = screen.getByRole("button", { name: /sign out/i });
    expect(signOutButton).toBeInTheDocument();
  });
});

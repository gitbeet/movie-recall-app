import { describe, test, expect, beforeEach } from "vitest";
import { Nav } from "./nav";
import { render, screen } from "@/test-utils";
import { MemoryRouter } from "react-router-dom";
import {
  mockUseFavoritesLoggedIn,
  mockUseFavoritesLoggedOut,
} from "@/pages/favorites-page/favortes-page.test";

const renderNav = () => {
  render(
    <MemoryRouter>
      <Nav />
    </MemoryRouter>
  );
};

describe.only("nav", () => {
  beforeEach(() => {
    mockUseFavoritesLoggedOut();
  });

  test("renders the logo and has a link to the home page", () => {
    renderNav();
    const logo = screen.getByLabelText("Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("href", "/");
  });

  test("renders the watchlist button and has a link to the watchlist page", () => {
    renderNav();
    const watchlistButton = screen.getByLabelText("Go to watchlist");
    expect(watchlistButton).toBeInTheDocument();
    expect(watchlistButton).toHaveAttribute("href", "/favorites");
  });

  test("renders the sign in button", () => {
    renderNav();
    const signInButton = screen.getByLabelText("Sign in");
    expect(signInButton).toBeInTheDocument();
  });

  test("renders the sign out button", () => {
    mockUseFavoritesLoggedIn();
    renderNav();
    const signOutButton = screen.getByLabelText("Sign out");
    expect(signOutButton).toBeInTheDocument();
  });

  test("renders the mode toggle button", () => {
    renderNav();
    const modeToggleButton = screen.getByLabelText("Toggle dark mode");
    expect(modeToggleButton).toBeInTheDocument();
  });
});

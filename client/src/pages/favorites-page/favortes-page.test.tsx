import { MemoryRouter } from "react-router-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";
import FavoritesPage from "./favorites-page";
import { render, screen } from "../../test-utils";
import * as FavoritesContext from "@/context/favorites-context";
import { type FavoritesContextType } from "@/context/favorites-context";

const renderFavoritesPage = () => {
  render(
    <MemoryRouter>
      <FavoritesPage />
    </MemoryRouter>
  );
};

export const mockUseFavoritesLoggedOut = () => {
  vi.spyOn(FavoritesContext, "useFavorites").mockReturnValue({
    user: null,
    favorites: [],
    addToFavorites: vi.fn(),
    removeFromFavorites: vi.fn(),
    isInFavorites: vi.fn(),
    loading: false,
    fetchFavorites: vi.fn(),
    refetchUser: vi.fn(),
  });
};

export const mockUseFavoritesLoggedIn = () => {
  vi.spyOn(FavoritesContext, "useFavorites").mockReturnValue({
    user: { id: 1, email: "test@example.com" },
    favorites: [
      { id: 1, movieId: 1, title: "Favorite Movie 1", posterUrl: "test.jpg" },
      { id: 2, movieId: 2, title: "Favorite Movie 2", posterUrl: "test.jpg" },
    ],
    addToFavorites: vi.fn(),
    removeFromFavorites: vi.fn(),
    isInFavorites: vi.fn(),
    loading: false,
    fetchFavorites: vi.fn(),
    refetchUser: vi.fn(),
  });
};

describe("favorites-page", () => {
  describe("when user is not logged in", () => {
    beforeEach(() => {
      mockUseFavoritesLoggedOut();
    });

    test("shows go back button", () => {
      renderFavoritesPage();
      const goBackButton = screen.getByRole("button", { name: /go back/i });
      expect(goBackButton).toBeInTheDocument();
    });

    test("shows login prompt", () => {
      renderFavoritesPage();
      const loginPrompt = screen.getByText(
        /please sign in to view your watchlist/i
      );
      expect(loginPrompt).toBeInTheDocument();
    });
  });

  describe("when user is logged in", () => {
    beforeEach(() => {
      mockUseFavoritesLoggedIn();
    });

    test("shows go back button", () => {
      renderFavoritesPage();
      const goBackButton = screen.getByRole("button", { name: /go back/i });
      expect(goBackButton).toBeInTheDocument();
    });

    test("shows watchlist heading", () => {
      renderFavoritesPage();
      const watchlistHeading = screen.getByRole("heading", {
        name: /my watchlist/i,
      });
      expect(watchlistHeading).toBeInTheDocument();
    });

    test("shows favorites list", () => {
      renderFavoritesPage();
      expect(screen.getByText(/favorite movie 1/i)).toBeInTheDocument();
      expect(screen.getByText(/favorite movie 2/i)).toBeInTheDocument();
    });

    test("calls removeFromFavorites when clicking Remove from Watchlist", () => {
      const removeFromFavoritesMock = vi.fn();
      const mockFavoritesContext: FavoritesContextType = {
        user: { id: 1, email: "test@example.com" },
        favorites: [
          {
            id: 1,
            movieId: 1,
            title: "Favorite Movie 1",
            posterUrl: "test.jpg",
          },
        ],
        addToFavorites: vi.fn(),
        removeFromFavorites: removeFromFavoritesMock,
        isInFavorites: vi.fn(),
        loading: false,
        fetchFavorites: vi.fn(),
        refetchUser: vi.fn(),
      };
      vi.spyOn(FavoritesContext, "useFavorites").mockImplementation(
        () => mockFavoritesContext
      );
      renderFavoritesPage();
      // since theres only one movie in the list, the only remove button should be the one for the first movie
      const removeButton = screen.getByRole("button", {
        name: /remove from watchlist/i,
      });
      expect(removeButton).toBeInTheDocument();
      removeButton.click();
      expect(removeFromFavoritesMock).toHaveBeenCalledWith(1);
    });
  });
});

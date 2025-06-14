import React, { createContext, useContext, useEffect, useState } from "react";

interface Movie {
  id: number;
  title: string;
  posterUrl?: string;
  [key: string]: any;
}

interface FavoritesContextType {
  favorites: Movie[];
  addFavorite: (movie: Movie) => Promise<void>;
  removeFavorite: (movieId: number) => Promise<void>;
  isFavorite: (movieId: number) => boolean;
  loading: boolean;
  userId: string | null;
  setUserId: (id: string) => void;
  fetchFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [userId, setUserIdState] = useState<string | null>(() => {
    return localStorage.getItem("userId") || null;
  });
  const [loadingCount, setLoadingCount] = useState(0);
  const loading = loadingCount > 0;

  // Persist userId to localStorage
  const setUserId = (id: string) => {
    setUserIdState(id);
    if (!id) {
      setFavorites([]); // Clear favorites on logout
      localStorage.removeItem("userId");
    } else {
      localStorage.setItem("userId", id);
    }
  };

  // Optional: sign out function (not used yet)
  // const signOut = () => {
  //   setUserIdState(null);
  //   localStorage.removeItem("userId");
  //   setFavorites([]);
  // };
  // Now handled in setUserId above.

  // Fetch favorites from backend
  const fetchFavorites = async () => {
    if (!userId) return;
    setLoadingCount((c) => c + 1);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/${userId}/favorites`
      );
      const data = await res.json();
      setFavorites(data.favorites || []);
    } finally {
      setLoadingCount((c) => Math.max(0, c - 1));
    }
  };

  // Add a movie to favorites
  const addFavorite = async (movie: Movie) => {
    if (!userId) return;
    setLoadingCount((c) => c + 1);
    try {
      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/${userId}/favorites`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(movie),
        }
      );
      await fetchFavorites();
    } finally {
      setLoadingCount((c) => Math.max(0, c - 1));
    }
  };

  // Remove a movie from favorites
  const removeFavorite = async (movieId: number) => {
    if (!userId) return;
    setLoadingCount((c) => c + 1);
    try {
      await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/user/${userId}/favorites/${movieId}`,
        {
          method: "DELETE",
        }
      );
      await fetchFavorites();
    } finally {
      setLoadingCount((c) => Math.max(0, c - 1));
    }
  };

  // Check if a movie is in favorites
  const isFavorite = (movieId: number) =>
    favorites.some((m) => m.id === movieId);

  useEffect(() => {
    if (userId) fetchFavorites();
    // eslint-disable-next-line
  }, [userId]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        loading,
        userId,
        setUserId,
        fetchFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites must be used within a FavoritesProvider");
  return ctx;
};

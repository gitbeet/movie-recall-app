import React, { createContext, useContext, useEffect, useState } from "react";

interface Movie {
  id: number;
  title: string;
  posterUrl?: string;
  [key: string]: any;
}

interface FavoritesContextType {
  favorites: Movie[];
  addToFavorites: (movie: Movie) => Promise<void>;
  removeFromFavorites: (movieId: number) => Promise<void>;
  isInFavorites: (movieId: number) => boolean;
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
  const [loading, setLoading] = useState(false);

  const setUserId = (id: string) => {
    setUserIdState(id);
    if (!id) {
      setFavorites([]); // Clear favorites on logout
      localStorage.removeItem("userId");
    } else {
      localStorage.setItem("userId", id);
    }
  };

  // Fetch favorites from backend
  const fetchFavorites = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/${userId}/favorites`
      );
      const data = await res.json();
      setFavorites(data.favorites || []);
    } finally {
      setLoading(false);
    }
  };

  // Add a movie to favorites
  const addToFavorites = async (movie: Movie) => {
    if (!userId) return;
    setLoading(true);
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
      setLoading(false);
    }
  };

  // Remove a movie from favorites
  const removeFromFavorites = async (movieId: number) => {
    if (!userId) return;
    setLoading(true);
    try {
      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/${userId}/favorites/${movieId}`,
        {
          method: "DELETE",
        }
      );
      await fetchFavorites();
    } finally {
      setLoading(false);
    }
  };

  // Check if a movie is in favorites
  const isInFavorites = (movieId: number) =>
    favorites.findIndex((m: Movie) => String(m.movieId) === String(movieId)) !==
    -1;

  useEffect(() => {
    if (userId) fetchFavorites();
    // eslint-disable-next-line
  }, [userId]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isInFavorites,
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

import React, { createContext, useContext, useEffect, useState } from "react";

interface Movie {
  id: number;
  title: string;
  posterUrl?: string;
  movieId: number;
  releaseYear?: string;
  rating?: number;
  description?: string;
}

interface User {
  id: number;
  email: string;
}

export interface FavoritesContextType {
  favorites: Movie[];
  addToFavorites: (movie: Movie) => Promise<void>;
  removeFromFavorites: (movieId: number) => Promise<void>;
  isInFavorites: (movieId: number) => boolean;
  loading: boolean;
  user: User | null;
  fetchFavorites: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch current user from session
  const refetchUser = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/me`,
        {
          credentials: "include",
        }
      );
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
        setFavorites([]);
      }
    } catch {
      setUser(null);
      setFavorites([]);
    }
  };

  // Fetch favorites from backend
  const fetchFavorites = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/${user.id}/favorites`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      setFavorites(data.favorites || []);
    } finally {
      setLoading(false);
    }
  };

  // Add a movie to favorites
  const addToFavorites = async (movie: Movie) => {
    if (!user) return;
    setLoading(true);
    try {
      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/${user.id}/favorites`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
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
    if (!user) return;
    setLoading(true);
    try {
      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/${
          user.id
        }/favorites/${movieId}`,
        {
          method: "DELETE",
          credentials: "include",
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
    refetchUser();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (user) fetchFavorites();
    // eslint-disable-next-line
  }, [user]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isInFavorites,
        loading,
        user,
        fetchFavorites,
        refetchUser,
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

import { createContext, useState, useContext, type ReactNode } from "react";
import { useEffect } from "react";

interface MovieResult {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  releaseYear: string;
}

interface SearchContextType {
  input: string;
  setInput: (input: string) => void;
  movieResults: MovieResult[];
  isLoading: boolean;
  error: string | null;
  setError: (err: string | null) => void;
  handleSearch: (searchInput: string) => Promise<void>;
  clearResults: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [input, setInput] = useState("");
  const [movieResults, setMovieResults] = useState<MovieResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const clearResults = () => {
    setMovieResults([]);
  };

  const handleSearch = async (searchInput: string) => {
    if (!searchInput.trim()) return;

    setIsLoading(true);
    setError(null);
    // We don't clear results here, so they persist on failed searches

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/movie/find`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: searchInput }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "An unknown error occurred" }));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const results: MovieResult[] = await response.json();
      setMovieResults(results);
    } catch (err: any) {
      console.error("Failed to find movie:", err);
      setError(err.message || "Sorry, I had trouble finding that movie.");
      setMovieResults([]); // Clear results on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        input,
        setInput,
        movieResults,
        isLoading,
        error,
        setError,
        handleSearch,
        clearResults,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

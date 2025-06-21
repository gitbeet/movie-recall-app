import { useFavorites } from "@/context/FavoritesContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bookmark, ArrowLeft } from "lucide-react";
import MovieCard from "@/components/common/MovieCard";

export default function FavoritesPage() {
  const { favorites, removeFromFavorites, loading, user } = useFavorites();
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10 space-y-16">
      <Button
        variant="secondary"
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2" />
        Go back
      </Button>
      {!user ? (
        <div className="max-w-xl mx-auto mt-16 text-center text-lg">
          Please sign in to view your watchlist.
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-12 text-center">My Watchlist</h1>
          {favorites.length === 0 ? (
            <div className="text-muted-foreground text-lg text-center">
              Your watchlist is empty.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
              {favorites.map((movie) => (
                <div
                  key={movie.id}
                  className="flex flex-col items-stretch"
                >
                  <MovieCard
                    id={movie.movieId}
                    title={movie.title || ""}
                    description={movie.description || ""}
                    posterUrl={movie.posterUrl || ""}
                    releaseYear={movie.releaseYear}
                    rating={movie.rating}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-2"
                    disabled={loading}
                    onClick={() => {
                      removeFromFavorites(movie.movieId);
                      console.log("Removed favorite:", movie.movieId);
                    }}
                  >
                    <Bookmark fill="currentColor" />
                    Remove from Watchlist
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

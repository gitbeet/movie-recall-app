import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSearch } from "@/context/SearchContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ImageCarousel from "@/components/ui/ImageCarousel";
import { PlayCircle, Bookmark, ArrowLeft, ExternalLink } from "lucide-react";
import TrailerModal from "@/components/modals/TrailerModal";
import MovieCarousel from "@/components/ui/MovieCarousel";
import CastCarousel from "@/components/ui/CastCarousel";
import { useFavorites } from "@/context/FavoritesContext";

interface CastMember {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
  imdbUrl?: string | null;
  tmdbUrl?: string;
}

interface CrewMember {
  id: number;
  name: string;
  job: string;
  imdbUrl?: string | null;
}

interface MovieDetails {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  releaseYear: string;
  genres: string[];
  rating: number;
  backdropUrl: string;
  images: {
    backdrops: string[];
    posters: string[];
  };
  trailerUrl: string;
  cast?: CastMember[];
  crew?: CrewMember[];
  imdbUrl?: string | null;
}

const MovieDetailsPage = () => {
  const navigate = useNavigate();
  const { movieResults } = useSearch();
  const [fallbackSimilar, setFallbackSimilar] = useState<MovieDetails[]>([]);
  const { id } = useParams<{ id: string }>();

  // Scroll to top when navigating to a different movie
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // Favorites context
  const { userId, addFavorite, removeFavorite, isFavorite, loading } =
    useFavorites();
  const isCurrentFavorite = movie ? isFavorite(movie.id) : false;

  // Use context results (excluding current movie), fallback to TMDB similar
  // MovieResult (from context) and MovieDetails (from fallback) are structurally compatible for MovieCard
  type MovieSummary = {
    id: number;
    title: string;
    description: string;
    posterUrl: string;
    releaseYear?: string;
    rating?: number;
  };
  const similarMovies: MovieSummary[] =
    movieResults && movieResults.length > 0
      ? movieResults.filter((m) => m.id !== Number(id))
      : fallbackSimilar;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setMovie(null); // Clear previous movie data to prevent stale crew/cast
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/movie/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch movie details.");
        }
        const data = await response.json();
        setMovie(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Fallback: fetch similar movies from TMDB if context is empty
    const fetchSimilarMovies = async () => {
      if ((!movieResults || movieResults.length === 0) && id) {
        try {
          const resp = await fetch(
            `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${
              import.meta.env.VITE_TMDB_API_KEY
            }`
          );
          if (resp.ok) {
            const data = await resp.json();
            setFallbackSimilar(
              data.results.map((m: any) => ({
                id: m.id,
                title: m.title,
                description: m.overview,
                posterUrl: m.poster_path
                  ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                  : "",
                releaseYear: m.release_date
                  ? m.release_date.split("-")[0]
                  : "N/A",
                rating: m.vote_average,
              }))
            );
          }
        } catch (e) {
          // ignore
          console.log(e);
        }
      }
    };

    if (id) {
      fetchMovieDetails();
      fetchSimilarMovies();
    }
  }, [id]);

  if (isLoading)
    return (
      <div className="w-full animate-pulse">
        {/* Backdrop skeleton */}
        <div className="w-full h-[30vh] md:h-[50vh] bg-muted/30" />
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 -mt-40 md:-mt-64 relative z-10 space-y-16">
          {/* Back to Homepage Button Skeleton */}
          <div className="mb-4 w-48 h-10 rounded-lg bg-muted" />
          <div className="md:flex md:space-x-8 items-start">
            {/* Poster skeleton */}
            <div className="md:w-1/3 flex-shrink-0">
              <div className="w-full aspect-[2/3] bg-muted rounded-lg " />
            </div>
            {/* Details skeleton */}
            <div className="md:w-2/3 mt-6 md:mt-0 space-y-4 p-8">
              <div className="h-8 w-2/3 bg-muted rounded" /> {/* Title */}
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-muted rounded" />
                <div className="h-6 w-16 bg-muted rounded" />
              </div>
              <div className="h-6 w-24 bg-muted rounded" /> {/* Rating */}
              <div className="h-16 w-full bg-muted rounded" />{" "}
              {/* Description */}
              <div className="flex gap-2 mt-6">
                <div className="h-10 w-32 bg-muted rounded" />
                <div className="h-10 w-40 bg-muted rounded" />
              </div>
              {/* Crew skeleton */}
              <div className="mt-6">
                <div className="h-6 w-32 bg-muted rounded mb-4" />
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-4 w-16 bg-muted rounded" /> {/* Job */}
                      <div className="h-4 w-20 bg-muted rounded" /> {/* Name */}
                      {i < 3 && (
                        <div className="h-3 w-3 bg-muted rounded-full mx-2" />
                      )}{" "}
                      {/* Dot */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Cast skeleton */}
          <div>
            <div className="h-8 w-40 bg-muted rounded mb-6" />
            <div className="flex gap-6 overflow-x-auto pb-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center min-w-[100px]"
                >
                  <div className="w-20 h-20 rounded-full bg-muted mb-2" />
                  <div className="h-4 w-16 bg-muted rounded mb-1" />
                  <div className="h-3 w-20 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>
          {/* Gallery skeleton */}
          <div>
            <div className="h-8 w-32 bg-muted rounded mb-6" />
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-48 h-28 bg-muted rounded" />
              ))}
            </div>
          </div>
          {/* Similar Movies skeleton */}
          <div>
            <div className="h-8 w-56 bg-muted rounded mb-6" />
            <div className="flex gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-56 h-80 bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  if (error)
    return <p className="text-center text-destructive mt-12">Error: {error}</p>;
  if (!movie) return <p className="text-center mt-12">Movie not found.</p>;

  return (
    <div className="w-full">
      <div
        className="w-full h-[40dvh] bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${movie.backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-white/40 dark:bg-black/60 backdrop-blur-sm"></div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 -mt-56 relative z-10 space-y-16">
        {/* Back to Homepage Button */}
        <Button
          variant="secondary"
          size="lg"
          className="mb-4 font-semibold flex items-center gap-2 shadow hover:shadow-lg"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-5 h-5" /> Back to Homepage
        </Button>
        <div className="md:flex md:space-x-8 items-start">
          <div className="md:w-1/3 flex-shrink-0">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full rounded-lg shadow-2xl"
            />
          </div>
          <div className="md:w-2/3 mt-6 md:mt-0 bg-card text-card-foreground p-8 rounded-lg shadow-xl">
            <div className="flex justify-between items-center gap-5">
              <h1 className="text-3xl md:text-4xl font-bold">{movie.title}</h1>
              {movie.imdbUrl && (
                <a
                  href={movie.imdbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-yellow-400 text-black rounded hover:bg-yellow-500 transition-colors gap-1"
                  title="View on IMDb"
                >
                  <ExternalLink className="w-4 h-4 mr-1" /> IMDb
                </a>
              )}
            </div>
            <div className="text-muted-foreground text-base md:text-lg mt-3 font-normal">
              {movie.releaseYear}
            </div>
            {movie.crew && movie.crew.length > 0 && (
              <div className="text-muted-foreground text-sm mb-3 flex flex-wrap gap-x-4 gap-y-1 mt-2">
                {movie.crew!.map((member, idx) => (
                  <span key={member.id} className="flex items-center">
                    <span className="font-medium">{member.job}:</span>&nbsp;
                    {member.imdbUrl ? (
                      <a
                        href={member.imdbUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-primary transition-colors"
                        title={`View ${member.name} on IMDb`}
                      >
                        {member.name}
                      </a>
                    ) : (
                      member.name
                    )}
                    {idx < movie.crew!.length - 1 && (
                      <span className="mx-2">&middot;</span>
                    )}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2 my-4">
              {movie.genres.map((genre) => (
                <Badge key={genre} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 my-4">
              <span className="text-xl font-bold text-primary">
                ★ {movie.rating.toFixed(1)}
              </span>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground">
              {movie.description}
            </p>

            {movie.trailerUrl && (
              <div className="mt-6 flex items-center gap-1.5">
                <Button size="lg" onClick={() => setIsTrailerOpen(true)}>
                  <PlayCircle />
                  <span>Watch Trailer</span>
                </Button>
                <Button
                  size="lg"
                  variant={"outline"}
                  disabled={!userId || loading}
                  onClick={async () => {
                    if (!userId) return;
                    if (isCurrentFavorite) {
                      await removeFavorite(movie.id);
                    } else {
                      await addFavorite({
                        id: movie.id,
                        title: movie.title,
                        posterUrl: movie.posterUrl,
                        description: movie.description,
                        releaseYear: movie.releaseYear,
                      });
                    }
                  }}
                >
                  <Bookmark
                    fill={isCurrentFavorite ? "currentColor" : "none"}
                  />
                  <span>
                    {isCurrentFavorite
                      ? "Remove from Watchlist"
                      : "Add to Watchlist"}
                  </span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Cast Section */}
        {movie.cast && movie.cast.length > 0 && (
          <div className="my-12">
            <h2 className="text-3xl font-bold mb-6 text-foreground">Cast</h2>
            <CastCarousel cast={movie.cast} />
          </div>
        )}

        <div>
          <h2 className="text-3xl font-bold mb-6 text-foreground">Gallery</h2>
          <ImageCarousel images={movie.images.backdrops} />
        </div>
        {/* Similar Movies Section */}
        {similarMovies.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Similar Movies
            </h2>
            <MovieCarousel
              movies={similarMovies}
              onMovieClick={(movie) => {
                navigate(`/movie/${movie.id}`);
                window.scrollTo({ top: 0, behavior: "instant" });
              }}
            />
          </div>
        )}
      </div>

      {isTrailerOpen && movie.trailerUrl && (
        <TrailerModal
          trailerUrl={movie.trailerUrl}
          onClose={() => setIsTrailerOpen(false)}
        />
      )}
    </div>
  );
};

export default MovieDetailsPage;

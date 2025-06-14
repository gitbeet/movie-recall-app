import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ImageCarousel from '@/components/ui/ImageCarousel';
import { PlayCircle, Bookmark } from 'lucide-react';
import TrailerModal from '@/components/modals/TrailerModal';

interface CastMember {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
  imdbUrl?: string | null;
  tmdbUrl?: string;
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
  imdbUrl?: string | null;
}

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/movie/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch movie details.');
        }
        const data = await response.json();
        setMovie(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  if (isLoading) return <p className="text-center mt-12">Loading movie details...</p>;
  if (error) return <p className="text-center text-destructive mt-12">Error: {error}</p>;
  if (!movie) return <p className="text-center mt-12">Movie not found.</p>;

  return (
    <div className="w-full">
      <div
        className="w-full h-[30vh] md:h-[50vh] bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${movie.backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 -mt-40 md:-mt-64 relative z-10">
        <div className="md:flex md:space-x-8 items-start">
          <div className="md:w-1/3 flex-shrink-0">
            <img src={movie.posterUrl} alt={movie.title} className="w-full rounded-lg shadow-2xl" />
          </div>
          <div className="md:w-2/3 mt-6 md:mt-0 bg-card text-card-foreground p-8 rounded-lg shadow-xl">
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
  {movie.title} ({movie.releaseYear})
  {movie.imdbUrl && (
    <a
      href={movie.imdbUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-yellow-400 text-black rounded hover:bg-yellow-500 transition-colors"
      title="View on IMDb"
    >
      IMDb
    </a>
  )}
</h1>
            <div className="flex flex-wrap gap-2 my-4">
              {movie.genres.map(genre => <Badge key={genre} variant="secondary">{genre}</Badge>)}
            </div>
            <div className="flex items-center gap-4 my-4">
              <span className="text-xl font-bold text-primary">★ {movie.rating.toFixed(1)}</span>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground">{movie.description}</p>

            {movie.trailerUrl && (
              <div className="mt-6 flex items-center gap-1.5">
                <Button size="lg"
  onClick={() => setIsTrailerOpen(true)}
>
  <PlayCircle />
  <span>Watch Trailer</span>
</Button>
                <Button size="lg" variant="outline" disabled>
  <Bookmark />
  <span>Add to Watchlist</span>
</Button>
              </div>
            )}
          </div>
        </div>

        {/* Cast Section */}
        {movie.cast && movie.cast.length > 0 && (
          <div className="my-12">
            <h2 className="text-3xl font-bold mb-6 text-foreground">Cast</h2>
            <div className="flex gap-6 overflow-x-auto pb-2">
              {movie.cast.map((member, idx) => (
                <div key={member.name + idx} className="flex flex-col items-center min-w-[100px]">
                  {member.profileUrl ? (
  <a
    href={member.imdbUrl || member.tmdbUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="hover:scale-105 transition-transform"
  >
    <img
      src={member.profileUrl}
      alt={member.name}
      className="w-20 h-20 rounded-full object-cover shadow-md mb-2 border-2 border-transparent hover:border-primary"
    />
  </a>
) : (
  <a
    href={member.imdbUrl || member.tmdbUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="hover:scale-105 transition-transform"
  >
    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-2 text-muted-foreground text-xl border-2 border-transparent hover:border-primary">
      ?
    </div>
  </a>
)}
<a
  href={member.imdbUrl || member.tmdbUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="font-semibold text-sm text-center line-clamp-2 hover:underline"
>
  {member.name}
</a>
                  <div className="text-xs text-muted-foreground text-center line-clamp-2">{member.character}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="my-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Gallery</h2>
          <ImageCarousel images={movie.images.backdrops} />
        </div>
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

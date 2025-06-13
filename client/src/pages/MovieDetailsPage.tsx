import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';


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
}

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 -mt-24 md:-mt-48 relative z-10">
        <div className="md:flex md:space-x-8 items-start">
          <div className="md:w-1/3 flex-shrink-0">
            <img src={movie.posterUrl} alt={movie.title} className="w-full rounded-lg shadow-2xl" />
          </div>
          <div className="md:w-2/3 mt-6 md:mt-0 bg-card text-card-foreground p-8 rounded-lg shadow-xl">
            <h1 className="text-3xl md:text-4xl font-bold">{movie.title} ({movie.releaseYear})</h1>
            <div className="flex flex-wrap gap-2 my-4">
              {movie.genres.map(genre => <Badge key={genre} variant="secondary">{genre}</Badge>)}
            </div>
            <div className="flex items-center gap-4 my-4">
              <span className="text-xl font-bold text-primary">★ {movie.rating.toFixed(1)}</span>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground">{movie.description}</p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {movie.images.backdrops.slice(0, 4).map((img, index) => (
              <div key={index} className="overflow-hidden rounded-lg shadow-lg">
                <img src={img} alt={`Backdrop ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;

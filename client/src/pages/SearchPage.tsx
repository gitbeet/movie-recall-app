import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MovieCard from '@/components/MovieCard';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useSearch } from '@/context/SearchContext';

const SearchPage = () => {
  const navigate = useNavigate();
  const { input, setInput, movieResults, isLoading, error, handleSearch } = useSearch();

  const onSearchClick = () => {
    handleSearch(input);
  };

  const handleCardClick = (movie: any) => {
    navigate(`/movie/${movie.id}`, {
      state: {
        movie,
        similarMovies: movieResults.filter((m: any) => m.id !== movie.id)
      }
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <main>
          <div className="flex space-x-2 my-12 max-w-2xl mx-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearchClick()}
              placeholder="Describe a movie, and let AI do the rest..."
              disabled={isLoading}
              className="text-lg p-6"
            />
            <Button onClick={onSearchClick} disabled={isLoading} className="text-lg p-6">
              Search
            </Button>
          </div>

          <div className="results-area">
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            )}
            {error && <p className="text-center text-destructive">{error}</p>}
            {!isLoading && !error && movieResults.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {movieResults.map((movie) => (
                  <div key={movie.id} onClick={() => handleCardClick(movie)}>
                    <MovieCard {...movie} />
                  </div>
                ))}
              </div>
            )}
            {!isLoading && !error && movieResults.length === 0 && (
                 <p className="text-center text-muted-foreground">Describe a movie to see the magic happen!</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchPage;

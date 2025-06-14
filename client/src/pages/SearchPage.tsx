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
          {/* Welcome message and tagline */}
          {!isLoading && !error && movieResults.length === 0 && (
            <div className="flex flex-col items-center justify-center my-16">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-4 text-primary ">Can't Remember That Movie?</h1>
              <p className="text-lg sm:text-xl text-muted-foreground text-center mb-8 max-w-xl">Describe any scene, actor, plot detail, or anything you remember, and let AI help you rediscover the movie you're thinking of. Try prompts like <span className='italic'>"A movie where a man relives the same day"</span> or <span className='italic'>"A film with a talking dog and a flying house"</span>.</p>
              {/* Example prompt chips */}
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                {[
                  "A movie where a man relives the same day",
                  "A film with a talking dog and a flying house",
                  "A hacker discovers the world is a simulation",
                  "A group of friends goes on a treasure hunt",
                  "An animated movie about emotions inside a girl's head"
                ].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    className="rounded-full px-4 py-2 text-sm hover:bg-accent transition-colors"
                    onClick={() => {
                      setInput(example);
                      handleSearch(example);
                    }}
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-2 my-12 max-w-2xl mx-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearchClick()}
              placeholder="Search for a movie..."
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

          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchPage;

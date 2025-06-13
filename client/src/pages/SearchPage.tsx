import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSearch } from '@/context/SearchContext';

const SearchPage = () => {
  const navigate = useNavigate();
  const { input, setInput, movieResults, isLoading, error, handleSearch } = useSearch();

  const onSearchClick = () => {
    handleSearch(input);
  };

  const handleCardClick = (movie: any) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <main>
          <div className="flex space-x-2 my-12 max-w-2xl mx-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSearchClick()}
              placeholder="Describe a movie, and let AI do the rest..."
              disabled={isLoading}
              className="text-lg p-6"
            />
            <Button onClick={onSearchClick} disabled={isLoading} className="text-lg p-6">
              Search
            </Button>
          </div>

          <div className="results-area">
            {isLoading && <p className="text-center">Finding movies...</p>}
            {error && <p className="text-center text-destructive">{error}</p>}
            {!isLoading && !error && movieResults.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movieResults.map((movie, index) => (
                  <Card key={index} onClick={() => handleCardClick(movie)} className="bg-card text-card-foreground overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                    <CardHeader className="p-0">
                      {movie.posterUrl ? (
                        <img src={movie.posterUrl} alt={movie.title} className="w-full h-auto object-cover" />
                      ) : (
                        <div className="h-48 flex items-center justify-center bg-secondary">
                          <p className="text-muted-foreground">No Poster Available</p>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-lg mb-2 truncate" title={movie.title}>{movie.title} ({movie.releaseYear})</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-3">{movie.description}</p>
                    </CardContent>
                  </Card>
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

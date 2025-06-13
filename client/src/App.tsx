import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface MovieResult {
  title: string;
  description: string;
  posterUrl: string;
  releaseYear: string;
}

function App() {
  const [input, setInput] = useState('');
  const [movieResults, setMovieResults] = useState<MovieResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);
    setMovieResults([]);

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/find-movie`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: input }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const results: MovieResult[] = await response.json();
      setMovieResults(results);

    } catch (err: any) {
      console.error("Failed to find movie:", err);
      setError(err.message || 'Sorry, I had trouble finding that movie. Could you try another description?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">CineFind</h1>
          <p className="text-lg text-muted-foreground">Can't remember a movie? Describe it here, and let AI do the rest.</p>
        </header>

        <main>
          <div className="flex space-x-2 mb-8 max-w-2xl mx-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g., 'A thief who enters people's dreams to steal secrets'"
              disabled={isLoading}
              className="text-lg p-6"
            />
            <Button onClick={handleSearch} disabled={isLoading} className="text-lg p-6">
              Search
            </Button>
          </div>

          <div className="results-area">
            {isLoading && <p className="text-center">Finding movies...</p>}
            {error && <p className="text-center text-destructive">{error}</p>}
            {!isLoading && !error && movieResults.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movieResults.map((movie, index) => (
                  <Card key={index} className="bg-card text-card-foreground overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
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
                 <p className="text-center text-muted-foreground">Results will appear here.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

import { type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MovieCard from "@/components/common/movie-card/movie-card";
import { AutoResizeTextArea } from "@/components/ui/auto-resize-text-area";
import { Loader2, Search, X } from "lucide-react";
import { type MovieResult, useSearch } from "@/context/search-context";
import { useTypewriterEffect } from "@/hooks/useTypewritterEffect";

const examplePrompts = [
  "A movie where a man relives the same day",
  "Tom Hanks stranded on an island",
  "A team enters people's dreams to steal secrets",
  "A girl travels to a magical land with a yellow brick road",
  "A shark terrorizes a beach town",
];

const SearchPage = () => {
  const navigate = useNavigate();
  const {
    input,
    setInput,
    movieResults,
    isLoading,
    error,
    setError,
    handleSearch,
    clearResults,
  } = useSearch();

  const placeholder = useTypewriterEffect(examplePrompts);

  const onSearchClick = () => {
    handleSearch(input);
  };

  // Handle Enter/Shift+Enter in textarea
  const handleInputKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSearchClick();
    }
    // else allow default (including Shift+Enter for newline)
  };

  const handleCardClick = (movie: MovieResult) => {
    navigate(`/movie/${movie.id}`, {
      state: {
        movie,
        similarMovies: movieResults.filter(
          (m: MovieResult) => m.id !== movie.id
        ),
      },
    });
  };

  const actualPlaceholder =
    error || movieResults.length > 0
      ? "Describe a scene, actor, or plot..."
      : placeholder;

  return (
    <div className="p-4 sm:p-6 lg:p-8 relative min-h-screen overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        <main>
          {/* Welcome message and tagline */}
          {movieResults.length === 0 && (
            <div className="flex flex-col items-center justify-center my-16">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-4 ">
                Can't Remember <i className="text-primary">That Movie</i> ?
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground text-center mb-8 max-w-xl">
                Describe any scene, actor, plot detail, or anything you
                remember, and let AI help you rediscover the movie you're
                thinking of. Try prompts like{" "}
                <span className="italic">
                  "A movie where a man relives the same day"
                </span>{" "}
                or{" "}
                <span className="italic">
                  "A film with a talking dog and a flying house"
                </span>
                .
              </p>
              {/* Example prompt chips */}
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                {[
                  "A movie where a man relives the same day",
                  "A film with a talking dog and a flying house",
                  "A hacker discovers the world is a simulation",
                  "A group of friends goes on a treasure hunt",
                  "An animated movie about emotions inside a girl's head",
                ].map((example, idx) => (
                  <Button
                    key={example}
                    variant="outline"
                    className={` ${
                      idx < 3 ? "" : "hidden sm:inline"
                    } rounded-full px-4 py-2 text-sm hover:bg-accent transition-colors`}
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

          <div className="flex space-x-2 relative my-12 max-w-2xl mx-auto items-center">
            <AutoResizeTextArea
              value={input}
              onChange={(e) => {
                if (error) setError(null);
                setInput(e.target.value);
              }}
              onKeyDown={handleInputKeyDown}
              maxHeight={180}
              placeholder={actualPlaceholder}
              aria-label="Movie description"
              autoFocus
            />
            <Button
              onClick={onSearchClick}
              disabled={isLoading || input.length === 0}
              size={"lg"}
            >
              <Search />
              <span className="hidden sm:inline">Find My Movie</span>
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
              <>
                <div className="flex justify-end mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      clearResults();
                      setInput("");
                    }}
                  >
                    <X />
                    Clear Results
                  </Button>
                </div>
                {/* Top 3 results */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
                    {movieResults.slice(0, 3).map((movie, idx) => (
                      <div
                        key={movie.id}
                        className="flex-1 min-w-0"
                        onClick={() => handleCardClick(movie)}
                      >
                        <MovieCard
                          {...movie}
                          topPick={
                            idx === 0 ? "top" : idx === 1 ? "second" : "third"
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {/* More results grid */}
                {movieResults.length > 3 && (
                  <>
                    <div className="text-base font-medium mb-3 text-muted-foreground">
                      More results
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {movieResults.slice(3).map((movie) => (
                        <div
                          key={movie.id}
                          onClick={() => handleCardClick(movie)}
                        >
                          <MovieCard {...movie} />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchPage;

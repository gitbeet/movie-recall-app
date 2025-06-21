import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "../common/movie-card";

interface MovieSummary {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  releaseYear?: string;
  rating?: number;
}

interface MovieCarouselProps {
  movies: MovieSummary[];
  onMovieClick?: (movie: MovieSummary) => void;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({
  movies,
  onMovieClick,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: true },
    []
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative group">
      <div
        className="overflow-hidden"
        ref={emblaRef}
      >
        <div className="flex -ml-4">
          {movies.map((movie) => (
            <div
              className="flex-grow-0 flex-shrink-0 w-56 min-w-[14rem] pl-4 cursor-pointer"
              key={movie.id}
              onClick={() => onMovieClick?.(movie)}
            >
              <MovieCard {...movie} />
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={scrollPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-card border border-border rounded-full p-2 shadow hover:bg-accent transition-all z-10 hidden group-hover:block"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-card border border-border rounded-full p-2 shadow hover:bg-accent transition-all z-10 hidden group-hover:block"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default MovieCarousel;

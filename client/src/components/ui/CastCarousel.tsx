import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CastMember {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
  imdbUrl?: string | null;
  tmdbUrl?: string;
}

interface CastCarouselProps {
  cast: CastMember[];
}

const CastCarousel: React.FC<CastCarouselProps> = ({ cast }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, dragFree: false }, []);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative group">
      <div className="overflow-hidden py-2" ref={emblaRef}>
        <div className="flex -ml-4">
          {cast.map((member, idx) => (
            <div
              key={member.name + idx}
              className="flex-grow-0 flex-shrink-0 w-40 min-w-[10rem]"
            >
              <a
                href={member.imdbUrl || member.tmdbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center hover:scale-105 transition-transform"
              >
                {member.profileUrl ? (
                  <img
                    src={member.profileUrl}
                    alt={member.name}
                    className="w-20 h-20 rounded-full object-cover shadow-md mb-2 border-2 border-transparent hover:border-primary"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-2 text-muted-foreground text-xl border-2 border-transparent hover:border-primary">
                    ?
                  </div>
                )}
                <span className="font-semibold text-sm text-center line-clamp-2 hover:underline">
                  {member.name}
                </span>
                <span className="text-xs text-muted-foreground text-center line-clamp-2">
                  {member.character}
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
      <button
        className="absolute top-1/2 -translate-y-1/2 left-2 bg-background/50 text-foreground rounded-full p-2 hover:bg-background/75 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 z-10"
        onClick={scrollPrev}
        aria-label="Previous cast"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        className="absolute top-1/2 -translate-y-1/2 right-2 bg-background/50 text-foreground rounded-full p-2 hover:bg-background/75 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 z-10"
        onClick={scrollNext}
        aria-label="Next cast"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default CastCarousel;

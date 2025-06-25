import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CastMemberCard } from "../cast-member-card/cast-member-card";

export interface CastMember {
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
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: false, dragFree: false },
    []
  );

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative group">
      <div
        className="overflow-hidden py-2"
        ref={emblaRef}
      >
        <div className="flex -ml-2">
          {cast.map((member, idx) => (
            <CastMemberCard
              key={member.name + idx}
              member={member}
            />
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

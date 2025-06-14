import React, { useCallback, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ImageModal from '../modals/ImageModal';

interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false }, []);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

    const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handlePrevImage = () => {
    if (selectedImageIndex !== null) {
      const newIndex = selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1;
      setSelectedImageIndex(newIndex);
    }
  };

  const handleNextImage = () => {
    if (selectedImageIndex !== null) {
      const newIndex = selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1;
      setSelectedImageIndex(newIndex);
    }
  };

  return (
    <div className="relative group">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {images.map((src, index) => (
                        <div className="flex-grow-0 flex-shrink-0 w-full min-w-0 pl-4 sm:w-1/2 md:w-1/3 lg:w-1/4 cursor-pointer" key={index} onClick={() => setSelectedImageIndex(index)}>
              <img src={src} alt={`Carousel image ${index + 1}`} className="w-full h-auto object-cover rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      <button
        className="absolute top-1/2 -translate-y-1/2 left-2 bg-background/50 text-foreground rounded-full p-2 hover:bg-background/75 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 z-10"
        onClick={scrollPrev}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        className="absolute top-1/2 -translate-y-1/2 right-2 bg-background/50 text-foreground rounded-full p-2 hover:bg-background/75 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 z-10"
        onClick={scrollNext}
        aria-label="Next slide"
      >
                <ChevronRight className="w-6 h-6" />
      </button>

            {selectedImageIndex !== null && (
        <ImageModal 
          imageUrl={images[selectedImageIndex]} 
          onClose={() => setSelectedImageIndex(null)} 
          onNext={handleNextImage}
          onPrev={handlePrevImage}
        />
      )}
    </div>
  );
};

export default ImageCarousel;

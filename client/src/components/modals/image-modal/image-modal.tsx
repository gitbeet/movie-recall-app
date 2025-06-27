import { type FC, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const ImageModal: FC<ImageModalProps> = ({
  imageUrl,
  onClose,
  onNext,
  onPrev,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowRight") {
        onNext();
      } else if (event.key === "ArrowLeft") {
        onPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="Enlarged view"
          className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/75 transition-all z-10"
          aria-label="Close image view"
        >
          <X className="w-6 h-6" />
        </button>

        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/75 transition-all z-10"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/75 transition-all z-10"
          aria-label="Next image"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default ImageModal;

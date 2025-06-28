import { type FC, useEffect } from "react";

export interface TrailerModalProps {
  trailerUrl: string;
  onClose: () => void;
}

const TrailerModal: FC<TrailerModalProps> = ({ trailerUrl, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-lg shadow-2xl overflow-hidden w-full max-w-4xl mx-4 aspect-video"
        onClick={(e) => e.stopPropagation()}
        data-testid="trailer-modal-content"
      >
        <iframe
          src={trailerUrl}
          title="Movie Trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );
};

export default TrailerModal;

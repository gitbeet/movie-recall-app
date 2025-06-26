import { Button } from "../../ui/button";
import { Share2 } from "lucide-react";
import React from "react";
import { ShareDropdown } from "../share-dropdown/share-dropdown";
import { Popover, PopoverTrigger } from "../../ui/popover";

interface ShareButtonProps {
  url?: string;
  title?: string;
  text?: string;
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  url,
  title,
  text,
  className,
}) => {
  const handleShare = async (openPopover: () => void) => {
    const shareUrl = url || window.location.href;
    const shareTitle = title || document.title;
    const shareText = text || undefined;

    if (
      navigator.share &&
      navigator.canShare({ url: shareUrl, title: shareTitle, text: shareText })
    ) {
      try {
        await navigator.share({
          url: shareUrl,
          title: shareTitle,
          text: shareText,
        });
      } catch (error) {
        // Catch the error to avoid uncaught promise rejections
        console.error("Error sharing:", error);
      }
    } else {
      openPopover();
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Share"
          className={className}
          onClick={async (e) => {
            e.stopPropagation();
            const shareUrl = url || window.location.href;
            const shareTitle = title || document.title;
            const shareText = text || undefined;

            if (
              navigator.canShare?.({
                url: shareUrl,
                title: shareTitle,
                text: shareText,
              })
            ) {
              e.preventDefault();
              await handleShare(() => {});
            }
          }}
        >
          <Share2 className="w-5 h-5" />
          <span className="sr-only">Share</span>
        </Button>
      </PopoverTrigger>

      <ShareDropdown
        url={url}
        title={title}
      />
    </Popover>
  );
};

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export interface MovieCardProps {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  releaseYear?: string;
  rating?: number;
  topPick?: "top" | "second" | "third";
}

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  description,
  posterUrl,
  releaseYear,
  rating,
  topPick,
}) => {
  const navigate = useNavigate();

  const badgeLabel =
    topPick === "top"
      ? "Top Pick"
      : topPick === "second"
      ? "2nd"
      : topPick === "third"
      ? "3rd"
      : null;
  const badgeVariant =
    topPick === "top"
      ? "default"
      : topPick === "second"
      ? "secondary"
      : topPick === "third"
      ? "secondary"
      : undefined;
  const emphasisClass = topPick ? "border-2 border-primary/50" : "";

  return (
    <div
      data-testid="movie-card"
      className={topPick ? "relative" : ""}
    >
      {badgeLabel && (
        <div className="absolute -top-2 -left-2 z-10">
          <Badge
            data-testid="movie-card-badge"
            variant={badgeVariant}
          >
            {badgeLabel}
          </Badge>
        </div>
      )}
      <Card
        className={
          "h-full flex flex-col pt-0 cursor-pointer hover:shadow-md transition-shadow overflow-hidden group/card " +
          emphasisClass
        }
        onClick={() => navigate(`/movie/${id}`)}
      >
        <CardHeader className="p-0 flex-shrink-0">
          <div className="aspect-[2/3] overflow-hidden">
            {posterUrl ? (
              <img
                data-testid="movie-card-poster"
                src={posterUrl}
                alt={`${title} poster`}
                className="w-full  object-cover group-hover/card:scale-105 transition-all duration-300"
              />
            ) : (
              <div className="w-full h-full  flex items-center justify-center bg-muted text-muted-foreground text-center text-xs sm:text-sm font-semibold rounded-md">
                No poster available
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 p-2">
          <CardTitle
            data-testid="movie-card-title"
            className="text-base font-semibold mb-1 line-clamp-1"
          >
            {title}
          </CardTitle>
          {releaseYear && (
            <div
              data-testid="movie-card-release-year"
              className="text-xs text-muted-foreground mb-1"
            >
              {releaseYear}
            </div>
          )}
          {rating !== undefined && (
            <div className="text-xs text-primary font-bold mb-1">
              ★ {rating.toFixed(1)}
            </div>
          )}
          <p
            data-testid="movie-card-description"
            className="text-xs text-muted-foreground min-h-[2.5em] line-clamp-2 flex-1"
          >
            {description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MovieCard;

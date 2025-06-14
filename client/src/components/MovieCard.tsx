import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  releaseYear?: string;
  rating?: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ id, title, description, posterUrl, releaseYear, rating }) => {
  const navigate = useNavigate();

  return (
    <Card className="h-full flex flex-col pt-0 cursor-pointer hover:shadow-lg transition-shadow overflow-hidden" onClick={() => navigate(`/movie/${id}`)}>
      <CardHeader className="p-0 flex-shrink-0">
        {posterUrl ? (
          <img src={posterUrl} alt={title} className="w-full aspect-[2/3] object-cover" />
        ) : (
          <div className="w-full aspect-[2/3] flex items-center justify-center bg-muted text-muted-foreground text-center text-xs sm:text-sm font-semibold rounded-md">
            No poster available
          </div>
        )}
      </CardHeader>
      <CardContent className="flex flex-col flex-1 p-2">
        <CardTitle className="text-base font-semibold line-clamp-2 mb-1 line-clamp-1">{title}</CardTitle>
        {releaseYear && <div className="text-xs text-muted-foreground mb-1">{releaseYear}</div>}
        {rating !== undefined && <div className="text-xs text-primary font-bold mb-1">★ {rating.toFixed(1)}</div>}
        <div className="text-xs text-muted-foreground min-h-[2.5em] line-clamp-2 flex-1">{description}</div>
      </CardContent>
    </Card>
  );
};

export default MovieCard;

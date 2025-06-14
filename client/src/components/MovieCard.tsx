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
    <Card className=" pt-0 cursor-pointer hover:shadow-lg transition-shadow overflow-hidden" onClick={() => navigate(`/movie/${id}`)}>
      <CardHeader className="p-0">
        <img src={posterUrl} alt={title} className="w-full aspect-[2/3] object-cover" />
      </CardHeader>
      <CardContent className="p-2">
        <CardTitle className="text-base font-semibold line-clamp-2 mb-1 line-clamp-1">{title}</CardTitle>
        {releaseYear && <div className="text-xs text-muted-foreground mb-1">{releaseYear}</div>}
        {rating !== undefined && <div className="text-xs text-primary font-bold mb-1">★ {rating.toFixed(1)}</div>}
        <div className="text-xs text-muted-foreground line-clamp-3">{description}</div>
      </CardContent>
    </Card>
  );
};

export default MovieCard;

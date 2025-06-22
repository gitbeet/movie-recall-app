import { Film } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link
      to="/"
      aria-label="Logo"
      className="flex items-center gap-1 text-lg"
    >
      <Film className="h-6 w-6 text-primary" />
      <span>
        <b>
          Flick<i className="text-primary">Finder</i>
        </b>
      </span>
    </Link>
  );
};

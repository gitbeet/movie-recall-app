import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-lg">
        Sorry, the page you are looking for does not exist.
      </p>
      <Button asChild>
        <Link to="/">
          <Home />
          Go back home
        </Link>
      </Button>
    </div>
  );
}

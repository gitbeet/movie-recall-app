import { Link, Outlet } from "react-router-dom";
import { ModeToggle } from "./ui/mode-toggle";
import { Film, LogIn } from "lucide-react";
import { Button } from "./ui/button";

const Layout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-start gap-1 text-lg">
              <Film className="h-6 w-6 text-primary" />
              <span>
                <b>flickfinder</b>.<span className="text-primary">ai</span>
              </span>
            </Link>
            <div>
              <ModeToggle />
              <Button disabled className="ml-2">
                <LogIn /> Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

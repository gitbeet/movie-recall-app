import { Link, Outlet } from 'react-router-dom';
import { ModeToggle } from './ui/mode-toggle';
import { Film } from 'lucide-react';

const Layout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-start gap-1 text-lg">
                <Film className="h-6 w-6 text-primary" />
                <span>flickfinder.<b className="text-primary">ai</b></span>
              </Link>
            <ModeToggle />
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

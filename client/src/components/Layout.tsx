import { Link, Outlet } from 'react-router-dom';
import { ModeToggle } from './ui/mode-toggle';

const Layout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary">
                CineFind
              </Link>
            </div>
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

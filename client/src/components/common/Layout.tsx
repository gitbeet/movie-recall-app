import { Link, Outlet } from "react-router-dom";
import { ModeToggle } from "../ui/mode-toggle";
import MobileMenu from "../common/MobileMenu";
import { Bookmark, Film, LogIn, LogOut } from "lucide-react";
import { Button } from "../ui/button";

import { useFavorites } from "@/context/FavoritesContext";
import { useNavigate } from "react-router-dom";

const Layout = () => {
  const { user, favorites, refetchUser } = useFavorites();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    // Call logout endpoint (to be implemented), then refetch user
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/logout`, {
      method: "POST",
      credentials: "include",
    });
    await refetchUser();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center gap-1 text-lg"
            >
              <Film className="h-6 w-6 text-primary" />
              <span>
                <b>
                  Flick<i className="text-primary">Finder</i>
                </b>
              </span>
            </Link>
            <div className="flex items-center gap-4">
              {/* Watchlist button - always visible */}
              <Link
                to="/favorites"
                className="relative"
              >
                <Button
                  variant="ghost"
                  className="relative"
                  size="icon"
                >
                  <span className="relative inline-block">
                    <Bookmark />
                    {favorites.length > 0 && (
                      <span className="absolute -bottom-2.5 -right-2.5 bg-primary text-white text-[10px] leading-none rounded h-4 w-4  shadow-md flex items-center justify-center">
                        {favorites.length}
                      </span>
                    )}
                  </span>
                </Button>
              </Link>

              {/* Desktop nav elements (hidden on mobile) */}
              <div className="hidden md:flex items-center gap-4">
                {user ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleSignOut}
                    >
                      <LogOut />
                      <span className="sm:inline hidden"> Sign Out</span>
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => navigate("/login")}>
                    <LogIn /> <span className="sm:inline hidden"> Sign In</span>
                  </Button>
                )}
                <ModeToggle />
              </div>
              {/* Mobile menu button (visible on mobile only) */}
              <div className="md:hidden">
                <MobileMenu />
              </div>
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

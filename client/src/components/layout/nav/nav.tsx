import { Link, useNavigate } from "react-router-dom";
import { Bookmark, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/context/favorites-context";
import { ModeToggle } from "@/components/ui/mode-toggle";
import MobileMenu from "../../common/mobile-menu";
import { Logo } from "../../common/logo";

export const Nav = () => {
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
    <nav className="bg-card border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <div className="flex items-center gap-4">
            {/* Watchlist button - always visible */}
            <Link
              to="/favorites"
              className="relative"
              aria-label="Go to watchlist"
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
                    aria-label="Sign out"
                  >
                    <LogOut />
                    <span className="sm:inline hidden"> Sign Out</span>
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => navigate("/login")}
                  aria-label="Sign in"
                >
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
  );
};

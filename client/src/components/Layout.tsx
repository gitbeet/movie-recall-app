import { Link, Outlet } from "react-router-dom";
import { ModeToggle } from "./ui/mode-toggle";
import { Bookmark, Film, LogIn, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import UserAuthModal from "./UserAuthModal";
import { useFavorites } from "@/context/FavoritesContext";
import React from "react";
import { useNavigate } from "react-router-dom";

const Layout = () => {
  const { userId, setUserId } = useFavorites();
  const [modalOpen, setModalOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    setUserId(""); // Clear userId and favorites (FavoritesProvider handles this)
    navigate("/"); // Optionally redirect to home
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-1 text-lg">
              <Film className="h-6 w-6 text-primary" />
              <span>
                <b>
                  Flick<i className="text-primary"> Finder</i>
                </b>
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <ModeToggle />
              {userId ? (
                <>
                  <Link to="/watchlist">
                    <Button variant="outline">
                      <Bookmark /> Watchlist
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={handleSignOut}>
                    <LogOut /> Sign Out
                  </Button>
                </>
              ) : (
                <Button onClick={() => setModalOpen(true)}>
                  <LogIn /> Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <UserAuthModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

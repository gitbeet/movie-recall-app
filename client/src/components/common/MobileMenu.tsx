import { useState } from "react";
import { ModeToggle } from "../ui/mode-toggle";
import { Button } from "../ui/button";
import { LogIn, LogOut, Menu, X } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/MobileMenu.module.css";
import React from "react";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const { user, refetchUser } = useFavorites();
  const navigate = useNavigate();

  // Helper to close with animation
  const closeMenu = React.useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 350); // match animation duration
  }, []);

  const handleSignOut = async () => {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/logout`, {
      method: "POST",
      credentials: "include",
    });
    await refetchUser();
    navigate("/");
    closeMenu();
  };

  const handleSignIn = () => {
    navigate("/login");
    closeMenu();
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>
      {(open || closing) && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop with blur and semitransparent effect and fade animation */}
          <div
            className={`fixed inset-0 bg-black/40 backdrop-blur-md ${
              closing ? styles.backdropFadeOut : styles.backdropFadeIn
            }`}
            onClick={closeMenu}
          />
          {/* Slide-in menu from right with exit animation */}
          <nav
            className={`relative ml-auto w-64 max-w-full bg-card shadow-lg flex flex-col gap-6 p-6 ${
              closing ? styles.slideOutRight : styles.slideInRight
            }`}
            style={{ right: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close menu"
                onClick={closeMenu}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <ModeToggle />
            {user ? (
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2"
              >
                <LogOut /> <span>Sign Out</span>
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={handleSignIn}
                className="w-full flex items-center gap-2"
              >
                <LogIn /> <span>Sign In</span>
              </Button>
            )}
          </nav>
        </div>
      )}
    </>
  );
}

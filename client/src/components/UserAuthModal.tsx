import React, { useState } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import { Button } from "./ui/button";

export default function UserAuthModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { setUserId } = useFavorites();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.userId) {
        setUserId(data.userId);
        onClose();
      } else {
        setError("Could not sign in. Try again.");
      }
    } catch (e) {
      setError("Could not sign in. Try again.");
      console.log(e);
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-card p-6 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-xl font-bold mb-2">Sign In</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            autoFocus
            className="input input-bordered w-full px-3 py-2 rounded border"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <div className="text-destructive text-sm">{error}</div>}
          <Button
            type="submit"
            disabled={loading || !email}
            size="lg"
            className="w-full"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="w-full"
          >
            Cancel
          </Button>
        </form>
      </div>
    </div>
  );
}

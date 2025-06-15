import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFavorites } from "@/context/FavoritesContext";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { refetchUser } = useFavorites();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      await refetchUser();
      navigate("/");
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="bg-card p-8 rounded-lg shadow-md w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Sign In</h1>
        <div className="space-y-2">
          <label htmlFor="email" className="block font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            placeholder="you@email.com"
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="block font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>
        {error && (
          <div className="text-destructive text-center text-sm">{error}</div>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
        <div className="text-center text-sm mt-2">
          Don't have an account?{" "}
          <Link to="/register" className="underline">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;

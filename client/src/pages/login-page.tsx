import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "@/context/favorites-context";
import { LoginForm } from "@/components/common/login-form";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { refetchUser } = useFavorites();

  const handleLogin = async (email: string, password: string) => {
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
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <LoginForm
        loading={loading}
        error={error}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default LoginPage;

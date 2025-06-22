import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterForm } from "@/components/common/register-form/register-form";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`${API_BASE}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <RegisterForm
        loading={loading}
        error={error}
        success={success}
        onRegister={handleRegister}
      />
    </div>
  );
};

export default RegisterPage;

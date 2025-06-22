import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RegisterForm, type RegisterFormProps } from "./register-form";
import { MemoryRouter } from "react-router-dom";

const renderRegisterForm = (props: Partial<RegisterFormProps> = {}) => {
  const defaultProps: RegisterFormProps = {
    onRegister: vi.fn(),
    loading: false,
    error: null,
    success: false,
  };

  render(
    <MemoryRouter>
      <RegisterForm
        {...defaultProps}
        {...props}
      />
    </MemoryRouter>
  );
};

describe("register-form", () => {
  describe("renders the UI elements correctly", () => {
    test("renders the heading", () => {
      renderRegisterForm();
      const heading = screen.getByRole("heading", {
        name: /sign up|register|create your account/i,
      });
      expect(heading).toBeInTheDocument();
    });

    test("renders the email input", () => {
      renderRegisterForm();
      const emailInput = screen.getByRole("textbox", { name: /email/i });
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute("type", "email");
    });

    test("renders the password input", () => {
      renderRegisterForm();
      const passwordInput = screen.getByLabelText("Password");
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    test("renders the confirm password input", () => {
      renderRegisterForm();
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      expect(confirmPasswordInput).toBeInTheDocument();
      expect(confirmPasswordInput).toHaveAttribute("type", "password");
    });

    test("renders the sign up button", () => {
      renderRegisterForm();
      const signUpButton = screen.getByRole("button", {
        name: "Sign up",
      });
      expect(signUpButton).toBeInTheDocument();
      expect(signUpButton).toBeEnabled();
    });

    test("Sign up button has the correct text and is disabled when loading is true", () => {
      renderRegisterForm({ loading: true });
      const signUpButton = screen.getByRole("button", {
        name: "Signing up...",
      });
      expect(signUpButton).toBeInTheDocument();
      expect(signUpButton).toBeDisabled();
    });

    test("renders the sign up with google button", () => {
      renderRegisterForm();
      const signUpWithGoogleButton = screen.getByRole("button", {
        name: /sign up with google|continue with google/i,
      });
      expect(signUpWithGoogleButton).toBeInTheDocument();
      expect(signUpWithGoogleButton).toBeDisabled();
    });

    test("renders the sign in link", () => {
      renderRegisterForm();
      const signInLink = screen.getByRole("link", {
        name: /sign in/i,
      });
      expect(signInLink).toBeInTheDocument();
      expect(signInLink).toHaveAttribute("href", "/login");
    });
  });
});

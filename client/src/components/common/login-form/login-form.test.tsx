import { render, screen, waitFor } from "@testing-library/react";
import { LoginForm, type LoginFormProps } from "./login-form";
import { describe, test, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

const renderSignInForm = (props: Partial<LoginFormProps> = {}) => {
  const defaultProps: LoginFormProps = {
    onLogin: vi.fn(),
    loading: false,
    error: null,
  };

  render(
    <MemoryRouter>
      <LoginForm
        {...defaultProps}
        {...props}
      />
    </MemoryRouter>
  );

  return { onLoginMock: defaultProps.onLogin };
};

describe("login-form", () => {
  describe("renders the UI elements correctly", () => {
    test("renders the heading", () => {
      renderSignInForm();
      const heading = screen.getByRole("heading", {
        name: /sign in|welcome|login/i,
      });
      expect(heading).toBeInTheDocument();
    });

    test("renders the email input", () => {
      renderSignInForm();
      const emailInput = screen.getByRole("textbox", { name: /email/i });
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute("type", "email");
    });

    test("typing in the email input", async () => {
      renderSignInForm();
      const emailInput = screen.getByRole("textbox", { name: /email/i });
      await userEvent.type(emailInput, "test@test.com");
      expect(emailInput).toHaveValue("test@test.com");
    });

    test("renders the password input", () => {
      renderSignInForm();
      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    test("typing in the password input", async () => {
      renderSignInForm();
      const passwordInput = screen.getByLabelText(/password/i);
      await userEvent.type(passwordInput, "password");
      expect(passwordInput).toHaveValue("password");
    });

    test("renders the signIn button", () => {
      renderSignInForm();
      const signInButton = screen.getByRole("button", { name: "Sign In" });
      expect(signInButton).toBeInTheDocument();
      expect(signInButton).toBeEnabled();
    });

    test.only("Sign In button has the correct text and is disabled when loading is true", () => {
      renderSignInForm({ loading: true });
      const signInButton = screen.getByRole("button", {
        name: "Signing in...",
      });
      expect(signInButton).toBeInTheDocument();
      expect(signInButton).toBeDisabled();
    });

    test("renders the sign in with google button and it is disabled", () => {
      renderSignInForm();
      const signInWithGoogleButton = screen.getByRole("button", {
        name: /sign in with google|continue with google/i,
      });
      expect(signInWithGoogleButton).toBeInTheDocument();
      expect(signInWithGoogleButton).toBeDisabled();
    });

    test("renders the sign up link and it has the correct href", () => {
      renderSignInForm();
      const signUpLink = screen.getByRole("link", { name: /sign up/i });
      expect(signUpLink).toBeInTheDocument();
      expect(signUpLink).toHaveAttribute("href", "/register");
    });
  });

  describe("form validation", () => {
    test("email is required", async () => {
      renderSignInForm();

      const emailInput = screen.getByRole("textbox", { name: /email/i });
      const signInButton = screen.getByRole("button", { name: "Sign In" });

      await userEvent.click(signInButton);

      const errorMessage = screen.getByText(/email is required/i);

      expect(emailInput).toHaveAttribute("aria-invalid", "true");
      expect(errorMessage).toBeInTheDocument();
    });

    test.only("email is valid", async () => {
      renderSignInForm();
      const emailInput = screen.getByRole("textbox", { name: /email/i });
      const signInButton = screen.getByRole("button", { name: "Sign In" });

      await userEvent.type(emailInput, "test");
      await userEvent.click(signInButton);

      const errorMessage = screen.getByText(/invalid email address/i);
      expect(errorMessage).toBeInTheDocument();
      expect(emailInput).toHaveAttribute("aria-invalid", "true");

      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, "test@test.com");
      await userEvent.click(signInButton);

      const errorMessageAfter = screen.queryByText(/invalid email address/i);
      expect(errorMessageAfter).not.toBeInTheDocument();
      expect(emailInput).toHaveAttribute("aria-invalid", "false");
    });

    test("password is required", async () => {
      renderSignInForm();

      const passwordInput = screen.getByLabelText(/password/i);
      const signInButton = screen.getByRole("button", { name: "Sign In" });

      await userEvent.click(signInButton);

      const errorMessage = screen.getByText(/password is required/i);

      expect(passwordInput).toHaveAttribute("aria-invalid", "true");
      expect(errorMessage).toBeInTheDocument();
    });

    test("password is valid", async () => {
      renderSignInForm();
      const passwordInput = screen.getByLabelText(/password/i);
      const signInButton = screen.getByRole("button", { name: "Sign In" });

      await userEvent.type(passwordInput, "123");
      await userEvent.click(signInButton);

      const errorMessage = screen.getByText(
        /password must be at least 6 characters/i
      );
      expect(errorMessage).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute("aria-invalid", "true");

      await userEvent.clear(passwordInput);
      await userEvent.type(passwordInput, "123456");
      await userEvent.click(signInButton);

      const errorMessageAfter = screen.queryByText(
        /password must be at least 6 characters/i
      );
      expect(errorMessageAfter).not.toBeInTheDocument();
      expect(passwordInput).toHaveAttribute("aria-invalid", "false");
    });
  });

  describe("form submission", () => {
    test("submitting the form with valid email and password", async () => {
      const { onLoginMock } = renderSignInForm();

      const emailInput = screen.getByRole("textbox", { name: /email/i });
      const passwordInput = screen.getByLabelText(/password/i);
      const signInButton = screen.getByRole("button", { name: "Sign In" });

      await userEvent.type(emailInput, "test@test.com");
      await userEvent.type(passwordInput, "123456");
      await userEvent.click(signInButton);

      await waitFor(() => {
        expect(onLoginMock).toHaveBeenCalledTimes(1);
        expect(onLoginMock).toHaveBeenCalledWith("test@test.com", "123456");
      });
    });
  });
});

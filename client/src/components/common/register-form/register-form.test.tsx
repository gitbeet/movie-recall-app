import { describe, test, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { RegisterForm, type RegisterFormProps } from "./register-form";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

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

  return {
    onRegisterMock: defaultProps.onRegister,
  };
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

    test("renders the sign in link and it has the correct href", () => {
      renderRegisterForm();
      const signInLink = screen.getByRole("link", {
        name: /sign in/i,
      });
      expect(signInLink).toBeInTheDocument();
      expect(signInLink).toHaveAttribute("href", "/login");
    });
  });

  describe("form validation", () => {
    test("email is required", async () => {
      renderRegisterForm();
      const emailInput = screen.getByRole("textbox", { name: /email/i });
      const signUpButton = screen.getByRole("button", { name: "Sign up" });

      await userEvent.click(signUpButton);

      const errorMessage = screen.getByText(/email is required/i);
      expect(errorMessage).toBeInTheDocument();
      expect(emailInput).toHaveAttribute("aria-invalid", "true");
    });

    test("email is valid", async () => {
      renderRegisterForm();
      const emailInput = screen.getByRole("textbox", { name: /email/i });
      const signUpButton = screen.getByRole("button", { name: "Sign up" });

      await userEvent.type(emailInput, "test");
      await userEvent.click(signUpButton);

      const errorMessage = screen.getByText(/invalid email address/i);
      expect(errorMessage).toBeInTheDocument();

      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, "test@test.com");
      await userEvent.click(signUpButton);

      const errorMessageAfter = screen.queryByText(/invalid email address/i);
      expect(errorMessageAfter).not.toBeInTheDocument();
      expect(emailInput).toHaveAttribute("aria-invalid", "false");
    });

    test("password is required", async () => {
      renderRegisterForm();
      const passwordInput = screen.getByLabelText("Password");
      const signUpButton = screen.getByRole("button", { name: "Sign up" });

      await userEvent.click(signUpButton);

      const errorMessage = await screen.findByText("Password is required");
      expect(errorMessage).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute("aria-invalid", "true");
    });

    test("password is valid", async () => {
      renderRegisterForm();
      const passwordInput = screen.getByLabelText("Password");
      const signUpButton = screen.getByRole("button", { name: "Sign up" });

      await userEvent.type(passwordInput, "123");
      await userEvent.click(signUpButton);

      const errorMessage = await screen.findByText(
        "Password must be at least 6 characters"
      );
      expect(errorMessage).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute("aria-invalid", "true");

      await userEvent.clear(passwordInput);
      await userEvent.type(passwordInput, "123456");

      const errorMessageAfter = screen.queryByText(
        "Password must be at least 6 characters"
      );
      expect(errorMessageAfter).not.toBeInTheDocument();
      expect(passwordInput).toHaveAttribute("aria-invalid", "false");
    });

    test("confirm password is required", async () => {
      renderRegisterForm();
      const confirmPasswordInput = screen.getByLabelText("Confirm Password");
      const signUpButton = screen.getByRole("button", { name: "Sign up" });

      await userEvent.click(signUpButton);

      const errorMessage = await screen.findByText(
        "Confirm password is required"
      );
      expect(errorMessage).toBeInTheDocument();
      expect(confirmPasswordInput).toHaveAttribute("aria-invalid", "true");
    });

    test("passwords do not match", async () => {
      renderRegisterForm();
      const passwordInput = screen.getByLabelText("Password");
      const confirmPasswordInput = screen.getByLabelText("Confirm Password");
      const signUpButton = screen.getByRole("button", { name: "Sign up" });

      await userEvent.type(passwordInput, "123456");
      await userEvent.type(confirmPasswordInput, "1234567");
      await userEvent.click(signUpButton);

      const errorMessage = await screen.findByText(/passwords do not match/i);
      expect(errorMessage).toBeInTheDocument();
      expect(confirmPasswordInput).toHaveAttribute("aria-invalid", "true");

      await userEvent.clear(confirmPasswordInput);
      await userEvent.type(confirmPasswordInput, "123456");
      await userEvent.click(signUpButton);

      const errorMessageAfter = screen.queryByText(/passwords do not match/i);
      expect(errorMessageAfter).not.toBeInTheDocument();
      expect(confirmPasswordInput).toHaveAttribute("aria-invalid", "false");
    });
  });

  describe.only("form submission", () => {
    test("submitting the form with valid data", async () => {
      const { onRegisterMock } = renderRegisterForm();
      const emailInput = screen.getByRole("textbox", { name: /email/i });
      const passwordInput = screen.getByLabelText("Password");
      const confirmPasswordInput = screen.getByLabelText("Confirm Password");
      const signUpButton = screen.getByRole("button", { name: "Sign up" });

      await userEvent.type(emailInput, "test@test.com");
      await userEvent.type(passwordInput, "123456");
      await userEvent.type(confirmPasswordInput, "123456");
      await userEvent.click(signUpButton);

      await waitFor(() => {
        expect(onRegisterMock).toHaveBeenCalledTimes(1);
        expect(onRegisterMock).toHaveBeenCalledWith("test@test.com", "123456");
      });
    });
  });
});

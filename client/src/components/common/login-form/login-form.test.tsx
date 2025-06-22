import { render, screen } from "@testing-library/react";
import { LoginForm } from "./login-form";
import { describe, test, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

const renderSignInForm = () => {
  render(
    <MemoryRouter>
      <LoginForm
        onLogin={() => {}}
        loading={false}
        error={null}
      />
    </MemoryRouter>
  );
};

describe("LoginForm", () => {
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

  test("renders the sign in with google button and it is disabled", async () => {
    renderSignInForm();
    const signInWithGoogleButton = screen.getByRole("button", {
      name: /sign in with google|continue with google/i,
    });
    expect(signInWithGoogleButton).toBeInTheDocument();
    expect(signInWithGoogleButton).toBeDisabled();
  });

  test("renders the sign up link", () => {
    renderSignInForm();
    const signUpLink = screen.getByRole("link", { name: /sign up/i });
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute("href", "/register");
  });
});

import { describe, expect, vi, beforeEach, type Mock, test } from "vitest";
import { ThemeProvider } from "@/context/theme-context";
import { ModeToggle } from "./mode-toggle";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("ModeToggle", () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {}; // In-memory store
    return {
      getItem: (key: string) => store[key] || null, // Retrieve item
      setItem: (key: string, value: string) => {
        store[key] = String(value);
      }, // Set item
      clear: () => {
        store = {};
      }, // Clear all items
    };
  })();

  // Assign the mock localStorage
  Object.defineProperty(window, "localStorage", { value: localStorageMock });

  // Mock window.matchMedia
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false, // Default to light mode for system preference
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Clear localStorage and any mock calls before each test
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("light", "dark");
  });

  // Test case 1: Switches from light to dark theme
  test("switches from light to dark theme and updates localStorage", async () => {
    // Render ModeToggle wrapped in ThemeProvider, initially set to 'light'
    render(
      <ThemeProvider defaultTheme="light">
        <ModeToggle />
      </ThemeProvider>
    );

    // Get the toggle button using its accessible label
    const toggleButton = screen.getByLabelText("Toggle dark mode");

    // Assert initial state: documentElement should have 'light' class
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    // localStorage should be null because we are using the default theme
    expect(localStorage.getItem("vite-ui-theme")).toBe(null);

    // Simulate a click on the button
    await userEvent.click(toggleButton);

    // Use waitFor to wait for state updates and DOM changes,
    // as useEffect and state updates are asynchronous.
    await waitFor(() => {
      // Assert that localStorage has been updated to 'dark'
      expect(localStorage.getItem("vite-ui-theme")).toBe("dark");
      // Assert that the documentElement's class list now contains 'dark'
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(document.documentElement.classList.contains("light")).toBe(false);
    });
  });

  // Test case 2: Switches from dark to light theme
  test("switches from dark to light theme and updates localStorage", async () => {
    // Pre-set localStorage to 'dark' to simulate a dark theme preference
    localStorage.setItem("vite-ui-theme", "dark");

    // Render ModeToggle wrapped in ThemeProvider (defaultTheme won't override storageKey)
    render(
      <ThemeProvider defaultTheme="system">
        <ModeToggle />
      </ThemeProvider>
    );

    const toggleButton = screen.getByLabelText("Toggle dark mode");

    // Assert initial state based on pre-set localStorage
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.classList.contains("light")).toBe(false);
    expect(localStorage.getItem("vite-ui-theme")).toBe("dark");

    // Simulate a click on the button
    await userEvent.click(toggleButton);

    await waitFor(() => {
      // Assert that localStorage has been updated to 'light'
      expect(localStorage.getItem("vite-ui-theme")).toBe("light");
      // Assert that the documentElement's class list now contains 'light'
      expect(document.documentElement.classList.contains("light")).toBe(true);
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });
  });

  // Test case 3: Verifies initial system theme handling (if no localStorage preference)
  test("initializes with system theme preference if no localStorage entry and system matches", async () => {
    // Mock matchMedia to prefer dark theme for this test
    (window.matchMedia as Mock).mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    // Render with defaultTheme='system' and no localStorage entry
    render(
      <ThemeProvider defaultTheme="system">
        <ModeToggle />
      </ThemeProvider>
    );

    // Initial render should apply the system dark theme
    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(document.documentElement.classList.contains("light")).toBe(false);
      // localStorage should not be set by system theme initialization
      expect(localStorage.getItem("vite-ui-theme")).toBe(null);
    });

    const toggleButton = screen.getByLabelText("Toggle dark mode");
    await userEvent.click(toggleButton); // Click to toggle from system-derived dark

    await waitFor(() => {
      //   Should switch to light and update localStorage
      expect(localStorage.getItem("vite-ui-theme")).toBe("light");
      expect(document.documentElement.classList.contains("light")).toBe(true);
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });
  });
});

import { render } from "@testing-library/react";
import type { RenderOptions, RenderResult } from "@testing-library/react";
import { Providers } from "./components/common/providers";

const renderWithProviders = (
  ui: React.ReactNode,
  options: RenderOptions = {}
): RenderResult => render(ui, { wrapper: Providers, ...options });

// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";
export { renderWithProviders as render };

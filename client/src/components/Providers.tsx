import { ThemeProvider } from "@/components/providers/theme-provider";
import { SearchProvider } from "@/context/SearchContext";
import { FavoritesProvider } from "@/context/FavoritesContext";

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <SearchProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </SearchProvider>
  </ThemeProvider>
);

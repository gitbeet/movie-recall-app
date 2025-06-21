import { ThemeProvider } from "@/context/theme-context";
import { SearchProvider } from "@/context/search-context";
import { FavoritesProvider } from "@/context/favorites-context";

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <SearchProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </SearchProvider>
  </ThemeProvider>
);

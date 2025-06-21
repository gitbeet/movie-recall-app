import { ThemeProvider } from "@/context/ThemeContext";
import { SearchProvider } from "@/context/SearchContext";
import { FavoritesProvider } from "@/context/FavoritesContext";

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <SearchProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </SearchProvider>
  </ThemeProvider>
);

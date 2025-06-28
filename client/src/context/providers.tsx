import { ThemeProvider } from "@/context/theme-context";
import { SearchProvider } from "@/context/search-context";
import { FavoritesProvider } from "@/context/favorites-context";
import { TooltipProvider } from "../components/ui/tooltip";

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <SearchProvider>
      <FavoritesProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </FavoritesProvider>
    </SearchProvider>
  </ThemeProvider>
);

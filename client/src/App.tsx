import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import SearchPage from "./pages/search-page/SearchPage";
import MovieDetailsPage from "./pages/movie-details-page/MovieDetailsPage";
import FavoritesPage from "./pages/FavoritesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import { SearchProvider } from "./context/SearchContext";
import { FavoritesProvider } from "./context/FavoritesContext";

function App() {
  return (
    <Router>
      <SearchProvider>
        <FavoritesProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route
                path="/"
                element={<SearchPage />}
              />
              <Route
                path="/movie/:id"
                element={<MovieDetailsPage />}
              />
              <Route
                path="/favorites"
                element={<FavoritesPage />}
              />
              <Route
                path="/login"
                element={<LoginPage />}
              />
              <Route
                path="/register"
                element={<RegisterPage />}
              />
              <Route
                path="*"
                element={<NotFoundPage />}
              />
            </Route>
          </Routes>
        </FavoritesProvider>
      </SearchProvider>
    </Router>
  );
}

export default App;

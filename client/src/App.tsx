import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/layout";
import SearchPage from "./pages/search-page/search-page";
import MovieDetailsPage from "./pages/movie-details-page/movie-details-page";
import FavoritesPage from "./pages/favorites-page/favorites-page";
import LoginPage from "./pages/login-page";
import RegisterPage from "./pages/register-page";
import NotFoundPage from "./pages/not-found-page/not-found-page";

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;

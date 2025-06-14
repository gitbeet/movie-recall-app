import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Layout from './components/Layout';
import SearchPage from './pages/SearchPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import WatchlistPage from './pages/WatchlistPage';
import { SearchProvider } from './context/SearchContext';
import { FavoritesProvider } from './context/FavoritesContext';

function App() {
  return (
    <Router>
      <SearchProvider>
        <FavoritesProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<SearchPage />} />
              <Route path="/movie/:id" element={<MovieDetailsPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
            </Route>
          </Routes>
        </FavoritesProvider>
      </SearchProvider>
    </Router>
  );
}

export default App;

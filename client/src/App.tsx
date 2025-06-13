import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Layout from './components/Layout';
import SearchPage from './pages/SearchPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import { SearchProvider } from './context/SearchContext';

function App() {
  return (
    <Router>
      <SearchProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<SearchPage />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
          </Route>
        </Routes>
      </SearchProvider>
    </Router>
  );
}

export default App;

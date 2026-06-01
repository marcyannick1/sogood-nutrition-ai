import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { CompareProvider } from './context/CompareContext';
import { Home } from './pages/Home';
import { SearchResults } from './pages/SearchResults';
import { ProductDetail } from './pages/ProductDetail';
import { Dashboard } from './pages/Dashboard';
import { Compare } from './pages/Compare';
import { Prediction } from './pages/Prediction';
import './App.css';

function App() {
  return (
    <Router>
      <CompareProvider>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/prediction" element={<Prediction />} />
          </Routes>
        </main>
      </CompareProvider>
    </Router>
  );
}

export default App;

import { Search } from 'lucide-react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function SearchBar({ large = false }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative w-full`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher un produit ou scanner un code-barres..."
        className={`input-field pr-14 ${large ? 'py-4 text-lg' : ''}`}
        data-testid="search-input"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-sogood-text-secondary hover:text-sogood-primary transition-colors"
        data-testid="search-button"
      >
        <Search size={large ? 24 : 20} />
      </button>
    </form>
  );
}

SearchBar.propTypes = {
  large: PropTypes.bool,
};

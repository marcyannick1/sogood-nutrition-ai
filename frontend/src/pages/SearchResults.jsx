import { Loader2, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { SearchBar } from '../components/SearchBar';
import { apiService } from '../services/api';

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nutriScore, setNutriScore] = useState('');
  const [nova, setNova] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const query = searchParams.get('q');

  useEffect(() => {
    const search = async () => {
      if (!query) return;

      setLoading(true);
      setError(null);
      try {
        const filters = {};
        if (nutriScore) filters.nutriScore = nutriScore;
        if (nova) filters.nova = nova;

        const result = await apiService.searchProducts(query, filters);
        setProducts(result.products || []);
      } catch (err) {
        setError('Erreur lors de la recherche');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [query, nutriScore, nova]);

  return (
    <div className="min-h-screen bg-sogood-bg px-6 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <select
            value={nutriScore}
            onChange={(e) => setNutriScore(e.target.value)}
            className="input-field w-auto"
            data-testid="nutriscore-filter"
          >
            <option value="">Tous les Nutri-Scores</option>
            <option value="a">Nutri-Score A</option>
            <option value="b">Nutri-Score B</option>
            <option value="c">Nutri-Score C</option>
            <option value="d">Nutri-Score D</option>
            <option value="e">Nutri-Score E</option>
          </select>

          <select
            value={nova}
            onChange={(e) => setNova(e.target.value)}
            className="input-field w-auto"
            data-testid="nova-filter"
          >
            <option value="">Tous les NOVA</option>
            <option value="1">NOVA 1</option>
            <option value="2">NOVA 2</option>
            <option value="3">NOVA 3</option>
            <option value="4">NOVA 4</option>
          </select>

          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="btn-secondary"
            data-testid="view-mode-toggle"
          >
            {viewMode === 'grid' ? 'Mode liste' : 'Mode grille'}
          </button>
        </div>

        {/* Results */}
        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-sogood-primary" />
          </div>
        )}

        {error && (
          <div className="product-card bg-red-50 text-red-700 p-4 text-center">
            {error}
          </div>
        )}

        {!loading && products.length === 0 && !error && (
          <div className="product-card flex flex-col items-center justify-center py-12 text-center">
            <Package size={48} className="mb-4 text-sogood-text-secondary" />
            <p className="text-sogood-text-secondary">Aucun produit trouvé</p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div
            className={
              viewMode === 'grid'
                ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-4'
                : 'space-y-4'
            }
          >
            {products.map((product) => (
              <ProductCard key={product.code} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

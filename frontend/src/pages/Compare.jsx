import { Package, Plus, X, Search } from 'lucide-react';
import { useState } from 'react';
import { useCompare } from '../hooks/useCompare';
import { NutriScoreBadge } from '../components/NutriScoreBadge';
import { NOVABadge } from '../components/NOVABadge';
import { apiService } from '../services/api';

export function Compare() {
  const { comparedProducts, removeProduct, addProduct } = useCompare();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const result = await apiService.searchProducts(searchQuery);
      setSearchResults(result.products || []);
    } catch (error) {
      console.error('Erreur recherche:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddProduct = (product) => {
    addProduct(product);
    setSearchResults([]);
    setSearchQuery('');
    setShowSearch(false);
  };

  return (
    <div className="min-h-screen bg-sogood-bg px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="section-title mb-12">Comparer les produits</h1>

        {comparedProducts.length === 0 ? (
          <div className="product-card flex flex-col items-center justify-center py-16">
            <Package size={48} className="mb-4 text-sogood-text-secondary" />
            <p className="mb-6 text-sogood-text-secondary">
              Aucun produit à comparer
            </p>
            <button
              onClick={() => setShowSearch(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Search size={18} />
              Ajouter un produit
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {comparedProducts.map((product, index) => (
                <div key={`${product.code}-${index}`} className="product-card relative">
                  <button
                    onClick={() => removeProduct(product.code)}
                    className="absolute right-4 top-4 rounded-full bg-red-100 p-2 hover:bg-red-200"
                    data-testid={`remove-${product.code}`}
                  >
                    <X size={18} className="text-red-600" />
                  </button>

                  {/* Image */}
                  <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-sogood-bg">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.product_name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <Package size={40} className="text-sogood-text-secondary" />
                    )}
                  </div>

                  {/* Infos */}
                  <h3 className="mb-1 font-outfit font-semibold text-sogood-text-primary">
                    {product.product_name}
                  </h3>
                  <p className="mb-4 text-sm text-sogood-text-secondary">
                    {product.brands}
                  </p>

                  {/* Scores */}
                  <div className="mb-4 space-y-2">
                    {product.nutriscore_grade && (
                      <div className="flex items-center gap-2">
                        <NutriScoreBadge
                          grade={product.nutriscore_grade}
                          size="sm"
                          productId={product.code}
                        />
                        <span className="text-sm text-sogood-text-secondary">
                          Nutri-Score
                        </span>
                      </div>
                    )}
                    {product.nova_group && (
                      <div className="flex items-center gap-2">
                        <NOVABadge
                          group={String(product.nova_group)}
                          size="sm"
                          productId={product.code}
                        />
                      </div>
                    )}
                  </div>

                  {/* Nutrition Comparée */}
                  <div className="space-y-1 border-t border-sogood-border pt-4 text-xs">
                    <div className="flex justify-between">
                      <span className="text-sogood-text-secondary">Énergie:</span>
                      <span className="font-semibold">
                        {product.energy_100g} kJ
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sogood-text-secondary">Sucres:</span>
                      <span className="font-semibold">{product.sugars_100g}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sogood-text-secondary">Graisses:</span>
                      <span className="font-semibold">{product.fat_100g}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sogood-text-secondary">Sel:</span>
                      <span className="font-semibold">{product.salt_100g}g</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-sogood-text-secondary">Additifs:</span>
                      <span className="font-semibold">{product.additives_tags}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Ajouter un produit */}
              {comparedProducts.length < 3 && (
                <button
                  onClick={() => setShowSearch(true)}
                  className="product-card flex flex-col items-center justify-center py-12 hover:bg-sogood-primary/5"
                  data-testid="add-product"
                >
                  <Plus size={40} className="mb-2 text-sogood-primary" />
                  <span className="font-semibold text-sogood-text-primary">
                    Ajouter un produit
                  </span>
                </button>
              )}
            </div>
          </>
        )}

        {/* Search Modal */}
        {showSearch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="product-card max-h-[80vh] w-full max-w-2xl overflow-y-auto">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-sogood-text">
                  Ajouter un produit
                </h2>
                <button
                  onClick={() => setShowSearch(false)}
                  className="rounded-full p-2 hover:bg-sogood-bg"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Chercher un produit..."
                    className="input-field flex-1"
                  />
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="btn-primary"
                  >
                    {isSearching ? 'Recherche...' : 'Chercher'}
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                {searchResults.length === 0 ? (
                  <p className="text-center text-sogood-text-secondary">
                    {searchQuery ? 'Aucun produit trouvé' : 'Tapez pour chercher'}
                  </p>
                ) : (
                  searchResults.map((product) => (
                    <div
                      key={product.code}
                      className="flex items-center justify-between border-b border-sogood-border p-3 hover:bg-sogood-bg"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-sogood-text">
                          {product.product_name}
                        </p>
                        <p className="text-sm text-sogood-text-secondary">
                          {product.brands}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddProduct(product)}
                        disabled={comparedProducts.some(
                          (p) => p.code === product.code
                        )}
                        className="btn-primary"
                      >
                        Ajouter
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { Package, Plus } from 'lucide-react';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../hooks/useCompare';
import { NutriScoreBadge } from './NutriScoreBadge';
import { NOVABadge } from './NOVABadge';

export function ProductCard({ product }) {
  const imageUrl = product.image_url || product.image_front_url;
  const fallbackRef = useRef(null);
  const { addProduct, comparedProducts } = useCompare();
  const isInCompare = comparedProducts.some((p) => p.code === product.code);

  const handleImageError = () => {
    if (fallbackRef.current) {
      fallbackRef.current.style.display = 'flex';
    }
  };

  const handleAddToCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addProduct(product);
  };

  return (
    <div className="product-card relative">
      <Link
        to={`/product/${product.id || product.code}`}
        className="block"
        data-testid={`product-card-${product.id || product.code}`}
      >
        {/* Image */}
        <div className="mb-4 flex h-48 items-center justify-center overflow-hidden rounded-xl bg-sogood-bg">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.product_name}
              className="h-full w-full object-contain"
              onError={handleImageError}
            />
          ) : null}
          <div
            ref={fallbackRef}
            className="hidden h-full w-full items-center justify-center"
          >
            <Package size={48} className="text-sogood-text-secondary" />
          </div>
        </div>

        {/* Product Info */}
        <h3 className="mb-1 line-clamp-2 min-h-[3rem] font-outfit font-semibold text-sogood-text-primary">
          {product.product_name}
        </h3>
        <p className="mb-3 line-clamp-1 text-sm text-sogood-text-secondary">
          {product.brands}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {product.nutriscore_grade && (
            <NutriScoreBadge
              grade={product.nutriscore_grade}
              size="sm"
              productId={product.code}
            />
          )}
          {product.nova_group && (
            <NOVABadge
              group={String(product.nova_group)}
              size="sm"
              productId={product.code}
            />
          )}
        </div>
      </Link>

      {/* Bouton Comparer */}
      <button
        onClick={handleAddToCompare}
        disabled={isInCompare || (comparedProducts.length >= 3 && !isInCompare)}
        className={`mt-3 w-full flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition ${
          isInCompare
            ? 'bg-green-100 text-green-700 cursor-not-allowed'
            : comparedProducts.length >= 3
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : 'bg-sogood-primary text-white hover:bg-sogood-primary/90 active:bg-sogood-primary'
        }`}
        title={
          isInCompare
            ? 'Déjà en comparaison'
            : comparedProducts.length >= 3
              ? 'Comparaison limitée à 3 produits'
              : 'Ajouter à la comparaison'
        }
      >
        <Plus size={16} />
        {isInCompare ? 'En comparaison' : 'Comparer'}
      </button>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    code: PropTypes.string,
    product_name: PropTypes.string.isRequired,
    brands: PropTypes.string,
    image_url: PropTypes.string,
    image_front_url: PropTypes.string,
    nutriscore_grade: PropTypes.string,
    nova_group: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
};

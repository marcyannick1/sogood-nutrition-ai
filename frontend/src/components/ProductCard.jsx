import { Package } from 'lucide-react';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { NutriScoreBadge } from './NutriScoreBadge';
import { NOVABadge } from './NOVABadge';

export function ProductCard({ product }) {
  const imageUrl = product.image_url || product.image_front_url;
  const fallbackRef = useRef(null);

  const handleImageError = () => {
    if (fallbackRef.current) {
      fallbackRef.current.style.display = 'flex';
    }
  };

  return (
    <Link
      to={`/product/${product.id || product.code}`}
      className="product-card block"
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

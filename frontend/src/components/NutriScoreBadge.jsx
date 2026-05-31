import { Package } from 'lucide-react';
import PropTypes from 'prop-types';

export function NutriScoreBadge({ grade, size = 'md', productId }) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-12 w-12 text-lg',
    lg: 'h-16 w-16 text-2xl',
  };

  const gradeUppercase = grade?.toUpperCase() || 'N/A';

  const colorMap = {
    A: 'bg-nutriscore-a',
    B: 'bg-nutriscore-b',
    C: 'bg-nutriscore-c',
    D: 'bg-nutriscore-d',
    E: 'bg-nutriscore-e',
  };

  const bgColor = colorMap[gradeUppercase] || 'bg-gray-400';

  return (
    <div
      className={`badge-nutriscore ${sizeClasses[size]} ${bgColor}`}
      data-testid={`nutriscore-badge-${productId}`}
    >
      {gradeUppercase}
    </div>
  );
}

NutriScoreBadge.propTypes = {
  grade: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  productId: PropTypes.string.isRequired,
};

import PropTypes from 'prop-types';

export function NOVABadge({ group, size = 'md', productId }) {
  const labels = {
    '1': 'Non transformé',
    '2': 'Transformé',
    '3': 'Très transformé',
    '4': 'Ultra-transformé',
  };

  const colorMap = {
    '1': 'bg-nova-1',
    '2': 'bg-nova-2',
    '3': 'bg-nova-3',
    '4': 'bg-nova-4',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const bgColor = colorMap[group] || 'bg-gray-400';
  const label = labels[group] || 'Inconnu';

  return (
    <div
      className={`badge-nova ${bgColor} ${sizeClasses[size]}`}
      data-testid={`nova-badge-${productId}`}
    >
      <span className="font-semibold">NOVA {group}</span>
      <span className="text-white/80 text-xs">• {label}</span>
    </div>
  );
}

NOVABadge.propTypes = {
  group: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  productId: PropTypes.string.isRequired,
};

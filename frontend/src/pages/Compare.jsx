import { Package, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { NutriScoreBadge } from '../components/NutriScoreBadge';
import { NOVABadge } from '../components/NOVABadge';

const DEMO_PRODUCTS = [
  {
    code: '3017620422003',
    product_name: 'Nutella',
    brands: 'Ferrero',
    image_url: 'https://images.openfoodfacts.org/images/products/301/762/042/2003/front_fr.jpg',
    nutriscore_grade: 'e',
    nova_group: 4,
    energy_100g: 2255,
    fat_100g: 30,
    sugars_100g: 56,
    salt_100g: 0.1,
    additives_tags: 5,
  },
  {
    code: '3046920088357',
    product_name: 'Oreos',
    brands: 'Mondelez',
    image_url: 'https://images.openfoodfacts.org/images/products/304/692/008/8357/front_fr.jpg',
    nutriscore_grade: 'd',
    nova_group: 4,
    energy_100g: 2100,
    fat_100g: 21,
    sugars_100g: 40,
    salt_100g: 0.6,
    additives_tags: 8,
  },
];

export function Compare() {
  const [comparedProducts, setComparedProducts] = useState(DEMO_PRODUCTS);

  const removeProduct = (code) => {
    setComparedProducts(comparedProducts.filter((p) => p.code !== code));
  };

  const addProduct = () => {
    // À implémenter avec recherche
  };

  return (
    <div className="min-h-screen bg-sogood-bg px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="section-title mb-12">Comparer les produits</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {comparedProducts.map((product) => (
            <div key={product.code} className="product-card relative">
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
              onClick={addProduct}
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
      </div>
    </div>
  );
}

import { ArrowLeft, Loader2, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NutriScoreBadge } from '../components/NutriScoreBadge';
import { NOVABadge } from '../components/NOVABadge';
import { apiService } from '../services/api';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await apiService.getProductDetail(id);
        setProduct(data);
      } catch (err) {
        setError('Produit non trouvé');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sogood-bg">
        <Loader2 className="h-8 w-8 animate-spin text-sogood-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-sogood-bg px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2 text-sogood-primary hover:text-sogood-primary-hover"
          >
            <ArrowLeft size={20} />
            Retour
          </button>
          <div className="product-card text-center py-12">
            <p className="text-sogood-text-secondary">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = product.image_url || product.image_front_url;

  return (
    <div className="min-h-screen bg-sogood-bg px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-sogood-primary hover:text-sogood-primary-hover"
        >
          <ArrowLeft size={20} />
          Retour
        </button>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Colonne gauche: Image et scores */}
          <div>
            <div className="product-card mb-6 flex h-96 items-center justify-center bg-sogood-bg">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.product_name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Package size={64} className="text-sogood-text-secondary" />
              )}
            </div>

            {/* Scores */}
            <div className="product-card space-y-6">
              {product.nutriscore_grade && (
                <div className="flex items-center gap-4">
                  <NutriScoreBadge
                    grade={product.nutriscore_grade}
                    size="lg"
                    productId={id}
                  />
                  <div>
                    <p className="text-sm text-sogood-text-secondary">Nutri-Score</p>
                    <p className="font-semibold text-sogood-text-primary">
                      Score {product.nutriscore_grade.toUpperCase()}
                    </p>
                  </div>
                </div>
              )}

              {product.nova_group && (
                <div className="flex items-center gap-4">
                  <NOVABadge
                    group={String(product.nova_group)}
                    size="md"
                    productId={id}
                  />
                  <div>
                    <p className="text-sm text-sogood-text-secondary">Groupe NOVA</p>
                  </div>
                </div>
              )}

              <button className="btn-primary w-full">
                Ajouter à la comparaison
              </button>
            </div>
          </div>

          {/* Colonne droite: Informations */}
          <div>
            <div className="product-card mb-6">
              <h1 className="font-outfit text-3xl font-bold text-sogood-text-primary mb-2">
                {product.product_name}
              </h1>
              <p className="text-lg text-sogood-text-secondary mb-4">
                {product.brands}
              </p>
              <p className="text-sm text-sogood-text-secondary">
                {product.categories && (
                  <>Catégorie: {product.categories}</>
                )}
              </p>
            </div>

            {/* Accordéons pour les infos */}
            <div className="space-y-4">
              {/* Ingrédients */}
              <div className="product-card">
                <h3 className="font-semibold text-sogood-text-primary mb-2">
                  Ingrédients
                </h3>
                <p className="text-sm text-sogood-text-secondary">
                  {product.ingredients_text || 'Non disponible'}
                </p>
              </div>

              {/* Valeurs nutritionnelles */}
              {(product.fat ||
                product.sugars ||
                product.salt) && (
                <div className="product-card">
                  <h3 className="font-semibold text-sogood-text-primary mb-4">
                    Valeurs nutritionnelles (pour 100g)
                  </h3>
                  <div className="space-y-2 text-sm">
                    {product.fat && (
                      <div className="flex justify-between">
                        <span className="text-sogood-text-secondary">
                          Graisses:
                        </span>
                        <span className="font-semibold">{product.fat}g</span>
                      </div>
                    )}
                    {product.sugars && (
                      <div className="flex justify-between">
                        <span className="text-sogood-text-secondary">Sucres:</span>
                        <span className="font-semibold">
                          {product.sugars}g
                        </span>
                      </div>
                    )}
                    {product.salt && (
                      <div className="flex justify-between">
                        <span className="text-sogood-text-secondary">Sel:</span>
                        <span className="font-semibold">{product.salt}g</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additifs */}
              {product.additives_count !== undefined && (
                <div className="product-card">
                  <h3 className="font-semibold text-sogood-text-primary mb-2">
                    Additifs
                  </h3>
                  <p className="text-sm text-sogood-text-secondary">
                    {product.additives_count} additif{product.additives_count > 1 ? 's' : ''} détecté{product.additives_count > 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

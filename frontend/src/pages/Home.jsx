import { LayoutGrid, Package, Salad, Beef, Fish, Leaf, Droplet, Cookie } from 'lucide-react';
import { useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { apiService } from '../services/api';

const categories = [
  { name: 'Fruits', icon: Leaf, tag: 'fruits' },
  { name: 'Produits laitiers', icon: Package, tag: 'dairy' },
  { name: 'Biscuits', icon: Cookie, tag: 'snacks' },
  { name: 'Viandes', icon: Beef, tag: 'meat' },
  { name: 'Salades', icon: Salad, tag: 'salads' },
  { name: 'Plats préparés', icon: LayoutGrid, tag: 'prepared' },
  { name: 'Boissons', icon: Droplet, tag: 'beverages' },
  { name: 'Poissons', icon: Fish, tag: 'fish' },
];

const features = [
  {
    title: 'Nutri-Score',
    description: 'Découvrez la qualité nutritionnelle de chaque produit en un coup d\'œil.',
    icon: '📊',
  },
  {
    title: 'NOVA',
    description: 'Analysez le niveau de transformation des aliments.',
    icon: '🔍',
  },
  {
    title: 'Additifs',
    description: 'Identifiez tous les additifs présents dans vos produits.',
    icon: '⚗️',
  },
];

export function Home() {
  useEffect(() => {
    // Charger les produits en vedette
    const loadFeatured = async () => {
      try {
        // Récupérer quelques produits populaires
        await apiService.searchProducts('nutella', { pageSize: 4 });
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    loadFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-sogood-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sogood-primary/10 to-sogood-accent/10 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="section-title mb-4 text-4xl md:text-5xl">
              Analyse Nutritionnelle Intelligente
            </h1>
            <p className="section-subtitle mb-8">
              Scannez, analysez et comparez les produits alimentaires pour faire des choix plus sains.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <SearchBar large />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="section-title mb-12">Explorez par catégorie</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.tag}
                  className="product-card flex flex-col items-center justify-center py-8 text-center cursor-pointer hover:bg-sogood-primary/5"
                  data-testid={`category-${cat.tag}`}
                >
                  <Icon className="mb-3 h-8 w-8 text-sogood-primary" />
                  <h3 className="font-manrope font-semibold text-sogood-text-primary">{cat.name}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white px-6 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="section-title mb-12 text-center">Nos fonctionnalités</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="product-card flex flex-col items-center text-center"
                data-testid={`feature-${feature.title.toLowerCase()}`}
              >
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h3 className="mb-2 font-outfit font-semibold text-sogood-text-primary">
                  {feature.title}
                </h3>
                <p className="text-sogood-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-sogood-primary px-6 py-16 text-center md:py-24">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 font-outfit text-3xl font-bold text-white md:text-4xl">
            Prêt à faire de meilleurs choix ?
          </h2>
          <p className="mb-8 text-white/90">
            Rejoignez des milliers d'utilisateurs qui analysent leurs produits alimentaires.
          </p>
          <button className="btn-primary !bg-white !text-sogood-primary hover:!bg-sogood-bg">
            Commencer maintenant
          </button>
        </div>
      </section>
    </div>
  );
}

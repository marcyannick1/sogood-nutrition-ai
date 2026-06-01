import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { apiService } from '../services/api';

export function NutriScorePrediction() {
  const [formData, setFormData] = useState({
    fat: '',
    sugars: '',
    salt: '',
    additives_count: '',
    nova_group: '1'
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      // Validation
      if (!formData.fat || !formData.sugars || !formData.salt || !formData.nova_group) {
        throw new Error('Tous les champs sont obligatoires');
      }

      const response = await apiService.predictNutriScore({
        fat: parseFloat(formData.fat),
        sugars: parseFloat(formData.sugars),
        salt: parseFloat(formData.salt),
        additives_count: formData.additives_count ? parseInt(formData.additives_count) : 0,
        nova_group: formData.nova_group
      });

      setPrediction(response.prediction);
    } catch (err) {
      setError(err.message || 'Erreur lors de la prédiction');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fat: '',
      sugars: '',
      salt: '',
      additives_count: '',
      nova_group: '1'
    });
    setPrediction(null);
    setError(null);
  };

  const getNutriScoreColor = (grade) => {
    switch (grade) {
      case 'A':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'B':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'C':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'D':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'E':
        return 'bg-red-200 text-red-900 border-red-400';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-sogood-bg px-6 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="product-card">
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-sogood-primary" />
            <h1 className="text-3xl font-bold text-sogood-text">
              Prédicteur Nutri-Score
            </h1>
          </div>

          <p className="mb-8 text-sogood-text-secondary">
            Prédisez le Nutri-Score d'un produit en fonction de ses valeurs nutritionnelles
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lipides */}
              <div>
                <label htmlFor="fat" className="block text-sm font-medium text-sogood-text mb-2">
                  Lipides (g pour 100g) *
                </label>
                <input
                  id="fat"
                  type="number"
                  name="fat"
                  step="0.1"
                  min="0"
                  value={formData.fat}
                  onChange={handleChange}
                  placeholder="Ex: 5.2"
                  className="input-field w-full"
                  required
                />
                <p className="text-xs text-sogood-text-secondary mt-1">
                  Entre 0 et 100g
                </p>
              </div>

              {/* Sucres */}
              <div>
                <label htmlFor="sugars" className="block text-sm font-medium text-sogood-text mb-2">
                  Sucres (g pour 100g) *
                </label>
                <input
                  id="sugars"
                  type="number"
                  name="sugars"
                  step="0.1"
                  min="0"
                  value={formData.sugars}
                  onChange={handleChange}
                  placeholder="Ex: 10.5"
                  className="input-field w-full"
                  required
                />
                <p className="text-xs text-sogood-text-secondary mt-1">
                  Entre 0 et 100g
                </p>
              </div>

              {/* Sel */}
              <div>
                <label htmlFor="salt" className="block text-sm font-medium text-sogood-text mb-2">
                  Sel (g pour 100g) *
                </label>
                <input
                  id="salt"
                  type="number"
                  name="salt"
                  step="0.01"
                  min="0"
                  value={formData.salt}
                  onChange={handleChange}
                  placeholder="Ex: 0.5"
                  className="input-field w-full"
                  required
                />
                <p className="text-xs text-sogood-text-secondary mt-1">
                  Entre 0 et 10g
                </p>
              </div>

              {/* Additifs */}
              <div>
                <label htmlFor="additives_count" className="block text-sm font-medium text-sogood-text mb-2">
                  Nombre d'additifs
                </label>
                <input
                  id="additives_count"
                  type="number"
                  name="additives_count"
                  min="0"
                  max="50"
                  value={formData.additives_count}
                  onChange={handleChange}
                  placeholder="Ex: 3"
                  className="input-field w-full"
                />
                <p className="text-xs text-sogood-text-secondary mt-1">
                  Nombre total d'additifs
                </p>
              </div>

              {/* NOVA Group */}
              <div className="md:col-span-2">
                <label htmlFor="nova_group" className="block text-sm font-medium text-sogood-text mb-2">
                  Groupe NOVA *
                </label>
                <select
                  id="nova_group"
                  name="nova_group"
                  value={formData.nova_group}
                  onChange={handleChange}
                  className="input-field w-full"
                  required
                >
                  <option value="1">NOVA 1 - Aliments non transformés ou minimalement transformés</option>
                  <option value="2">NOVA 2 - Ingrédients culinaires transformés</option>
                  <option value="3">NOVA 3 - Aliments transformés</option>
                  <option value="4">NOVA 4 - Produits ultra-transformés</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Prédiction en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Prédire
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="btn-secondary"
              >
                Réinitialiser
              </button>
            </div>
          </form>

          {/* Prediction Result */}
          {prediction && (
            <div className="p-6 bg-sogood-bg border-2 border-sogood-primary rounded-lg">
              <h2 className="text-lg font-semibold text-sogood-text mb-4">
                Résultat de la prédiction
              </h2>
              <div className={`inline-block px-8 py-4 rounded-lg border-2 font-bold text-3xl ${getNutriScoreColor(prediction)}`}>
                {prediction}
              </div>
              <p className="mt-4 text-sogood-text-secondary">
                {prediction === 'A' && "Excellent pour la santé ! 🎉"}
                {prediction === 'B' && "Bon choix nutritionnel 👍"}
                {prediction === 'C' && "Acceptable, mais à consommer avec modération ⚠️"}
                {prediction === 'D' && "À limiter pour une meilleure santé ⚠️"}
                {prediction === 'E' && "À éviter autant que possible ❌"}
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Info:</strong> Cette prédiction utilise un algorithme simplifié basé sur les critères publics du Nutri-Score.
              Les résultats sont à titre indicatif.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

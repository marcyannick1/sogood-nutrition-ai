import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { apiService } from '../services/api';

const NUTRISCORE_COLORS = {
  A: '#038141',
  B: '#85BB2F',
  C: '#FECB02',
  D: '#EE8100',
  E: '#E63E11',
};

const NOVA_COLORS = {
  1: '#00A05A',
  2: '#FFC800',
  3: '#FF8200',
  4: '#FF0000',
};

export function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nutriscoreData, setNutriscoreData] = useState([]);
  const [novaData, setNovaData] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await apiService.getStats();
        setStats(data);

        // Données factices pour démonstration
        setNutriscoreData([
          { grade: 'A', count: 12 },
          { grade: 'B', count: 28 },
          { grade: 'C', count: 35 },
          { grade: 'D', count: 18 },
          { grade: 'E', count: 7 },
        ]);

        setNovaData([
          { name: 'NOVA 1', value: 15 },
          { name: 'NOVA 2', value: 30 },
          { name: 'NOVA 3', value: 35 },
          { name: 'NOVA 4', value: 20 },
        ]);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sogood-bg">
        <Loader2 className="h-8 w-8 animate-spin text-sogood-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sogood-bg px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="section-title mb-12">Tableau de bord</h1>

        {/* Stats Cards */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <div className="product-card">
            <h3 className="mb-2 text-sm text-sogood-text-secondary">
              Total des analyses
            </h3>
            <p className="text-4xl font-bold text-sogood-primary">
              {stats?.total_scans || 0}
            </p>
          </div>
          <div className="product-card">
            <h3 className="mb-2 text-sm text-sogood-text-secondary">
              Meilleur Nutri-Score
            </h3>
            <p className="text-4xl font-bold text-sogood-accent">
              {stats?.best_nutriscore || 'A'}
            </p>
          </div>
          <div className="product-card">
            <h3 className="mb-2 text-sm text-sogood-text-secondary">
              Marques analysées
            </h3>
            <p className="text-4xl font-bold text-sogood-primary">
              {stats?.brands_count || 0}
            </p>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid gap-8 lg:grid-cols-2 mb-12">
          {/* Bar Chart - Nutri-Score */}
          <div className="product-card">
            <h2 className="mb-6 font-outfit text-xl font-semibold text-sogood-text-primary">
              Distribution des Nutri-Scores
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={nutriscoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8E4" />
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#2E7D32">
                  {nutriscoreData.map((entry) => (
                    <Cell key={entry.grade} fill={NUTRISCORE_COLORS[entry.grade]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - NOVA */}
          <div className="product-card">
            <h2 className="mb-6 font-outfit text-xl font-semibold text-sogood-text-primary">
              Distribution des groupes NOVA
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={novaData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {novaData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={NOVA_COLORS[index + 1] || '#cccccc'}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Marques */}
        <div className="product-card">
          <h2 className="mb-6 font-outfit text-xl font-semibold text-sogood-text-primary">
            Top 10 Marques analysées
          </h2>
          <div className="space-y-3">
            {[
              { name: 'Nestlé', count: 45 },
              { name: 'Danone', count: 38 },
              { name: 'PepsiCo', count: 35 },
              { name: 'Coca-Cola', count: 32 },
              { name: 'Mondelez', count: 28 },
              { name: 'Ferrero', count: 25 },
              { name: 'Unilever', count: 22 },
              { name: 'Lactalis', count: 20 },
              { name: 'Fonterra', count: 18 },
              { name: 'General Mills', count: 15 },
            ].map((brand) => (
              <div
                key={brand.name}
                className="flex items-center justify-between border-b border-sogood-border pb-3 last:border-b-0"
              >
                <span className="font-medium text-sogood-text-primary">
                  {brand.name}
                </span>
                <span className="rounded-full bg-sogood-accent px-3 py-1 text-sm font-semibold text-white">
                  {brand.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

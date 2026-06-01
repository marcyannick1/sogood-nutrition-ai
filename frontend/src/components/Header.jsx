import { BarChart3, GitCompare, Leaf, Search, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const location = useLocation();

  const navItems = [
    { icon: Search, label: 'Rechercher', to: '/' },
    { icon: BarChart3, label: 'Dashboard', to: '/dashboard' },
    { icon: GitCompare, label: 'Comparer', to: '/compare' },
    { icon: Sparkles, label: 'Prédiction', to: '/prediction' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="glass-header sticky top-0 z-50 border-b border-sogood-border">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" data-testid="logo">
          <Leaf className="h-6 w-6 text-sogood-primary" />
          <span className="font-outfit text-2xl font-bold text-sogood-primary">
            SoGood
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2" data-testid="navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`nav-pill ${active ? 'nav-pill-active' : 'nav-pill-inactive'}`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <Icon size={20} />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

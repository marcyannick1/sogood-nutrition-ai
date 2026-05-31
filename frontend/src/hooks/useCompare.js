import { useState, useEffect } from 'react';

// Hook personnalisé pour gérer la liste de comparaison
export function useCompare() {
  const [comparedProducts, setComparedProducts] = useState([]);

  // Charger depuis localStorage
  useEffect(() => {
    const stored = localStorage.getItem('sogood_compared');
    if (stored) {
      setComparedProducts(JSON.parse(stored));
    }
  }, []);

  // Sauvegarder dans localStorage
  useEffect(() => {
    localStorage.setItem('sogood_compared', JSON.stringify(comparedProducts));
  }, [comparedProducts]);

  const addProduct = (product) => {
    if (comparedProducts.length < 3 && !comparedProducts.find((p) => p.code === product.code)) {
      setComparedProducts([...comparedProducts, product]);
    }
  };

  const removeProduct = (code) => {
    setComparedProducts(comparedProducts.filter((p) => p.code !== code));
  };

  const clearCompare = () => {
    setComparedProducts([]);
  };

  return {
    comparedProducts,
    addProduct,
    removeProduct,
    clearCompare,
  };
}

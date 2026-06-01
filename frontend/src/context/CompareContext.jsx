import { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [comparedProducts, setComparedProducts] = useState([]);

  // Charger depuis localStorage au montage
  useEffect(() => {
    const stored = localStorage.getItem('sogood_compared');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log('📥 Produits chargés du localStorage:', parsed.length);
        setComparedProducts(parsed);
      } catch (error) {
        console.error('Erreur chargement comparaison:', error);
      }
    }
  }, []);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    console.log('💾 Sauvegarde localStorage:', comparedProducts.length, 'produits');
    localStorage.setItem('sogood_compared', JSON.stringify(comparedProducts));
  }, [comparedProducts]);

  const addProduct = (product) => {
    if (!product || !product.code) {
      console.error('⚠️ Produit invalide:', product);
      return;
    }
    
    setComparedProducts((prevProducts) => {
      const isAlreadyAdded = prevProducts.some((p) => p.code === product.code);
      
      if (prevProducts.length >= 3) {
        console.log('❌ Limite de 3 produits atteinte');
        return prevProducts;
      }
      
      if (isAlreadyAdded) {
        console.log('❌ Produit déjà dans la comparaison');
        return prevProducts;
      }
      
      console.log('✅ Ajout du produit:', product.product_name, 'Code:', product.code);
      const newProducts = [...prevProducts, product];
      console.log('📊 Total produits après ajout:', newProducts.length);
      return newProducts;
    });
  };

  const removeProduct = (code) => {
    setComparedProducts((prevProducts) =>
      prevProducts.filter((p) => p.code !== code)
    );
  };

  const clearCompare = () => {
    setComparedProducts([]);
  };

  const value = {
    comparedProducts,
    addProduct,
    removeProduct,
    clearCompare,
  };

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare doit être utilisé dans CompareProvider');
  }
  return context;
}

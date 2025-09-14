import React, { useState } from 'react';
import ProductList from './ProductList';
import ShoppingCart from './ShoppingCart';
import Button from './Button';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'products' | 'cart'>('products');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Shopping Store</h1>
            <div className="flex space-x-4">
              <Button
                variant={currentView === 'products' ? 'primary' : 'secondary'}
                onClick={() => setCurrentView('products')}
              >
                Products
              </Button>
              <Button
                variant={currentView === 'cart' ? 'primary' : 'secondary'}
                onClick={() => setCurrentView('cart')}
              >
                Cart
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {currentView === 'products' ? (
          <ProductList onAddToCart={() => setCurrentView('cart')} />
        ) : (
          <ShoppingCart />
        )}
      </main>
    </div>
  );
};

export default App;

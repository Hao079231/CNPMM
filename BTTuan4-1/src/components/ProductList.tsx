import React, { useState } from 'react';
import { CartItem } from '../types';
import { useCart } from '../hooks/useCart';
import Button from './Button';
import Card from './Card';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

interface ProductListProps {
  className?: string;
  onAddToCart?: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ className = '', onAddToCart }) => {
  const { addItem } = useCart();
  const [addedProduct, setAddedProduct] = useState<string | null>(null);

  // Danh sách sản phẩm mẫu
  const products: Product[] = [
    {
      id: '1',
      name: 'iPhone 15 Pro',
      price: 999,
      description: 'Latest iPhone with A17 Pro chip and titanium design',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
      category: 'Electronics'
    },
    {
      id: '2',
      name: 'MacBook Air M2',
      price: 1199,
      description: 'Ultra-thin laptop with M2 chip and all-day battery',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
      category: 'Electronics'
    },
    {
      id: '3',
      name: 'AirPods Pro',
      price: 249,
      description: 'Active noise cancellation and spatial audio',
      image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=300&fit=crop',
      category: 'Electronics'
    },
    {
      id: '4',
      name: 'Nike Air Max 270',
      price: 150,
      description: 'Comfortable running shoes with Max Air cushioning',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
      category: 'Fashion'
    },
    {
      id: '5',
      name: 'Coffee Maker',
      price: 89,
      description: 'Programmable coffee maker with 12-cup capacity',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop',
      category: 'Home'
    },
    {
      id: '6',
      name: 'Wireless Mouse',
      price: 29,
      description: 'Ergonomic wireless mouse with precision tracking',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
      category: 'Electronics'
    }
  ];

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
    });
    
    // Hiển thị thông báo đã thêm
    setAddedProduct(product.name);
    setTimeout(() => setAddedProduct(null), 2000);
    
    // Chuyển sang tab Cart sau khi thêm sản phẩm
    if (onAddToCart) {
      onAddToCart();
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Electronics: 'bg-blue-100 text-blue-800',
      Fashion: 'bg-pink-100 text-pink-800',
      Home: 'bg-green-100 text-green-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`max-w-6xl mx-auto p-6 ${className}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
        <p className="text-gray-600">Discover amazing products and add them to your cart</p>
      </div>

      {/* Thông báo đã thêm sản phẩm */}
      {addedProduct && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          ✅ "{addedProduct}" đã được thêm vào giỏ hàng!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 left-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(product.category)}`}>
                  {product.category}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">
                  ${product.price}
                </span>
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductList;

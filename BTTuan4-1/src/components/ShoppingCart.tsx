import React, { useState } from 'react';
import { CartItem } from '../types';
import { useCart } from '../hooks/useCart';
import CartItemCard from './CartItemCard';
import Button from './Button';
import Modal from './Modal';
import Input from './Input';

interface ShoppingCartProps {
  className?: string;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ className = '' }) => {
  const { items, addItem, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
  });

  const handleAddItem = () => {
    if (newItem.name && newItem.price) {
      addItem({
        id: Date.now().toString(),
        name: newItem.name,
        price: parseFloat(newItem.price),
        description: newItem.description || undefined,
        image: newItem.image || undefined,
      });
      
      setNewItem({ name: '', price: '', description: '', image: '' });
      setIsModalOpen(false);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Shopping Cart ({getTotalItems()})
        </h1>
        <div className="space-x-2">
          <Button onClick={() => setIsModalOpen(true)}>
            Add Item
          </Button>
          <Button variant="secondary" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Your cart is empty</p>
          <Button className="mt-4" onClick={() => setIsModalOpen(true)}>
            Add your first item
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold">Total: ${getTotalPrice().toFixed(2)}</span>
            <Button size="large" className="bg-green-600 hover:bg-green-700">
              Checkout
            </Button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Item"
      >
        <div className="space-y-4">
          <Input
            label="Item Name"
            value={newItem.name}
            onChange={(value) => setNewItem({ ...newItem, name: value })}
            placeholder="Enter item name"
          />
          
          <Input
            label="Price"
            type="number"
            value={newItem.price}
            onChange={(value) => setNewItem({ ...newItem, price: value })}
            placeholder="Enter price"
          />
          
          <Input
            label="Description (Optional)"
            value={newItem.description}
            onChange={(value) => setNewItem({ ...newItem, description: value })}
            placeholder="Enter description"
          />
          
          <Input
            label="Image URL (Optional)"
            value={newItem.image}
            onChange={(value) => setNewItem({ ...newItem, image: value })}
            placeholder="Enter image URL"
          />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem}>
              Add Item
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ShoppingCart;

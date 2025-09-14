import React from 'react';
import { CartItemCardProps } from '../types';
import Button from './Button';
import Card from './Card';

const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  className = '',
}) => {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemove(item.id);
    } else {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center space-x-4">
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
        )}
        
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
          {item.description && (
            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
          )}
          <p className="text-lg font-semibold text-blue-600 mt-2">
            ${item.price.toFixed(2)}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size="small"
            variant="secondary"
            onClick={() => handleQuantityChange(item.quantity - 1)}
          >
            -
          </Button>
          
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          
          <Button
            size="small"
            variant="secondary"
            onClick={() => handleQuantityChange(item.quantity + 1)}
          >
            +
          </Button>
          
          <Button
            size="small"
            variant="danger"
            onClick={() => onRemove(item.id)}
          >
            Remove
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CartItemCard;

import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex items-center space-x-4 py-4 border-b border-dark-200">
      {/* Item Image */}
      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
      ) : (
        <div className="w-20 h-20 bg-dark-200 rounded-lg flex items-center justify-center text-2xl">
          🍽️
        </div>
      )}

      {/* Item Details */}
      <div className="flex-1">
        <h3 className="font-medium text-dark-900">{item.name}</h3>
        <p className="text-sm text-dark-600">{formatCurrency(item.price)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="p-1 rounded-full bg-dark-100 hover:bg-dark-200 transition-colors"
        >
          <Minus className="h-4 w-4 text-dark-600" />
        </button>
        
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="p-1 rounded-full bg-dark-100 hover:bg-dark-200 transition-colors"
        >
          <Plus className="h-4 w-4 text-dark-600" />
        </button>
      </div>

      {/* Total Price */}
      <div className="w-24 text-right">
        <p className="font-semibold text-dark-900">
          {formatCurrency(item.price * item.quantity)}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id)}
        className="p-2 text-error hover:bg-error-50 rounded-lg transition-colors"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
};

export default CartItem;

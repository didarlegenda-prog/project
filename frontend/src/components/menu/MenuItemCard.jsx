import { Plus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';

const MenuItemCard = ({ item, onAddToCart }) => {
  return (
    <div className="bg-white border border-dark-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex">
        {/* Item Details */}
        <div className="flex-1 p-4">
          <h3 className="font-semibold text-dark-900 mb-1">{item.name}</h3>
          
          {item.description && (
            <p className="text-sm text-dark-600 mb-2 line-clamp-2">
              {item.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-primary">
              {formatCurrency(item.price)}
            </p>

            {item.is_available ? (
              <Button
                size="sm"
                variant="primary"
                onClick={() => onAddToCart(item)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add to Cart
              </Button>
            ) : (
              <span className="text-sm text-error font-medium">
                Unavailable
              </span>
            )}
          </div>

          {/* Tags */}
          {(item.is_vegetarian || item.is_vegan || item.is_spicy) && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.is_vegetarian && (
                <span className="text-xs px-2 py-1 bg-success-100 text-success-800 rounded">
                  🌱 Vegetarian
                </span>
              )}
              {item.is_vegan && (
                <span className="text-xs px-2 py-1 bg-success-100 text-success-800 rounded">
                  🌿 Vegan
                </span>
              )}
              {item.is_spicy && (
                <span className="text-xs px-2 py-1 bg-error-100 text-error-800 rounded">
                  🌶️ Spicy
                </span>
              )}
            </div>
          )}
        </div>

        {/* Item Image */}
        {item.image && (
          <div className="w-32 h-32 flex-shrink-0">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;

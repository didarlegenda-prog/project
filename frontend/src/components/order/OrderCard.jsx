import { formatCurrency, formatDateTime, formatOrderStatus } from '../../utils/formatters';
import Badge from '../common/Badge';
import { STATUS_COLORS } from '../../utils/constants';
import { Clock, MapPin } from 'lucide-react';

const OrderCard = ({ order, onClick }) => {
  return (
    <div
      onClick={() => onClick?.(order)}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">
            Order #{order.id || order.order_number}
          </h3>
          <p className="text-sm text-gray-600">
            {formatDateTime(order.created_at)}
          </p>
        </div>
        <Badge variant={STATUS_COLORS[order.status]}>
          {formatOrderStatus(order.status)}
        </Badge>
      </div>

      {/* Restaurant */}
      {order.restaurant && (
        <div className="flex items-center mb-2">
          <span className="text-2xl mr-2">🍽️</span>
          <span className="font-medium text-gray-900">
            {order.restaurant.name || order.restaurant_name}
          </span>
        </div>
      )}

      {/* Items Count */}
      <p className="text-sm text-gray-600 mb-2">
        {order.items?.length || order.total_items} items
      </p>

      {/* Order Type and Address */}
      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{order.order_type}</span>
        </div>
        
        {order.delivery_address && (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate">{order.delivery_address.street}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <span className="text-gray-600">Total</span>
        <span className="text-lg font-semibold text-primary">
          {formatCurrency(order.total_amount || order.total)}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;

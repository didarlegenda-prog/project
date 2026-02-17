import { Link } from 'react-router-dom';
import { Star, Clock, DollarSign } from 'lucide-react';
import { formatCurrency, formatRating } from '../../utils/formatters';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link
      to={`/restaurants/${restaurant.slug}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-dark-200"
    >
      {/* Image */}
      <div className="relative h-48 bg-dark-200">
        {restaurant.logo ? (
          <img
            src={restaurant.logo}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-dark-400 text-4xl">
            🍽️
          </div>
        )}
        
        {/* Status Badge */}
        {!restaurant.is_open_now && (
          <div className="absolute top-2 right-2 px-3 py-1.5 bg-error text-white text-sm font-bold rounded-full shadow-lg">
            Closed
          </div>
        )}
        
        {restaurant.is_open_now && (
          <div className="absolute top-2 right-2 px-3 py-1.5 bg-success-600 text-white text-sm font-bold rounded-full shadow-lg">
            Open
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-dark-900 mb-1">
          {restaurant.name}
        </h3>
        
        <p className="text-sm text-dark-600 mb-3">
          {restaurant.cuisine_type || 'Various cuisines'}
        </p>

        {/* Rating, Time, Price */}
        <div className="flex items-center space-x-4 text-sm text-dark-700">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-warning-500 fill-warning-500 mr-1" />
            <span className="font-semibold">{formatRating(restaurant.average_rating || 0)}</span>
          </div>
          
          {restaurant.estimated_delivery_time && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-dark-600" />
              <span className="font-medium">{restaurant.estimated_delivery_time} min</span>
            </div>
          )}
          
          {restaurant.delivery_fee !== undefined && (
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-success-600" />
              <span className="font-medium">
                {restaurant.delivery_fee === 0 
                  ? 'Free' 
                  : formatCurrency(restaurant.delivery_fee)}
              </span>
            </div>
          )}
        </div>

        {/* Min Order */}
        {restaurant.minimum_order && (
          <p className="text-xs text-dark-600 mt-2 font-medium">
            Min. order: {formatCurrency(restaurant.minimum_order)}
          </p>
        )}
      </div>
    </Link>
  );
};

export default RestaurantCard;

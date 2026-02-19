import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { restaurantsAPI } from '../api/restaurants';
import { menuAPI } from '../api/menu';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/common/Loading';
import MenuItemCard from '../components/menu/MenuItemCard';
import Button from '../components/common/Button';
import { Clock, DollarSign, MapPin, Phone, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

const RestaurantPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const { data: restaurant, isLoading: loadingRestaurant } = useQuery({
    queryKey: ['restaurant', slug],
    queryFn: () => restaurantsAPI.getBySlug(slug),
  });

  const { data: itemsData } = useQuery({
    queryKey: ['menu-items', restaurant?.id],
    queryFn: () => menuAPI.getItems(restaurant.id),
    enabled: !!restaurant?.id,
  });

  const menuItems = itemsData?.results || itemsData || [];

  const handleAddToCart = (item) => {
    addToCart(item, {
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      delivery_fee: restaurant.delivery_fee,
    });
  };

  const handleReservation = () => {
    if (!isAuthenticated) {
      toast.error('Please login to make a reservation');
      navigate('/login');
      return;
    }
    navigate('/reservations');
  };

  if (loadingRestaurant) {
    return <Loading fullScreen />;
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark-900 mb-2">Restaurant not found</h2>
          <p className="text-dark-600">The restaurant you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-50">
      {/* Restaurant Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start space-x-6">
            {/* Logo */}
            <div className="w-32 h-32 flex-shrink-0 bg-dark-200 rounded-lg overflow-hidden">
              {restaurant.logo ? (
                <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-4xl">🍽️</div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-dark-900">{restaurant.name}</h1>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  restaurant.is_open_now
                    ? 'bg-success-100 text-success-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {restaurant.is_open_now ? 'Open Now' : 'Closed'}
                </span>
              </div>
              <p className="text-dark-600 mb-4">{restaurant.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm">
                {restaurant.cuisine_type && (
                  <span className="px-3 py-1 bg-dark-100 text-dark-700 rounded-full">
                    {restaurant.cuisine_type}
                  </span>
                )}
                
                {restaurant.estimated_delivery_time && (
                  <div className="flex items-center text-dark-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{restaurant.estimated_delivery_time} min</span>
                  </div>
                )}
                
                <div className="flex items-center text-dark-600">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span>{restaurant.delivery_fee === 0 ? 'Free delivery' : `${formatCurrency(restaurant.delivery_fee)} delivery`}</span>
                </div>
              </div>

              {restaurant.address && (
                <div className="flex items-center text-dark-600 mt-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{restaurant.address}</span>
                </div>
              )}
              
              {restaurant.phone && (
                <div className="flex items-center text-dark-600 mt-2">
                  <Phone className="h-4 w-4 mr-1" />
                  <span>{restaurant.phone}</span>
                </div>
              )}

              {/* Reserve Table Button */}
              <div className="mt-4">
                <Button 
                  variant="primary"
                  onClick={handleReservation}
                  className="w-full sm:w-auto font-bold shadow-lg"
                  size="lg"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Reserve Table
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-dark-900 mb-6">Menu</h2>
        
        {menuItems.length === 0 ? (
          <p className="text-dark-600 text-center py-8">No menu items available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {menuItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantPage;

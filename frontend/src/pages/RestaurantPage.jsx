import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { restaurantsAPI } from '../api/restaurants';
import { menuAPI } from '../api/menu';
import { reviewsAPI } from '../api/reviews';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/common/Loading';
import MenuCategoryTabs from '../components/menu/MenuCategoryTabs';
import MenuItemCard from '../components/menu/MenuItemCard';
import ReviewCard from '../components/review/ReviewCard';
import ReviewForm from '../components/review/ReviewForm';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { Star, Clock, DollarSign, MapPin, Phone } from 'lucide-react';
import { formatCurrency, formatRating } from '../utils/formatters';

const RestaurantPage = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const { data: restaurant, isLoading: loadingRestaurant } = useQuery({
    queryKey: ['restaurant', slug],
    queryFn: () => restaurantsAPI.getBySlug(slug),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories', restaurant?.id],
    queryFn: () => menuAPI.getCategories(restaurant.id),
    enabled: !!restaurant?.id,
  });

  const { data: itemsData } = useQuery({
    queryKey: ['menu-items', restaurant?.id, activeCategory],
    queryFn: () => menuAPI.getItems(restaurant.id, activeCategory),
    enabled: !!restaurant?.id,
  });

  const { data: reviewsData, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', restaurant?.id],
    queryFn: () => reviewsAPI.getByRestaurant(restaurant.id, { page_size: 10 }),
    enabled: !!restaurant?.id,
  });

  const categories = categoriesData?.results || categoriesData || [];
  const menuItems = itemsData?.results || itemsData || [];
  const reviews = reviewsData?.results || reviewsData || [];

  const handleAddToCart = (item) => {
    addToCart(item, {
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      delivery_fee: restaurant.delivery_fee,
    });
  };

  if (loadingRestaurant) {
    return <Loading fullScreen />;
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Restaurant not found</h2>
          <p className="text-gray-600">The restaurant you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start space-x-6">
            {/* Logo */}
            <div className="w-32 h-32 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
              {restaurant.logo ? (
                <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-4xl">🍽️</div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
              <p className="text-gray-600 mb-4">{restaurant.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium">{formatRating(restaurant.average_rating || 0)}</span>
                  <span className="ml-1">({restaurant.total_reviews || 0} reviews)</span>
                </div>
                
                {restaurant.cuisine_type && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                    {restaurant.cuisine_type}
                  </span>
                )}
                
                {restaurant.estimated_delivery_time && (
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{restaurant.estimated_delivery_time} min</span>
                  </div>
                )}
                
                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span>{restaurant.delivery_fee === 0 ? 'Free delivery' : `${formatCurrency(restaurant.delivery_fee)} delivery`}</span>
                </div>
              </div>

              {restaurant.address && (
                <div className="flex items-center text-gray-600 mt-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{restaurant.address}</span>
                </div>
              )}
              
              {restaurant.phone && (
                <div className="flex items-center text-gray-600 mt-2">
                  <Phone className="h-4 w-4 mr-1" />
                  <span>{restaurant.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      {categories.length > 0 && (
        <MenuCategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      )}

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu</h2>
        
        {menuItems.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No menu items available</p>
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

        {/* Reviews Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
            {isAuthenticated && (
              <Button onClick={() => setShowReviewModal(true)}>
                Write a Review
              </Button>
            )}
          </div>

          {reviews.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Write a Review"
      >
        <ReviewForm
          restaurantId={restaurant.id}
          onSuccess={() => {
            setShowReviewModal(false);
            refetchReviews();
          }}
        />
      </Modal>
    </div>
  );
};

export default RestaurantPage;

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { restaurantsAPI } from '../api/restaurants';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import { Search } from 'lucide-react';

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const { data, isLoading, error } = useQuery({
    queryKey: ['restaurants', searchQuery],
    queryFn: () => restaurantsAPI.getAll({
      search: searchQuery,
    }),
  });

  const restaurants = data?.results || data || [];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    setSearchParams(params);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-dark-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Hungry? Order food now!</h1>
          <p className="text-xl mb-8">
            Discover the best restaurants in your area
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for restaurants..."
                className="w-full pl-12 pr-4 py-4 rounded-lg text-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-dark-400" />
            </div>
          </form>
        </div>
      </div>

      {/* Filters and Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Clear Search */}
        {searchQuery && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-dark-700">
                Showing results for: <span className="font-semibold">"{searchQuery}"</span>
              </p>
              <button
                onClick={clearSearch}
                className="text-sm text-primary hover:text-primary-600"
              >
                Clear search
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <Loading />
        ) : error ? (
          <EmptyState
            title="Error loading restaurants"
            message="Please try again later"
          />
        ) : restaurants.length === 0 ? (
          <EmptyState
            title="No restaurants found"
            message="Try adjusting your search or filters"
          />
        ) : (
          <>
            <div className="mb-4">
              <p className="text-dark-600">
                {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} found
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;

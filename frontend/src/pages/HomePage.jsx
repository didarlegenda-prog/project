import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { restaurantsAPI } from '../api/restaurants';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import { Search, SlidersHorizontal } from 'lucide-react';

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    cuisine_type: searchParams.get('cuisine') || '',
    min_rating: searchParams.get('min_rating') || '',
    ordering: searchParams.get('ordering') || '-average_rating',
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['restaurants', searchQuery, filters],
    queryFn: () => restaurantsAPI.getAll({
      search: searchQuery,
      ...filters,
    }),
  });

  const restaurants = data?.results || data || [];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      cuisine_type: '',
      min_rating: '',
      ordering: '-average_rating',
    });
    setSearchParams({});
    setSearchQuery('');
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
        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-dark-700 font-medium hover:text-dark-900"
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
            </button>
            
            {(filters.cuisine_type || filters.min_rating || searchQuery) && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:text-primary-600"
              >
                Clear all
              </button>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Cuisine Type
                </label>
                <select
                  value={filters.cuisine_type}
                  onChange={(e) => handleFilterChange('cuisine_type', e.target.value)}
                  className="w-full px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Cuisines</option>
                  <option value="Italian">Italian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Indian">Indian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Japanese">Japanese</option>
                  <option value="American">American</option>
                  <option value="Thai">Thai</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={filters.min_rating}
                  onChange={(e) => handleFilterChange('min_rating', e.target.value)}
                  className="w-full px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="3.0">3.0+ Stars</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.ordering}
                  onChange={(e) => handleFilterChange('ordering', e.target.value)}
                  className="w-full px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="-average_rating">Highest Rated</option>
                  <option value="estimated_delivery_time">Fastest Delivery</option>
                  <option value="delivery_fee">Lowest Delivery Fee</option>
                  <option value="-created_at">Newest</option>
                </select>
              </div>
            </div>
          )}
        </div>

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

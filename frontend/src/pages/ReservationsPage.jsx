import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { reservationsAPI } from '../api/reservations';
import { restaurantsAPI } from '../api/restaurants';
import { useAuth } from '../hooks/useAuth';
import ReservationCard from '../components/reservation/ReservationCard';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import { Calendar, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ReservationsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loadingTables, setLoadingTables] = useState(false);
  const { user } = useAuth();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['reservations'],
    queryFn: () => reservationsAPI.getAll({ ordering: '-date_time' }),
  });

  const { data: restaurantsData } = useQuery({
    queryKey: ['restaurants'],
    queryFn: restaurantsAPI.getAll,
  });

  const reservations = data?.results || data || [];
  const restaurants = restaurantsData?.results || restaurantsData || [];

  const { register, handleSubmit, formState: { errors, isDirty }, reset, watch } = useForm();

  const watchRestaurant = watch('restaurant');
  const watchDate = watch('date');
  const watchTime = watch('time');
  const watchGuests = watch('party_size');

  const selectedRestaurant = restaurants.find(
    (r) => String(r.id) === String(watchRestaurant)
  );

  const fetchAvailableTables = async (restaurant, date, time, guests) => {
    setLoadingTables(true);
    try {
      const tables = await reservationsAPI.getAvailableTables(
        restaurant,
        date,
        time,
        guests
      );
      setAvailableTables(tables?.results || tables || []);
    } catch {
      toast.error('Failed to fetch available tables');
      setAvailableTables([]);
    } finally {
      setLoadingTables(false);
    }
  };

  useEffect(() => {
    if (watchRestaurant && watchDate && watchTime && watchGuests) {
      fetchAvailableTables(watchRestaurant, watchDate, watchTime, watchGuests);
    } else {
      setAvailableTables([]);
      setSelectedTable(null);
    }
  }, [watchRestaurant, watchDate, watchTime, watchGuests]);

  const handleCreateReservation = async (data) => {
    if (!selectedTable) {
      toast.error('Please select a table');
      return;
    }

    try {
      await reservationsAPI.create({
        restaurant: data.restaurant,
        table: selectedTable,
        reservation_date: data.date,
        reservation_time: data.time,
        guests_count: parseInt(data.party_size),
        phone: data.phone || user?.phone_number || '',
        email: data.email || user?.email || '',
        special_requests: data.special_requests || '',
      });
      
      toast.success('Reservation created successfully!');
      setShowForm(false);
      reset();
      setAvailableTables([]);
      setSelectedTable(null);
      refetch();
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to create reservation';
      toast.error(message);
    }
  };

  const handleCancelForm = () => {
    if (isDirty && !confirm('You have unsaved changes. Are you sure you want to cancel?')) {
      return;
    }
    setShowForm(false);
    reset();
    setAvailableTables([]);
    setSelectedTable(null);
  };

  const handleCancelReservation = async (reservationId) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      await reservationsAPI.cancel(reservationId);
      toast.success('Reservation cancelled successfully');
      refetch();
    } catch {
      toast.error('Failed to cancel reservation');
    }
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-dark-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-dark-900">My Reservations</h1>
          <Button variant="success" size="lg" onClick={() => setShowForm(true)}>
            Make a Reservation
          </Button>
        </div>

        {/* Inline Form */}
        {showForm && (
          <div className="mb-8 bg-white rounded-lg shadow-md p-6 border-2 border-blue-500 animate-slide-down">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-dark-900">Make a Reservation</h2>
              <button onClick={handleCancelForm} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleSubmit(handleCreateReservation)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Restaurant <span className="text-error">*</span>
                </label>
                <select
                  {...register('restaurant', { required: 'Restaurant is required' })}
                  className="w-full px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a restaurant</option>
                  {restaurants.map((restaurant) => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </option>
                  ))}
                </select>
                {errors.restaurant && (
                  <p className="mt-1 text-sm text-error">{errors.restaurant.message}</p>
                )}
              </div>

              {selectedRestaurant && !selectedRestaurant.is_open_now && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
                  <p className="font-medium">⚠️ This restaurant is currently closed</p>
                  <p className="text-sm mt-1">Please check business hours before making a reservation.</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Date"
                  type="date"
                  {...register('date', { required: 'Date is required' })}
                  error={errors.date?.message}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />

                <Input
                  label="Time"
                  type="time"
                  {...register('time', { required: 'Time is required' })}
                  error={errors.time?.message}
                  required
                />
              </div>

              <Input
                label="Number of Guests"
                type="number"
                {...register('party_size', {
                  required: 'Number of guests is required',
                  min: { value: 1, message: 'At least 1 guest required' },
                  max: { value: 20, message: 'Maximum 20 guests allowed' },
                })}
                error={errors.party_size?.message}
                min="1"
                max="20"
                required
              />

              {/* Table Selection */}
              {watchRestaurant && watchDate && watchTime && watchGuests && (
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">
                    Select Table <span className="text-error">*</span>
                  </label>
                  {loadingTables ? (
                    <div className="text-center py-8 text-dark-600">
                      Loading available tables...
                    </div>
                  ) : availableTables.length === 0 ? (
                    <div className="text-center py-8 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-orange-800 font-medium">No tables available</p>
                      <p className="text-sm text-orange-600 mt-1">
                        Try different date, time, or fewer guests
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableTables.map((table) => (
                        <button
                          key={table.id}
                          type="button"
                          onClick={() => setSelectedTable(table.id)}
                          className={`p-4 border-2 rounded-lg transition-all ${
                            selectedTable === table.id
                              ? 'border-primary bg-primary-50'
                              : 'border-dark-300 hover:border-primary'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-lg font-bold text-dark-900">
                              Table {table.table_number}
                            </div>
                            <div className="text-sm text-dark-600 mt-1">
                              🪑 Seats {table.capacity}
                            </div>
                            {table.location && (
                              <div className="text-xs text-dark-500 mt-1">
                                📍 {table.location}
                              </div>
                            )}
                            {selectedTable === table.id && (
                              <div className="mt-2 text-primary font-semibold text-sm">
                                ✓ Selected
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Phone"
                  type="tel"
                  {...register('phone')}
                  placeholder={user?.phone_number || 'Your phone number'}
                />

                <Input
                  label="Email"
                  type="email"
                  {...register('email')}
                  placeholder={user?.email || 'Your email'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Special Requests
                </label>
                <textarea
                  {...register('special_requests')}
                  rows="3"
                  className="w-full px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Any special requests or dietary restrictions..."
                />
              </div>

              <div className="flex space-x-3">
                <Button type="submit" fullWidth>
                  Confirm Reservation
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={handleCancelForm}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {reservations.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No reservations"
            message="You haven't made any reservations yet. Book a table now!"
            action={
              <Button variant="success" size="lg" fullWidth onClick={() => setShowForm(true)}>
                Make Your First Reservation
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onCancel={handleCancelReservation}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationsPage;

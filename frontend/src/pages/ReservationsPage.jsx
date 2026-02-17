import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { reservationsAPI } from '../api/reservations';
import { restaurantsAPI } from '../api/restaurants';
import ReservationCard from '../components/reservation/ReservationCard';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import { Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const ReservationsPage = () => {
  const [showNewModal, setShowNewModal] = useState(false);

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

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleCreateReservation = async (data) => {
    try {
      // Combine date and time
      const dateTime = `${data.date}T${data.time}:00`;
      
      await reservationsAPI.create({
        restaurant: data.restaurant,
        date_time: dateTime,
        party_size: parseInt(data.party_size),
        special_requests: data.special_requests || '',
      });
      
      toast.success('Reservation created successfully!');
      setShowNewModal(false);
      reset();
      refetch();
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to create reservation';
      toast.error(message);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      await reservationsAPI.cancel(reservationId);
      toast.success('Reservation cancelled successfully');
      refetch();
    } catch (error) {
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
          <Button variant="success" size="lg" onClick={() => setShowNewModal(true)}>
            Make a Reservation
          </Button>
        </div>

        {reservations.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No reservations"
            message="You haven't made any reservations yet. Book a table now!"
            action={
              <Button variant="success" size="lg" fullWidth onClick={() => setShowNewModal(true)}>
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

      {/* New Reservation Modal */}
      <Modal
        isOpen={showNewModal}
        onClose={() => {
          setShowNewModal(false);
          reset();
        }}
        title="Make a Reservation"
      >
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
              onClick={() => {
                setShowNewModal(false);
                reset();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ReservationsPage;

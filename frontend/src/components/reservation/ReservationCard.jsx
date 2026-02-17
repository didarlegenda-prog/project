import { formatDateTime } from '../../utils/formatters';
import Badge from '../common/Badge';
import { STATUS_COLORS, RESERVATION_STATUSES } from '../../utils/constants';
import { Calendar, Clock, Users } from 'lucide-react';
import Button from '../common/Button';

const ReservationCard = ({ reservation, onCancel }) => {
  const canCancel = reservation.status === RESERVATION_STATUSES.PENDING || 
                    reservation.status === RESERVATION_STATUSES.CONFIRMED;

  return (
    <div className="bg-white border border-dark-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-dark-900 mb-1">
            {reservation.restaurant?.name || reservation.restaurant_name}
          </h3>
          <Badge variant={STATUS_COLORS[reservation.status]}>
            {reservation.status}
          </Badge>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-dark-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span className="text-sm">{formatDateTime(reservation.date_time, 'MMM dd, yyyy')}</span>
        </div>
        
        <div className="flex items-center text-dark-600">
          <Clock className="h-4 w-4 mr-2" />
          <span className="text-sm">{formatDateTime(reservation.date_time, 'HH:mm')}</span>
        </div>
        
        <div className="flex items-center text-dark-600">
          <Users className="h-4 w-4 mr-2" />
          <span className="text-sm">{reservation.party_size} guests</span>
        </div>
      </div>

      {reservation.special_requests && (
        <div className="mb-4 p-3 bg-dark-50 rounded-lg">
          <p className="text-sm text-dark-600">
            <span className="font-medium">Special Requests: </span>
            {reservation.special_requests}
          </p>
        </div>
      )}

      {canCancel && (
        <Button
          variant="danger"
          size="sm"
          fullWidth
          onClick={() => onCancel(reservation.id)}
        >
          Cancel Reservation
        </Button>
      )}
    </div>
  );
};

export default ReservationCard;

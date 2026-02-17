import StarRating from './StarRating';
import { formatRelativeTime } from '../../utils/formatters';
import { Edit, Trash2 } from 'lucide-react';

const ReviewCard = ({ review, onEdit, onDelete, showActions = false }) => {
  return (
    <div className="bg-white border border-dark-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-dark-200 flex items-center justify-center text-dark-600 font-medium">
            {review.user?.first_name?.[0] || review.user?.username?.[0] || 'U'}
          </div>
          <div className="ml-3">
            <p className="font-medium text-dark-900">
              {review.user?.first_name || review.user?.username || 'Anonymous'}
            </p>
            <p className="text-sm text-dark-500">
              {formatRelativeTime(review.created_at)}
            </p>
          </div>
        </div>

        {showActions && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit?.(review)}
              className="p-1 text-dark-600 hover:text-primary"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete?.(review.id)}
              className="p-1 text-dark-600 hover:text-error"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mb-2">
        <StarRating rating={review.rating} readonly size="sm" />
      </div>

      <p className="text-dark-700">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;

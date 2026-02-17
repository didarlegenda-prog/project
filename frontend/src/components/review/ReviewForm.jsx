import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../common/Button';
import StarRating from './StarRating';
import toast from 'react-hot-toast';
import { reviewsAPI } from '../../api/reviews';

const ReviewForm = ({ restaurantId, onSuccess, existingReview = null }) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      comment: existingReview?.comment || '',
    },
  });

  const onSubmit = async (data) => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        restaurant: restaurantId,
        rating,
        comment: data.comment,
      };

      if (existingReview) {
        await reviewsAPI.update(existingReview.id, reviewData);
        toast.success('Review updated successfully!');
      } else {
        await reviewsAPI.create(reviewData);
        toast.success('Review submitted successfully!');
      }

      reset();
      setRating(0);
      onSuccess?.();
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to submit review';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating <span className="text-error">*</span>
        </label>
        <StarRating rating={rating} onRatingChange={setRating} size="lg" />
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Review
        </label>
        <textarea
          {...register('comment', {
            required: 'Review comment is required',
            minLength: {
              value: 10,
              message: 'Review must be at least 10 characters',
            },
          })}
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Share your experience with this restaurant..."
        />
        {errors.comment && (
          <p className="mt-1 text-sm text-error">{errors.comment.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        loading={isSubmitting}
        fullWidth
      >
        {existingReview ? 'Update Review' : 'Submit Review'}
      </Button>
    </form>
  );
};

export default ReviewForm;

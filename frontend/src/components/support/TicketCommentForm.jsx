import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { supportAPI } from '../../api/support';
import toast from 'react-hot-toast';

const TicketCommentForm = ({ ticketId, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await supportAPI.addComment(ticketId, { message: data.comment });
      toast.success('Comment added successfully!');
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Add a Comment
        </label>
        <textarea
          {...register('comment', {
            required: 'Comment is required',
            minLength: {
              value: 10,
              message: 'Comment must be at least 10 characters',
            },
          })}
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Write your comment..."
        />
        {errors.comment && (
          <p className="mt-1 text-sm text-error">{errors.comment.message}</p>
        )}
      </div>

      <Button type="submit" loading={isSubmitting} fullWidth>
        Add Comment
      </Button>
    </form>
  );
};

export default TicketCommentForm;

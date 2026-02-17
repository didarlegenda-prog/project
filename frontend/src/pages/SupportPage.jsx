import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { supportAPI } from '../api/support';
import TicketCard from '../components/support/TicketCard';
import TicketCommentForm from '../components/support/TicketCommentForm';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import { HelpCircle, Plus } from 'lucide-react';
import { TICKET_CATEGORIES } from '../utils/constants';
import { formatDateTime } from '../utils/formatters';
import toast from 'react-hot-toast';

const SupportPage = () => {
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['support-tickets'],
    queryFn: () => supportAPI.getAll({ ordering: '-created_at' }),
  });

  const tickets = data?.results || data || [];

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleCreateTicket = async (data) => {
    try {
      await supportAPI.create(data);
      toast.success('Ticket created successfully!');
      setShowNewTicketModal(false);
      reset();
      refetch();
    } catch (error) {
      toast.error('Failed to create ticket');
    }
  };

  const handleTicketClick = async (ticket) => {
    try {
      const fullTicket = await supportAPI.getById(ticket.id);
      const comments = await supportAPI.getComments(ticket.id);
      setSelectedTicket({ ...fullTicket, comments: comments.results || comments });
      setShowTicketModal(true);
    } catch (error) {
      toast.error('Failed to load ticket details');
    }
  };

  const handleCommentSuccess = async () => {
    await handleTicketClick(selectedTicket);
    refetch();
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-dark-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-dark-900">Support Tickets</h1>
          <Button onClick={() => setShowNewTicketModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </div>

        {tickets.length === 0 ? (
          <EmptyState
            icon={HelpCircle}
            title="No support tickets"
            message="Have a question or issue? Create a support ticket and we'll help you out!"
            action={
              <Button variant="warning" size="lg" fullWidth onClick={() => setShowNewTicketModal(true)}>
                Create Your First Ticket
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={handleTicketClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      <Modal
        isOpen={showNewTicketModal}
        onClose={() => {
          setShowNewTicketModal(false);
          reset();
        }}
        title="Create Support Ticket"
      >
        <form onSubmit={handleSubmit(handleCreateTicket)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">
              Category <span className="text-error">*</span>
            </label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="w-full px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a category</option>
              {Object.values(TICKET_CATEGORIES).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-error">{errors.category.message}</p>
            )}
          </div>

          <Input
            label="Subject"
            {...register('subject', { required: 'Subject is required' })}
            error={errors.subject?.message}
            placeholder="Brief description of your issue"
            required
          />

          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">
              Description <span className="text-error">*</span>
            </label>
            <textarea
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 20,
                  message: 'Description must be at least 20 characters',
                },
              })}
              rows="5"
              className="w-full px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Please provide details about your issue..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-error">{errors.description.message}</p>
            )}
          </div>

          <div className="flex space-x-3">
            <Button type="submit" fullWidth>
              Create Ticket
            </Button>
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => {
                setShowNewTicketModal(false);
                reset();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Ticket Details Modal */}
      <Modal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        title={`Ticket #${selectedTicket?.id}`}
        size="lg"
      >
        {selectedTicket && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-dark-900 text-lg mb-2">
                {selectedTicket.subject}
              </h3>
              <p className="text-dark-600 mb-4">{selectedTicket.description}</p>
              <div className="flex items-center space-x-4 text-sm text-dark-500">
                <span>Category: {selectedTicket.category}</span>
                <span>Status: {selectedTicket.status}</span>
                <span>{formatDateTime(selectedTicket.created_at)}</span>
              </div>
            </div>

            {/* Comments */}
            {selectedTicket.comments && selectedTicket.comments.length > 0 && (
              <div className="border-t border-dark-200 pt-6">
                <h4 className="font-semibold text-dark-900 mb-4">Comments</h4>
                <div className="space-y-4">
                  {selectedTicket.comments.map((comment) => (
                    <div key={comment.id} className="bg-dark-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-medium text-dark-900">
                          {comment.user?.first_name || comment.user?.username || 'User'}
                        </span>
                        <span className="text-xs text-dark-500">
                          {formatDateTime(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-dark-700">{comment.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Comment */}
            {selectedTicket.status !== 'CLOSED' && (
              <div className="border-t border-dark-200 pt-6">
                <TicketCommentForm
                  ticketId={selectedTicket.id}
                  onSuccess={handleCommentSuccess}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SupportPage;

import { formatDateTime } from '../../utils/formatters';
import Badge from '../common/Badge';
import { STATUS_COLORS } from '../../utils/constants';
import { MessageSquare } from 'lucide-react';

const TicketCard = ({ ticket, onClick }) => {
  return (
    <div
      onClick={() => onClick?.(ticket)}
      className="bg-white border border-dark-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <Badge variant="gray">{ticket.category}</Badge>
            <Badge variant={STATUS_COLORS[ticket.status]}>
              {ticket.status}
            </Badge>
          </div>
          <h3 className="font-semibold text-dark-900 mb-1">{ticket.subject}</h3>
          <p className="text-sm text-dark-600 line-clamp-2">{ticket.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-dark-500 mt-3 pt-3 border-t border-dark-200">
        <div className="flex items-center">
          <MessageSquare className="h-4 w-4 mr-1" />
          <span>{ticket.comments_count || 0} comments</span>
        </div>
        <span>{formatDateTime(ticket.created_at)}</span>
      </div>
    </div>
  );
};

export default TicketCard;

import { Bell, Package, Calendar, Tag } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';
import { NOTIFICATION_TYPES } from '../../utils/constants';

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const getIcon = () => {
    switch (notification.type) {
      case NOTIFICATION_TYPES.ORDER:
        return <Package className="h-5 w-5" />;
      case NOTIFICATION_TYPES.RESERVATION:
        return <Calendar className="h-5 w-5" />;
      case NOTIFICATION_TYPES.PROMOTION:
        return <Tag className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <div
      onClick={() => !notification.is_read && onMarkAsRead(notification.id)}
      className={`p-4 border-b border-dark-200 cursor-pointer hover:bg-dark-50 transition-colors ${
        !notification.is_read ? 'bg-primary-50' : 'bg-white'
      }`}
    >
      <div className="flex items-start">
        <div className={`p-2 rounded-full mr-3 ${
          !notification.is_read ? 'bg-primary-100 text-primary' : 'bg-dark-100 text-dark-600'
        }`}>
          {getIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-medium text-dark-900">{notification.title}</h4>
            {!notification.is_read && (
              <span className="ml-2 w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
            )}
          </div>
          
          <p className="text-sm text-dark-600 mb-1">{notification.message}</p>
          
          <p className="text-xs text-dark-500">
            {formatRelativeTime(notification.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;

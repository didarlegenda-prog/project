import { useQuery } from '@tanstack/react-query';
import { notificationsAPI } from '../api/notifications';
import { useNotifications } from '../hooks/useNotifications';
import NotificationItem from '../components/notification/NotificationItem';
import NotificationSettings from '../components/notification/NotificationSettings';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import { Bell, Settings } from 'lucide-react';
import { useState } from 'react';

const NotificationsPage = () => {
  const { notifications, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkAllAsRead = async () => {
    setIsLoading(true);
    await markAllAsRead();
    await fetchNotifications();
    setIsLoading(false);
  };

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
    await fetchNotifications();
  };

  const unreadNotifications = notifications.filter(n => !n.is_read);

  return (
    <div className="min-h-screen bg-dark-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-dark-900">Notifications</h1>
            {unreadNotifications.length > 0 && (
              <p className="text-sm text-dark-600 mt-1">
                {unreadNotifications.length} unread notification{unreadNotifications.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          
          <div className="flex space-x-2">
            {unreadNotifications.length > 0 && (
              <Button
                variant="outline"
                onClick={handleMarkAllAsRead}
                loading={isLoading}
              >
                Mark all as read
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {notifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications"
              message="You're all caught up! Check back later for updates."
            />
          ) : (
            <div className="divide-y divide-dark-200">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Notification Settings"
      >
        <NotificationSettings />
      </Modal>
    </div>
  );
};

export default NotificationsPage;

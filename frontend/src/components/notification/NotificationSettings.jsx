import { useState, useEffect } from 'react';
import { notificationsAPI } from '../../api/notifications';
import toast from 'react-hot-toast';
import Button from '../common/Button';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    email_order_updates: true,
    email_reservation_updates: true,
    email_promotions: false,
    sms_order_updates: false,
    sms_reservation_updates: false,
    push_enabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await notificationsAPI.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await notificationsAPI.updateSettings(settings);
      toast.success('Settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading settings...</div>;
  }

  const settingsList = [
    { key: 'email_order_updates', label: 'Email notifications for orders', group: 'Email' },
    { key: 'email_reservation_updates', label: 'Email notifications for reservations', group: 'Email' },
    { key: 'email_promotions', label: 'Email promotional offers', group: 'Email' },
    { key: 'sms_order_updates', label: 'SMS notifications for orders', group: 'SMS' },
    { key: 'sms_reservation_updates', label: 'SMS notifications for reservations', group: 'SMS' },
    { key: 'push_enabled', label: 'Push notifications', group: 'Push' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {settingsList.map((setting) => (
          <div key={setting.key} className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-dark-900">{setting.label}</p>
              <p className="text-sm text-dark-500">{setting.group} Notifications</p>
            </div>
            <button
              onClick={() => handleToggle(setting.key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings[setting.key] ? 'bg-primary' : 'bg-dark-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings[setting.key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <Button onClick={handleSave} loading={saving} fullWidth>
        Save Settings
      </Button>
    </div>
  );
};

export default NotificationSettings;

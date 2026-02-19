const NotificationSettings = () => {
  const settingsList = [
    { key: 'push_enabled', label: 'In-App Notifications', group: 'Active', enabled: true },
    { key: 'email_order_updates', label: 'Email notifications (Coming Soon)', group: 'Future', enabled: false },
    { key: 'sms_order_updates', label: 'SMS notifications (Coming Soon)', group: 'Future', enabled: false },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {settingsList.map((setting) => (
          <div key={setting.key} className="flex items-center justify-between py-3">
            <div>
              <p className={`font-medium ${setting.enabled ? 'text-dark-900' : 'text-dark-400'}`}>{setting.label}</p>
              <p className="text-sm text-dark-500">
                {setting.group === 'Active' ? 'Active' : <span className="text-xs px-2 py-0.5 bg-dark-100 text-dark-400 rounded-full">Coming Soon</span>}
              </p>
            </div>
            <button
              disabled={!setting.enabled}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                setting.enabled ? 'bg-primary' : 'bg-dark-200 opacity-50 cursor-not-allowed'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  setting.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSettings;

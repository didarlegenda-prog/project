"""
Celery configuration for Restaurant Management Platform.
"""
import os
from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('restaurant_platform')

# Load config from Django settings
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks from all registered Django apps
app.autodiscover_tasks()

# Celery Beat Schedule
app.conf.beat_schedule = {
    'auto-cancel-unpaid-orders': {
        'task': 'orders.tasks.auto_cancel_unpaid_orders',
        'schedule': crontab(minute='*/15'),  # Every 15 minutes
    },
    'mark-no-show-reservations': {
        'task': 'reservations.tasks.mark_no_show_reservations',
        'schedule': crontab(minute='0', hour='*'),  # Every hour
    },
    'check-low-stock': {
        'task': 'inventory.tasks.check_low_stock_alerts',
        'schedule': crontab(minute='0', hour='9'),  # 9:00 AM daily
    },
    'generate-daily-reports': {
        'task': 'analytics.tasks.generate_daily_reports',
        'schedule': crontab(minute='30', hour='0'),  # 00:30 AM daily
    },
}

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')

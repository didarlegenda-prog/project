from django.db import models
from users.models import User


class Notification(models.Model):
    """Notification model for user notifications."""
    
    TYPE_CHOICES = [
        ('ORDER', 'Order Update'),
        ('RESERVATION', 'Reservation Update'),
        ('PAYMENT', 'Payment Update'),
        ('PROMOTION', 'Promotion'),
        ('REVIEW', 'Review'),
        ('SYSTEM', 'System'),
        ('ALERT', 'Alert'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    
    title = models.CharField(max_length=200)
    message = models.TextField()
    data = models.JSONField(default=dict, blank=True)  # Additional data for the notification
    
    is_read = models.BooleanField(default=False)
    
    # Delivery channels
    sent_email = models.BooleanField(default=False)
    sent_sms = models.BooleanField(default=False)
    sent_push = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.title}"


class NotificationSettings(models.Model):
    """User notification preferences."""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_settings')
    
    # Email preferences
    email_order_updates = models.BooleanField(default=True)
    email_reservation_updates = models.BooleanField(default=True)
    email_promotions = models.BooleanField(default=True)
    email_newsletter = models.BooleanField(default=False)
    
    # SMS preferences
    sms_order_updates = models.BooleanField(default=False)
    sms_reservation_reminders = models.BooleanField(default=False)
    
    # Push preferences
    push_enabled = models.BooleanField(default=True)
    push_order_updates = models.BooleanField(default=True)
    push_promotions = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'notification_settings'
    
    def __str__(self):
        return f"Notification settings for {self.user.email}"


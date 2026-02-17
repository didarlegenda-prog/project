"""Views for notifications app."""
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from notifications.models import Notification, NotificationSettings


class NotificationViewSet(viewsets.ModelViewSet):
    """API endpoint for notifications."""
    queryset = Notification.objects.all()
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class NotificationSettingsView(APIView):
    """API endpoint for notification settings."""
    
    def get(self, request):
        settings, _ = NotificationSettings.objects.get_or_create(user=request.user)
        return Response({"status": "ok"})


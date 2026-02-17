"""Views for notifications app."""
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from notifications.models import Notification, NotificationSettings
from notifications.serializers.notification_serializers import NotificationSerializer, NotificationSettingsSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    """API endpoint for notifications."""
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class NotificationSettingsView(APIView):
    """API endpoint for notification settings."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        settings, _ = NotificationSettings.objects.get_or_create(user=request.user)
        serializer = NotificationSettingsSerializer(settings)
        return Response(serializer.data)
    
    def patch(self, request):
        settings, _ = NotificationSettings.objects.get_or_create(user=request.user)
        serializer = NotificationSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)



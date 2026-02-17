"""Views for developers app."""
from rest_framework import viewsets
from developers.models import APIKey, Webhook


class APIKeyViewSet(viewsets.ModelViewSet):
    """API endpoint for API keys."""
    queryset = APIKey.objects.all()
    
    def get_queryset(self):
        return APIKey.objects.filter(user=self.request.user)


class WebhookViewSet(viewsets.ModelViewSet):
    """API endpoint for webhooks."""
    queryset = Webhook.objects.all()
    
    def get_queryset(self):
        return Webhook.objects.filter(user=self.request.user)


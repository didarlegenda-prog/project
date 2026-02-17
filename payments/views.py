"""Views for payments app."""
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from payments.models import Payment


class PaymentViewSet(viewsets.ModelViewSet):
    """API endpoint for payments."""
    queryset = Payment.objects.all()
    
    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)


class StripeWebhookView(APIView):
    """Stripe webhook handler."""
    
    def post(self, request):
        # Placeholder for Stripe webhook
        return Response({"status": "received"})


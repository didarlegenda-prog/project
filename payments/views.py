"""Views for payments app."""
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from payments.models import Payment
from payments.serializers.payment_serializers import PaymentSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    """API endpoint for payments."""
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)


@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhookView(APIView):
    """Stripe webhook handler."""
    authentication_classes = []  # Disable authentication for webhooks
    permission_classes = []  # Disable permissions for webhooks
    
    def post(self, request):
        # TODO: Implement Stripe signature verification
        # import stripe
        # from django.conf import settings
        # 
        # payload = request.body
        # sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        # 
        # try:
        #     event = stripe.Webhook.construct_event(
        #         payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        #     )
        # except ValueError as e:
        #     return Response({"error": "Invalid payload"}, status=400)
        # except stripe.error.SignatureVerificationError as e:
        #     return Response({"error": "Invalid signature"}, status=400)
        
        # Placeholder response
        return Response({"status": "received"})



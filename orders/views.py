"""Views for orders app."""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from orders.models import Order
from orders.serializers.order_serializers import OrderSerializer


class OrderViewSet(viewsets.ModelViewSet):
    """API endpoint for orders."""
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Order.objects.none()
        
        if user.role == 'CUSTOMER':
            return Order.objects.filter(user=user)
        elif user.role == 'RESTAURANT_OWNER':
            return Order.objects.filter(restaurant__owner=user)
        elif user.role == 'ADMIN':
            return Order.objects.all()
        return Order.objects.none()



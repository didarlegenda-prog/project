"""Views for orders app."""
from rest_framework import viewsets
from orders.models import Order


class OrderViewSet(viewsets.ModelViewSet):
    """API endpoint for orders."""
    queryset = Order.objects.all()
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'CUSTOMER':
            return Order.objects.filter(user=user)
        elif user.role == 'RESTAURANT_OWNER':
            return Order.objects.filter(restaurant__owner=user)
        elif user.role == 'ADMIN':
            return Order.objects.all()
        return Order.objects.none()


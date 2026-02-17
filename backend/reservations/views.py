"""Views for reservations app."""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from reservations.models import Reservation
from reservations.serializers.reservation_serializers import ReservationSerializer


class ReservationViewSet(viewsets.ModelViewSet):
    """API endpoint for reservations."""
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Reservation.objects.none()
        
        if user.role == 'CUSTOMER':
            return Reservation.objects.filter(user=user)
        elif user.role == 'RESTAURANT_OWNER':
            return Reservation.objects.filter(restaurant__owner=user)
        elif user.role == 'ADMIN':
            return Reservation.objects.all()
        return Reservation.objects.none()



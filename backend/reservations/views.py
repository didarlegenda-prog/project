"""Views for reservations app."""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils.dateparse import parse_date
from datetime import datetime
from reservations.models import Reservation
from reservations.serializers.reservation_serializers import ReservationSerializer
from restaurants.models import Table


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

    @action(detail=False, methods=['get'])
    def available_tables(self, request):
        """Get available tables for a restaurant on a specific date/time."""
        restaurant_id = request.query_params.get('restaurant')
        date = request.query_params.get('date')
        time = request.query_params.get('time')
        guests = request.query_params.get('guests')

        if not all([restaurant_id, date, time, guests]):
            return Response(
                {'error': 'restaurant, date, time, and guests parameters are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            guests = int(guests)
            reservation_date = parse_date(date)
            reservation_time = datetime.strptime(time, '%H:%M').time()
        except (ValueError, TypeError):
            return Response(
                {'error': 'Invalid date, time, or guests format'},
                status=status.HTTP_400_BAD_REQUEST
            )

        tables = Table.objects.filter(
            restaurant_id=restaurant_id,
            capacity__gte=guests,
            is_available=True
        )

        available_tables = []
        for table in tables:
            conflicting = Reservation.objects.filter(
                table=table,
                reservation_date=reservation_date,
                reservation_time=reservation_time,
                status__in=['PENDING', 'CONFIRMED']
            )
            if not conflicting.exists():
                available_tables.append({
                    'id': table.id,
                    'table_number': table.table_number,
                    'capacity': table.capacity,
                    'location': table.location,
                })

        return Response(available_tables)



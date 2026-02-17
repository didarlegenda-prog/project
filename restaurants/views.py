"""
Views for restaurants app.
"""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from restaurants.models import Restaurant, Review
from restaurants.serializers.restaurant_serializers import RestaurantSerializer, ReviewSerializer
from core.permissions import IsRestaurantOwnerOrReadOnly


class RestaurantViewSet(viewsets.ModelViewSet):
    """
    API endpoint for restaurants.
    
    list: Get list of all active restaurants.
    create: Create a new restaurant (owner only).
    retrieve: Get restaurant details.
    update: Update restaurant (owner only).
    destroy: Delete restaurant (owner only).
    """
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsRestaurantOwnerOrReadOnly]
    
    def get_queryset(self):
        queryset = Restaurant.objects.all()
        # Filter by status for non-owners
        if not self.request.user.is_authenticated or self.request.user.role != 'RESTAURANT_OWNER':
            queryset = queryset.filter(status='ACTIVE')
        return queryset


class ReviewViewSet(viewsets.ModelViewSet):
    """
    API endpoint for restaurant reviews.
    """
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        return Review.objects.filter(restaurant_id=self.kwargs['restaurant_pk'])



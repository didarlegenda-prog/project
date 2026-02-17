"""
Views for restaurants app.
"""
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
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
    lookup_field = 'slug'
    
    # Фильтрация - УБРАЛИ cuisine_type из filterset_fields
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['price_range', 'status']  # ← Убрали cuisine_type!
    search_fields = ['name', 'description']
    ordering_fields = ['average_rating', 'created_at', 'name']
    ordering = ['-average_rating']
    
    def get_queryset(self):
        queryset = Restaurant.objects.all()
        
        # Filter by status for non-owners
        if not self.request.user.is_authenticated or self.request.user.role != 'RESTAURANT_OWNER':
            queryset = queryset.filter(status='ACTIVE')
        
        # РУЧНАЯ фильтрация по cuisine_type (JSONField)
        cuisine = self.request.query_params.get('cuisine_type')
        if cuisine:
            queryset = queryset.filter(cuisine_type__contains=[cuisine])
        
        # Фильтр по рейтингу
        min_rating = self.request.query_params.get('min_rating')
        if min_rating:
            try:
                queryset = queryset.filter(average_rating__gte=float(min_rating))
            except ValueError:
                pass
        
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
    
    def perform_create(self, serializer):
        restaurant_pk = self.kwargs.get('restaurant_pk')
        serializer.save(
            user=self.request.user,
            restaurant_id=restaurant_pk
        )
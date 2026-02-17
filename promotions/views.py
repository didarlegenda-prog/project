"""Views for promotions app."""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from promotions.models import Promotion
from promotions.serializers.promotion_serializers import PromotionSerializer


class PromotionViewSet(viewsets.ModelViewSet):
    """API endpoint for promotions."""
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]



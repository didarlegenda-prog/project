"""Views for promotions app."""
from rest_framework import viewsets
from promotions.models import Promotion


class PromotionViewSet(viewsets.ModelViewSet):
    """API endpoint for promotions."""
    queryset = Promotion.objects.all()


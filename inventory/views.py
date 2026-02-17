"""Views for inventory app."""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from inventory.models import InventoryItem, StockMovement
from inventory.serializers.inventory_serializers import InventoryItemSerializer, StockMovementSerializer


class InventoryItemViewSet(viewsets.ModelViewSet):
    """API endpoint for inventory items."""
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    permission_classes = [IsAuthenticated]


class StockMovementViewSet(viewsets.ModelViewSet):
    """API endpoint for stock movements."""
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
    permission_classes = [IsAuthenticated]



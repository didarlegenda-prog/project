"""Views for inventory app."""
from rest_framework import viewsets
from inventory.models import InventoryItem, StockMovement


class InventoryItemViewSet(viewsets.ModelViewSet):
    """API endpoint for inventory items."""
    queryset = InventoryItem.objects.all()


class StockMovementViewSet(viewsets.ModelViewSet):
    """API endpoint for stock movements."""
    queryset = StockMovement.objects.all()


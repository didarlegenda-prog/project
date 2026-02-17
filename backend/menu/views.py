"""Views for menu app."""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from menu.models import MenuCategory, MenuItem
from menu.serializers.menu_serializers import MenuCategorySerializer, MenuItemSerializer


class MenuCategoryViewSet(viewsets.ModelViewSet):
    """API endpoint for menu categories."""
    queryset = MenuCategory.objects.all()
    serializer_class = MenuCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class MenuItemViewSet(viewsets.ModelViewSet):
    """API endpoint for menu items."""
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]



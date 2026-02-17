"""Views for menu app."""
from rest_framework import viewsets
from menu.models import MenuCategory, MenuItem


class MenuCategoryViewSet(viewsets.ModelViewSet):
    """API endpoint for menu categories."""
    queryset = MenuCategory.objects.all()


class MenuItemViewSet(viewsets.ModelViewSet):
    """API endpoint for menu items."""
    queryset = MenuItem.objects.all()


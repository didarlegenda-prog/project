"""
Custom permissions for Restaurant Management Platform.
"""
from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Check if object has a 'user' attribute
        return hasattr(obj, 'user') and obj.user == request.user


class IsRestaurantOwner(permissions.BasePermission):
    """
    Permission to check if user is a restaurant owner.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'RESTAURANT_OWNER'
    
    def has_object_permission(self, request, view, obj):
        # For Restaurant objects
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
        # For objects with restaurant foreign key
        elif hasattr(obj, 'restaurant'):
            return obj.restaurant.owner == request.user
        return False


class IsRestaurantOwnerOrReadOnly(permissions.BasePermission):
    """
    Read-only for everyone, write for restaurant owners only.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'RESTAURANT_OWNER'
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
        elif hasattr(obj, 'restaurant'):
            return obj.restaurant.owner == request.user
        return False


class IsRestaurantStaffOrOwner(permissions.BasePermission):
    """
    Permission for restaurant staff or owner.
    """
    def has_object_permission(self, request, view, obj):
        # Get restaurant from object
        restaurant = None
        if hasattr(obj, 'restaurant'):
            restaurant = obj.restaurant
        elif hasattr(obj, 'owner'):  # Restaurant object itself
            restaurant = obj
        
        if not restaurant:
            return False
        
        # Check if user is owner
        if restaurant.owner == request.user:
            return True
        
        # Check if user is staff (would need a staff field in Restaurant model)
        # For now, just check owner
        return False


class IsAdminUser(permissions.BasePermission):
    """
    Permission to check if user is an admin.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'ADMIN'


class IsCustomer(permissions.BasePermission):
    """
    Permission to check if user is a customer.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'CUSTOMER'


class IsAuthenticatedOrReadOnly(permissions.BasePermission):
    """
    Allow any user to view, but require authentication for modifications.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated

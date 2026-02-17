"""URLs for restaurants app."""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from restaurants import views

router = DefaultRouter()
router.register(r'', views.RestaurantViewSet, basename='restaurant')
router.register(r'(?P<restaurant_pk>[^/.]+)/reviews', views.ReviewViewSet, basename='restaurant-review')

urlpatterns = [
    path('', include(router.urls)),
]

"""URLs for notifications app."""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from notifications import views

router = DefaultRouter()
router.register(r'', views.NotificationViewSet, basename='notification')

urlpatterns = [
    path('settings/', views.NotificationSettingsView.as_view(), name='notification-settings'),
    path('', include(router.urls)),
]

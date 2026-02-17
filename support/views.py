"""Views for support app."""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from support.models import SupportTicket
from support.serializers.support_serializers import SupportTicketSerializer


class SupportTicketViewSet(viewsets.ModelViewSet):
    """API endpoint for support tickets."""
    queryset = SupportTicket.objects.all()
    serializer_class = SupportTicketSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return SupportTicket.objects.all()
        return SupportTicket.objects.filter(user=user)



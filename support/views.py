"""Views for support app."""
from rest_framework import viewsets
from support.models import SupportTicket


class SupportTicketViewSet(viewsets.ModelViewSet):
    """API endpoint for support tickets."""
    queryset = SupportTicket.objects.all()
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return SupportTicket.objects.all()
        return SupportTicket.objects.filter(user=user)


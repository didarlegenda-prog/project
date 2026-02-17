"""Views for analytics app."""
from rest_framework import viewsets
from analytics.models import DailySalesReport


class DailySalesReportViewSet(viewsets.ModelViewSet):
    """API endpoint for daily sales reports."""
    queryset = DailySalesReport.objects.all()


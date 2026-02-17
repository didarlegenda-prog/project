"""
Celery tasks for orders app.
"""
from celery import shared_task
from django.utils import timezone
from datetime import timedelta


@shared_task
def send_order_confirmation_email(order_id):
    """
    Send order confirmation email to customer.
    """
    from orders.models import Order
    try:
        order = Order.objects.get(id=order_id)
        # TODO: Implement email sending logic
        print(f"Sending order confirmation email for order {order.order_number}")
        return f"Email sent for order {order.order_number}"
    except Order.DoesNotExist:
        return f"Order {order_id} not found"


@shared_task
def send_order_status_update(order_id):
    """
    Send order status update to customer.
    """
    from orders.models import Order
    try:
        order = Order.objects.get(id=order_id)
        # TODO: Implement email sending logic
        print(f"Sending status update for order {order.order_number}: {order.status}")
        return f"Status update sent for order {order.order_number}"
    except Order.DoesNotExist:
        return f"Order {order_id} not found"


@shared_task
def notify_restaurant_new_order(order_id):
    """
    Notify restaurant about new order.
    """
    from orders.models import Order
    try:
        order = Order.objects.get(id=order_id)
        # TODO: Implement notification logic
        print(f"Notifying restaurant {order.restaurant.name} about order {order.order_number}")
        return f"Restaurant notified about order {order.order_number}"
    except Order.DoesNotExist:
        return f"Order {order_id} not found"


@shared_task
def auto_cancel_unpaid_orders():
    """
    Auto-cancel unpaid orders after 30 minutes.
    Runs every 15 minutes via Celery Beat.
    """
    from orders.models import Order
    
    cutoff_time = timezone.now() - timedelta(minutes=30)
    unpaid_orders = Order.objects.filter(
        status='PENDING',
        is_paid=False,
        created_at__lt=cutoff_time
    )
    
    count = 0
    for order in unpaid_orders:
        order.status = 'CANCELLED'
        order.cancellation_reason = 'Automatically cancelled due to non-payment'
        order.cancelled_at = timezone.now()
        order.save()
        count += 1
        
        # Send notification to customer
        send_order_status_update.delay(order.id)
    
    return f"Auto-cancelled {count} unpaid orders"

from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone

from .models import Order
from payments.models import Payment
from notifications.models import Notification


@receiver(pre_save, sender=Order)
def auto_confirm_cash_payment_on_delivery(sender, instance, **kwargs):
    """
    Автоматически подтверждает оплату наличными
    когда статус заказа меняется на DELIVERED
    """
    # Проверяем что это не новый объект
    if instance.pk:
        try:
            # Получаем старый объект из БД
            old_order = Order.objects.get(pk=instance.pk)
            
            # Проверяем что статус изменился на DELIVERED
            if old_order.status != 'DELIVERED' and instance.status == 'DELIVERED':
                
                # Проверяем что заказ ещё не оплачен
                if not instance.is_paid:
                    
                    # Ищем платёж наличными
                    try:
                        payment = Payment.objects.get(
                            order=instance,
                            payment_method='CASH',
                            status='PENDING'
                        )
                        
                        # Подтверждаем оплату
                        payment.status = 'SUCCEEDED'
                        payment.paid_at = timezone.now()
                        payment.save()
                        
                        # Отмечаем заказ как оплаченный
                        instance.is_paid = True
                        instance.delivered_at = timezone.now()
                        
                        # Отправляем уведомление клиенту
                        Notification.objects.create(
                            user=instance.user,
                            title='Заказ доставлен',
                            message=f'Ваш заказ {instance.order_number} успешно доставлен и оплачен. Приятного аппетита!',
                            is_read=False
                        )
                        
                        print(f"✅ Автоподтверждение оплаты наличными для заказа {instance.order_number}")
                        
                    except Payment.DoesNotExist:
                        # Если платёж не наличными или уже подтверждён - ничего не делаем
                        pass
                        
        except Order.DoesNotExist:
            # Новый заказ, ничего не делаем
            pass
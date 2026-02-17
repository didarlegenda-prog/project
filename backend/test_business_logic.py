#!/usr/bin/env python
"""
Тестирование бизнес-логики Restaurant Management System
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
from django.db.models import Avg, Sum

from users.models import User, Address
from restaurants.models import Restaurant, Table, Review
from menu.models import MenuItem, MenuCategory
from orders.models import Order, OrderItem
from payments.models import Payment
from reservations.models import Reservation
from inventory.models import InventoryItem, StockMovement

print("🧪 ТЕСТИРОВАНИЕ БИЗНЕС-ЛОГИКИ")
print("="*60)

# ==========================================
# ТЕСТ 1: Создание заказа
# ==========================================
print("\n📝 ТЕСТ 1: Создание заказа с расчётом стоимости")
print("-"*60)

try:
    customer = User.objects.get(email='arman.almaty@gmail.com')
    restaurant = Restaurant.objects.get(slug='nomad-restaurant')
    
    # Создаём адрес доставки
    address, _ = Address.objects.get_or_create(
        user=customer,
        defaults={
            'street_address': 'мкр. Аксай-4, д. 12',
            'city': 'Алматы',
            'postal_code': '050000',
            'country': 'Казахстан',
            'is_default': True
        }
    )
    
    # Создаём заказ
    # Создаём заказ
    order = Order.objects.create(
        user=customer,
        restaurant=restaurant,
        order_type='DELIVERY',
        status='PENDING',
        delivery_address=address,
        delivery_instructions='Позвонить за 5 минут',
        subtotal=Decimal('0'),      # ← ДОБАВЬ ЭТО
        tax=Decimal('0'),           # ← И ЭТО
        delivery_fee=Decimal('0'),  # ← И ЭТО
        total=Decimal('0')          # ← И ЭТО
)
    
    # Добавляем блюда
    beshbarmak = MenuItem.objects.get(name='Бешбармак классический')
    baursak = MenuItem.objects.get(name='Баурсаки (10 шт)')
    
    OrderItem.objects.create(
        order=order,
        menu_item=beshbarmak,
        quantity=2,
        unit_price=beshbarmak.price,
        subtotal=beshbarmak.price * 2
    )
    
    OrderItem.objects.create(
        order=order,
        menu_item=baursak,
        quantity=1,
        unit_price=baursak.price,
        subtotal=baursak.price
    )
    
    # Рассчитываем стоимость
    order.subtotal = sum(item.subtotal for item in order.items.all())
    order.tax = order.subtotal * Decimal('0.10')
    order.delivery_fee = Decimal('500')
    order.total = order.subtotal + order.tax + order.delivery_fee
    order.save()
    
    print(f"✅ Заказ создан: {order.order_number}")
    print(f"   Ресторан: {restaurant.name}")
    print(f"   Клиент: {customer.get_full_name()}")
    print(f"   Блюд: {order.items.count()}")
    print(f"   Подытог: {order.subtotal} ₸")
    print(f"   НДС (10%): {order.tax} ₸")
    print(f"   Доставка: {order.delivery_fee} ₸")
    print(f"   ИТОГО: {order.total} ₸")
    print("\n   Состав заказа:")
    for item in order.items.all():
        print(f"     • {item.menu_item.name} x{item.quantity} = {item.subtotal} ₸")
    
except Exception as e:
    print(f"❌ ОШИБКА: {e}")

# ==========================================
# ТЕСТ 2: Оплата заказа
# ==========================================
print("\n💳 ТЕСТ 2: Обработка оплаты")
print("-"*60)

try:
    order = Order.objects.filter(is_paid=False).first()
    
    if order:
        payment = Payment.objects.create(
            order=order,
            user=order.user,
            amount=order.total,
            currency='KZT',
            payment_method='CARD',
            status='PROCESSING'
        )
        
        print(f"⏳ Обработка платежа...")
        print(f"   Заказ: {order.order_number}")
        print(f"   Сумма: {payment.amount} ₸")
        print(f"   Метод: {payment.get_payment_method_display()}")
        
        # Симулируем успешную оплату
        payment.status = 'SUCCEEDED'
        payment.paid_at = timezone.now()
        payment.save()
        
        order.is_paid = True
        order.status = 'CONFIRMED'
        order.save()
        
        print(f"✅ Платёж успешен!")
        print(f"   Статус платежа: {payment.get_status_display()}")
        print(f"   Статус заказа: {order.get_status_display()}")
        print(f"   Оплачено: {payment.paid_at.strftime('%Y-%m-%d %H:%M')}")
    else:
        print("ℹ️  Нет неоплаченных заказов для теста")
    
except Exception as e:
    print(f"❌ ОШИБКА: {e}")

# ==========================================
# ТЕСТ 3: Бронирование столика
# ==========================================
print("\n📅 ТЕСТ 3: Бронирование столика")
print("-"*60)

try:
    customer = User.objects.get(email='nurlan.shymkent@gmail.com')
    restaurant = Restaurant.objects.get(slug='dastarkhan')
    
    table = restaurant.tables.filter(capacity__gte=4, is_available=True).first()
    
    if table:
        reservation = Reservation.objects.create(
            user=customer,
            restaurant=restaurant,
            table=table,
            guests_count=4,
            reservation_date=(timezone.now() + timedelta(days=3)).date(),
            reservation_time='18:30',
            status='CONFIRMED',
            special_requests='Тихое место для деловой встречи',
            phone=customer.phone if hasattr(customer, 'phone') else '+77773456789',
            email=customer.email
        )
        
        print(f"✅ Бронирование создано!")
        print(f"   Ресторан: {restaurant.name}")
        print(f"   Клиен��: {customer.get_full_name()}")
        print(f"   Столик: №{table.table_number} (на {table.capacity} чел.)")
        print(f"   Дата: {reservation.reservation_date}")
        print(f"   Время: {reservation.reservation_time}")
        print(f"   Гостей: {reservation.guests_count}")
        print(f"   Пожелания: {reservation.special_requests}")
    else:
        print("❌ Нет доступных столиков")
    
except Exception as e:
    print(f"❌ ОШИБКА: {e}")

# ==========================================
# ТЕСТ 4: Списание инвентаря при заказе
# ==========================================
print("\n📦 ТЕСТ 4: Управление инвентарём")
print("-"*60)

try:
    restaurant = Restaurant.objects.get(slug='samarkand')
    
    rice = InventoryItem.objects.get(restaurant=restaurant, name='Рис девзира')
    meat = InventoryItem.objects.get(restaurant=restaurant, name='Баранина для плова')
    
    print(f"📊 Текущие остатки:")
    print(f"   Рис девзира: {rice.current_quantity} {rice.unit}")
    print(f"   Баранина: {meat.current_quantity} {meat.unit}")
    
    # Симулируем заказ плова
    rice_needed = Decimal('0.4')
    meat_needed = Decimal('0.2')
    
    if rice.current_quantity >= rice_needed and meat.current_quantity >= meat_needed:
        # Списываем со склада
        rice.current_quantity -= rice_needed
        rice.save()
        
        meat.current_quantity -= meat_needed
        meat.save()
        
        # Создаём записи о движении (если есть нужные поля)
        try:
            StockMovement.objects.create(
                inventory_item=rice,
                movement_type='OUT',
                quantity=rice_needed,
                notes='Использовано для заказа плова'
            )
            
            StockMovement.objects.create(
                inventory_item=meat,
                movement_type='OUT',
                quantity=meat_needed,
                notes='Использовано для заказа плова'
            )
        except:
            pass
        
        print(f"\n✅ Инвентарь списан для заказа")
        print(f"   Списано риса: {rice_needed} {rice.unit}")
        print(f"   Списано мяса: {meat_needed} {meat.unit}")
        print(f"\n📊 Остатки после списания:")
        print(f"   Рис девзира: {rice.current_quantity} {rice.unit}")
        print(f"   Баранина: {meat.current_quantity} {meat.unit}")
        
        if rice.current_quantity <= rice.minimum_quantity:
            print(f"⚠️  ВНИМАНИЕ: Низкий запас риса!")
        if meat.current_quantity <= meat.minimum_quantity:
            print(f"⚠️  ВНИМАНИЕ: Низкий запас баранины!")
    else:
        print("❌ Недостаточно ингредиентов на складе")
    
except Exception as e:
    print(f"❌ ОШИБКА: {e}")

# ==========================================
# ТЕСТ 5: Применение промокода
# ==========================================
print("\n🎁 ТЕСТ 5: Применение промокода")
print("-"*60)

try:
    from promotions.models import Promotion
    
    customer = User.objects.get(email='assel.astana@gmail.com')
    restaurant = Restaurant.objects.get(slug='nomad-restaurant')
    promo = Promotion.objects.filter(code='NAVRUZ2026').first()
    
    if promo:
        # Создаём адрес
        address, _ = Address.objects.get_or_create(
            user=customer,
            defaults={
                'street_address': 'ул. Кунаева, 25',
                'city': 'Астана',
                'postal_code': '010000',
                'country': 'Казахстан',
                'is_default': True
            }
        )
        
        # Создаём заказ
        # Создаём заказ
        order = Order.objects.create(
            user=customer,
            restaurant=restaurant,
            order_type='DELIVERY',
            status='PENDING',
            delivery_address=address,
            subtotal=Decimal('0'),      # ← ДОБАВЬ ЭТО
            tax=Decimal('0'),           # ← И ЭТО
            delivery_fee=Decimal('0'),  # ← И ЭТО
            total=Decimal('0')          # ← И ЭТО
)
        
        # Добавляем блюдо
        beshbarmak = MenuItem.objects.get(name='Бешбармак классический')
        OrderItem.objects.create(
            order=order,
            menu_item=beshbarmak,
            quantity=1,
            unit_price=beshbarmak.price,
            subtotal=beshbarmak.price
        )
        
        # Рассчитываем без промокода
        order.subtotal = beshbarmak.price
        order.tax = order.subtotal * Decimal('0.10')
        order.delivery_fee = Decimal('500')
        order.total = order.subtotal + order.tax + order.delivery_fee
        
        print(f"📝 Заказ без промокода:")
        print(f"   Подытог: {order.subtotal} ₸")
        print(f"   НДС: {order.tax} ₸")
        print(f"   Доставка: {order.delivery_fee} ₸")
        print(f"   Итого: {order.total} ₸")
        
        # Применяем промокод
        if hasattr(promo, 'discount_percentage') and promo.discount_percentage:
            discount_amount = order.subtotal * (promo.discount_percentage / 100)
        elif hasattr(promo, 'discount_amount') and promo.discount_amount:
            discount_amount = promo.discount_amount
        else:
            discount_amount = Decimal('0')
        
        order.discount = discount_amount
        order.total = order.subtotal - discount_amount + order.tax + order.delivery_fee
        order.save()
        
        promo.usage_count += 1
        promo.save()
        
        print(f"\n🎁 Применён промокод '{promo.code}':")
        print(f"   Название: {promo.name}")
        print(f"   Сумма скидки: {discount_amount} ₸")
        print(f"   ИТОГО К ОПЛАТЕ: {order.total} ₸")
        print(f"   Экономия: {discount_amount} ₸")
    else:
        print("ℹ️  Промокод не найден")
    
except Exception as e:
    print(f"❌ ОШИБКА: {e}")

# ==========================================
# ТЕСТ 6: Расчёт рейтинга ресторана
# ==========================================
print("\n⭐ ТЕСТ 6: Расчёт рейтинга ресторана")
print("-"*60)

try:
    restaurant = Restaurant.objects.get(slug='nomad-restaurant')
    reviews = restaurant.reviews.all()
    
    if reviews.exists():
        avg_rating = reviews.aggregate(Avg('rating'))['rating__avg']
        restaurant.average_rating = round(avg_rating, 2)
        restaurant.total_reviews = reviews.count()
        restaurant.save()
        
        print(f"📊 Статистика отзывов для '{restaurant.name}':")
        print(f"   Всего отзывов: {reviews.count()}")
        print(f"   Средний рейтинг: {restaurant.average_rating} ⭐")
        print(f"\n   Последние отзывы:")
        
        for review in reviews[:3]:
            print(f"   • {review.user.get_full_name()}: {review.rating}⭐")
            print(f"     {review.comment[:60]}...")
    else:
        print(f"ℹ️  У ресторана '{restaurant.name}' пока нет отзывов")
    
except Exception as e:
    print(f"❌ ОШИБКА: {e}")

# ==========================================
# ТЕСТ 7: Автоотмена неоплаченных заказов
# ==========================================
print("\n⏰ ТЕСТ 7: Автоотмена неоплаченных заказов")
print("-"*60)

try:
    cutoff_time = timezone.now() - timedelta(minutes=30)
    old_unpaid_orders = Order.objects.filter(
        status='PENDING',
        is_paid=False,
        created_at__lt=cutoff_time
    )
    
    count = old_unpaid_orders.count()
    
    if count > 0:
        print(f"🔍 Найдено {count} неоплаченных заказов старше 30 минут")
        
        for order in old_unpaid_orders:
            order.status = 'CANCELLED'
            order.cancellation_reason = 'Автоматическая отмена из-за неоплаты'
            order.cancelled_at = timezone.now()
            order.save()
            
            print(f"   ❌ Отменён заказ {order.order_number}")
            print(f"      Создан: {order.created_at.strftime('%Y-%m-%d %H:%M')}")
            print(f"      Сумма: {order.total} ₸")
        
        print(f"\n✅ Отменено заказов: {count}")
    else:
        print("ℹ️  Нет заказов для автоотмены")
    
except Exception as e:
    print(f"❌ ОШИБКА: {e}")

# ==========================================
# ИТОГОВАЯ СТАТИСТИКА
# ==========================================
print("\n" + "="*60)
print("📊 ИТОГОВАЯ СТАТИСТИКА СИСТЕМЫ")
print("="*60)

try:
    print(f"\n👥 ПОЛЬЗОВАТЕЛИ:")
    print(f"   Владельцев ресторанов: {User.objects.filter(role='RESTAURANT_OWNER').count()}")
    print(f"   Клиентов: {User.objects.filter(role='CUSTOMER').count()}")
    
    print(f"\n🍽️ РЕСТОРАНЫ:")
    print(f"   Всего: {Restaurant.objects.count()}")
    print(f"   Активных: {Restaurant.objects.filter(status='ACTIVE').count()}")
    
    print(f"\n📋 МЕНЮ:")
    print(f"   Категорий: {MenuCategory.objects.count()}")
    print(f"   Блюд: {MenuItem.objects.count()}")
    print(f"   Доступных блюд: {MenuItem.objects.filter(is_available=True).count()}")
    
    print(f"\n🛒 ЗАКАЗЫ:")
    total_orders = Order.objects.count()
    paid_orders = Order.objects.filter(is_paid=True).count()
    total_revenue = Order.objects.filter(is_paid=True).aggregate(Sum('total'))['total__sum'] or 0
    
    print(f"   Всего заказов: {total_orders}")
    print(f"   Оплаченных: {paid_orders}")
    print(f"   Выручка: {total_revenue} ₸")
    
    print(f"\n📅 БРОНИРОВАНИЯ:")
    print(f"   Всего: {Reservation.objects.count()}")
    print(f"   Подтверждённых: {Reservation.objects.filter(status='CONFIRMED').count()}")
    
    print(f"\n⭐ ОТЗЫВЫ:")
    reviews_count = Review.objects.count()
    avg_rating = Review.objects.aggregate(Avg('rating'))['rating__avg'] or 0
    print(f"   Всего отзывов: {reviews_count}")
    print(f"   Средний рейтинг: {round(avg_rating, 2)}⭐")
    
except Exception as e:
    print(f"❌ ОШИБКА: {e}")

print("\n" + "="*60)
print("✅ ТЕСТИРОВАНИЕ ЗАВЕРШЕНО!")
print("="*60)
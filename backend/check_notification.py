#!/usr/bin/env python
"""
Тест реальной отправки уведомлений
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.conf import settings
from notifications.models import Notification
from users.models import User

print("🧪 ТЕСТ РЕАЛЬНОЙ ОТПРАВКИ УВЕДОМЛЕНИЙ")
print("="*70)

# ==========================================
# 1. ПРОВЕРКА EMAIL
# ==========================================
print("\n📧 1. ПРОВЕРКА EMAIL")
print("-"*70)

print(f"EMAIL_BACKEND: {settings.EMAIL_BACKEND}")

if hasattr(settings, 'EMAIL_HOST'):
    print(f"EMAIL_HOST: {settings.EMAIL_HOST}")
    print(f"EMAIL_PORT: {settings.EMAIL_PORT}")
    print(f"EMAIL_USE_TLS: {getattr(settings, 'EMAIL_USE_TLS', False)}")
    print(f"EMAIL_HOST_USER: {settings.EMAIL_HOST_USER if hasattr(settings, 'EMAIL_HOST_USER') else 'Не задан'}")
    
    if 'console' in settings.EMAIL_BACKEND:
        print("\n⚠️  CONSOLE BACKEND - письма выводятся в консоль (НЕ отправляются)")
    elif 'smtp' in settings.EMAIL_BACKEND.lower():
        print("\n✅ SMTP BACKEND - письма готовы к отправке")
        
        # Пробуем отправить тестовое письмо
        print("\n📤 Попытка отправить тестовое письмо...")
        try:
            from django.core.mail import send_mail
            
            result = send_mail(
                subject='Тест уведомлений Restaurant Management',
                message='Это тестовое письмо для проверки отправки.',
                from_email=settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'noreply@restaurant.kz',
                recipient_list=['test@example.com'],
                fail_silently=False,
            )
            
            print(f"✅ Письмо отправлено (результат: {result})")
            
        except Exception as e:
            print(f"❌ Ошибка отправки: {e}")
            print("💡 Нужно настроить SMTP credentials в .env")
else:
    print("⚠️  EMAIL_HOST не настроен")

# ==========================================
# 2. ПРОВЕРКА SMS
# ==========================================
print("\n📱 2. ПРОВЕРКА SMS")
print("-"*70)

# Проверяем Twilio
if hasattr(settings, 'TWILIO_ACCOUNT_SID'):
    print(f"✅ TWILIO_ACCOUNT_SID: {settings.TWILIO_ACCOUNT_SID[:10]}...")
    print(f"✅ TWILIO_AUTH_TOKEN: {'*' * 10}")
    
    if hasattr(settings, 'TWILIO_PHONE_NUMBER'):
        print(f"✅ TWILIO_PHONE_NUMBER: {settings.TWILIO_PHONE_NUMBER}")
    
    # Пробуем отправить тестовое SMS
    print("\n📤 Попытка отправить тестовое SMS...")
    try:
        from twilio.rest import Client
        
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        
        # НЕ ОТПРАВЛЯЕМ РЕАЛЬНО, только проверяем что модуль работает
        print("✅ Twilio Client инициализирован")
        print("💡 Реальная отправка отключена в тесте")
        
    except ImportError:
        print("❌ Модуль twilio не установлен")
        print("💡 Установи: pip install twilio")
    except Exception as e:
        print(f"❌ Ошибка инициализации Twilio: {e}")
else:
    print("❌ Twilio не настроен")
    print("💡 Нужно добавить в .env:")
    print("   TWILIO_ACCOUNT_SID=your_account_sid")
    print("   TWILIO_AUTH_TOKEN=your_auth_token")
    print("   TWILIO_PHONE_NUMBER=+1234567890")

# ==========================================
# 3. ПРОВЕРКА PUSH
# ==========================================
print("\n🔔 3. ПРОВЕРКА PUSH УВЕДОМЛЕНИЙ")
print("-"*70)

# Проверяем Firebase
if hasattr(settings, 'FIREBASE_API_KEY') or hasattr(settings, 'FCM_SERVER_KEY'):
    print("✅ Firebase настроен")
    
    # Проверяем модуль
    try:
        import firebase_admin
        print("✅ firebase-admin установлен")
    except ImportError:
        print("❌ firebase-admin не установлен")
        print("💡 Установи: pip install firebase-admin")
        
elif hasattr(settings, 'ONESIGNAL_API_KEY'):
    print("✅ OneSignal настроен")
    
else:
    print("❌ Push провайдер не настроен")
    print("💡 Нужно настроить Firebase или OneSignal")

# ==========================================
# 4. ПРОВЕРКА ФУНКЦИЙ ОТПРАВКИ
# ==========================================
print("\n🔍 4. ПРОВЕРКА ФУНКЦИЙ ОТПРАВКИ")
print("-"*70)

# Ищем файлы с функциями отправки
import os

notifications_dir = os.path.join(os.path.dirname(__file__), 'notifications')

files_to_check = [
    'email.py',
    'sms.py',
    'push.py',
    'send.py',
    'utils.py',
]

print("\nПроверка наличия модулей:")
for filename in files_to_check:
    filepath = os.path.join(notifications_dir, filename)
    if os.path.exists(filepath):
        print(f"✅ {filename} существует")
        
        # Проверяем функции внутри
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
                if 'send_email' in content or 'send_mail' in content:
                    print(f"   📧 Найдена функция отправки Email")
                if 'send_sms' in content:
                    print(f"   📱 Найдена функция отправки SMS")
                if 'send_push' in content:
                    print(f"   🔔 Найдена функция отправки Push")
                    
        except Exception as e:
            print(f"   ⚠️  Ошибка чтения файла: {e}")
    else:
        print(f"❌ {filename} не найден")

# ==========================================
# 5. ТЕСТ СОЗДАНИЯ УВЕДОМЛЕНИЯ
# ==========================================
print("\n🧪 5. ТЕСТ СОЗДАНИЯ УВЕДОМЛЕНИЯ")
print("-"*70)

try:
    user = User.objects.filter(role='CUSTOMER').first()
    
    if user:
        # Создаём тестовое уведомление
        notification = Notification.objects.create(
            user=user,
            notification_type='TEST',
            title='Тестов��е уведомление',
            message='Проверка системы уведомлений',
            is_read=False,
            sent_email=False,
            sent_sms=False,
            sent_push=False
        )
        
        print(f"✅ Создано уведомление ID: {notification.id}")
        print(f"   Для: {user.get_full_name()}")
        print(f"   sent_email: {notification.sent_email}")
        print(f"   sent_sms: {notification.sent_sms}")
        print(f"   sent_push: {notification.sent_push}")
        
        print("\n💡 Уведомление создано в БД, но email/sms/push НЕ отправлены")
        print("   Нужны функции для реальной отправки")
        
    else:
        print("⚠️  Нет пользователей для теста")
        
except Exception as e:
    print(f"❌ Ошибка: {e}")

# ==========================================
# ИТОГ
# ==========================================
print("\n" + "="*70)
print("📊 ИТОГ")
print("="*70)

print("\n✅ ЧТО ЕСТЬ:")
print("  • Модели Notification и NotificationSettings")
print("  • Поля sent_email, sent_sms, sent_push")
print("  • Настройки пользователей")

print("\n⚠️  ЧТО НУЖНО:")
print("  • Функции для реальной отправки email")
print("  • Функции для реальной отправки SMS")
print("  • Функции для реальной отправки Push")
print("  • Signal или Celery task для автоотправки")

print("\n💡 РЕКОМЕНДАЦИЯ:")
print("  Инфраструктура готова на 80%")
print("  Нужно добавить функции отправки и автоматизацию")
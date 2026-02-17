# 🐍 Django REST API Backend

Backend API for Restaurant Management Platform.

## 📁 Structure

```
backend/
├── config/          # Django settings & URLs
├── core/            # Core utilities & permissions
├── users/           # User management
├── restaurants/     # Restaurant management
├── menu/            # Menu management
├── orders/          # Order processing
├── reservations/    # Table reservations
├── payments/        # Payment processing
├── inventory/       # Inventory tracking
├── notifications/   # Notification system
├── support/         # Support tickets
├── developers/      # API keys & webhooks
├── promotions/      # Promotions & coupons
└── analytics/       # Analytics & reports
```

## 🚀 Local Development

### Setup

1. Install dependencies
```bash
cd backend
pip install -r requirements.txt
```

2. Create `.env` file
```bash
cp .env.example .env
```

3. Run migrations
```bash
python manage.py migrate
```

4. Create superuser
```bash
python manage.py createsuperuser
```

5. Run development server
```bash
python manage.py runserver
```

### Run with Docker

```bash
# From project root
docker-compose up backend
```

## 🧪 Testing

```bash
python manage.py test
```

## 📚 API Documentation

After starting the server:
- Swagger UI: http://localhost:8000/swagger/
- ReDoc: http://localhost:8000/redoc/

## 🔐 Environment Variables

See `.env.example` for all required environment variables.

Key variables:
- `SECRET_KEY` - Django secret key
- `DEBUG` - Debug mode (True/False)
- `DB_*` - Database configuration
- `REDIS_HOST` - Redis host
- `STRIPE_SECRET_KEY` - Stripe API key
- `EMAIL_*` - Email configuration

## 📦 Dependencies

See `requirements.txt` for full list.

Main packages:
- Django 5.1.14
- djangorestframework
- celery
- psycopg2-binary
- redis
- stripe

## 🎯 Features

- ✅ JWT Authentication
- ✅ Role-based access control
- ✅ RESTful API
- ✅ Swagger documentation
- ✅ Celery async tasks
- ✅ Redis caching
- ✅ Stripe payments
- ✅ Email notifications

## 📞 Support

For issues and questions, create a GitHub issue.

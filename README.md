# Restaurant Management Platform - Backend

A comprehensive production-ready Django REST API for managing restaurants, menus, orders, reservations, payments, and more.

## 🎯 Features

### Core Features
- **User Management**: Registration, authentication, profile management, role-based access (Customer, Restaurant Owner, Staff, Admin)
- **Restaurant Management**: Full CRUD operations, reviews, ratings, image galleries
- **Menu Management**: Categories and items with dietary information, allergen tracking
- **Order Management**: Complete order lifecycle with status tracking, delivery/pickup/dine-in
- **Reservation System**: Table booking with availability checking, no-show detection
- **Payment Processing**: Stripe integration with webhooks, refunds
- **Inventory Management**: Stock tracking, low stock alerts, movement history
- **Notifications**: Email, SMS, and push notifications with user preferences
- **Support System**: Ticketing system with comments and assignment
- **Promotions**: Discount codes with usage limits and validity periods
- **Analytics**: Daily sales reports, revenue trends, popular items tracking
- **Developer APIs**: API key management, webhooks for third-party integrations

### Technical Features
- JWT Authentication
- RESTful API design
- Swagger/OpenAPI documentation
- Celery for async tasks
- Redis for caching and task queue
- PostgreSQL database (SQLite for development)
- Role-based permissions
- Comprehensive data validation
- Automated daily reports

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- PostgreSQL (optional, SQLite works for development)
- Redis (for Celery tasks)
- pip

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd project
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Environment configuration**
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Run migrations**
```bash
python manage.py migrate
```

6. **Create superuser**
```bash
python manage.py createsuperuser
```

7. **Run development server**
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/`

### Running with Celery

In separate terminals:

```bash
# Terminal 1: Celery Worker
celery -A config worker -l info

# Terminal 2: Celery Beat (for scheduled tasks)
celery -A config beat -l info

# Terminal 3: Django Development Server
python manage.py runserver
```

## 📚 API Documentation

Once the server is running, access the API documentation at:

- **Swagger UI**: http://localhost:8000/swagger/
- **ReDoc**: http://localhost:8000/redoc/

## 🏗️ Project Structure

```
project/
├── config/                 # Django settings and configuration
│   ├── settings.py        # Main settings file
│   ├── urls.py            # Root URL configuration
│   └── celery.py          # Celery configuration
├── core/                   # Shared utilities
│   └── permissions.py     # Custom permission classes
├── users/                  # User management
├── restaurants/            # Restaurant management
├── menu/                   # Menu and items
├── orders/                 # Order processing
├── reservations/           # Table reservations
├── payments/               # Payment processing
├── inventory/              # Stock management
├── notifications/          # Notification system
├── support/                # Customer support
├── promotions/             # Promo codes and discounts
├── analytics/              # Reports and analytics
├── developers/             # API keys and webhooks
├── manage.py              # Django management script
├── requirements.txt       # Python dependencies
└── .env.example          # Environment variables template
```

## 🔑 API Endpoints

### Authentication
- `POST /api/v1/auth/register/` - User registration
- `POST /api/v1/auth/login/` - JWT token login
- `POST /api/v1/auth/token/refresh/` - Refresh JWT token
- `GET /api/v1/auth/profile/` - Get user profile
- `PATCH /api/v1/auth/profile/update/` - Update profile
- `POST /api/v1/auth/change-password/` - Change password
- `POST /api/v1/auth/change-email/` - Change email

### Restaurants
- `GET /api/v1/restaurants/` - List restaurants
- `POST /api/v1/restaurants/` - Create restaurant (owner only)
- `GET /api/v1/restaurants/{id}/` - Restaurant details
- `PUT/PATCH /api/v1/restaurants/{id}/` - Update restaurant
- `DELETE /api/v1/restaurants/{id}/` - Delete restaurant
- `GET /api/v1/restaurants/{id}/reviews/` - List reviews
- `POST /api/v1/restaurants/{id}/reviews/` - Create review

### Menu
- `GET /api/v1/menu/categories/` - List menu categories
- `POST /api/v1/menu/categories/` - Create category
- `GET /api/v1/menu/items/` - List menu items
- `POST /api/v1/menu/items/` - Create menu item

### Orders
- `GET /api/v1/orders/` - List orders (filtered by role)
- `POST /api/v1/orders/` - Create order
- `GET /api/v1/orders/{id}/` - Order details
- `PATCH /api/v1/orders/{id}/` - Update order status

### Reservations
- `GET /api/v1/reservations/` - List reservations
- `POST /api/v1/reservations/` - Create reservation
- `GET /api/v1/reservations/{id}/` - Reservation details
- `PATCH /api/v1/reservations/{id}/` - Update reservation

### Payments
- `GET /api/v1/payments/` - List payments
- `POST /api/v1/payments/` - Create payment intent
- `POST /api/v1/payments/webhooks/stripe/` - Stripe webhook

### Other Endpoints
See API documentation for complete list of endpoints for:
- Inventory management
- Notifications
- Support tickets
- Promotions
- Analytics
- Developer tools

## 🔐 Authentication

This API uses JWT (JSON Web Tokens) for authentication.

1. **Register** or login to get access and refresh tokens
2. **Include** the access token in requests:
   ```
   Authorization: Bearer <your-access-token>
   ```
3. **Refresh** the access token when it expires using the refresh token

## 👥 User Roles

- **CUSTOMER**: Can place orders, make reservations, leave reviews
- **RESTAURANT_OWNER**: Can manage their restaurants, menu, orders, reservations
- **STAFF**: Can help manage restaurant operations
- **ADMIN**: Full system access

## 🔧 Configuration

Key environment variables (see `.env.example`):

```bash
# Django
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=restaurant_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Celery
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

## 📦 Dependencies

Core dependencies:
- Django 4.2.7
- Django REST Framework 3.14.0
- djangorestframework-simplejwt 5.3.0
- drf-yasg 1.21.7 (API documentation)
- celery 5.3.4
- redis 5.0.1
- stripe 7.7.0
- Pillow 10.1.0

See `requirements.txt` for complete list.

## 🧪 Testing

```bash
# Run all tests
python manage.py test

# Run tests for specific app
python manage.py test users

# Run with coverage
coverage run manage.py test
coverage report
```

## 📝 Database Models

### Core Models
- **User**: Custom user model with role-based access
- **Restaurant**: Restaurant information and settings
- **MenuItem**: Menu items with pricing and availability
- **Order**: Orders with items and delivery information
- **Reservation**: Table reservations
- **Payment**: Payment transactions
- **Review**: Restaurant reviews and ratings

See models in each app for complete schema.

## 🔄 Celery Tasks

Automated tasks:
- **Every 15 minutes**: Auto-cancel unpaid orders
- **Hourly**: Mark no-show reservations
- **Daily at 9 AM**: Check low stock alerts
- **Daily at 12:30 AM**: Generate daily sales reports

## 🛠️ Development

### Running Tests
```bash
python manage.py test
```

### Creating Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Admin Interface
Access Django admin at: http://localhost:8000/admin/

## 🚀 Deployment

### Production Settings
1. Set `DEBUG=False`
2. Configure proper `SECRET_KEY`
3. Set up PostgreSQL database
4. Configure Redis for production
5. Set up proper `ALLOWED_HOSTS`
6. Configure email backend (SMTP)
7. Set up Stripe production keys
8. Configure static files serving
9. Set up proper logging

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📧 Contact

For questions or support, please contact: contact@restaurant.local

## 🙏 Acknowledgments

Built with Django REST Framework and modern best practices for API development.

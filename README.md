# 🍽️ Restaurant Management Platform

Complete restaurant management system with Django REST Framework backend.

## 📁 Project Structure

```
project/
├── backend/          # Django REST API
├── frontend/         # React frontend (coming soon)
├── docker-compose.yml
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### Installation

1. Clone repository
```bash
git clone https://github.com/didarlegenda-prog/project.git
cd project
```

2. Create environment file
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your settings
```

3. Start services
```bash
docker-compose up -d
```

4. Run migrations
```bash
docker-compose exec backend python manage.py migrate
```

5. Create superuser
```bash
docker-compose exec backend python manage.py createsuperuser
```

6. Access
- **Backend API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/
- **Swagger Docs**: http://localhost:8000/swagger/
- **Redoc**: http://localhost:8000/redoc/

## 📚 Documentation

- Backend documentation: [`backend/README.md`](backend/README.md)
- Implementation summary: [`backend/IMPLEMENTATION_SUMMARY.md`](backend/IMPLEMENTATION_SUMMARY.md)
- Security advisory: [`backend/SECURITY_ADVISORY.md`](backend/SECURITY_ADVISORY.md)

## 🛠️ Technology Stack

### Backend
- Django 5.1.14
- Django REST Framework
- PostgreSQL 16
- Redis 7
- Celery

## 📝 License

MIT License

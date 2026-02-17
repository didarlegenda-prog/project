# 🍽️ FoodApp Frontend

A modern, full-featured React frontend for a food delivery platform built with Vite, React 19, Tailwind CSS, and Stripe integration.

## 🚀 Features

### ✅ Complete Module Coverage
- **Authentication** - Login, register, JWT token management
- **Restaurant Catalog** - Browse, search, and filter restaurants
- **Menu System** - View menu items by category with full details
- **Shopping Cart** - Add items, update quantities, apply promo codes
- **Checkout** - Multiple order types, address selection, Stripe payment
- **Order Management** - Order history, tracking, status updates
- **Reservations** - Table booking with date/time selection
- **User Profile** - Profile management, preferences, image upload
- **Address Management** - CRUD operations for delivery addresses
- **Notifications** - Real-time notifications with settings
- **Support System** - Create and manage support tickets
- **Reviews** - Rate and review restaurants

### 🎨 UI/UX Features
- Responsive design (mobile, tablet, desktop)
- Clean, modern interface with Tailwind CSS
- Loading states and error handling
- Toast notifications for user feedback
- Modal dialogs for forms and details
- Empty states for better UX
- Protected routes with authentication

### 🔐 Security
- JWT authentication with auto-refresh
- Protected API routes
- Secure Stripe payment integration
- Input validation and sanitization

## 📦 Tech Stack

- **React 19** - Latest React features
- **Vite** - Fast build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Query** - Data fetching and caching
- **React Hook Form** - Form validation
- **Stripe Elements** - Payment processing
- **date-fns** - Date formatting
- **react-hot-toast** - Toast notifications
- **lucide-react** - Icon library

## 🛠️ Installation

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and set your values:
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

3. **Start development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/              # API client and modules
│   │   ├── client.js     # Axios instance with interceptors
│   │   ├── auth.js       # Authentication APIs
│   │   ├── restaurants.js
│   │   ├── menu.js
│   │   ├── orders.js
│   │   ├── payments.js
│   │   ├── reservations.js
│   │   ├── promotions.js
│   │   ├── notifications.js
│   │   ├── support.js
│   │   ├── reviews.js
│   │   ├── users.js
│   │   └── addresses.js
│   ├── components/       # Reusable components
│   │   ├── layout/       # Header, Footer, Sidebar
│   │   ├── common/       # Button, Input, Modal, etc.
│   │   ├── restaurant/   # Restaurant cards and filters
│   │   ├── menu/         # Menu items and categories
│   │   ├── cart/         # Cart items and summary
│   │   ├── order/        # Order cards and tracking
│   │   ├── payment/      # Payment forms
│   │   ├── reservation/  # Reservation components
│   │   ├── notification/ # Notification items
│   │   ├── support/      # Support tickets
│   │   └── review/       # Review forms and cards
│   ├── context/          # Context providers
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── NotificationContext.jsx
│   ├── hooks/            # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   └── useNotifications.js
│   ├── pages/            # Page components
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── RestaurantPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── ReservationsPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── AddressesPage.jsx
│   │   ├── NotificationsPage.jsx
│   │   ├── SupportPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── utils/            # Utility functions
│   │   ├── constants.js  # App constants
│   │   ├── formatters.js # Date/currency formatters
│   │   └── validators.js # Form validators
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # App entry point
│   └── index.css         # Global styles
├── .env.example          # Environment variables template
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── README.md
```

## 🔑 Key Features Implementation

### Authentication Flow
- JWT tokens stored in localStorage
- Automatic token refresh on 401 errors
- Protected routes redirect to login
- User profile persisted across sessions

### Shopping Cart
- Items persist in localStorage
- Restaurant validation (can't mix restaurants)
- Quantity controls
- Promo code validation
- Real-time total calculation

### Checkout Process
1. Select order type (Delivery, Pickup, Dine-In)
2. Choose/add delivery address
3. Select payment method (Card or Cash)
4. Complete Stripe payment (if card)
5. Place order and redirect to orders page

### Order Tracking
- Real-time status updates
- Visual progress tracker
- Order history with filters
- Cancel pending orders
- Reorder functionality

## 🎨 Color Scheme

- **Primary:** Blue (#3B82F6)
- **Success:** Green (#10B981)
- **Warning:** Yellow (#F59E0B)
- **Error:** Red (#EF4444)
- **Background:** Gray shades
- **Text:** Dark Gray (#1F2937)

## 📱 Responsive Breakpoints

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

## 🔄 State Management

- **Auth State:** Context API + localStorage
- **Cart State:** Context API + localStorage
- **Notification State:** Context API + polling
- **Server State:** React Query for caching and fetching

## 🛡️ Security Best Practices

- Input validation on all forms
- XSS protection via React's built-in escaping
- CSRF protection via JWT tokens
- Secure payment handling through Stripe
- Environment variables for sensitive data
- HTTPOnly cookies not used (JWT in localStorage)

## 📝 Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Known Issues

- None at this time

## 📞 Support

For issues and questions, please use the support ticket system within the app.

## 🎯 Future Enhancements

- Real-time order tracking with websockets
- Push notifications
- Social authentication (Google, Facebook)
- Advanced search and filtering
- Restaurant favorites
- Order scheduling
- Multiple language support
- Dark mode

---

Built with ❤️ using React and Vite

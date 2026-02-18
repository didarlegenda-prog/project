import { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [promoCode, setPromoCode] = useState(null);
  const [discount, setDiscount] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedRestaurant = localStorage.getItem('cart_restaurant');
    const savedPromo = localStorage.getItem('promo_code');
    
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    if (savedRestaurant) {
      setRestaurant(JSON.parse(savedRestaurant));
    }
    if (savedPromo) {
      setPromoCode(JSON.parse(savedPromo));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    if (restaurant) {
      localStorage.setItem('cart_restaurant', JSON.stringify(restaurant));
    } else {
      localStorage.removeItem('cart_restaurant');
    }
  }, [cartItems, restaurant]);

  const addToCart = (item, restaurantInfo) => {
    // Check if cart is from different restaurant
    if (restaurant && restaurant.id !== restaurantInfo.id) {
      const confirm = window.confirm(
        'Your cart contains items from another restaurant. Do you want to clear it and add items from this restaurant?'
      );
      if (!confirm) return;
      clearCart();
    }

    // Set restaurant if not set
    if (!restaurant) {
      setRestaurant(restaurantInfo);
    }

    // Check if item already in cart
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      // Update quantity
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
      toast.success(`${item.name} quantity updated!`, {
        icon: '🛒',
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: '#fff',
          fontWeight: 'bold',
        },
      });
    } else {
      // Add new item
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
      toast.success(`${item.name} added to cart!`, {
        icon: '🛒',
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: '#fff',
          fontWeight: 'bold',
        },
      });
    }
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    
    // Clear restaurant if cart is empty
    if (updatedCart.length === 0) {
      setRestaurant(null);
      setPromoCode(null);
      setDiscount(0);
    }
    
    toast.success('Item removed from cart');
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurant(null);
    setPromoCode(null);
    setDiscount(0);
    localStorage.removeItem('cart');
    localStorage.removeItem('cart_restaurant');
    localStorage.removeItem('promo_code');
    toast.success('Cart cleared');
  };

  const applyPromoCode = (code, discountAmount) => {
    setPromoCode(code);
    setDiscount(discountAmount);
    localStorage.setItem('promo_code', JSON.stringify({ code, discount: discountAmount }));
    toast.success('Promo code applied!');
  };

  const removePromoCode = () => {
    setPromoCode(null);
    setDiscount(0);
    localStorage.removeItem('promo_code');
    toast.success('Promo code removed');
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    // Prices from API are in cents (8400 = $84.00)
    // Divide by 100 to convert to dollars
    const priceInDollars = item.price / 100;
    return sum + (priceInDollars * item.quantity);
  }, 0);
  const tax = subtotal * 0.08; // 8% tax
  const deliveryFee = restaurant?.delivery_fee ? restaurant.delivery_fee / 100 : 0; // Also convert delivery fee from cents
  const total = subtotal + tax + deliveryFee - discount;

  const value = {
    cartItems,
    restaurant,
    promoCode,
    discount,
    subtotal,
    tax,
    deliveryFee,
    total,
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyPromoCode,
    removePromoCode,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

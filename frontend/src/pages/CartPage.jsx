import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import PromoCodeInput from '../components/cart/PromoCodeInput';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { ShoppingCart } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    cartItems,
    restaurant,
    promoCode,
    discount,
    subtotal,
    tax,
    deliveryFee,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            message="Add some delicious items to get started!"
            action={
              <Link to="/">
                <Button>Browse Restaurants</Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <Button variant="ghost" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Restaurant Info */}
              {restaurant && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {restaurant.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Order from {restaurant.name}
                  </p>
                </div>
              )}

              {/* Items */}
              <div className="space-y-0">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Promo Code */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <PromoCodeInput
                  onApply={applyPromoCode}
                  currentPromo={promoCode}
                  onRemove={removePromoCode}
                  orderData={{
                    restaurant: restaurant?.id,
                    subtotal: subtotal,
                  }}
                />
              </div>

              {/* Summary */}
              <CartSummary
                subtotal={subtotal}
                tax={tax}
                deliveryFee={deliveryFee}
                discount={discount}
                total={total}
              />

              {/* Checkout Button */}
              <Button
                fullWidth
                size="lg"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>

              {/* Continue Shopping */}
              <Link to="/" className="block">
                <Button variant="outline" fullWidth>
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

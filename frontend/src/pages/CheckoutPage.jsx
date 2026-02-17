import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '../hooks/useCart';
import { useQuery } from '@tanstack/react-query';
import { addressesAPI } from '../api/addresses';
import { ordersAPI } from '../api/orders';
import { paymentsAPI } from '../api/payments';
import CartSummary from '../components/cart/CartSummary';
import PaymentMethodSelector from '../components/payment/PaymentMethodSelector';
import StripeCheckoutForm from '../components/payment/StripeCheckoutForm';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';
import { ORDER_TYPES, PAYMENT_METHODS } from '../utils/constants';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_fake');

const CheckoutPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    restaurant,
    promoCode,
    discount,
    subtotal,
    tax,
    deliveryFee,
    total,
    clearCart,
  } = useCart();

  const [orderType, setOrderType] = useState(ORDER_TYPES.DELIVERY);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.CARD);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const { data: addressesData } = useQuery({
    queryKey: ['addresses'],
    queryFn: addressesAPI.getAll,
  });

  const addresses = addressesData?.results || addressesData || [];

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find(addr => addr.is_default) || addresses[0];
      setSelectedAddress(defaultAddr?.id);
    }
  }, [cartItems, addresses, selectedAddress, navigate]);

  const createOrder = async (paymentData = {}) => {
    const orderData = {
      restaurant: restaurant.id,
      order_type: orderType,
      payment_method: paymentMethod,
      items: cartItems.map(item => ({
        menu_item: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: subtotal,
      tax: tax,
      delivery_fee: deliveryFee,
      discount: discount,
      total_amount: total,
      promo_code: promoCode,
      ...paymentData,
    };

    if (orderType === ORDER_TYPES.DELIVERY && selectedAddress) {
      orderData.delivery_address = selectedAddress;
    }

    return await ordersAPI.create(orderData);
  };

  const handleCardPayment = async (paymentMethodData) => {
    setIsProcessing(true);
    try {
      // Create payment intent
      const paymentIntent = await paymentsAPI.createPaymentIntent({
        amount: total,
        payment_method: paymentMethodData.id,
      });

      // Create order with payment info
      const order = await createOrder({
        payment_intent_id: paymentIntent.id,
      });

      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders`);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCashPayment = async () => {
    setIsProcessing(true);
    try {
      const order = await createOrder();
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders`);
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onSubmit = async (data) => {
    if (paymentMethod === PAYMENT_METHODS.CASH) {
      await handleCashPayment();
    }
    // Card payment is handled by StripeCheckoutForm
  };

  if (cartItems.length === 0) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Type */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Type</h2>
                <div className="space-y-3">
                  {Object.values(ORDER_TYPES).map((type) => (
                    <label
                      key={type}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        orderType === type
                          ? 'border-primary bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="order-type"
                        value={type}
                        checked={orderType === type}
                        onChange={() => setOrderType(type)}
                        className="mr-3"
                      />
                      <span className="font-medium text-gray-900">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              {orderType === ORDER_TYPES.DELIVERY && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Delivery Address
                  </h2>
                  
                  {addresses.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-600 mb-4">No addresses saved</p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/addresses')}
                      >
                        Add Address
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {addresses.map((address) => (
                        <label
                          key={address.id}
                          className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedAddress === address.id
                              ? 'border-primary bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            value={address.id}
                            checked={selectedAddress === address.id}
                            onChange={() => setSelectedAddress(address.id)}
                            className="mt-1 mr-3"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {address.label || 'Address'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.street}, {address.city}, {address.state} {address.zip_code}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Payment Method
                </h2>
                <PaymentMethodSelector
                  selected={paymentMethod}
                  onChange={setPaymentMethod}
                />

                {/* Stripe Card Form */}
                {paymentMethod === PAYMENT_METHODS.CARD && (
                  <div className="mt-6">
                    <Elements stripe={stripePromise}>
                      <StripeCheckoutForm
                        amount={total}
                        onSuccess={handleCardPayment}
                        onError={() => setIsProcessing(false)}
                      />
                    </Elements>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <CartSummary
                  subtotal={subtotal}
                  tax={tax}
                  deliveryFee={deliveryFee}
                  discount={discount}
                  total={total}
                />

                {/* Place Order Button (for cash payment) */}
                {paymentMethod === PAYMENT_METHODS.CASH && (
                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    loading={isProcessing}
                    className="mt-4"
                  >
                    Place Order
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;

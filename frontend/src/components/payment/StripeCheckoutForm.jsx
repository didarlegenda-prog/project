import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const StripeCheckoutForm = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        toast.error(error.message);
        onError?.(error);
      } else {
        onSuccess?.(paymentMethod);
      }
    } catch (error) {
      toast.error('Payment processing failed');
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#1F2937',
        '::placeholder': {
          color: '#9CA3AF',
        },
      },
      invalid: {
        color: '#EF4444',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-dark-300 rounded-lg">
        <CardElement options={cardElementOptions} />
      </div>

      <div className="flex items-center justify-between text-sm text-dark-600">
        <span>Total Amount:</span>
        <span className="text-lg font-semibold text-dark-900">
          ${amount?.toFixed(2)}
        </span>
      </div>

      <Button
        type="submit"
        fullWidth
        loading={isProcessing}
        disabled={!stripe || isProcessing}
      >
        Pay ${amount?.toFixed(2)}
      </Button>

      <p className="text-xs text-dark-500 text-center">
        Your payment information is secure and encrypted
      </p>
    </form>
  );
};

export default StripeCheckoutForm;

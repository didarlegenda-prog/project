import { CreditCard, Banknote } from 'lucide-react';
import { PAYMENT_METHODS } from '../../utils/constants';

const PaymentMethodSelector = ({ selected, onChange }) => {
  const paymentMethods = [
    {
      id: PAYMENT_METHODS.CARD,
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Pay securely with Stripe',
    },
    {
      id: PAYMENT_METHODS.CASH,
      name: 'Cash on Delivery',
      icon: Banknote,
      description: 'Pay when you receive your order',
    },
  ];

  return (
    <div className="space-y-3">
      {paymentMethods.map((method) => (
        <label
          key={method.id}
          className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
            selected === method.id
              ? 'border-primary bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <input
            type="radio"
            name="payment-method"
            value={method.id}
            checked={selected === method.id}
            onChange={() => onChange(method.id)}
            className="mt-1 mr-3"
          />
          <div className="flex-1">
            <div className="flex items-center">
              <method.icon className="h-5 w-5 mr-2 text-gray-700" />
              <span className="font-medium text-gray-900">{method.name}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{method.description}</p>
          </div>
        </label>
      ))}
    </div>
  );
};

export default PaymentMethodSelector;

import { formatCurrency } from '../../utils/formatters';

const CartSummary = ({ subtotal, tax, deliveryFee, discount, total }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="flex justify-between text-gray-600">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      <div className="flex justify-between text-gray-600">
        <span>Tax (8%)</span>
        <span>{formatCurrency(tax)}</span>
      </div>

      <div className="flex justify-between text-gray-600">
        <span>Delivery Fee</span>
        <span>
          {deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}
        </span>
      </div>

      {discount > 0 && (
        <div className="flex justify-between text-success-600 font-medium">
          <span>Discount</span>
          <span>-{formatCurrency(discount)}</span>
        </div>
      )}

      <div className="border-t border-gray-300 pt-3 mt-3">
        <div className="flex justify-between text-lg font-semibold text-gray-900">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;

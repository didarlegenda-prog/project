import { Check } from 'lucide-react';
import { ORDER_STATUSES } from '../../utils/constants';

const OrderStatusTracker = ({ currentStatus }) => {
  const statusSteps = [
    { key: ORDER_STATUSES.PENDING, label: 'Pending' },
    { key: ORDER_STATUSES.CONFIRMED, label: 'Confirmed' },
    { key: ORDER_STATUSES.PREPARING, label: 'Preparing' },
    { key: ORDER_STATUSES.READY, label: 'Ready' },
    { key: ORDER_STATUSES.OUT_FOR_DELIVERY, label: 'Out for Delivery' },
    { key: ORDER_STATUSES.DELIVERED, label: 'Delivered' },
  ];

  // Remove OUT_FOR_DELIVERY for non-delivery orders
  const filteredSteps = statusSteps;

  const getCurrentStepIndex = () => {
    const index = filteredSteps.findIndex((step) => step.key === currentStatus);
    return index >= 0 ? index : 0;
  };

  const currentStepIndex = getCurrentStepIndex();
  const isCancelled = currentStatus === ORDER_STATUSES.CANCELLED;

  if (isCancelled) {
    return (
      <div className="text-center py-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-100 text-error mb-2">
          <span className="text-2xl">❌</span>
        </div>
        <p className="font-medium text-error">Order Cancelled</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between">
        {filteredSteps.map((step, index) => (
          <div key={step.key} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="relative flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  index <= currentStepIndex
                    ? 'bg-primary border-primary text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {index < currentStepIndex ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              
              {/* Label */}
              <p
                className={`mt-2 text-xs font-medium text-center ${
                  index <= currentStepIndex ? 'text-primary' : 'text-gray-400'
                }`}
              >
                {step.label}
              </p>
            </div>

            {/* Connector Line */}
            {index < filteredSteps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  index < currentStepIndex ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusTracker;

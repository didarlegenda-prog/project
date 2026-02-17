import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersAPI } from '../api/orders';
import OrderCard from '../components/order/OrderCard';
import OrderStatusTracker from '../components/order/OrderStatusTracker';
import Modal from '../components/common/Modal';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { Package } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersAPI.getAll({ ordering: '-created_at' }),
  });

  const orders = data?.results || data || [];

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await ordersAPI.cancel(orderId);
      toast.success('Order cancelled successfully');
      refetch();
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to cancel order');
    }
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            message="You haven't placed any orders yet. Start ordering now!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={handleOrderClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Order #${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Status Tracker */}
            <OrderStatusTracker currentStatus={selectedOrder.status} />

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">{formatDateTime(selectedOrder.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Type:</span>
                  <span className="font-medium">{selectedOrder.order_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">{selectedOrder.payment_method}</span>
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.quantity}x {item.menu_item?.name || item.name}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatCurrency(selectedOrder.total_amount || selectedOrder.total)}</span>
              </div>
            </div>

            {/* Actions */}
            {selectedOrder.status === 'PENDING' && (
              <Button
                variant="danger"
                fullWidth
                onClick={() => handleCancelOrder(selectedOrder.id)}
              >
                Cancel Order
              </Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage;

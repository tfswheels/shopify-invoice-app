import { ShoppingCart, Calendar, Mail, DollarSign } from 'lucide-react';

const OrdersList = ({ orders, onSelectOrder, selectedOrderId }) => {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Found</h3>
        <p className="text-gray-600">Orders from your Shopify store will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        <p className="text-sm text-gray-600">Click an order to preview invoice</p>
      </div>

      <div className="divide-y max-h-[600px] overflow-y-auto">
        {orders.map((order) => (
          <OrderItem
            key={order.id}
            order={order}
            isSelected={order.id === selectedOrderId}
            onClick={() => onSelectOrder(order)}
          />
        ))}
      </div>
    </div>
  );
};

const OrderItem = ({ order, isSelected, onClick }) => {
  const statusColors = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    authorized: 'bg-blue-100 text-blue-800',
    refunded: 'bg-red-100 text-red-800',
    voided: 'bg-gray-100 text-gray-800'
  };

  const statusColor = statusColors[order.status] || 'bg-gray-100 text-gray-800';

  return (
    <div
      onClick={onClick}
      className={`px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${
        isSelected ? 'bg-blue-50 border-l-4 border-blue-600' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-900 mr-3">
              {order.orderNumber}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
              {order.status}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              <span>{order.customerName || 'Guest'}</span>
              {order.customerEmail && (
                <span className="ml-2 text-gray-500">({order.customerEmail})</span>
              )}
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{new Date(order.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="text-right ml-4">
          <div className="flex items-center text-lg font-bold text-gray-900">
            <DollarSign className="w-5 h-5" />
            {order.amount.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {order.currency}
          </div>
        </div>
      </div>

      {order.lineItems && order.lineItems.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-600">
            {order.lineItems.length} item{order.lineItems.length !== 1 ? 's' : ''}
            {order.lineItems.length > 0 && `: ${order.lineItems[0].title}`}
            {order.lineItems.length > 1 && ` +${order.lineItems.length - 1} more`}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrdersList;

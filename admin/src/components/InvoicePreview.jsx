import { X, Download, Send, FileText } from 'lucide-react';

const InvoicePreview = ({ order, onClose }) => {
  if (!order) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Order Selected</h3>
        <p className="text-gray-600">Select an order to preview invoice</p>
      </div>
    );
  }

  const invoiceDate = new Date(order.date).toLocaleDateString();
  const dueDate = new Date(new Date(order.date).setDate(new Date(order.date).getDate() + 30)).toLocaleDateString();

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between text-white">
        <div className="flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          <h2 className="text-lg font-semibold">Invoice Preview</h2>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-1 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Invoice Content */}
      <div className="p-6">
        {/* Invoice Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h1>
          <div className="flex justify-between text-sm">
            <div>
              <p className="text-gray-600">Invoice Number</p>
              <p className="font-semibold text-gray-900">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Status</p>
              <p className="font-semibold text-gray-900 capitalize">{order.status}</p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
          <div>
            <p className="text-xs text-gray-600 mb-1">Invoice Date</p>
            <p className="text-sm font-medium text-gray-900">{invoiceDate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Due Date</p>
            <p className="text-sm font-medium text-gray-900">{dueDate}</p>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Bill To:</h3>
          <div className="text-sm text-gray-700">
            <p className="font-medium">{order.customerName || 'Guest Customer'}</p>
            {order.customerEmail && <p>{order.customerEmail}</p>}
            {order.billingAddress && (
              <div className="mt-2">
                {order.billingAddress.address1 && <p>{order.billingAddress.address1}</p>}
                {order.billingAddress.address2 && <p>{order.billingAddress.address2}</p>}
                <p>
                  {order.billingAddress.city && `${order.billingAddress.city}, `}
                  {order.billingAddress.province && `${order.billingAddress.province} `}
                  {order.billingAddress.zip}
                </p>
                {order.billingAddress.country && <p>{order.billingAddress.country}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Items:</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Item</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">Qty</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Price</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.lineItems?.map((item, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 text-gray-900">
                      {item.title}
                      {item.sku && (
                        <span className="block text-xs text-gray-500">SKU: {item.sku}</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center text-gray-900">{item.quantity}</td>
                    <td className="px-3 py-2 text-right text-gray-900">${item.price.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right font-medium text-gray-900">
                      ${item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="border-t pt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900 font-medium">
                ${order.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-900 font-medium">$0.00</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span className="text-gray-900">Total</span>
              <span className="text-blue-600">
                ${order.amount.toFixed(2)} {order.currency}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-6 border-t space-y-2">
          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
          <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
            <Send className="w-4 h-4 mr-2" />
            Send Invoice
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-xs text-gray-500 text-center">
            Thank you for your business!
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;

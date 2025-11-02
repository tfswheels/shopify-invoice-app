import { useState } from 'react';
import { Store, ArrowRight } from 'lucide-react';

const ShopifyAuth = ({ onAuthenticated }) => {
  const [shopDomain, setShopDomain] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = (e) => {
    e.preventDefault();

    if (!shopDomain) {
      alert('Please enter your shop domain');
      return;
    }

    // Clean up the shop domain
    let cleanDomain = shopDomain.trim().toLowerCase();

    // Remove https:// or http://
    cleanDomain = cleanDomain.replace(/^https?:\/\//, '');

    // Add .myshopify.com if not present
    if (!cleanDomain.includes('.myshopify.com')) {
      cleanDomain = cleanDomain.replace(/\/$/, '') + '.myshopify.com';
    }

    setLoading(true);

    // Redirect to OAuth
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    window.location.href = `${apiUrl}/auth/shopify?shop=${cleanDomain}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Store className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Invoice App
            </h1>
            <p className="text-gray-600">
              Connect your Shopify store to get started
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label htmlFor="shop" className="block text-sm font-medium text-gray-700 mb-2">
                Shop Domain
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="shop"
                  value={shopDomain}
                  onChange={(e) => setShopDomain(e.target.value)}
                  placeholder="yourstore.myshopify.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Enter your Shopify store domain
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Connecting...
                </>
              ) : (
                <>
                  Connect to Shopify
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> You'll be redirected to Shopify to authorize this app.
              Make sure the app is installed on your store first.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Need help? Check the documentation
        </p>
      </div>
    </div>
  );
};

export default ShopifyAuth;

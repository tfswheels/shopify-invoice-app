import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ShopifyAuth from './components/ShopifyAuth';

function App() {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check URL parameters for shop
    const params = new URLSearchParams(window.location.search);
    const shopParam = params.get('shop');
    const host = params.get('host');

    if (shopParam) {
      // Store shop in localStorage
      localStorage.setItem('shopify_shop', shopParam);
      if (host) {
        localStorage.setItem('shopify_host', host);
      }
      setShop(shopParam);

      // Clean URL
      window.history.replaceState({}, document.title, '/');
    } else {
      // Check localStorage
      const storedShop = localStorage.getItem('shopify_shop');
      if (storedShop) {
        setShop(storedShop);
      }
    }

    setLoading(false);
  }, []);

  const handleAuthenticated = (shopDomain) => {
    setShop(shopDomain);
  };

  const handleLogout = () => {
    localStorage.removeItem('shopify_shop');
    localStorage.removeItem('shopify_host');
    setShop(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show dashboard if authenticated, otherwise show auth page
  return shop ? (
    <Dashboard shop={shop} onLogout={handleLogout} />
  ) : (
    <ShopifyAuth onAuthenticated={handleAuthenticated} />
  );
}

export default App;

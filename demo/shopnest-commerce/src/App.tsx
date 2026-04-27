import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { StoreLayout } from './pages/storefront/StoreLayout';
import { Home } from './pages/storefront/Home';
import { ProductList } from './pages/storefront/ProductList';
import { ProductDetail } from './pages/storefront/ProductDetail';
import { Cart } from './pages/storefront/Cart';
import { Checkout } from './pages/storefront/Checkout';

import { DashboardLayout } from './pages/dashboard/DashboardLayout';
import { Overview } from './pages/dashboard/Overview';
import { ProductsAdmin } from './pages/dashboard/ProductsAdmin';
import { OrdersAdmin } from './pages/dashboard/OrdersAdmin';
import { SettingsAdmin } from './pages/dashboard/SettingsAdmin';
import { CouponsAdmin } from './pages/dashboard/CouponsAdmin';

function App() {
  return (
    <BrowserRouter basename="/demos/shopnest-commerce">
      <Routes>
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="products" element={<ProductsAdmin />} />
          <Route path="orders" element={<OrdersAdmin />} />
          <Route path="coupons" element={<CouponsAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

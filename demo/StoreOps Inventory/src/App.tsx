/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { ProductsLayout } from './pages/products/ProductsLayout';
import { ProductList } from './pages/products/ProductList';
import { Settings } from './pages/Settings';
import { Suppliers } from './pages/Suppliers';
import { Inventory } from './pages/Inventory';
import { Reports } from './pages/Reports';
import { Orders } from './pages/Orders';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppLayout />,
      children: [
        {
          index: true,
          element: <Dashboard />
        },
        {
          path: 'products',
          element: <ProductsLayout />,
          children: [
            { index: true, element: <ProductList /> }
          ]
        },
        {
          path: 'inventory',
          element: <Inventory />
        },
        {
          path: 'orders',
          element: <Orders />
        },
        {
          path: 'suppliers',
          element: <Suppliers />
        },
        {
          path: 'reports',
          element: <Reports />
        },
        {
          path: 'settings',
          element: <Settings />
        },
        {
          path: '*',
          element: <Navigate to="/" replace />
        }
      ]
    }
  ],
  {
    basename: '/demos/storeops-inventory'
  },
);

export default function App() {
  return <RouterProvider router={router} />;
}

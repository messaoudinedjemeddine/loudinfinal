'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export default function TestOrderPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testOrder = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const testOrderData = {
        customerName: 'Test Customer',
        customerPhone: '0550123456',
        deliveryType: 'HOME_DELIVERY' as const,
        wilayaId: 5,
        deliveryAddress: 'Test Address',
        items: [{
          productId: 'cmet35r760001tsmc4t8nqvke', // iPhone 15 Pro
          quantity: 1
        }]
      };

      console.log('🧪 Testing order creation with data:', testOrderData);
      
      const response = await api.orders.create(testOrderData);
      
      console.log('✅ Order created successfully:', response);
      setResult(response);
    } catch (err: any) {
      console.error('❌ Order creation failed:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testDirectAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const testOrderData = {
        customerName: 'Test Customer',
        customerPhone: '0550123456',
        deliveryType: 'HOME_DELIVERY',
        wilayaId: 5,
        deliveryAddress: 'Test Address',
        items: [{
          productId: 'cmet35r760001tsmc4t8nqvke', // iPhone 15 Pro
          quantity: 1
        }]
      };

      console.log('🧪 Testing direct API call with data:', testOrderData);
      
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testOrderData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      
      console.log('✅ Direct API call successful:', data);
      setResult(data);
    } catch (err: any) {
      console.error('❌ Direct API call failed:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Order Creation Test</h1>
          
          <div className="space-y-4">
            <button
              onClick={testOrder}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Order Creation (via API client)'}
            </button>
            
            <button
              onClick={testDirectAPI}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Direct API Call'}
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <h3 className="font-bold">Error:</h3>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              <h3 className="font-bold">Success:</h3>
              <pre className="mt-2 text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client'

import { ShippingDashboard } from '@/components/admin/shipping-dashboard';

export default function AdminShippingPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Shipping Management</h1>
        <p className="text-muted-foreground">
          Manage confirmed orders and create Yalidine shipments
        </p>
      </div>
      
      <ShippingDashboard />
    </div>
  );
} 
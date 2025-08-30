'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  DollarSign,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useLocaleStore } from '@/lib/locale-store'
import { DeliveryAgentDashboard } from './delivery-agent-dashboard'
import { OrderConfirmationDashboard } from './order-confirmation-dashboard'
import { ShippingRoleDashboard } from './shipping-role-dashboard'


// Types for dashboard data
interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  orderStatusBreakdown?: {
    NEW: number;
    CONFIRMED: number;
    IN_TRANSIT: number;
    DONE: number;
    CANCELED: number;
  };
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  total: number;
  callCenterStatus: string;
  deliveryStatus: string;
  createdAt: string;
  items: Array<{
    productId: string;
    quantity: number;
    product: {
      name: string;
      nameAr?: string;
    };
  }>;
}

interface LowStockProduct {
  id: string;
  name: string;
  nameAr?: string;
  stock: number;
  image: string;
  price: number;
}

const statusColors = {
  NEW: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELED: 'bg-red-100 text-red-800',
  NO_RESPONSE: 'bg-gray-100 text-gray-800'
}

export function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t, isRTL, direction } = useLocaleStore()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') || 'orders'
  
  // Dashboard data state
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([])

  const statusLabels = {
    NEW: t?.common?.new || 'New',
    CONFIRMED: 'Confirmed',
    CANCELED: 'Canceled',
    NO_RESPONSE: 'No Response',
    NOT_READY: 'Not Ready',
    READY: 'Ready',
    IN_TRANSIT: 'In Transit',
    DONE: 'Delivered'
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all dashboard data in parallel
      const [statsData, ordersData, lowStockData] = await Promise.all([
        api.admin.getDashboardStats(),
        api.admin.getRecentOrders(),
        api.admin.getLowStockProducts()
      ])

      setStats(statsData as DashboardStats)
      setRecentOrders(ordersData as Order[])
      setLowStockProducts(lowStockData as LowStockProduct[])

    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{t?.common?.loading || 'Loading...'}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchDashboardData}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8" dir={direction}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t?.admin?.sidebarTitle || 'Admin Dashboard'}</h1>
        <p className="text-muted-foreground">
          Complete overview of your e-commerce platform. Manage products, orders, users, and analytics.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className={`flex flex-row items-center justify-between pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <CardTitle className="text-sm font-medium">{t?.admin?.products || 'Products'}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                Active products in store
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className={`flex flex-row items-center justify-between pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <CardTitle className="text-sm font-medium">{t?.admin?.orders || 'Orders'}</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                All time orders
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className={`flex flex-row items-center justify-between pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <CardTitle className="text-sm font-medium">{t?.admin?.users || 'Users'}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered users
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className={`flex flex-row items-center justify-between pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} DA</div>
              <p className="text-xs text-muted-foreground">
                All time revenue
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

              {/* Tabs for Recent Orders, Low Stock, Order Confirmation, Delivery Agent, and Shipping */}
      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock Alert</TabsTrigger>
          <TabsTrigger value="order-confirmation">Order Confirmation</TabsTrigger>
          <TabsTrigger value="delivery-agent">Delivery Agent</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Clock className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No recent orders</p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className={`flex items-center justify-between p-4 border rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="flex-1">
                        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} mb-2`}>
                          <h4 className="font-medium">{order.customerName}</h4>
                          <Badge variant="outline">{order.customerPhone}</Badge>
                        </div>
                        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'} text-sm text-muted-foreground`}>
                          <span>{order.items.length} items</span>
                          <span>{order.total.toLocaleString()} DA</span>
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                        <Badge className={statusColors[order.callCenterStatus as keyof typeof statusColors]}>
                          {statusLabels[order.callCenterStatus as keyof typeof statusLabels]}
                        </Badge>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="low-stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <AlertTriangle className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                Low Stock Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No low stock products</p>
              ) : (
                <div className="space-y-4">
                  {lowStockProducts.map((product) => (
                    <div key={product.id} className={`flex items-center justify-between p-4 border rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Stock: {product.stock} units
                          </p>
                        </div>
                      </div>
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                        <span className="text-sm font-medium">{product.price.toLocaleString()} DA</span>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="order-confirmation" className="space-y-4">
          <OrderConfirmationDashboard />
        </TabsContent>

        <TabsContent value="delivery-agent" className="space-y-4">
          <DeliveryAgentDashboard />
        </TabsContent>

        <TabsContent value="shipping" className="space-y-4">
          <ShippingRoleDashboard />
        </TabsContent>

      </Tabs>
    </div>
  )
} 
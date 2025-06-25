'use client'

import { useState, useEffect } from 'react'
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
  NO_RESPONSE: 'bg-gray-100 text-gray-800',
  NOT_READY: 'bg-gray-100 text-gray-800',
  READY: 'bg-yellow-100 text-yellow-800',
  IN_TRANSIT: 'bg-blue-100 text-blue-800',
  DONE: 'bg-green-100 text-green-800'
}

const statusLabels = {
  NEW: 'New',
  CONFIRMED: 'Confirmed',
  CANCELED: 'Canceled',
  NO_RESPONSE: 'No Response',
  NOT_READY: 'Not Ready',
  READY: 'Ready',
  IN_TRANSIT: 'In Transit',
  DONE: 'Delivered'
}

export function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Dashboard data state
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([])

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
          <p className="text-muted-foreground">Loading dashboard data...</p>
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Loudim Dashboard</h1>
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
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
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
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
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
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered customers
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
            <CardHeader className="flex flex-row items-center justify-between pb-2">
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

      {/* Dashboard Tabs */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock Alert</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge className={statusColors[order.callCenterStatus as keyof typeof statusColors]}>
                            {statusLabels[order.callCenterStatus as keyof typeof statusLabels]}
                          </Badge>
                          <Badge className={statusColors[order.deliveryStatus as keyof typeof statusColors]}>
                            {statusLabels[order.deliveryStatus as keyof typeof statusLabels]}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        {order.items.length} items • {order.total.toLocaleString()} DA
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/orders/${order.id}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="low-stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                        <p className="text-sm font-medium">${product.price}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          Update Stock
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button asChild className="h-20 flex-col">
                  <Link href="/admin/products/new">
                    <Package className="w-6 h-6 mb-2" />
                    Add Product
                  </Link>
                </Button>
                <Button asChild className="h-20 flex-col" variant="outline">
                  <Link href="/admin/categories/new">
                    <BarChart3 className="w-6 h-6 mb-2" />
                    Add Category
                  </Link>
                </Button>
                <Button asChild className="h-20 flex-col" variant="outline">
                  <Link href="/admin/users/new">
                    <Users className="w-6 h-6 mb-2" />
                    Add User
                  </Link>
                </Button>
                <Button asChild className="h-20 flex-col" variant="outline">
                  <Link href="/admin/analytics">
                    <TrendingUp className="w-6 h-6 mb-2" />
                    View Analytics
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 
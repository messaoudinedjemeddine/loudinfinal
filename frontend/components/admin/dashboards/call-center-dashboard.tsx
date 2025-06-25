'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Phone, 
  ShoppingCart, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Eye,
  MessageSquare,
  UserCheck
} from 'lucide-react'
import Link from 'next/link'
import { api } from '@/lib/api'

interface CallCenterStats {
  newOrders: number;
  confirmedOrders: number;
  canceledOrders: number;
  noResponseOrders: number;
  totalOrders: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  total: number;
  callCenterStatus: string;
  deliveryStatus: string;
  createdAt: string;
  notes?: string;
  items: Array<{
    productId: string;
    quantity: number;
    product: {
      name: string;
      nameAr?: string;
    };
  }>;
}

const statusColors = {
  NEW: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELED: 'bg-red-100 text-red-800',
  NO_RESPONSE: 'bg-gray-100 text-gray-800'
}

const statusLabels = {
  NEW: 'New',
  CONFIRMED: 'Confirmed',
  CANCELED: 'Canceled',
  NO_RESPONSE: 'No Response'
}

export function CallCenterDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<CallCenterStats>({
    newOrders: 0,
    confirmedOrders: 0,
    canceledOrders: 0,
    noResponseOrders: 0,
    totalOrders: 0
  })
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    fetchCallCenterData()
  }, [])

  const fetchCallCenterData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch call center specific data
      const [ordersData] = await Promise.all([
        api.admin.getRecentOrders()
      ])

      const ordersList = ordersData as Order[]
      setOrders(ordersList)

      // Calculate stats
      const stats = {
        newOrders: ordersList.filter(o => o.callCenterStatus === 'NEW').length,
        confirmedOrders: ordersList.filter(o => o.callCenterStatus === 'CONFIRMED').length,
        canceledOrders: ordersList.filter(o => o.callCenterStatus === 'CANCELED').length,
        noResponseOrders: ordersList.filter(o => o.callCenterStatus === 'NO_RESPONSE').length,
        totalOrders: ordersList.length
      }
      setStats(stats)

    } catch (err) {
      console.error('Error fetching call center data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.admin.updateOrderStatus(orderId, { callCenterStatus: status })
      fetchCallCenterData() // Refresh data
    } catch (err) {
      console.error('Error updating order status:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading call center data...</p>
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
          <Button onClick={fetchCallCenterData}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Call Center - Loudim Dashboard</h1>
        <p className="text-muted-foreground">
          Manage customer orders and communications. Track order status and customer interactions.
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
              <CardTitle className="text-sm font-medium">New Orders</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.newOrders}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting confirmation
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
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.confirmedOrders}</div>
              <p className="text-xs text-muted-foreground">
                Orders confirmed
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
              <CardTitle className="text-sm font-medium">No Response</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.noResponseOrders}</div>
              <p className="text-xs text-muted-foreground">
                Need follow-up
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
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                All orders today
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Orders Management */}
      <Tabs defaultValue="new" className="space-y-6">
        <TabsList>
          <TabsTrigger value="new">New Orders ({stats.newOrders})</TabsTrigger>
          <TabsTrigger value="no-response">No Response ({stats.noResponseOrders})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed ({stats.confirmedOrders})</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>New Orders - Require Confirmation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.filter(order => order.callCenterStatus === 'NEW').map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium">#{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground">{order.customerName}</p>
                            <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Badge className={statusColors[order.callCenterStatus as keyof typeof statusColors]}>
                              {statusLabels[order.callCenterStatus as keyof typeof statusLabels]}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {order.items.length} items • {order.total.toLocaleString()} DA • {new Date(order.createdAt).toLocaleString()}
                        </div>
                        {order.notes && (
                          <div className="mt-2 text-sm bg-muted p-2 rounded">
                            <strong>Notes:</strong> {order.notes}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => updateOrderStatus(order.id, 'CONFIRMED')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Confirm
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, 'CANCELED')}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {orders.filter(order => order.callCenterStatus === 'NEW').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No new orders to confirm
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="no-response" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Orders Requiring Follow-up</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.filter(order => order.callCenterStatus === 'NO_RESPONSE').map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium">#{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground">{order.customerName}</p>
                            <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Badge className={statusColors[order.callCenterStatus as keyof typeof statusColors]}>
                              {statusLabels[order.callCenterStatus as keyof typeof statusLabels]}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {order.items.length} items • {order.total.toLocaleString()} DA
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => updateOrderStatus(order.id, 'CONFIRMED')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Confirm
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, 'CANCELED')}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {orders.filter(order => order.callCenterStatus === 'NO_RESPONSE').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No orders requiring follow-up
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Confirmed Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.filter(order => order.callCenterStatus === 'CONFIRMED').map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium">#{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground">{order.customerName}</p>
                            <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Badge className={statusColors[order.callCenterStatus as keyof typeof statusColors]}>
                              {statusLabels[order.callCenterStatus as keyof typeof statusLabels]}
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
                  </div>
                ))}
                {orders.filter(order => order.callCenterStatus === 'CONFIRMED').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No confirmed orders
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="h-16 flex-col">
              <Link href="/admin/orders">
                <ShoppingCart className="w-6 h-6 mb-2" />
                View All Orders
              </Link>
            </Button>
            <Button asChild className="h-16 flex-col" variant="outline">
              <Link href="/admin/orders?status=new">
                <Clock className="w-6 h-6 mb-2" />
                New Orders
              </Link>
            </Button>
            <Button asChild className="h-16 flex-col" variant="outline">
              <Link href="/admin/orders?status=no_response">
                <MessageSquare className="w-6 h-6 mb-2" />
                Follow-up Required
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle,
  Loader2,
  Eye,
  AlertTriangle,
  Navigation,
  Phone,
  Package
} from 'lucide-react'
import Link from 'next/link'
import { api } from '@/lib/api'

interface DeliveryStats {
  readyOrders: number;
  inTransitOrders: number;
  deliveredOrders: number;
  totalDeliveries: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryType: string;
  deliveryAddress?: string;
  total: number;
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

const statusColors = {
  READY: 'bg-yellow-100 text-yellow-800',
  IN_TRANSIT: 'bg-blue-100 text-blue-800',
  DONE: 'bg-green-100 text-green-800'
}

const statusLabels = {
  READY: 'Ready',
  IN_TRANSIT: 'In Transit',
  DONE: 'Delivered'
}

export function DeliveryAgentDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DeliveryStats>({
    readyOrders: 0,
    inTransitOrders: 0,
    deliveredOrders: 0,
    totalDeliveries: 0
  })
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    fetchDeliveryData()
  }, [])

  const fetchDeliveryData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch delivery data
      const [ordersData] = await Promise.all([
        api.admin.getRecentOrders()
      ])

      const ordersList = ordersData as Order[]
      setOrders(ordersList)

      // Calculate stats
      const stats = {
        readyOrders: ordersList.filter(o => o.deliveryStatus === 'READY').length,
        inTransitOrders: ordersList.filter(o => o.deliveryStatus === 'IN_TRANSIT').length,
        deliveredOrders: ordersList.filter(o => o.deliveryStatus === 'DONE').length,
        totalDeliveries: ordersList.filter(o => o.deliveryStatus === 'READY' || o.deliveryStatus === 'IN_TRANSIT').length
      }
      setStats(stats)

    } catch (err) {
      console.error('Error fetching delivery data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const updateDeliveryStatus = async (orderId: string, status: string) => {
    try {
      await api.admin.updateOrderStatus(orderId, { deliveryStatus: status })
      fetchDeliveryData() // Refresh data
    } catch (err) {
      console.error('Error updating delivery status:', err)
    }
  }

  const handleCallCustomer = (phone: string) => {
    window.open(`tel:${phone}`, '_blank')
  }

  const handleNavigateToAddress = (address: string) => {
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading delivery data...</p>
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
          <Button onClick={fetchDeliveryData}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Delivery Management - Loudim Dashboard</h1>
        <p className="text-muted-foreground">
          Manage deliveries and track order status. Handle customer communications and navigation.
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
              <CardTitle className="text-sm font-medium">Ready for Pickup</CardTitle>
              <Package className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.readyOrders}</div>
              <p className="text-xs text-muted-foreground">
                Orders ready for pickup
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
              <CardTitle className="text-sm font-medium">In Transit</CardTitle>
              <Truck className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inTransitOrders}</div>
              <p className="text-xs text-muted-foreground">
                Currently delivering
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
              <CardTitle className="text-sm font-medium">Delivered Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.deliveredOrders}</div>
              <p className="text-xs text-muted-foreground">
                Successfully delivered
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
              <CardTitle className="text-sm font-medium">Total Active</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDeliveries}</div>
              <p className="text-xs text-muted-foreground">
                Active deliveries
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Delivery Management */}
      <Tabs defaultValue="ready" className="space-y-6">
        <TabsList>
          <TabsTrigger value="ready">Ready for Pickup ({stats.readyOrders})</TabsTrigger>
          <TabsTrigger value="in-transit">In Transit ({stats.inTransitOrders})</TabsTrigger>
          <TabsTrigger value="delivered">Delivered ({stats.deliveredOrders})</TabsTrigger>
        </TabsList>

        <TabsContent value="ready" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Orders Ready for Pickup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.filter(order => order.deliveryStatus === 'READY').map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium">#{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground">{order.customerName}</p>
                            <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.deliveryType === 'HOME_DELIVERY' ? 'Home Delivery' : 'Pickup'}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Badge className={statusColors[order.deliveryStatus as keyof typeof statusColors]}>
                              {statusLabels[order.deliveryStatus as keyof typeof statusLabels]}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {order.items.length} items • {order.total.toLocaleString()} DA • {new Date(order.createdAt).toLocaleString()}
                        </div>
                        {order.deliveryAddress && (
                          <div className="mt-2 text-sm bg-muted p-2 rounded">
                            <strong>Address:</strong> {order.deliveryAddress}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => updateDeliveryStatus(order.id, 'IN_TRANSIT')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Truck className="w-4 h-4 mr-1" />
                          Start Delivery
                        </Button>
                        {order.deliveryAddress && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleNavigateToAddress(order.deliveryAddress!)}
                          >
                            <Navigation className="w-4 h-4 mr-1" />
                            Navigate
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleCallCustomer(order.customerPhone)}
                        >
                          <Phone className="w-4 h-4 mr-1" />
                          Call
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
                {orders.filter(order => order.deliveryStatus === 'READY').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No orders ready for pickup
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="in-transit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Orders In Transit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.filter(order => order.deliveryStatus === 'IN_TRANSIT').map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium">#{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground">{order.customerName}</p>
                            <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.deliveryType === 'HOME_DELIVERY' ? 'Home Delivery' : 'Pickup'}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Badge className={statusColors[order.deliveryStatus as keyof typeof statusColors]}>
                              {statusLabels[order.deliveryStatus as keyof typeof statusLabels]}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {order.items.length} items • {order.total.toLocaleString()} DA
                        </div>
                        {order.deliveryAddress && (
                          <div className="mt-2 text-sm bg-muted p-2 rounded">
                            <strong>Address:</strong> {order.deliveryAddress}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => updateDeliveryStatus(order.id, 'DONE')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark Delivered
                        </Button>
                        {order.deliveryAddress && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleNavigateToAddress(order.deliveryAddress!)}
                          >
                            <Navigation className="w-4 h-4 mr-1" />
                            Navigate
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleCallCustomer(order.customerPhone)}
                        >
                          <Phone className="w-4 h-4 mr-1" />
                          Call
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
                {orders.filter(order => order.deliveryStatus === 'IN_TRANSIT').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No orders in transit
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivered" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivered Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.filter(order => order.deliveryStatus === 'DONE').map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium">#{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground">{order.customerName}</p>
                            <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.deliveryType === 'HOME_DELIVERY' ? 'Home Delivery' : 'Pickup'}
                            </p>
                          </div>
                          <div className="flex space-x-2">
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
                  </div>
                ))}
                {orders.filter(order => order.deliveryStatus === 'DONE').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No delivered orders today
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
              <Link href="/admin/orders?status=ready">
                <Package className="w-6 h-6 mb-2" />
                Ready Orders
              </Link>
            </Button>
            <Button asChild className="h-16 flex-col" variant="outline">
              <Link href="/admin/orders?status=in_transit">
                <Truck className="w-6 h-6 mb-2" />
                In Transit
              </Link>
            </Button>
            <Button asChild className="h-16 flex-col" variant="outline">
              <Link href="/admin/shipping">
                <MapPin className="w-6 h-6 mb-2" />
                Delivery Areas
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
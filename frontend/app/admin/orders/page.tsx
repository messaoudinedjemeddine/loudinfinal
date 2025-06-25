'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Eye,
  Phone,
  MapPin,
  Calendar,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/admin-layout'
import { api } from '@/lib/api'
import { toast } from 'sonner'

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail: string
  total: number
  deliveryType: 'HOME_DELIVERY' | 'PICKUP'
  deliveryAddress?: string
  city: string
  callCenterStatus: 'NEW' | 'CONFIRMED' | 'CANCELED' | 'NO_RESPONSE'
  deliveryStatus: 'NOT_READY' | 'READY' | 'IN_TRANSIT' | 'DONE'
  createdAt: string
  items: OrderItem[]
}

const callCenterStatusColors = {
  NEW: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELED: 'bg-red-100 text-red-800',
  NO_RESPONSE: 'bg-gray-100 text-gray-800'
}

const deliveryStatusColors = {
  NOT_READY: 'bg-gray-100 text-gray-800',
  READY: 'bg-yellow-100 text-yellow-800',
  IN_TRANSIT: 'bg-blue-100 text-blue-800',
  DONE: 'bg-green-100 text-green-800'
}

const callCenterStatusIcons = {
  NEW: Clock,
  CONFIRMED: CheckCircle,
  CANCELED: XCircle,
  NO_RESPONSE: Phone
}

const deliveryStatusIcons = {
  NOT_READY: Package,
  READY: Package,
  IN_TRANSIT: Truck,
  DONE: CheckCircle
}

export default function AdminOrdersPage() {
  const [mounted, setMounted] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [callCenterFilter, setCallCenterFilter] = useState('all')
  const [deliveryFilter, setDeliveryFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await api.admin.getOrders() as { orders: Order[] }
      setOrders(response.orders || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = [...orders]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerPhone.includes(searchQuery)
      )
    }

    // Call center status filter
    if (callCenterFilter !== 'all') {
      filtered = filtered.filter(order => order.callCenterStatus === callCenterFilter)
    }

    // Delivery status filter
    if (deliveryFilter !== 'all') {
      filtered = filtered.filter(order => order.deliveryStatus === deliveryFilter)
    }

    // City filter
    if (cityFilter !== 'all') {
      filtered = filtered.filter(order => order.city === cityFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchQuery, callCenterFilter, deliveryFilter, cityFilter])

  if (!mounted) return null

  const handleUpdateCallCenterStatus = async (orderId: string, status: string) => {
    try {
      await api.admin.updateOrderStatus(orderId, { callCenterStatus: status })
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, callCenterStatus: status as any } : order
      ))
      toast.success('Call center status updated')
    } catch (error) {
      console.error('Failed to update call center status:', error)
      toast.error('Failed to update call center status')
    }
  }

  const handleUpdateDeliveryStatus = async (orderId: string, status: string) => {
    try {
      await api.admin.updateOrderStatus(orderId, { deliveryStatus: status })
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, deliveryStatus: status as any } : order
      ))
      toast.success('Delivery status updated')
    } catch (error) {
      console.error('Failed to update delivery status:', error)
      toast.error('Failed to update delivery status')
    }
  }

  const cities = Array.from(new Set(orders.map(order => order.city)))

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground">
              Manage customer orders and track delivery status
            </p>
          </div>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading orders...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">
            Manage customer orders and track delivery status
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
                <p className="text-xs text-muted-foreground">
                  +23% from last month
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
                <CardTitle className="text-sm font-medium">New Orders</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orders.filter(o => o.callCenterStatus === 'NEW').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting confirmation
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
                <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                <Truck className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orders.filter(o => o.deliveryStatus === 'IN_TRANSIT').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Out for delivery
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
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()} DA
                </div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={callCenterFilter} onValueChange={setCallCenterFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Call Center Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="all-call-center" value="all">All Call Center</SelectItem>
                  <SelectItem key="NEW" value="NEW">New</SelectItem>
                  <SelectItem key="CONFIRMED" value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem key="CANCELED" value="CANCELED">Canceled</SelectItem>
                  <SelectItem key="NO_RESPONSE" value="NO_RESPONSE">No Response</SelectItem>
                </SelectContent>
              </Select>

              <Select value={deliveryFilter} onValueChange={setDeliveryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Delivery Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="all-delivery" value="all">All Delivery</SelectItem>
                  <SelectItem key="NOT_READY" value="NOT_READY">Not Ready</SelectItem>
                  <SelectItem key="READY" value="READY">Ready</SelectItem>
                  <SelectItem key="IN_TRANSIT" value="IN_TRANSIT">In Transit</SelectItem>
                  <SelectItem key="DONE" value="DONE">Done</SelectItem>
                </SelectContent>
              </Select>

              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="all-cities" value="all">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.map((order, index) => {
                const CallCenterIcon = callCenterStatusIcons[order.callCenterStatus as keyof typeof callCenterStatusIcons]
                const DeliveryIcon = deliveryStatusIcons[order.deliveryStatus as keyof typeof deliveryStatusIcons]

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-6 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                          <Badge className={callCenterStatusColors[order.callCenterStatus as keyof typeof callCenterStatusColors]}>
                            <CallCenterIcon className="w-3 h-3 mr-1" />
                            {order.callCenterStatus}
                          </Badge>
                          <Badge className={deliveryStatusColors[order.deliveryStatus as keyof typeof deliveryStatusColors]}>
                            <DeliveryIcon className="w-3 h-3 mr-1" />
                            {order.deliveryStatus}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{order.customerName}</span>
                            </div>
                            <p className="text-sm text-muted-foreground ml-6">
                              {order.customerPhone}
                            </p>
                            {order.customerEmail && (
                              <p className="text-sm text-muted-foreground ml-6">
                                {order.customerEmail}
                              </p>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{order.city}</span>
                            </div>
                            <p className="text-sm text-muted-foreground ml-6">
                              {order.deliveryType === 'HOME_DELIVERY' ? order.deliveryAddress : 'Pickup from desk'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-lg font-bold text-primary">
                            {order.total.toLocaleString()} DA
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 lg:w-48">
                        <Select
                          value={order.callCenterStatus}
                          onValueChange={(value) => handleUpdateCallCenterStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem key={`${order.id}-NEW`} value="NEW">New</SelectItem>
                            <SelectItem key={`${order.id}-CONFIRMED`} value="CONFIRMED">Confirmed</SelectItem>
                            <SelectItem key={`${order.id}-CANCELED`} value="CANCELED">Canceled</SelectItem>
                            <SelectItem key={`${order.id}-NO_RESPONSE`} value="NO_RESPONSE">No Response</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select
                          value={order.deliveryStatus}
                          onValueChange={(value) => handleUpdateDeliveryStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem key={`${order.id}-NOT_READY`} value="NOT_READY">Not Ready</SelectItem>
                            <SelectItem key={`${order.id}-READY`} value="READY">Ready</SelectItem>
                            <SelectItem key={`${order.id}-IN_TRANSIT`} value="IN_TRANSIT">In Transit</SelectItem>
                            <SelectItem key={`${order.id}-DONE`} value="DONE">Done</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}

              {filteredOrders.length === 0 && (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
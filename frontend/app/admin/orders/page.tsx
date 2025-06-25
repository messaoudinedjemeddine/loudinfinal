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
  XCircle,
  User,
  Mail,
  CreditCard,
  FileText,
  Download
} from 'lucide-react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/admin-layout'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface OrderItem {
  id: string
  name: string
  nameAr?: string
  quantity: number
  price: number
  size?: string
  product: {
    id: string
    name: string
    nameAr?: string
    image?: string
  }
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  total: number
  subtotal: number
  deliveryFee: number
  deliveryType: 'HOME_DELIVERY' | 'PICKUP'
  deliveryAddress?: string
  city: {
    name: string
    nameAr?: string
  }
  deliveryDesk?: {
    name: string
    nameAr?: string
  }
  callCenterStatus: 'NEW' | 'CONFIRMED' | 'CANCELED' | 'NO_RESPONSE'
  deliveryStatus: 'NOT_READY' | 'READY' | 'IN_TRANSIT' | 'DONE'
  createdAt: string
  updatedAt: string
  notes?: string
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

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    NEW: 'New',
    CONFIRMED: 'Confirmed',
    CANCELED: 'Canceled',
    NO_RESPONSE: 'No Response',
    NOT_READY: 'Not Ready',
    READY: 'Ready',
    IN_TRANSIT: 'In Transit',
    DONE: 'Delivered'
  }
  return labels[status] || status
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
        order.customerPhone.includes(searchQuery) ||
        order.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase())
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
      filtered = filtered.filter(order => order.city.name === cityFilter)
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

  const handleExportOrders = async () => {
    try {
      toast.loading('Exporting orders...')
      const csvData = await api.admin.exportOrders()
      
      // Create and download the file
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `orders-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.dismiss()
      toast.success('Orders exported successfully')
    } catch (error) {
      console.error('Failed to export orders:', error)
      toast.dismiss()
      toast.error('Failed to export orders')
    }
  }

  const cities = Array.from(new Set(orders.map(order => order.city.name)))

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Orders Management</h1>
            <p className="text-muted-foreground">
              Manage customer orders, track delivery status, and handle order confirmations
            </p>
          </div>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading orders...</p>
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Orders Management</h1>
              <p className="text-muted-foreground">
                Manage customer orders, track delivery status, and handle order confirmations
              </p>
            </div>
            <Button onClick={handleExportOrders} className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Orders</span>
            </Button>
          </div>
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
                  All time orders
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
                  All time revenue
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
                  placeholder="Search orders, customers..."
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
                  <SelectItem key="DONE" value="DONE">Delivered</SelectItem>
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

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Call Center</TableHead>
                    <TableHead>Delivery</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const CallCenterIcon = callCenterStatusIcons[order.callCenterStatus as keyof typeof callCenterStatusIcons]
                    const DeliveryIcon = deliveryStatusIcons[order.deliveryStatus as keyof typeof deliveryStatusIcons]
                    
                    return (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div className="font-mono font-medium">
                            {order.orderNumber}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{order.customerName}</div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              <span>{order.customerPhone}</span>
                            </div>
                            {order.customerEmail && (
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Mail className="w-3 h-3" />
                                <span>{order.customerEmail}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={item.id} className="text-sm">
                                <div className="font-medium">
                                  {item.quantity}x {item.product.name}
                                </div>
                                {item.size && (
                                  <div className="text-xs text-muted-foreground">
                                    Size: {item.size}
                                  </div>
                                )}
                                {index < order.items.length - 1 && (
                                  <div className="border-t my-1"></div>
                                )}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-bold text-primary">
                              {order.total.toLocaleString()} DA
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Subtotal: {order.subtotal.toLocaleString()} DA
                            </div>
                            {order.deliveryFee > 0 && (
                              <div className="text-xs text-muted-foreground">
                                Delivery: {order.deliveryFee.toLocaleString()} DA
                              </div>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Select
                            value={order.callCenterStatus}
                            onValueChange={(value) => handleUpdateCallCenterStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="NEW">New</SelectItem>
                              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                              <SelectItem value="CANCELED">Canceled</SelectItem>
                              <SelectItem value="NO_RESPONSE">No Response</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        
                        <TableCell>
                          <Select
                            value={order.deliveryStatus}
                            onValueChange={(value) => handleUpdateDeliveryStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="NOT_READY">Not Ready</SelectItem>
                              <SelectItem value="READY">Ready</SelectItem>
                              <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                              <SelectItem value="DONE">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{order.city.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {order.deliveryType === 'HOME_DELIVERY' 
                                ? (order.deliveryAddress || 'Home Delivery')
                                : (order.deliveryDesk?.name || 'Pickup')
                              }
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/orders/${order.id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              
              {filteredOrders.length === 0 && (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search terms
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
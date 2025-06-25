'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { AdminLayout } from '@/components/admin/admin-layout'
import { api } from '@/lib/api'
import { toast } from 'sonner'

interface OrderDetailPageProps {
  params: {
    id: string
  }
}

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

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const [mounted, setMounted] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    fetchOrder()
  }, [params.id])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await api.orders.getById(params.id) as Order
      setOrder(response)
    } catch (error) {
      console.error('Failed to fetch order:', error)
      toast.error('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateCallCenterStatus = async (status: string) => {
    if (!order) return
    
    try {
      await api.admin.updateOrderStatus(order.id, { callCenterStatus: status })
      setOrder(prev => prev ? { ...prev, callCenterStatus: status as any } : null)
      toast.success('Call center status updated')
    } catch (error) {
      console.error('Failed to update call center status:', error)
      toast.error('Failed to update call center status')
    }
  }

  const handleUpdateDeliveryStatus = async (status: string) => {
    if (!order) return
    
    try {
      await api.admin.updateOrderStatus(order.id, { deliveryStatus: status })
      setOrder(prev => prev ? { ...prev, deliveryStatus: status as any } : null)
      toast.success('Delivery status updated')
    } catch (error) {
      console.error('Failed to update delivery status:', error)
      toast.error('Failed to update delivery status')
    }
  }

  if (!mounted) return null

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/admin/orders">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Orders
              </Link>
            </Button>
          </div>
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/admin/orders">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Orders
              </Link>
            </Button>
          </div>
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Order not found</h3>
            <p className="text-muted-foreground">
              The order you&apos;re looking for doesn&apos;t exist
            </p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/admin/orders">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Orders
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Order {order.orderNumber}</h1>
              <p className="text-muted-foreground">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Badge className={statusColors[order.callCenterStatus as keyof typeof statusColors]}>
              {order.callCenterStatus}
            </Badge>
            <Badge className={statusColors[order.deliveryStatus as keyof typeof statusColors]}>
              {order.deliveryStatus}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{order.customerName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{order.customerPhone}</span>
                  </div>
                  {order.customerEmail && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{order.customerEmail}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Delivery Type:</p>
                  <p className="text-muted-foreground">
                    {order.deliveryType === 'HOME_DELIVERY' ? 'Home Delivery' : 'Pickup from Desk'}
                  </p>
                </div>
                <div>
                  <p className="font-medium">City:</p>
                  <p className="text-muted-foreground">{order.city.name}</p>
                </div>
                {order.deliveryType === 'HOME_DELIVERY' && order.deliveryAddress && (
                  <div>
                    <p className="font-medium">Address:</p>
                    <p className="text-muted-foreground">{order.deliveryAddress}</p>
                  </div>
                )}
                {order.deliveryType === 'PICKUP' && order.deliveryDesk && (
                  <div>
                    <p className="font-medium">Pickup Desk:</p>
                    <p className="text-muted-foreground">{order.deliveryDesk.name}</p>
                  </div>
                )}
                {order.notes && (
                  <div>
                    <p className="font-medium">Notes:</p>
                    <p className="text-muted-foreground">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="relative w-16 h-16 bg-muted rounded-md overflow-hidden">
                        <Image
                          src={item.product.image || '/placeholder-product.jpg'}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        {item.size && (
                          <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{item.price.toLocaleString()} DA</p>
                        <p className="text-sm text-muted-foreground">
                          Total: {(item.quantity * item.price).toLocaleString()} DA
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Actions */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{order.subtotal.toLocaleString()} DA</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>{order.deliveryFee.toLocaleString()} DA</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-primary">{order.total.toLocaleString()} DA</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Updates */}
            <Card>
              <CardHeader>
                <CardTitle>Update Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Call Center Status</label>
                  <Select
                    value={order.callCenterStatus}
                    onValueChange={handleUpdateCallCenterStatus}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEW">New</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                      <SelectItem value="CANCELED">Canceled</SelectItem>
                      <SelectItem value="NO_RESPONSE">No Response</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Delivery Status</label>
                  <Select
                    value={order.deliveryStatus}
                    onValueChange={handleUpdateDeliveryStatus}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NOT_READY">Not Ready</SelectItem>
                      <SelectItem value="READY">Ready</SelectItem>
                      <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                      <SelectItem value="DONE">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Customer
                </Button>
                <Button className="w-full" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button className="w-full elegant-gradient">
                  Print Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
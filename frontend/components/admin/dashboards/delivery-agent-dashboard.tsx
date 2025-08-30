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
  Package,
  MessageSquare,
  Edit,
  Tag,
  ExternalLink,
  Send,
  Save
} from 'lucide-react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useLocaleStore } from '@/lib/locale-store'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { yalidineAPI } from '@/lib/yalidine-api'

interface DeliveryStats {
  readyOrders: number;
  inTransitOrders: number;
  deliveredOrders: number;
  totalDeliveries: number;
  confirmedOrders: number;
  answeredOrders: number;
  noAnswerOrders: number;
  smsSentOrders: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryType: 'HOME_DELIVERY' | 'PICKUP';
  deliveryAddress?: string;
  deliveryFee: number;
  subtotal: number;
  total: number;
  callCenterStatus: 'NEW' | 'CONFIRMED' | 'CANCELED' | 'PENDING' | 'DOUBLE_ORDER' | 'DELAYED';
  deliveryStatus: string;
  communicationStatus?: 'ANSWERED' | 'DIDNT_ANSWER' | 'SMS_SENT';
  notes?: string;
  trackingNumber?: string;
  yalidineShipmentId?: string;
  createdAt: string;
  updatedAt: string;
  city: {
    id: string;
    name: string;
    nameAr?: string;
  };
  deliveryDesk?: {
    id: string;
    name: string;
    nameAr?: string;
  };
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      nameAr?: string;
      image?: string;
    };
  }>;
}

interface YalidineShipment {
  id: string;
  tracking: string;
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  from_wilaya_name: string;
  to_wilaya_name: string;
  to_commune_name: string;
  product_list: string;
  price: number;
  weight: number;
  last_status: string;
  date_creation: string;
  date_last_status: string;
}

const statusColors = {
  READY: 'bg-yellow-100 text-yellow-800',
  IN_TRANSIT: 'bg-blue-100 text-blue-800',
  DONE: 'bg-green-100 text-green-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  ANSWERED: 'bg-green-100 text-green-800',
  DIDNT_ANSWER: 'bg-red-100 text-red-800',
  SMS_SENT: 'bg-blue-100 text-blue-800'
}

const statusLabels = {
  READY: 'Ready',
  IN_TRANSIT: 'In Transit',
  DONE: 'Delivered',
  CONFIRMED: 'Confirmed',
  ANSWERED: 'Answered',
  DIDNT_ANSWER: 'Didn\'t Answer',
  SMS_SENT: 'SMS Sent'
}

const communicationStatusColors = {
  ANSWERED: 'bg-green-100 text-green-800 border border-green-200',
  DIDNT_ANSWER: 'bg-red-100 text-red-800 border border-red-200',
  SMS_SENT: 'bg-blue-100 text-blue-800 border border-blue-200'
}

const communicationStatusLabels = {
  ANSWERED: 'Answered',
  DIDNT_ANSWER: 'Didn\'t Answer',
  SMS_SENT: 'SMS Sent'
}

export function DeliveryAgentDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t, isRTL, direction } = useLocaleStore()
  const [stats, setStats] = useState<DeliveryStats>({
    readyOrders: 0,
    inTransitOrders: 0,
    deliveredOrders: 0,
    totalDeliveries: 0,
    confirmedOrders: 0,
    answeredOrders: 0,
    noAnswerOrders: 0,
    smsSentOrders: 0
  })
  const [orders, setOrders] = useState<Order[]>([])
  const [yalidineShipments, setYalidineShipments] = useState<YalidineShipment[]>([])
  const [loadingShipments, setLoadingShipments] = useState(false)
  
  // Enhanced functionality state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showCommunicationDialog, setShowCommunicationDialog] = useState(false)
  const [showNotesDialog, setShowNotesDialog] = useState(false)
  const [loadingAction, setLoadingAction] = useState(false)

  useEffect(() => {
    fetchDeliveryData()
  }, [])

  const fetchDeliveryData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch delivery data and Yalidine shipments
      const [ordersData] = await Promise.all([
        api.admin.getOrders({ limit: 100 }) // Get more orders for delivery agent
      ])

      const ordersList = (ordersData as any).orders || ordersData as Order[]
      setOrders(ordersList)

      // Fetch Yalidine shipments
      await fetchYalidineShipments()

      // Calculate stats
      const confirmedOrders = ordersList.filter(o => o.callCenterStatus === 'CONFIRMED')
      const stats = {
        readyOrders: ordersList.filter(o => o.deliveryStatus === 'READY').length,
        inTransitOrders: ordersList.filter(o => o.deliveryStatus === 'IN_TRANSIT').length,
        deliveredOrders: ordersList.filter(o => o.deliveryStatus === 'DONE').length,
        totalDeliveries: ordersList.filter(o => o.deliveryStatus === 'READY' || o.deliveryStatus === 'IN_TRANSIT').length,
        confirmedOrders: confirmedOrders.length,
        answeredOrders: confirmedOrders.filter(o => o.communicationStatus === 'ANSWERED').length,
        noAnswerOrders: confirmedOrders.filter(o => o.communicationStatus === 'DIDNT_ANSWER').length,
        smsSentOrders: confirmedOrders.filter(o => o.communicationStatus === 'SMS_SENT').length
      }
      setStats(stats)

    } catch (err) {
      console.error('Error fetching delivery data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const fetchYalidineShipments = async () => {
    try {
      setLoadingShipments(true)
      const response = await yalidineAPI.getAllShipments()
      setYalidineShipments(response.data || [])
    } catch (error) {
      console.error('Error fetching Yalidine shipments:', error)
      setYalidineShipments([])
    } finally {
      setLoadingShipments(false)
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

  // Enhanced functionality functions
  const updateCommunicationStatus = async (orderId: string, status: string, notes?: string) => {
    try {
      setLoadingAction(true)
      const updateData: any = { communicationStatus: status }
      if (notes) updateData.notes = notes
      
      await api.admin.updateOrderStatus(orderId, updateData)
      toast.success(`Communication status updated to ${communicationStatusLabels[status as keyof typeof communicationStatusLabels]}`)
      fetchDeliveryData()
    } catch (err) {
      console.error('Error updating communication status:', err)
      toast.error('Failed to update communication status')
    } finally {
      setLoadingAction(false)
    }
  }

  const updateOrderNotes = async (orderId: string, notes: string) => {
    try {
      setLoadingAction(true)
      await api.admin.updateOrderStatus(orderId, { notes })
      toast.success('Order notes updated successfully')
      fetchDeliveryData()
      setShowNotesDialog(false)
    } catch (err) {
      console.error('Error updating order notes:', err)
      toast.error('Failed to update order notes')
    } finally {
      setLoadingAction(false)
    }
  }

  const sendWhatsAppMessage = (phoneNumber: string, trackingNumber: string) => {
    try {
      // Format phone number for WhatsApp (remove leading 0 and add country code)
      const formattedPhone = phoneNumber.startsWith('0') ? phoneNumber.substring(1) : phoneNumber
      const whatsappNumber = `213${formattedPhone}`
      
      // Create WhatsApp message
      const message = `مرحبا! يمكنك تتبع طلبك باستخدام الرقم التالي: ${trackingNumber}

يمكنك تتبع طلبك على موقعنا:
https://loudim.com/track-order

شكرا لك!`
      
      // Encode message for URL
      const encodedMessage = encodeURIComponent(message)
      
      // Create WhatsApp URL
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank')
      
      toast.success('WhatsApp message prepared for sending')
    } catch (err) {
      console.error('Error preparing WhatsApp message:', err)
      toast.error('Failed to prepare WhatsApp message')
    }
  }

  const formatYalidineDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
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
    <div className="space-y-6" dir={direction}>
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">{t?.admin?.deliveryAgent || 'Delivery Management Dashboard'}</h2>
        <p className="text-muted-foreground">
          Manage deliveries and track order status. Handle customer communications and navigation.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className={`flex flex-row items-center justify-between pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <CardTitle className="text-sm font-medium">Ready for Pickup</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.readyOrders}</div>
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
            <CardHeader className={`flex flex-row items-center justify-between pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <CardTitle className="text-sm font-medium">In Transit</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inTransitOrders}</div>
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
            <CardHeader className={`flex flex-row items-center justify-between pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <CardTitle className="text-sm font-medium">Delivered Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.deliveredOrders}</div>
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
            <CardHeader className={`flex flex-row items-center justify-between pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className={`flex flex-row items-center justify-between pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <CardTitle className="text-sm font-medium">Confirmed Orders</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.confirmedOrders}</div>
              <p className="text-xs text-muted-foreground">
                Orders to contact
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader className={`flex flex-row items-center justify-between pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <CardTitle className="text-sm font-medium">Answered</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.answeredOrders}</div>
              <p className="text-xs text-muted-foreground">
                Customers answered
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader className={`flex flex-row items-center justify-between pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <CardTitle className="text-sm font-medium">No Answer</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.noAnswerOrders}</div>
              <p className="text-xs text-muted-foreground">
                Customers didn't answer
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader className={`flex flex-row items-center justify-between pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <CardTitle className="text-sm font-medium">SMS Sent</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.smsSentOrders}</div>
              <p className="text-xs text-muted-foreground">
                SMS notifications sent
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Delivery Management */}
      <Tabs defaultValue="confirmed" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="confirmed">Confirmed Orders ({stats.confirmedOrders})</TabsTrigger>
          <TabsTrigger value="ready">Ready for Pickup ({stats.readyOrders})</TabsTrigger>
          <TabsTrigger value="in-transit">In Transit ({stats.inTransitOrders})</TabsTrigger>
          <TabsTrigger value="delivered">Delivered ({stats.deliveredOrders})</TabsTrigger>
          <TabsTrigger value="yalidine">Yalidine Shipments ({yalidineShipments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="confirmed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CheckCircle className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                Confirmed Orders - Customer Communication
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.filter(order => order.callCenterStatus === 'CONFIRMED').length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No confirmed orders to contact</p>
              ) : (
                <div className="space-y-4">
                  {orders.filter(order => order.callCenterStatus === 'CONFIRMED').map((order) => (
                    <div key={order.id} className={`flex items-center justify-between p-4 border rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="flex-1">
                        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} mb-2`}>
                          <h4 className="font-medium">#{order.orderNumber}</h4>
                          <Badge variant="outline">{order.customerPhone}</Badge>
                          {order.communicationStatus && (
                            <Badge className={communicationStatusColors[order.communicationStatus as keyof typeof communicationStatusColors]}>
                              {communicationStatusLabels[order.communicationStatus as keyof typeof communicationStatusLabels]}
                            </Badge>
                          )}
                        </div>
                        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'} text-sm text-muted-foreground mb-2`}>
                          <span>{order.customerName}</span>
                          <span>{order.items.length} items</span>
                          <span>{order.total.toLocaleString()} DA</span>
                          <span>{order.deliveryType === 'HOME_DELIVERY' ? 'Home Delivery' : 'Pickup'}</span>
                        </div>
                        {order.deliveryAddress && (
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Address:</span> {order.deliveryAddress}
                          </div>
                        )}
                        {order.notes && (
                          <div className="text-sm text-muted-foreground mt-1">
                            <span className="font-medium">Notes:</span> {order.notes}
                          </div>
                        )}
                      </div>
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowCommunicationDialog(true)
                          }}
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Update Status
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowNotesDialog(true)
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Notes
                        </Button>
                        {order.trackingNumber && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendWhatsAppMessage(order.customerPhone, order.trackingNumber!)}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            WhatsApp
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

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

        <TabsContent value="yalidine" className="space-y-4">
      <Card>
        <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Package className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  Yalidine Shipments
                </CardTitle>
                <Button 
                  onClick={fetchYalidineShipments} 
                  disabled={loadingShipments}
                  variant="outline"
                  size="sm"
                >
                  <Loader2 className={`h-4 w-4 mr-2 ${loadingShipments ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
        </CardHeader>
        <CardContent>
              {loadingShipments ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading shipments from Yalidine...</span>
                </div>
              ) : yalidineShipments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p>No shipments found in Yalidine account</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {yalidineShipments.map((shipment, index) => (
                    <div key={shipment.id || shipment.tracking || `shipment-${index}`} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="font-medium text-lg">#{shipment.tracking}</p>
                                <Badge className={`${
                                  shipment.last_status === 'Livré' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                  shipment.last_status === 'Sorti en livraison' ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                                  shipment.last_status === 'En préparation' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                  shipment.last_status === 'Echèc livraison' ? 'bg-red-100 text-red-800 border border-red-200' :
                                  shipment.last_status === 'Retourné au vendeur' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                                  shipment.last_status === 'Echange échoué' ? 'bg-red-100 text-red-800 border border-red-200' :
                                  shipment.last_status === 'Pas encore expédié' ? 'bg-slate-100 text-slate-800 border border-slate-200' :
                                  shipment.last_status === 'A vérifier' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                                  shipment.last_status === 'Pas encore ramassé' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                                  shipment.last_status === 'Prêt à expédier' ? 'bg-cyan-100 text-cyan-800 border border-cyan-200' :
                                  shipment.last_status === 'Ramassé' ? 'bg-teal-100 text-teal-800 border border-teal-200' :
                                  shipment.last_status === 'Bloqué' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                                  shipment.last_status === 'Débloqué' ? 'bg-lime-100 text-lime-800 border border-lime-200' :
                                  shipment.last_status === 'Transfert' ? 'bg-violet-100 text-violet-800 border border-violet-200' :
                                  shipment.last_status === 'Expédié' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                  shipment.last_status === 'Centre' ? 'bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-200' :
                                  shipment.last_status === 'En localisation' ? 'bg-pink-100 text-pink-800 border border-pink-200' :
                                  shipment.last_status === 'Vers Wilaya' ? 'bg-cyan-100 text-cyan-800 border border-cyan-200' :
                                  shipment.last_status === 'Reçu à Wilaya' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                  shipment.last_status === 'En attente du client' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                  shipment.last_status === 'Prêt pour livreur' ? 'bg-green-100 text-green-800 border border-green-200' :
                                  shipment.last_status === 'En attente' ? 'bg-gray-100 text-gray-800 border border-gray-200' :
                                  shipment.last_status === 'En alerte' ? 'bg-red-100 text-red-800 border border-red-200' :
                                  shipment.last_status === 'Tentative échouée' ? 'bg-red-100 text-red-800 border border-red-200' :
                                  shipment.last_status === 'Retour vers centre' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                                  shipment.last_status === 'Retourné au centre' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                                  shipment.last_status === 'Retour transfert' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                                  shipment.last_status === 'Retour groupé' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                                  shipment.last_status === 'Retour à retirer' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                                  shipment.last_status === 'Retour vers vendeur' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                                  'bg-slate-100 text-slate-800 border border-slate-200'
                                }`}>
                                  {shipment.last_status || 'Active'}
                                </Badge>
                              </div>
                              <p className="font-medium">{shipment.customer_name}</p>
                              <p className="text-sm text-muted-foreground">{shipment.customer_phone}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-lg">{shipment.price?.toLocaleString()} DA</p>
                              <p className="text-sm text-muted-foreground">
                                {shipment.weight || 1} kg
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">From:</span> {shipment.from_wilaya_name || 'Batna'}
                            </div>
                            <div>
                              <span className="font-medium">To:</span> {shipment.to_wilaya_name} • {shipment.to_commune_name}
                            </div>
                            <div>
                              <span className="font-medium">Created:</span> {formatYalidineDate(shipment.date_creation)}
                            </div>
                            <div>
                              <span className="font-medium">Products:</span> {shipment.product_list || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Last Status Date:</span> {formatYalidineDate(shipment.date_last_status)}
                            </div>
                          </div>
                          {shipment.customer_address && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              <span className="font-medium">Address:</span> {shipment.customer_address}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => sendWhatsAppMessage(shipment.customer_phone, shipment.tracking)}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            WhatsApp
            </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCallCustomer(shipment.customer_phone)}
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Call
            </Button>
          </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>

      {/* Communication Status Dialog */}
      <Dialog open={showCommunicationDialog} onOpenChange={setShowCommunicationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Communication Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Order #{selectedOrder?.orderNumber}</Label>
              <p className="text-sm text-muted-foreground">
                Customer: {selectedOrder?.customerName} ({selectedOrder?.customerPhone})
              </p>
            </div>
            <div>
              <Label>Communication Status</Label>
              <Select onValueChange={(value) => {
                if (selectedOrder) {
                  updateCommunicationStatus(selectedOrder.id, value)
                  setShowCommunicationDialog(false)
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ANSWERED">Answered</SelectItem>
                  <SelectItem value="DIDNT_ANSWER">Didn't Answer</SelectItem>
                  <SelectItem value="SMS_SENT">SMS Sent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add/Edit Notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Order #{selectedOrder?.orderNumber}</Label>
              <p className="text-sm text-muted-foreground">
                Customer: {selectedOrder?.customerName} ({selectedOrder?.customerPhone})
              </p>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea 
                placeholder="Add notes about this order..."
                defaultValue={selectedOrder?.notes || ''}
                onChange={(e) => {
                  if (selectedOrder) {
                    selectedOrder.notes = e.target.value
                  }
                }}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowNotesDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (selectedOrder) {
                    updateOrderNotes(selectedOrder.id, selectedOrder.notes || '')
                  }
                }}
                disabled={loadingAction}
              >
                {loadingAction ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Notes
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
} 
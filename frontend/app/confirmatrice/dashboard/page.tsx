'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ShoppingCart, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Phone,
  Truck,
  Package,
  Eye,
  Loader2,
  TrendingUp,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface DashboardStats {
  pendingOrders: number
  confirmedOrders: number
  canceledOrders: number
  noResponseOrders: number
  totalOrders: number
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  deliveryType: 'HOME_DELIVERY' | 'PICKUP'
  deliveryAddress?: string
  deliveryFee: number
  subtotal: number
  total: number
  notes?: string
  callCenterStatus: string
  deliveryStatus: string
  createdAt: string
  updatedAt: string
  items: any[]
  city: {
    id: string
    name: string
  }
  deliveryDesk?: {
    id: string
    name: string
  }
}

const statusColors = {
  NEW: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELED: 'bg-red-100 text-red-800',
  NO_RESPONSE: 'bg-orange-100 text-orange-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  DOUBLE_ORDER: 'bg-purple-100 text-purple-800',
  DELAYED: 'bg-gray-100 text-gray-800'
}

const statusLabels = {
  NEW: 'Nouvelle',
  CONFIRMED: 'Confirmée',
  CANCELED: 'Annulée',
  NO_RESPONSE: 'Pas de réponse',
  PENDING: 'En attente',
  DOUBLE_ORDER: 'Commande double',
  DELAYED: 'Retardée'
}

export default function ConfirmatriceDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    pendingOrders: 0,
    confirmedOrders: 0,
    canceledOrders: 0,
    noResponseOrders: 0,
    totalOrders: 0
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [urgentOrders, setUrgentOrders] = useState<Order[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/confirmatrice/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        throw new Error('Failed to fetch dashboard stats')
      }

      // Fetch recent orders
      const ordersResponse = await fetch('/api/confirmatrice/orders/pending', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        setRecentOrders(ordersData.slice(0, 5)) // Get latest 5 orders
        
        // Get urgent orders (NEW status)
        const urgent = ordersData.filter((order: Order) => order.callCenterStatus === 'NEW')
        setUrgentOrders(urgent.slice(0, 3)) // Get latest 3 urgent orders
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const getDeliveryTypeLabel = (type: string) => {
    return type === 'HOME_DELIVERY' ? 'Livraison à domicile' : 'Point relais'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement...</p>
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
          <Button onClick={fetchDashboardData}>Réessayer</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Tableau de Bord Confirmatrice</h1>
        <p className="text-muted-foreground">
          Vue d&apos;ensemble complète de vos commandes. Gérez les confirmations, les annulations et le suivi des clients.
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
              <CardTitle className="text-sm font-medium">Nouvelles</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">
                Commandes en attente de confirmation
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
              <CardTitle className="text-sm font-medium">Confirmées</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.confirmedOrders}</div>
              <p className="text-xs text-muted-foreground">
                Commandes validées aujourd&apos;hui
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
              <CardTitle className="text-sm font-medium">Annulées</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.canceledOrders}</div>
              <p className="text-xs text-muted-foreground">
                Commandes annulées
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
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                Toutes les commandes
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs for Recent Orders, Urgent Orders, and Quick Actions */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Commandes Récentes</TabsTrigger>
          <TabsTrigger value="urgent">Commandes Urgentes</TabsTrigger>
          <TabsTrigger value="actions">Actions Rapides</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Commandes Récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Aucune commande récente</p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{order.customerName}</h4>
                          <Badge variant="outline">{order.customerPhone}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{order.items.length} articles</span>
                          <span>{order.total.toFixed(2)} DH</span>
                          <span>{formatDate(order.createdAt)}</span>
                          <span className="flex items-center">
                            <Truck className="w-3 h-3 mr-1" />
                            {getDeliveryTypeLabel(order.deliveryType)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={statusColors[order.callCenterStatus as keyof typeof statusColors]}>
                          {statusLabels[order.callCenterStatus as keyof typeof statusLabels]}
                        </Badge>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/confirmatrice/orders/pending`}>
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

        <TabsContent value="urgent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Commandes Urgentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {urgentOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Aucune commande urgente</p>
              ) : (
                <div className="space-y-4">
                  {urgentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-orange-200 rounded-lg bg-orange-50">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{order.customerName}</h4>
                          <Badge variant="outline" className="bg-orange-100">
                            <Phone className="w-3 h-3 mr-1" />
                            {order.customerPhone}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{order.items.length} articles</span>
                          <span className="font-medium text-orange-600">{order.total.toFixed(2)} DH</span>
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-orange-100 text-orange-800">
                          Nouvelle
                        </Badge>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/confirmatrice/orders/pending`}>
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

        <TabsContent value="actions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Gérer les Commandes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Accédez à toutes les commandes en attente de confirmation
                </p>
                <Button asChild className="w-full">
                  <Link href="/confirmatrice/orders/pending">
                    Voir les Commandes
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Commandes Confirmées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Consultez les commandes validées et prêtes pour la livraison
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/confirmatrice/orders/confirm">
                    Voir les Confirmées
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Historique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Consultez l&apos;historique complet des commandes traitées
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/confirmatrice/orders/history">
                    Voir l&apos;Historique
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

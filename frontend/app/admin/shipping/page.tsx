'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Truck, 
  Package, 
  MapPin,
  Calculator,
  Settings,
  AlertCircle
} from 'lucide-react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { ShipmentManager } from '@/components/admin/shipment-manager'
import { yalidineAPI } from '@/lib/yalidine-api'

export default function AdminShippingPage() {
  const [mounted, setMounted] = useState(false)
  const [yalidineStatus, setYalidineStatus] = useState<{ configured: boolean; message: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    checkYalidineStatus()
  }, [])

  const checkYalidineStatus = async () => {
    try {
      const status = await yalidineAPI.getStatus()
      setYalidineStatus(status)
    } catch (error) {
      console.error('Error checking Yalidine status:', error)
      setYalidineStatus({ configured: false, message: 'Failed to check status' })
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Shipping Management</h1>
          <p className="text-muted-foreground">
            Manage Yalidine shipments and track deliveries
          </p>
        </div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Yalidine Integration Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span>Checking status...</span>
                </div>
              ) : yalidineStatus?.configured ? (
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <Truck className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Yalidine API is properly configured and ready to use
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Not Configured
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {yalidineStatus?.message || 'Yalidine API is not configured'}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                No shipments created yet
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Transit</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                No shipments in transit
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                No shipments delivered
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Shipment Manager */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ShipmentManager />
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Shipping Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Use the shipping calculator to estimate delivery costs for different destinations and package sizes.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Features:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Real-time cost calculation</li>
                      <li>• Support for all Algerian wilayas</li>
                      <li>• Home delivery and pickup options</li>
                      <li>• Insurance and COD options</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Requirements:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Valid Yalidine API credentials</li>
                      <li>• Package dimensions and weight</li>
                      <li>• Customer delivery information</li>
                      <li>• Product description and value</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  )
} 
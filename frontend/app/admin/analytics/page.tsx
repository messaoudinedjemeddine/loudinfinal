'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  MapPin,
  Star
} from 'lucide-react'
import { AdminLayout } from '@/components/admin/admin-layout'

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalRevenue: 1250000,
    revenueGrowth: 18.5,
    totalOrders: 234,
    ordersGrowth: 23.1,
    totalCustomers: 89,
    customersGrowth: 5.2,
    avgOrderValue: 5342,
    avgOrderGrowth: -2.1
  },
  salesByMonth: [
    { month: 'Jan', revenue: 85000, orders: 45 },
    { month: 'Feb', revenue: 92000, orders: 52 },
    { month: 'Mar', revenue: 78000, orders: 38 },
    { month: 'Apr', revenue: 105000, orders: 61 },
    { month: 'May', revenue: 118000, orders: 68 },
    { month: 'Jun', revenue: 134000, orders: 72 }
  ],
  topProducts: [
    { name: 'Traditional Karakou Dress', sales: 45, revenue: 1125000 },
    { name: 'Modern Takchita', sales: 32, revenue: 1024000 },
    { name: 'Embroidered Caftan', sales: 28, revenue: 616000 },
    { name: 'Elegant Haik Dress', sales: 25, revenue: 450000 }
  ],
  topCategories: [
    { name: 'Traditional Dresses', sales: 142, percentage: 35.5 },
    { name: 'Bridal Collection', sales: 98, percentage: 24.5 },
    { name: 'Modern Abayas', sales: 87, percentage: 21.8 },
    { name: 'Embroidered Caftans', sales: 73, percentage: 18.2 }
  ],
  ordersByCity: [
    { city: 'Algiers', orders: 89, percentage: 38.0 },
    { city: 'Oran', orders: 56, percentage: 23.9 },
    { city: 'Constantine', orders: 34, percentage: 14.5 },
    { city: 'Annaba', orders: 28, percentage: 12.0 },
    { city: 'Blida', orders: 27, percentage: 11.5 }
  ],
  customerSatisfaction: {
    averageRating: 4.7,
    totalReviews: 156,
    ratingDistribution: [
      { stars: 5, count: 89, percentage: 57.1 },
      { stars: 4, count: 45, percentage: 28.8 },
      { stars: 3, count: 15, percentage: 9.6 },
      { stars: 2, count: 5, percentage: 3.2 },
      { stars: 1, count: 2, percentage: 1.3 }
    ]
  }
}

export default function AdminAnalyticsPage() {
  const [mounted, setMounted] = useState(false)
  const [timeRange, setTimeRange] = useState('6months')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const { overview, topProducts, topCategories, ordersByCity, customerSatisfaction } = mockAnalytics

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">
              Business insights and performance metrics
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overview.totalRevenue.toLocaleString()} DA
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  +{overview.revenueGrowth}% from last period
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
                <div className="text-2xl font-bold">{overview.totalOrders}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  +{overview.ordersGrowth}% from last period
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
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview.totalCustomers}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  +{overview.customersGrowth}% from last period
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
                <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overview.avgOrderValue.toLocaleString()} DA
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
                  {overview.avgOrderGrowth}% from last period
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Top Selling Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-camel-400 to-camel-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.sales} sales
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          {product.revenue.toLocaleString()} DA
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Sales by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCategories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {category.sales} sales ({category.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-camel-400 to-camel-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders by City */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Orders by City
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ordersByCity.map((city, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium">{city.city}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{city.orders} orders</p>
                        <p className="text-sm text-muted-foreground">
                          {city.percentage}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Customer Satisfaction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Customer Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {customerSatisfaction.averageRating}
                    </div>
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(customerSatisfaction.averageRating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Based on {customerSatisfaction.totalReviews} reviews
                    </p>
                  </div>

                  <div className="space-y-2">
                    {customerSatisfaction.ratingDistribution.map((rating) => (
                      <div key={rating.stars} className="flex items-center space-x-2">
                        <span className="text-sm w-8">{rating.stars}★</span>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${rating.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12">
                          {rating.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  )
}
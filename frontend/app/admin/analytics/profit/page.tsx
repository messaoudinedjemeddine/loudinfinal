'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Package,
  BarChart3,
  Download,
  Filter,
  ArrowLeft
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CategoryAnalytics {
  categoryId: string
  categoryName: string
  categoryNameAr?: string
  brandName: string
  totalProducts: number
  totalStock: number
  totalValue: number
  totalCost: number
  totalProfit: number
  averageProfitMargin: number
  products: Array<{
    id: string
    name: string
    nameAr?: string
    price: number
    costPrice: number
    stock: number
    profitPerUnit: number
    totalProfit: number
    profitMargin: number
  }>
}

interface GlobalAnalytics {
  totalCategories: number
  totalProducts: number
  totalStock: number
  totalValue: number
  totalCost: number
  totalProfit: number
  averageProfitMargin: number
}

interface ProfitAnalyticsResponse {
  globalAnalytics: GlobalAnalytics
  categoryAnalytics: CategoryAnalytics[]
}

export default function ProfitAnalyticsPage() {
  const [mounted, setMounted] = useState(false)
  const [analytics, setAnalytics] = useState<ProfitAnalyticsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedBrand, setSelectedBrand] = useState<string>('all')
  const [brands, setBrands] = useState<Array<{ id: string; name: string; slug: string }>>([])

  useEffect(() => {
    setMounted(true)
    fetchBrands()
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchAnalytics()
    }
  }, [mounted, selectedBrand])

  const fetchBrands = async () => {
    try {
      const response = await api.admin.getBrands() as Array<{ id: string; name: string; slug: string }>
      setBrands(response)
    } catch (error) {
      console.error('Failed to fetch brands:', error)
    }
  }

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const brandSlug = selectedBrand === 'all' ? undefined : selectedBrand
      const response = await api.admin.getProfitAnalytics(brandSlug) as ProfitAnalyticsResponse
      setAnalytics(response)
    } catch (error) {
      console.error('Failed to fetch profit analytics:', error)
      toast.error('Failed to load profit analytics')
    } finally {
      setLoading(false)
    }
  }

  const exportAnalytics = async () => {
    try {
      toast.loading('Preparing analytics export...')
      
      const brandSlug = selectedBrand === 'all' ? undefined : selectedBrand
      const response = await api.admin.getProfitAnalytics(brandSlug) as ProfitAnalyticsResponse
      
      // Create CSV content
      const headers = [
        'Category',
        'Brand',
        'Total Products',
        'Total Stock',
        'Total Value (DA)',
        'Total Cost (DA)',
        'Total Profit (DA)',
        'Average Profit Margin (%)'
      ]

      const csvRows = [headers.join(',')]

      response.categoryAnalytics.forEach(category => {
        const row = [
          `"${category.categoryName}"`,
          `"${category.brandName}"`,
          category.totalProducts,
          category.totalStock,
          category.totalValue,
          category.totalCost,
          category.totalProfit,
          category.averageProfitMargin.toFixed(2)
        ]
        csvRows.push(row.join(','))
      })

      const csvContent = csvRows.join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `profit-analytics-${selectedBrand === 'all' ? 'all-brands' : selectedBrand}-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.dismiss()
      toast.success('Analytics exported successfully')
    } catch (error) {
      console.error('Export failed:', error)
      toast.dismiss()
      toast.error('Failed to export analytics')
    }
  }

  if (!mounted) return null

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profit Analytics</h1>
              <p className="text-gray-600 dark:text-gray-400">Analyze profit margins by category and product</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.slug}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={exportAnalytics} className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        {/* Global Stats */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Profit</p>
                      <p className="text-2xl font-bold text-green-600">
                        {analytics.globalAnalytics.totalProfit.toLocaleString()} DA
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {analytics.globalAnalytics.totalValue.toLocaleString()} DA
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Profit Margin</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {analytics.globalAnalytics.averageProfitMargin.toFixed(1)}%
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {analytics.globalAnalytics.totalCategories}
                      </p>
                    </div>
                    <Package className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Category Analytics Table */}
        <Card>
          <CardHeader>
            <CardTitle>Profit by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : !analytics ? (
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No analytics data</h3>
                <p className="text-gray-600 dark:text-gray-400">Analytics data will appear here once products are added</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Total Stock</TableHead>
                      <TableHead>Total Value</TableHead>
                      <TableHead>Total Cost</TableHead>
                      <TableHead>Total Profit</TableHead>
                      <TableHead>Avg. Margin</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.categoryAnalytics.map((category) => (
                      <TableRow key={category.categoryId}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{category.categoryName}</p>
                            {category.categoryNameAr && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">{category.categoryNameAr}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{category.brandName}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{category.totalProducts}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{category.totalStock}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{category.totalValue.toLocaleString()} DA</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-gray-600">{category.totalCost.toLocaleString()} DA</span>
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${category.totalProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {category.totalProfit.toLocaleString()} DA
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={category.averageProfitMargin > 0 ? "default" : "destructive"}>
                            {category.averageProfitMargin.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

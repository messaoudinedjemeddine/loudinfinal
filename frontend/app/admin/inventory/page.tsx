'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  Search, 
  Filter, 
  Download,
  Upload,
  Plus,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  FileSpreadsheet,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import Image from 'next/image'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface Product {
  id: string
  name: string
  nameAr: string
  price: number
  oldPrice?: number
  stock: number
  category: {
    id: string
    name: string
    slug: string
  }
  reference: string
  isOnSale: boolean
  isActive: boolean
  image: string
  createdAt: string
  sizes?: Array<{
    id: string
    size: string
    stock: number
  }>
  totalStock?: number
  description?: string
  descriptionAr?: string
}

interface InventoryStats {
  totalProducts: number
  lowStockProducts: number
  outOfStockProducts: number
  totalValue: number
  totalStock: number
}

export default function AdminInventoryPage() {
  const [mounted, setMounted] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<InventoryStats>({
    totalProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalValue: 0,
    totalStock: 0
  })

  useEffect(() => {
    setMounted(true)
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await api.admin.getInventory() as { products: Product[] }
      const productsList = response.products || []
      setProducts(productsList)
      
      // Calculate stats
      const totalValue = productsList.reduce((sum, product) => sum + (product.price * (product.totalStock || product.stock)), 0)
      const lowStockProducts = productsList.filter(p => (p.totalStock || p.stock) <= 5 && (p.totalStock || p.stock) > 0).length
      const outOfStockProducts = productsList.filter(p => (p.totalStock || p.stock) === 0).length
      const totalStock = productsList.reduce((sum, product) => sum + (product.totalStock || product.stock), 0)
      
      setStats({
        totalProducts: productsList.length,
        lowStockProducts,
        outOfStockProducts,
        totalValue,
        totalStock
      })
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error('Failed to load inventory data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = [...products]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.nameAr?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category?.name === categoryFilter)
    }

    // Stock filter
    if (stockFilter === 'low') {
      filtered = filtered.filter(product => (product.totalStock || product.stock) <= 5 && (product.totalStock || product.stock) > 0)
    } else if (stockFilter === 'out') {
      filtered = filtered.filter(product => (product.totalStock || product.stock) === 0)
    } else if (stockFilter === 'in') {
      filtered = filtered.filter(product => (product.totalStock || product.stock) > 5)
    }

    // Status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(product => product.isActive)
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(product => !product.isActive)
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, categoryFilter, stockFilter, statusFilter])

  const exportToExcel = async () => {
    try {
      toast.loading('Preparing export...');
      
      const response = await api.admin.exportInventory() as string;
      
      if (!response) {
        throw new Error('No data received from server');
      }
      
      // Create and download file
      const blob = new Blob([response], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `inventory-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success('Inventory exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.dismiss();
      toast.error(`Failed to export inventory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  const importFromExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split('\n')
        const headers = lines[0].split(',').map(h => h.trim())
        
        // Parse CSV and create products
        const productsToImport = lines.slice(1).filter(line => line.trim()).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
          return {
            reference: values[0],
            name: values[1],
            nameAr: values[2],
            category: values[3],
            price: parseFloat(values[4]) || 0,
            oldPrice: parseFloat(values[5]) || undefined,
            mainStock: parseInt(values[6]) || 0,
            sizes: values[7],
            totalStock: parseInt(values[8]) || 0,
            status: values[9],
            isOnSale: values[10] === 'Yes',
            description: values[12],
            descriptionAr: values[13]
          }
        })

        // Send to API
        const result = await api.admin.importInventory({ products: productsToImport }) as {
          message: string;
          results: {
            created: number;
            updated: number;
            errors: any[];
          };
        }
        
        toast.success(`Import completed: ${result.results.created} created, ${result.results.updated} updated`)
        
        // Refresh the inventory
        fetchProducts()
        
      } catch (error) {
        console.error('Import failed:', error)
        toast.error('Failed to import products')
      }
    }
    reader.readAsText(file)
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' }
    if (stock <= 5) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' }
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' }
  }

  const formatSizes = (sizes: Product['sizes']) => {
    if (!sizes || sizes.length === 0) return 'No sizes'
    return sizes.map(size => `${size.size}: ${size.stock}`).join(', ')
  }

  if (!mounted) return null

  const categories = Array.from(new Set(products.map(product => product.category?.name).filter(Boolean)))

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Inventory Management</h1>
              <p className="text-muted-foreground">
                Manage your product inventory, track stock levels, and import/export data
              </p>
            </div>
          </div>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading inventory...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Inventory Management</h1>
            <p className="text-muted-foreground">
              Manage your product inventory, track stock levels, and import/export data
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Excel
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Products from Excel</DialogTitle>
                  <DialogDescription>
                    Upload a CSV file with product data. Make sure the file has the correct format.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={importFromExcel}
                    placeholder="Choose file..."
                  />
                  <p className="text-sm text-muted-foreground">
                    Download the template file to see the required format.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={exportToExcel}>
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
            <Button asChild>
              <Link href="/admin/products/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  All products in inventory
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
                <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
                <Package className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.totalStock}</div>
                <p className="text-xs text-muted-foreground">
                  Total units available
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
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.lowStockProducts}</div>
                <p className="text-xs text-muted-foreground">
                  Products with ≤5 units
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
                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.outOfStockProducts}</div>
                <p className="text-xs text-muted-foreground">
                  Products with 0 units
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
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.totalValue.toLocaleString()} DA
                </div>
                <p className="text-xs text-muted-foreground">
                  Inventory value
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Stock Status</label>
                <Select value={stockFilter} onValueChange={setStockFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All stock levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All stock levels</SelectItem>
                    <SelectItem value="in">In stock (&gt;5)</SelectItem>
                    <SelectItem value="low">Low stock (≤5)</SelectItem>
                    <SelectItem value="out">Out of stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Product Inventory</CardTitle>
            <p className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price (DA)</TableHead>
                    <TableHead>Main Stock</TableHead>
                    <TableHead>Sizes & Quantities</TableHead>
                    <TableHead>Total Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.totalStock || product.stock)
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                            <Image
                              src={product.image || '/placeholder.svg'}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {product.reference}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            {product.nameAr && (
                              <div className="text-sm text-muted-foreground">{product.nameAr}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category?.name}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.price.toLocaleString()} DA</div>
                            {product.oldPrice && (
                              <div className="text-sm text-muted-foreground line-through">
                                {product.oldPrice.toLocaleString()} DA
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <span className="font-medium">{product.stock}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="text-sm text-muted-foreground">
                              {formatSizes(product.sizes)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{product.totalStock || product.stock}</span>
                            <Badge className={stockStatus.color}>
                              {stockStatus.label}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.isActive ? "default" : "secondary"}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/admin/products/${product.id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/admin/products/${product.id}/edit`}>
                                <Edit className="w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
} 
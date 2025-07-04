'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ImageUpload } from '@/components/ui/image-upload'
import { 
  ArrowLeft,
  Save,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/admin-layout'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { useLocaleStore } from '@/lib/locale-store'

interface Product {
  id: string;
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  price: number;
  oldPrice?: number;
  category: string;
  reference?: string;
  stock: number;
  isOnSale: boolean;
  isActive: boolean;
  isLaunch?: boolean;
  launchAt?: string;
  images?: Array<{ url: string; alt?: string }>;
  slug?: string;
}

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { t } = useLocaleStore()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [productData, setProductData] = useState<Product>({
    id: '',
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    price: 0,
    oldPrice: 0,
    category: '',
    reference: '',
    stock: 0,
    isOnSale: false,
    isActive: true,
    isLaunch: false,
    launchAt: '',
    images: []
  })

  const fetchProduct = useCallback(async () => {
    try {
      const data = await api.admin.getProduct(params.id) as any
      // Transform the API response to match our Product interface
      const transformedData: Product = {
        id: data.id,
        name: data.name,
        nameAr: data.nameAr || '',
        description: data.description || '',
        descriptionAr: data.descriptionAr || '',
        price: data.price,
        oldPrice: data.oldPrice || 0,
        category: data.category?.name || data.category || '',
        reference: data.reference || '',
        stock: data.stock,
        isOnSale: data.isOnSale || false,
        isActive: data.isActive !== false,
        isLaunch: data.isLaunch || false,
        launchAt: data.launchAt ? new Date(data.launchAt).toISOString().slice(0, 16) : '',
        images: data.images || [],
        slug: data.slug || ''
      }
      setProductData(transformedData)
    } catch (error) {
      console.error('Failed to fetch product:', error)
      toast.error('Failed to load product')
    }
  }, [params.id])

  useEffect(() => {
    setMounted(true)
    fetchProduct()
  }, [fetchProduct])

  if (!mounted) return null

  const handleInputChange = (field: string, value: any) => {
    setProductData(prev => ({ ...prev, [field]: value }))
  }

  const handleImagesChange = (images: Array<{ url: string; alt?: string }>) => {
    setProductData(prev => ({ ...prev, images }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Generate slug from name if not provided
      const slug = productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

      await api.admin.updateProduct(params.id, {
        name: productData.name,
        nameAr: productData.nameAr,
        description: productData.description,
        descriptionAr: productData.descriptionAr,
        price: productData.price,
        oldPrice: productData.oldPrice,
        category: productData.category,
        reference: productData.reference,
        stock: productData.stock,
        isOnSale: productData.isOnSale,
        isActive: productData.isActive,
        isLaunch: productData.isLaunch,
        launchAt: productData.launchAt ? new Date(productData.launchAt).toISOString() : undefined,
        slug: slug,
        images: productData.images
      })

      toast.success('Product updated successfully!')
      router.push('/admin/products')
    } catch (error) {
      console.error('Failed to update product:', error)
      toast.error('Failed to update product')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Product</h1>
              <p className="text-muted-foreground">
                Update product information and settings
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/products/${params.id}`}>
              <Eye className="w-4 h-4 mr-2" />
              View Product
            </Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={productData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameAr">Product Name (Arabic)</Label>
                  <Input
                    id="nameAr"
                    value={productData.nameAr || ''}
                    onChange={(e) => handleInputChange('nameAr', e.target.value)}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={productData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descriptionAr">Description (Arabic)</Label>
                  <Textarea
                    id="descriptionAr"
                    value={productData.descriptionAr || ''}
                    onChange={(e) => handleInputChange('descriptionAr', e.target.value)}
                    dir="rtl"
                    rows={4}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (DA) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={productData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="oldPrice">Old Price (DA)</Label>
                  <Input
                    id="oldPrice"
                    type="number"
                    value={productData.oldPrice || ''}
                    onChange={(e) => handleInputChange('oldPrice', parseFloat(e.target.value) || undefined)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={productData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Traditional Dresses">Traditional Dresses</SelectItem>
                      <SelectItem value="Modern Abayas">Modern Abayas</SelectItem>
                      <SelectItem value="Embroidered Caftans">Embroidered Caftans</SelectItem>
                      <SelectItem value="Bridal Collection">Bridal Collection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference">Reference Code</Label>
                  <Input
                    id="reference"
                    value={productData.reference || ''}
                    onChange={(e) => handleInputChange('reference', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={productData.stock}
                    onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isOnSale"
                    checked={productData.isOnSale}
                    onCheckedChange={(checked) => handleInputChange('isOnSale', checked)}
                  />
                  <Label htmlFor="isOnSale">On Sale</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={productData.isActive}
                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isLaunch"
                    checked={productData.isLaunch}
                    onCheckedChange={(checked) => handleInputChange('isLaunch', checked)}
                  />
                  <Label htmlFor="isLaunch">{t?.product?.launch?.launchMode || 'Launch Mode'}</Label>
                </div>
              </div>
              
              {productData.isLaunch && (
                <div className="space-y-2">
                  <Label htmlFor="launchAt">{t?.product?.launch?.launchDate || 'Launch Date & Time'}</Label>
                  <Input
                    id="launchAt"
                    type="datetime-local"
                    value={productData.launchAt || ''}
                    onChange={(e) => handleInputChange('launchAt', e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Set when this product will become available for ordering
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                images={productData.images || []}
                onImagesChange={handleImagesChange}
                multiple={true}
                maxImages={10}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" type="button" onClick={() => router.push('/admin/products')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="elegant-gradient">
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
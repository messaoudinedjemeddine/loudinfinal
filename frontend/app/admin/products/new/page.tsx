'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { ImageUpload } from '@/components/ui/image-upload'
import { 
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Minus
} from 'lucide-react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/admin-layout'
import { toast } from 'sonner'
import { api } from '@/lib/api'

const availableSizes = ['36', '38', '40', '42', '44', '46', '48', '50']

interface Category {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
}

export default function NewProductPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [productData, setProductData] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    price: '',
    oldPrice: '',
    category: '',
    reference: '',
    stock: '',
    isOnSale: false,
    isActive: true,
    images: [] as Array<{ url: string; alt?: string }>,
    sizes: [] as { size: string; stock: number }[],
    features: [] as string[],
    specifications: {} as Record<string, string>
  })

  const [newFeature, setNewFeature] = useState('')
  const [newSpecKey, setNewSpecKey] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')

  useEffect(() => {
    setMounted(true)
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await api.admin.getCategories() as Category[]
      setCategories(response)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      toast.error('Failed to load categories')
    }
  }

  if (!mounted) return null

  const handleInputChange = (field: string, value: any) => {
    setProductData(prev => ({ ...prev, [field]: value }))
  }

  const handleImagesChange = (images: Array<{ url: string; alt?: string }>) => {
    setProductData(prev => ({ ...prev, images }))
  }

  const handleAddSize = (size: string) => {
    if (!productData.sizes.find(s => s.size === size)) {
      setProductData(prev => ({
        ...prev,
        sizes: [...prev.sizes, { size, stock: 0 }]
      }))
    }
  }

  const handleRemoveSize = (size: string) => {
    setProductData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s.size !== size)
    }))
  }

  const handleSizeStockChange = (size: string, stock: number) => {
    setProductData(prev => ({
      ...prev,
      sizes: prev.sizes.map(s => s.size === size ? { ...s, stock } : s)
    }))
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setProductData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const handleRemoveFeature = (index: number) => {
    setProductData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const handleAddSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setProductData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpecKey.trim()]: newSpecValue.trim()
        }
      }))
      setNewSpecKey('')
      setNewSpecValue('')
    }
  }

  const handleRemoveSpecification = (key: string) => {
    setProductData(prev => ({
      ...prev,
      specifications: Object.fromEntries(
        Object.entries(prev.specifications).filter(([k]) => k !== key)
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      if (!productData.name || !productData.price || !productData.category) {
        toast.error('Please fill in all required fields')
        return
      }

      // Generate slug from name
      const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

      // Debug: Log the product data being sent
      const productPayload = {
        name: productData.name,
        nameAr: productData.nameAr,
        description: productData.description,
        descriptionAr: productData.descriptionAr,
        price: parseFloat(productData.price),
        oldPrice: productData.oldPrice ? parseFloat(productData.oldPrice) : undefined,
        categoryId: productData.category, // Now this should be a valid UUID
        reference: productData.reference,
        stock: parseInt(productData.stock) || 0,
        isOnSale: productData.isOnSale,
        isActive: productData.isActive,
        slug: slug,
        images: productData.images,
        sizes: productData.sizes,
        features: productData.features,
        specifications: productData.specifications
      };
      
      console.log('Creating product with payload:', productPayload);

      // Call the API using the api client
      const result = await api.admin.createProduct(productPayload);


      toast.success('Product created successfully!')
      router.push('/admin/products')
    } catch (error) {
      console.error('Failed to create product:', error)
      toast.error('Failed to create product')
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
            <Button variant="outline" asChild>
              <Link href="/admin/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Add New Product</h1>
              <p className="text-muted-foreground">Create a new product for your store</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={productData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameAr">Product Name (Arabic)</Label>
                  <Input
                    id="nameAr"
                    value={productData.nameAr}
                    onChange={(e) => handleInputChange('nameAr', e.target.value)}
                    placeholder="أدخل اسم المنتج بالعربية"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={productData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter product description"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descriptionAr">Description (Arabic)</Label>
                <Textarea
                  id="descriptionAr"
                  value={productData.descriptionAr}
                  onChange={(e) => handleInputChange('descriptionAr', e.target.value)}
                  placeholder="أدخل وصف المنتج بالعربية"
                  rows={4}
                  dir="rtl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={productData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference">Reference Code</Label>
                  <Input
                    id="reference"
                    value={productData.reference}
                    onChange={(e) => handleInputChange('reference', e.target.value)}
                    placeholder="e.g., KAR-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Total Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={productData.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                images={productData.images}
                onImagesChange={handleImagesChange}
                multiple={true}
                maxImages={10}
              />
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (DA) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={productData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="oldPrice">Old Price (DA)</Label>
                  <Input
                    id="oldPrice"
                    type="number"
                    value={productData.oldPrice}
                    onChange={(e) => handleInputChange('oldPrice', e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isOnSale"
                  checked={productData.isOnSale}
                  onCheckedChange={(checked) => handleInputChange('isOnSale', checked)}
                />
                <Label htmlFor="isOnSale">Mark as on sale</Label>
              </div>
            </CardContent>
          </Card>

          {/* Sizes */}
          <Card>
            <CardHeader>
              <CardTitle>Available Sizes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {availableSizes.map((size) => {
                  const isSelected = productData.sizes.find(s => s.size === size)
                  return (
                    <Button
                      key={size}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      className="h-12"
                      onClick={() => isSelected ? handleRemoveSize(size) : handleAddSize(size)}
                    >
                      {size}
                    </Button>
                  )
                })}
              </div>

              {productData.sizes.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Stock per Size</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {productData.sizes.map((sizeData) => (
                      <div key={sizeData.size} className="flex items-center space-x-2">
                        <Label className="w-8">{sizeData.size}:</Label>
                        <Input
                          type="number"
                          value={sizeData.stock}
                          onChange={(e) => handleSizeStockChange(sizeData.size, parseInt(e.target.value) || 0)}
                          min="0"
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Product Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex space-x-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                />
                <Button type="button" onClick={handleAddFeature}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {productData.features.length > 0 && (
                <div className="space-y-2">
                  {productData.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span>{feature}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFeature(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  placeholder="Specification name"
                />
                <Input
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  placeholder="Specification value"
                />
                <Button type="button" onClick={handleAddSpecification}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>

              {Object.entries(productData.specifications).length > 0 && (
                <div className="space-y-2">
                  {Object.entries(productData.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-2 border rounded">
                      <span><strong>{key}:</strong> {value}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSpecification(key)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={productData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
                <Label htmlFor="isActive">Product is active and visible to customers</Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/products">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isLoading} className="elegant-gradient">
              {isLoading ? (
                'Creating...'
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Product
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
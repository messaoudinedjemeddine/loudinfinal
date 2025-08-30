'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  ShoppingCart, 
  Star, 
  Filter, 
  Grid, 
  List, 
  Search, 
  X,
  Sparkles,
  TrendingUp,
  Heart,
  Eye
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore, useWishlistStore } from '@/lib/store'
import { useLocaleStore } from '@/lib/locale-store'
import { toast } from 'sonner'
import { LaunchCountdown } from '@/components/launch-countdown'

// Define Product type
interface Product {
  id: string;
  slug: string;
  name: string;
  nameAr?: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: {
    id: string;
    name: string;
    nameAr?: string;
    slug: string;
  } | string;
  categoryAr?: string;
  rating?: number;
  isOnSale?: boolean;
  isLaunch?: boolean;
  isLaunchActive?: boolean;
  isOrderable?: boolean;
  launchAt?: string;
  stock: number;
  sizes: Array<{ id: string; size: string; stock: number }> | string[];
}

interface Category {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
}

const availableSizes = ['36', '38', '40', '42', '44', '46', '48', '50']

export default function LoudStylesProductsPage() {
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedFilters, setSelectedFilters] = useState({
    inStock: false,
    onSale: false,
    highRated: false
  })

  const addItem = useCartStore((state) => state.addItem)
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore()
  const { t, isRTL } = useLocaleStore()

  // Fetch products and categories
  useEffect(() => {
    setMounted(true)
    
    async function fetchData() {
      try {
        setLoading(true)
        
        // Fetch products - TODO: Update to filter by LOUD STYLES brand
        const productsResponse = await fetch('/api/products')
        const productsData = await productsResponse.json()
        
        // Fetch categories - TODO: Update to filter by LOUD STYLES brand
        const categoriesResponse = await fetch('/api/categories')
        const categoriesData = await categoriesResponse.json()
        
        setProducts(productsData.products || [])
        setCategories(categoriesData.categories || [])
        setFilteredProducts(productsData.products || [])
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Filter products based on search, category, and other filters
  useEffect(() => {
    let filtered = [...products]
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.nameAr && product.nameAr.includes(searchQuery))
      )
    }
    
    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => {
        if (typeof product.category === 'string') {
          return product.category === selectedCategory
        }
        return product.category.name === selectedCategory
      })
    }
    
    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    
    // Size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => {
        const productSizes = Array.isArray(product.sizes) 
          ? product.sizes.map(s => typeof s === 'string' ? s : s.size)
          : []
        return selectedSizes.some(size => productSizes.includes(size))
      })
    }
    
    // Additional filters
    if (selectedFilters.inStock) {
      filtered = filtered.filter(product => product.stock > 0)
    }
    
    if (selectedFilters.onSale) {
      filtered = filtered.filter(product => product.isOnSale)
    }
    
    if (selectedFilters.highRated) {
      filtered = filtered.filter(product => (product.rating || 0) >= 4)
    }
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
        break
      default:
        // Featured - keep original order
        break
    }
    
    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedCategory, selectedSizes, priceRange, sortBy, selectedFilters])

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: isRTL ? product.nameAr || product.name : product.name,
      price: product.price,
      image: product.image
    })
    toast.success(isRTL ? 'تمت الإضافة إلى السلة' : 'Added to cart')
  }

  const handleWishlistToggle = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast.success(isRTL ? 'تم الإزالة من المفضلة' : 'Removed from wishlist')
    } else {
      addToWishlist({
        id: product.id,
        name: isRTL ? product.nameAr || product.name : product.name,
        price: product.price,
        image: product.image
      })
      toast.success(isRTL ? 'تمت الإضافة إلى المفضلة' : 'Added to wishlist')
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-warm-50 to-cream-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              {isRTL ? 'منتجات LOUD STYLES' : 'LOUD STYLES Products'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {isRTL 
                ? 'اكتشفي مجموعتنا المميزة من الأزياء التقليدية الجزائرية'
                : 'Discover our exclusive collection of traditional Algerian fashion'
              }
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search and Sort */}
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder={isRTL ? 'البحث في المنتجات...' : 'Search products...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">{isRTL ? 'مميز' : 'Featured'}</SelectItem>
                <SelectItem value="price-low">{isRTL ? 'السعر: من الأقل' : 'Price: Low to High'}</SelectItem>
                <SelectItem value="price-high">{isRTL ? 'السعر: من الأعلى' : 'Price: High to Low'}</SelectItem>
                <SelectItem value="rating">{isRTL ? 'التقييم' : 'Rating'}</SelectItem>
                <SelectItem value="newest">{isRTL ? 'الأحدث' : 'Newest'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode and Filters Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {isRTL ? 'المرشحات' : 'Filters'}
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <h3 className="font-semibold mb-3">{isRTL ? 'الفئة' : 'Category'}</h3>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">{isRTL ? 'جميع الفئات' : 'All Categories'}</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {isRTL ? category.nameAr || category.name : category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold mb-3">{isRTL ? 'نطاق السعر' : 'Price Range'}</h3>
                  <div className="space-y-4">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={50000}
                      min={0}
                      step={1000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{priceRange[0].toLocaleString()} {isRTL ? 'د.ج' : 'DA'}</span>
                      <span>{priceRange[1].toLocaleString()} {isRTL ? 'د.ج' : 'DA'}</span>
                    </div>
                  </div>
                </div>

                {/* Size Filter */}
                <div>
                  <h3 className="font-semibold mb-3">{isRTL ? 'المقاس' : 'Size'}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {availableSizes.map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <Checkbox
                          id={size}
                          checked={selectedSizes.includes(size)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedSizes([...selectedSizes, size])
                            } else {
                              setSelectedSizes(selectedSizes.filter(s => s !== size))
                            }
                          }}
                        />
                        <label htmlFor={size} className="text-sm">{size}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Filters */}
                <div>
                  <h3 className="font-semibold mb-3">{isRTL ? 'مرشحات إضافية' : 'Additional Filters'}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="inStock"
                        checked={selectedFilters.inStock}
                        onCheckedChange={(checked) => 
                          setSelectedFilters({...selectedFilters, inStock: !!checked})
                        }
                      />
                      <label htmlFor="inStock" className="text-sm">{isRTL ? 'متوفر في المخزون' : 'In Stock'}</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="onSale"
                        checked={selectedFilters.onSale}
                        onCheckedChange={(checked) => 
                          setSelectedFilters({...selectedFilters, onSale: !!checked})
                        }
                      />
                      <label htmlFor="onSale" className="text-sm">{isRTL ? 'في التخفيض' : 'On Sale'}</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="highRated"
                        checked={selectedFilters.highRated}
                        onCheckedChange={(checked) => 
                          setSelectedFilters({...selectedFilters, highRated: !!checked})
                        }
                      />
                      <label htmlFor="highRated" className="text-sm">{isRTL ? 'تقييم عالي' : 'High Rated'}</label>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 pb-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-80 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {isRTL ? 'لا توجد منتجات' : 'No products found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {isRTL 
                ? 'جربي تغيير المرشحات أو البحث عن شيء آخر'
                : 'Try adjusting your filters or search for something else'
              }
            </p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link href={`/loud-styles/products/${product.slug}`}>
                  <Card className="overflow-hidden border-0 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                    <div className="relative">
                      <div className="aspect-square overflow-hidden">
                        <Image
                          src={product.image}
                          alt={isRTL ? product.nameAr || product.name : product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.isOnSale && (
                          <Badge className="bg-red-500 hover:bg-red-600">
                            {isRTL ? 'تخفيض' : 'Sale'}
                          </Badge>
                        )}
                        {product.isLaunchActive && (
                          <Badge className="bg-purple-500 hover:bg-purple-600">
                            <Sparkles className="w-3 h-3 mr-1" />
                            {isRTL ? 'قريباً' : 'Coming Soon'}
                          </Badge>
                        )}
                      </div>

                      {/* Wishlist Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-4 right-4 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
                        onClick={(e) => {
                          e.preventDefault()
                          handleWishlistToggle(product)
                        }}
                      >
                        <Heart 
                          className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} 
                        />
                      </Button>

                      {/* Quick Actions */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault()
                              handleAddToCart(product)
                            }}
                            disabled={!product.isOrderable}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {isRTL ? 'أضف للسلة' : 'Add to Cart'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white dark:bg-gray-800"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {isRTL ? 'عرض' : 'View'}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="mb-2">
                        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {isRTL ? product.nameAr || product.name : product.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {typeof product.category === 'string' 
                            ? product.category 
                            : (isRTL ? product.category.nameAr || product.category.name : product.category.name)
                          }
                        </p>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                          ({product.rating || 0})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">
                            {product.price.toLocaleString()} {isRTL ? 'د.ج' : 'DA'}
                          </span>
                          {product.oldPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {product.oldPrice.toLocaleString()} {isRTL ? 'د.ج' : 'DA'}
                            </span>
                          )}
                        </div>
                        {product.stock <= 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {isRTL ? 'نفذ المخزون' : 'Out of Stock'}
                          </Badge>
                        )}
                      </div>

                      {/* Launch Countdown */}
                      {product.isLaunchActive && (
                        <LaunchCountdown launchAt={product.launchAt} />
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

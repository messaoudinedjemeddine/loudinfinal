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

export default function ProductsPage() {
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
        
        // Fetch products
        const productsRes = await fetch('/api/products')
        const productsData = await productsRes.json()
        const productsArray = Array.isArray(productsData) ? productsData : (productsData.products || [])
        setProducts(productsArray)
        
        // Fetch categories
        const categoriesRes = await fetch('/api/categories')
        const categoriesData = await categoriesRes.json()
        // Ensure categories is always an array
        const categoriesArray = Array.isArray(categoriesData) ? categoriesData : []
        setCategories(categoriesArray)
        
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Handle URL parameters for category filtering
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      // Find the category by slug or name
      const category = categories.find(cat => 
        cat.slug === categoryParam || 
        cat.name.toLowerCase() === categoryParam.toLowerCase()
      )
      if (category) {
        setSelectedCategory(category.name)
      }
    }
  }, [searchParams, categories])

  useEffect(() => {
    let filtered = [...products]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product => {
        const productName = (isRTL ? (product.nameAr ?? '') : (product.name ?? '')).toLowerCase();
        const categoryName = (isRTL 
          ? (typeof product.category === 'string' 
              ? (product.categoryAr ?? '') 
              : (product.category.nameAr ?? ''))
          : (typeof product.category === 'string' 
              ? product.category 
              : product.category.name)
        ).toLowerCase();
        
        return productName.includes(searchQuery.toLowerCase()) ||
               categoryName.includes(searchQuery.toLowerCase());
      });
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => {
        const categoryName = typeof product.category === 'string' 
          ? product.category 
          : product.category.name;
        return categoryName === selectedCategory;
      });
    }

    // Size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => {
        if (!product.sizes) return false;
        
        // Handle both string array and object array formats
        const sizeStrings = Array.isArray(product.sizes) && product.sizes.length > 0
          ? typeof product.sizes[0] === 'string' 
            ? product.sizes as string[]
            : (product.sizes as Array<{id: string; size: string; stock: number}>).map(s => s.size)
          : [];
        
        return sizeStrings.some(size => selectedSizes.includes(size));
      });
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Additional filters
    if (selectedFilters.inStock) {
      filtered = filtered.filter(product => product.stock > 0)
    }
    if (selectedFilters.onSale) {
      filtered = filtered.filter(product => product.isOnSale)
    }
    if (selectedFilters.highRated) {
      filtered = filtered.filter(product => (product.rating ?? 0) >= 4.5)
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
        filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        break
      case 'newest':
        // Would sort by creation date in real app
        break
      default:
        // Featured - keep original order
        break
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedCategory, selectedSizes, priceRange, sortBy, selectedFilters, isRTL])

  if (!mounted) return null

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: isRTL ? (product.nameAr || product.name) : product.name,
      price: product.price,
              image: product.image || '/placeholder.svg'
    })
  }

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSelectedSizes([])
    setPriceRange([0, 50000])
    setSortBy('featured')
    setSelectedFilters({
      inStock: false,
      onSale: false,
      highRated: false
    })
  }

  const ProductCard = ({ product, index }: { product: Product, index: number }) => {
    // Convert sizes to string array for rendering
    const sizeStrings = Array.isArray(product.sizes) && product.sizes.length > 0
      ? typeof product.sizes[0] === 'string' 
        ? product.sizes as string[]
        : (product.sizes as Array<{id: string; size: string; stock: number}>).map(s => s.size)
      : [];

    return (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.6, 
          delay: index * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        whileHover={{ 
          y: -8,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        className="group relative h-full"
      >
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-beige-100 via-beige-200 to-beige-300 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
          {/* Product Image */}
          <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex-shrink-0">
            <Link href={`/products/${product.slug}`} className="block w-full h-full">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative w-full h-full"
              >
                <Image
                  src={product.image && product.image.trim() !== '' ? product.image : '/placeholder.svg'}
                  alt={isRTL ? product.nameAr || product.name : product.name}
                  fill
                  className="object-cover transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </motion.div>
            </Link>
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300">
              <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} opacity-0 group-hover:opacity-100 transition-all duration-300`}>
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-lg"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const isCurrentlyWishlisted = isInWishlist(product.id)
                    
                    if (isCurrentlyWishlisted) {
                      removeFromWishlist(product.id)
                      toast.success(isRTL ? 'تم إزالة من المفضلة' : 'Removed from wishlist')
                    } else {
                      addToWishlist({
                        id: product.id,
                        name: product.name,
                        nameAr: product.nameAr,
                        price: product.price,
                        oldPrice: product.oldPrice,
                        image: product.image,
                        rating: product.rating,
                        isOnSale: product.isOnSale,
                        stock: product.stock,
                        slug: product.slug
                      })
                      toast.success(isRTL ? 'تم الإضافة للمفضلة' : 'Added to wishlist')
                    }
                  }}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
              
              <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} opacity-0 group-hover:opacity-100 transition-all duration-300`}>
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-lg"
                  asChild
                >
                  <Link href={`/products/${product.slug}`}>
                    <Eye className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Badges */}
            <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} space-y-2`}>
              {product.isOnSale && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                >
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg text-center">
                    <Sparkles className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                    {isRTL ? 'تخفيض' : 'Sale'}
                  </Badge>
                </motion.div>
              )}
              {product.isLaunch && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.25 + index * 0.1, duration: 0.4 }}
                >
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg text-center">
                    {t?.product?.launch?.comingSoon || 'Coming Soon'}
                  </Badge>
                </motion.div>
              )}
            </div>
            
            <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
              {product.stock <= 5 && product.stock > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: isRTL ? -20 : 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                >
                  <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-0 shadow-lg text-center">
                    {isRTL ? 'مخزون قليل' : 'Low Stock'}
                  </Badge>
                </motion.div>
              )}
              {product.stock === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: isRTL ? -20 : 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                >
                  <Badge className="bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0 shadow-lg text-center">
                    {isRTL ? 'غير متوفر' : 'Out of Stock'}
                  </Badge>
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Product Info */}
          <CardContent className="p-4 flex-1 flex flex-col min-h-0">
            <div className="space-y-3 flex-1 flex flex-col">
              {/* Category */}
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <Badge variant="outline" className="text-xs font-medium text-center">
                  {isRTL 
                    ? (typeof product.category === 'string' 
                        ? (product.categoryAr || product.category) 
                        : (product.category.nameAr || product.category.name))
                    : (typeof product.category === 'string' 
                        ? product.category 
                        : product.category.name)
                  }
                </Badge>
                <div className={`flex items-center space-x-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 dark:text-muted-foreground">
                    {product.rating?.toFixed(1) || '0.0'}
                  </span>
                </div>
              </div>

              {/* Product Name */}
              <Link href={`/products/${product.slug}`} className="block flex-1 min-h-0">
                <h3 className="font-semibold text-base leading-tight line-clamp-2 hover:text-primary transition-colors group-hover:text-primary text-center min-h-[2.5rem] flex items-center justify-center">
                  {isRTL ? product.nameAr || product.name : product.name}
                </h3>
              </Link>

              {/* Sizes Preview */}
              {sizeStrings.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center min-h-[1.5rem]">
                  {sizeStrings.slice(0, 3).map((size: string, sizeIndex: number) => (
                    <span 
                      key={size || sizeIndex} 
                      className="text-xs bg-muted px-2 py-1 rounded-full font-medium text-center"
                    >
                      {size || '-'}
                    </span>
                  ))}
                  {sizeStrings.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-muted-foreground">
                      +{sizeStrings.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Price */}
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'} mt-auto`}>
                <div className="space-y-1 text-center flex-1">
                  <div className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-center`}>
                    <span className="text-lg font-bold text-primary">
                      {product.price.toLocaleString()} {isRTL ? 'د.ج' : 'DA'}
                    </span>
                    {product.oldPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {product.oldPrice.toLocaleString()} {isRTL ? 'د.ج' : 'DA'}
                      </span>
                    )}
                  </div>
                  {product.oldPrice && (
                    <div className={`flex items-center space-x-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-center`}>
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">
                        {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% {isRTL ? 'توفير' : 'off'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Launch Countdown */}
              {product.isLaunch && product.launchAt && (
                <div className="mt-3">
                  <LaunchCountdown launchAt={product.launchAt} />
                </div>
              )}

              {/* Add to Cart Button */}
              <Button
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-center mt-3 h-10"
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0 || (product.isLaunch && product.isLaunchActive)}
              >
                <ShoppingCart className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {product.stock === 0 
                  ? (isRTL ? 'غير متوفر' : 'Out of Stock')
                  : (product.isLaunch && product.isLaunchActive)
                    ? (t?.product?.launch?.comingSoon || 'Coming Soon')
                    : (isRTL ? 'أضيفي للسلة' : 'Add to Cart')
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const ProductListCard = ({ product, index }: { product: Product, index: number }) => {
    // Convert sizes to string array for rendering
    const sizeStrings = Array.isArray(product.sizes) && product.sizes.length > 0
      ? typeof product.sizes[0] === 'string' 
        ? product.sizes as string[]
        : (product.sizes as Array<{id: string; size: string; stock: number}>).map(s => s.size)
      : [];

    return (
      <motion.div
        initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          duration: 0.6, 
          delay: index * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        whileHover={{ 
          x: isRTL ? -5 : 5,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        className="group"
      >
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-beige-100 via-beige-200 to-beige-300 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500 h-64">
          <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} h-full`}>
            {/* Product Image */}
            <div className="relative w-64 h-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex-shrink-0">
              <Link href={`/products/${product.slug}`} className="block w-full h-full">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={product.image && product.image.trim() !== '' ? product.image : '/placeholder.svg'}
                    alt={isRTL ? product.nameAr || product.name : product.name}
                    fill
                    className="object-cover transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </motion.div>
              </Link>
              
              {/* Badges */}
              <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} space-y-2`}>
                {product.isOnSale && (
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg text-xs">
                    <Sparkles className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                    {isRTL ? 'تخفيض' : 'Sale'}
                  </Badge>
                )}
                {product.isLaunch && (
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg text-xs">
                    {t?.product?.launch?.comingSoon || 'Coming Soon'}
                  </Badge>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-0 shadow-lg text-xs">
                    {isRTL ? 'مخزون قليل' : 'Low Stock'}
                  </Badge>
                )}
                {product.stock === 0 && (
                  <Badge className="bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0 shadow-lg text-xs">
                    {isRTL ? 'غير متوفر' : 'Out of Stock'}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Product Info */}
            <div className="flex-1 p-6 flex flex-col justify-between h-full">
              <div className="space-y-3 flex-1">
                {/* Header */}
                <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="flex-1 min-w-0">
                    <Badge variant="outline" className="text-xs font-medium mb-2">
                      {isRTL 
                        ? (typeof product.category === 'string' 
                            ? (product.categoryAr || product.category) 
                            : (product.category.nameAr || product.category.name))
                        : (typeof product.category === 'string' 
                            ? product.category 
                            : product.category.name)
                      }
                    </Badge>
                    <Link href={`/products/${product.slug}`} className="block">
                      <h3 className="font-semibold text-lg leading-tight hover:text-primary transition-colors group-hover:text-primary line-clamp-2">
                        {isRTL ? product.nameAr || product.name : product.name}
                      </h3>
                    </Link>
                  </div>
                  <div className={`flex items-center space-x-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'} flex-shrink-0 ml-3`}>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-muted-foreground">
                      {product.rating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                </div>

                {/* Sizes */}
                {sizeStrings.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {isRTL ? 'المقاسات:' : 'Sizes:'}
                    </span>
                    {sizeStrings.slice(0, 4).map((size: string, sizeIndex: number) => (
                      <span 
                        key={size || sizeIndex} 
                        className="text-xs bg-muted px-2 py-1 rounded-full font-medium"
                      >
                        {size || '-'}
                      </span>
                    ))}
                    {sizeStrings.length > 4 && (
                      <span className="text-xs text-muted-foreground">
                        +{sizeStrings.length - 4} {isRTL ? 'أكثر' : 'more'}
                      </span>
                    )}
                  </div>
                )}

                {/* Price */}
                <div className={`flex items-center space-x-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="space-y-1">
                    <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="text-xl font-bold text-primary">
                        {product.price.toLocaleString()} {isRTL ? 'د.ج' : 'DA'}
                      </span>
                      {product.oldPrice && (
                        <span className="text-base text-muted-foreground line-through">
                          {product.oldPrice.toLocaleString()} {isRTL ? 'د.ج' : 'DA'}
                        </span>
                      )}
                    </div>
                    {product.oldPrice && (
                      <div className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">
                          {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% {isRTL ? 'توفير' : 'off'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Launch Countdown */}
              {product.isLaunch && product.launchAt && (
                <div className="w-full mb-3">
                  <LaunchCountdown launchAt={product.launchAt} />
                </div>
              )}

              {/* Actions - Always visible at bottom */}
              <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'} pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto`}>
                <Button
                  className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 h-10"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0 || (product.isLaunch && product.isLaunchActive)}
                >
                  <ShoppingCart className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {product.stock === 0 
                    ? (isRTL ? 'غير متوفر' : 'Out of Stock')
                    : (product.isLaunch && product.isLaunchActive)
                      ? (t?.product?.launch?.comingSoon || 'Coming Soon')
                      : (isRTL ? 'أضيفي للسلة' : 'Add to Cart')
                  }
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full w-10 h-10 p-0 border-2 hover:border-primary hover:bg-primary/10 flex-shrink-0"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const isCurrentlyWishlisted = isInWishlist(product.id)
                    
                    if (isCurrentlyWishlisted) {
                      removeFromWishlist(product.id)
                      toast.success(isRTL ? 'تم إزالة من المفضلة' : 'Removed from wishlist')
                    } else {
                      addToWishlist({
                        id: product.id,
                        name: product.name,
                        nameAr: product.nameAr,
                        price: product.price,
                        oldPrice: product.oldPrice,
                        image: product.image,
                        rating: product.rating,
                        isOnSale: product.isOnSale,
                        stock: product.stock,
                        slug: product.slug
                      })
                      toast.success(isRTL ? 'تم الإضافة للمفضلة' : 'Added to wishlist')
                    }
                  }}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full w-10 h-10 p-0 border-2 hover:border-primary hover:bg-primary/10 flex-shrink-0"
                  asChild
                >
                  <Link href={`/products/${product.slug}`}>
                    <Eye className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-100 via-cream-50 to-warm-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-camel-200 via-camel-300 to-camel-400 dark:from-camel-700 dark:via-camel-600 dark:to-camel-500">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-6xl mx-auto px-4 py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-secondary bg-clip-text text-transparent text-center leading-tight">
              {isRTL ? 'أناقة الأزياء التقليدية الجزائرية' : 'Discover Our Collection'}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-center leading-relaxed">
              {isRTL 
                ? 'تسوقي حسب المجموعة - المجموعة المميزة'
                : 'A unique collection of premium products with the highest quality and best prices'
              }
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5`} />
              <Input
                placeholder={isRTL ? 'البحث في المنتجات...' : 'Search products...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} h-12 text-lg bg-white/80 backdrop-blur-sm border-2 border-primary/20 focus:border-primary/50 transition-all duration-300 text-center`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} flex-col lg:flex-row gap-8`}>
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:w-80 space-y-6"
          >
            <Card className="sticky top-8 bg-gradient-to-br from-beige-100 via-beige-200 to-beige-300 dark:from-gray-800 dark:to-gray-900 shadow-xl">
              <CardContent className="p-6 space-y-6">
                {/* Header */}
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <h3 className="font-semibold text-lg flex items-center justify-center w-full">
                    <Filter className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'المرشحات' : 'Filters'}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Category Filter */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-muted-foreground uppercase tracking-wide text-center w-full">
                    {isRTL ? 'الفئة' : 'Category'}
                  </h4>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-white/90 dark:bg-gray-700/90 text-center w-full">
                      <SelectValue placeholder={isRTL ? 'اختر الفئة' : 'Select category'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All" className="text-center">{isRTL ? 'الكل' : 'All'}</SelectItem>
                      {Array.isArray(categories) && categories.map((category) => (
                        <SelectItem key={category.id} value={category.name} className="text-center">
                          {isRTL ? category.nameAr || category.name : category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-muted-foreground uppercase tracking-wide text-center w-full">
                    {isRTL ? 'نطاق السعر' : 'Price Range'}
                  </h4>
                  <div className="space-y-4">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={50000}
                      min={0}
                      step={1000}
                      className="w-full"
                    />
                    <div className={`flex justify-between text-sm text-gray-600 dark:text-gray-300 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="text-center">{priceRange[0].toLocaleString()} {isRTL ? 'د.ج' : 'DA'}</span>
                      <span className="text-center">{priceRange[1].toLocaleString()} {isRTL ? 'د.ج' : 'DA'}</span>
                    </div>
                  </div>
                </div>

                {/* Size Filter */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-muted-foreground uppercase tracking-wide text-center w-full">
                    {isRTL ? 'المقاس' : 'Size'}
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {availableSizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSizes.includes(size) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleSizeToggle(size)}
                        className="h-8 text-center"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Additional Filters */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-muted-foreground uppercase tracking-wide text-center w-full">
                    {isRTL ? 'خيارات إضافية' : 'Additional Options'}
                  </h4>
                  <div className="space-y-3">
                    <div className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-center`}>
                      <Checkbox
                        id="inStock"
                        checked={selectedFilters.inStock}
                        onCheckedChange={(checked) => 
                          setSelectedFilters(prev => ({ ...prev, inStock: checked as boolean }))
                        }
                      />
                      <label htmlFor="inStock" className="text-sm text-center flex-1">
                        {isRTL ? 'متوفر في المخزون فقط' : 'In stock only'}
                      </label>
                    </div>
                    <div className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-center`}>
                      <Checkbox
                        id="onSale"
                        checked={selectedFilters.onSale}
                        onCheckedChange={(checked) => 
                          setSelectedFilters(prev => ({ ...prev, onSale: checked as boolean }))
                        }
                      />
                      <label htmlFor="onSale" className="text-sm text-center flex-1">
                        {isRTL ? 'في التخفيض فقط' : 'On sale only'}
                      </label>
                    </div>
                    <div className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-center`}>
                      <Checkbox
                        id="highRated"
                        checked={selectedFilters.highRated}
                        onCheckedChange={(checked) => 
                          setSelectedFilters(prev => ({ ...prev, highRated: checked as boolean }))
                        }
                      />
                      <label htmlFor="highRated" className="text-sm text-center flex-1">
                        {isRTL ? 'تقييم عالي (4.5+)' : 'High rated (4.5+)'}
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Products Section */}
          <div className="flex-1 space-y-6">
            {/* Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className="text-center w-full">
                <h2 className="text-2xl font-bold text-center">
                  {isRTL ? 'المنتجات' : 'Products'}
                </h2>
                <p className="text-muted-foreground text-center">
                  {isRTL 
                    ? `عرض ${filteredProducts.length} منتج من أصل ${products.length}`
                    : `Showing ${filteredProducts.length} of ${products.length} products`
                  }
                </p>
              </div>

              <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-white/90 dark:bg-gray-700/90 text-center">
                    <SelectValue placeholder={isRTL ? 'ترتيب حسب' : 'Sort by'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured" className="text-center">{isRTL ? 'مميز' : 'Featured'}</SelectItem>
                    <SelectItem value="price-low" className="text-center">{isRTL ? 'السعر: من الأقل إلى الأعلى' : 'Price: Low to High'}</SelectItem>
                    <SelectItem value="price-high" className="text-center">{isRTL ? 'السعر: من الأعلى إلى الأقل' : 'Price: High to Low'}</SelectItem>
                    <SelectItem value="rating" className="text-center">{isRTL ? 'التقييم' : 'Rating'}</SelectItem>
                    <SelectItem value="newest" className="text-center">{isRTL ? 'الأحدث' : 'Newest'}</SelectItem>
                  </SelectContent>
                </Select>

                <div className={`flex items-center gap-2 bg-white/90 dark:bg-gray-700/90 rounded-lg p-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
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
              </div>
            </motion.div>

            {/* Products Grid */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="aspect-[4/5] bg-gray-200 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </motion.div>
              ) : filteredProducts.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center">
                    {isRTL ? 'لا توجد منتجات' : 'No products found'}
                  </h3>
                  <p className="text-muted-foreground mb-6 text-center">
                    {isRTL 
                      ? 'لا توجد منتجات تطابق معايير البحث. جربي تعديل المرشحات.'
                      : 'No products match your search criteria. Try adjusting your filters.'
                    }
                  </p>
                  <Button onClick={clearAllFilters} variant="outline" className="text-center">
                    {isRTL ? 'مسح المرشحات' : 'Clear Filters'}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="products"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                  }
                >
                  {filteredProducts.map((product, index) => (
                    viewMode === 'grid' ? (
                      <ProductCard key={product.id} product={product} index={index} />
                    ) : (
                      <ProductListCard key={product.id} product={product} index={index} />
                    )
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
  Share2,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Package,
  Clock,
  MapPin,
  Eye,
  X,
  ArrowLeft,
  ArrowRight,
  ThumbsUp,
  MessageCircle,
  Calendar,
  User,
  Star as StarIcon
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore, useWishlistStore } from '@/lib/store'
import { useLocaleStore } from '@/lib/locale-store'
import { toast } from 'sonner'
import { LaunchCountdown } from '@/components/launch-countdown'
import { Navbar } from '@/components/navbar'

interface Product {
  id: string;
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  price: number;
  oldPrice?: number;
  category: {
    id: string;
    name: string;
    nameAr?: string;
    slug: string;
  } | string;
  categoryAr?: string;
  rating?: number;
  reviewCount?: number;
  isOnSale?: boolean;
  isLaunch?: boolean;
  isLaunchActive?: boolean;
  isOrderable?: boolean;
  launchAt?: string;
  stock: number;
  reference?: string;
  images: string[];
  sizes: Array<{ id: string; size: string; stock: number }>;
  features?: string[];
  specifications?: Record<string, string>;
  slug?: string;
  brand?: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function LoudimProductPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')

  const addItem = useCartStore((state) => state.addItem)
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore()
  const { t, isRTL } = useLocaleStore()

  // Fetch LOUDIM product
  useEffect(() => {
    if (!slug) return

    async function fetchProduct() {
      try {
        setLoading(true)
        const response = await fetch(`/api/products/slug/${slug}?brand=loudim`)
        
        if (!response.ok) {
          throw new Error('Product not found')
        }
        
        const data = await response.json()
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 via-warm-50 to-cream-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg text-muted-foreground">
              {isRTL ? 'جاري تحميل المنتج...' : 'Loading product...'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 via-warm-50 to-cream-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {isRTL ? 'خطأ في تحميل المنتج' : 'Error Loading Product'}
            </h1>
            <p className="text-muted-foreground mb-4">
              {error || (isRTL ? 'المنتج غير موجود' : 'Product not found')}
            </p>
            <Link href="/loudim/products">
              <Button>
                <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {isRTL ? 'العودة للمنتجات' : 'Back to Products'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === (product.images?.length || 1) - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (product.images?.length || 1) - 1 : prev - 1
    )
  }

  const handleAddToCart = () => {
    if (product.isLaunch && product.isLaunchActive) {
      toast.error(isRTL ? 'المنتج غير متاح للطلب حتى الآن' : 'Product is not available for ordering yet')
      return
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error(t.product.selectSize)
      return
    }

    const selectedSizeData = product.sizes?.find((s) => s.id === selectedSize)
    
    if (selectedSizeData && selectedSizeData.stock === 0) {
      toast.error(isRTL ? 'المقاس المحدد غير متوفر' : 'Selected size is out of stock')
      return
    }

    if (product.stock === 0) {
      toast.error(isRTL ? 'المنتج غير متوفر' : 'Product is out of stock')
      return
    }

    addItem({
      id: product.id,
      name: isRTL ? product.nameAr || product.name : product.name,
      price: product.price,
      image: product.images?.[0] || '/placeholder.svg',
      quantity,
      size: selectedSizeData?.size,
      sizeId: selectedSize || undefined
    })

    toast.success(isRTL ? `تم إضافة ${quantity} عنصر للسلة!` : `Added ${quantity} item(s) to cart!`)
  }

  const handleBuyNow = () => {
    if (product.isLaunch && product.isLaunchActive) {
      toast.error(isRTL ? 'المنتج غير متاح للطلب حتى الآن' : 'Product is not available for ordering yet')
      return
    }
    handleAddToCart()
    // Navigate to checkout
    window.location.href = '/checkout'
  }

  const handleWishlist = () => {
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
        image: product.images?.[0] || '/placeholder.svg',
        rating: product.rating,
        isOnSale: product.isOnSale,
        stock: product.stock,
        slug: product.slug || product.id
      })
      toast.success(isRTL ? 'تم الإضافة للمفضلة' : 'Added to wishlist')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: isRTL ? product.nameAr || product.name : product.name,
        text: isRTL ? product.descriptionAr || product.description : product.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success(isRTL ? 'تم نسخ الرابط' : 'Link copied to clipboard')
    }
  }

  const availableStock = selectedSize 
    ? product.sizes?.find(s => s.id === selectedSize)?.stock || 0
    : product.stock

  const tabs = [
    { id: 'description', label: isRTL ? 'الوصف' : 'Description' },
    { id: 'features', label: isRTL ? 'المميزات' : 'Features' },
    { id: 'specifications', label: isRTL ? 'المواصفات' : 'Specifications' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-warm-50 to-cream-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`flex items-center space-x-2 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <Link href="/" className="hover:text-foreground transition-colors">
              {isRTL ? 'الرئيسية' : 'Home'}
            </Link>
            <span>/</span>
            <Link href="/loudim" className="hover:text-foreground transition-colors">
              LOUDIM
            </Link>
            <span>/</span>
            <Link href="/loudim/products" className="hover:text-foreground transition-colors">
              {isRTL ? 'المنتجات' : 'Products'}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium text-center">
              {isRTL ? product.nameAr || product.name : product.name}
            </span>
          </motion.nav>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 ${isRTL ? 'lg:grid-cols-2' : 'lg:grid-cols-2'}`}>
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Main Image */}
              <div className="relative w-full h-[500px] bg-gradient-to-br from-cream-100 to-cream-200 dark:from-gray-900 dark:to-gray-950 rounded-2xl overflow-hidden shadow-2xl max-w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={product.images?.[currentImageIndex] || product.images?.[0] || '/placeholder.svg'}
                      alt={isRTL ? product.nameAr || product.name : product.name}
                      className="object-contain w-full h-full"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {product.images && product.images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-lg`}
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-lg`}
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </>
                )}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="space-y-4">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-sm font-medium text-center">
                      {isRTL 
                        ? (typeof product.category === 'string' 
                            ? (product.categoryAr || product.category) 
                            : (product.category?.nameAr || product.category?.name || 'Uncategorized'))
                        : (typeof product.category === 'string' 
                            ? product.category 
                            : (product.category?.name || 'Uncategorized'))
                      }
                    </Badge>
                    {product.isLaunch && (
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg text-sm">
                        {isRTL ? 'إطلاق قريب' : 'Coming Soon'}
                      </Badge>
                    )}
                  </div>
                  <div className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
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
                    <span className="text-sm text-muted-foreground text-center">
                      {product.rating?.toFixed(1) || '0.0'} ({product.reviewCount || 0} {isRTL ? 'تقييم' : 'reviews'})
                    </span>
                  </div>
                </div>

                <h1 className="text-4xl font-bold leading-tight text-center">
                  {isRTL ? product.nameAr || product.name : product.name}
                </h1>

                <p className="text-muted-foreground text-center">
                  {isRTL ? 'المرجع' : 'Reference'}: {product.reference}
                </p>
              </div>

              {/* Price Section */}
              <div className="space-y-4">
                <div className={`flex items-center space-x-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-center`}>
                  <span className="text-4xl font-bold text-primary text-center">
                    {product.price.toLocaleString()} {t.common.currency}
                  </span>
                  {product.oldPrice && (
                    <span className="text-2xl text-muted-foreground line-through text-center">
                      {product.oldPrice.toLocaleString()} {t.common.currency}
                    </span>
                  )}
                </div>
                
                {product.oldPrice && (
                  <div className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-center`}>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-lg text-green-600 font-semibold text-center">
                      {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% {isRTL ? 'توفير' : 'off'}
                    </span>
                  </div>
                )}
              </div>

              {/* Launch Countdown */}
              {product.isLaunch && product.launchAt && (
                <div className="space-y-4">
                  <LaunchCountdown launchAt={product.launchAt} className="justify-center" />
                </div>
              )}

              {/* Stock Status */}
              <div className={`flex items-center space-x-3 p-4 rounded-xl border ${isRTL ? 'flex-row-reverse' : 'flex-row'} ${
                product.isLaunch && product.isLaunchActive 
                  ? 'bg-orange-50 dark:bg-orange-900/40 border-orange-200 dark:border-orange-700'
                  : availableStock > 0 
                    ? 'bg-green-50 dark:bg-green-900/40 border-green-200 dark:border-green-700'
                    : 'bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-700'
              }`}>
                {product.isLaunch && product.isLaunchActive ? (
                  <>
                    <Clock className="w-6 h-6 text-orange-500" />
                    <div className="text-center">
                      <p className="text-orange-700 dark:text-orange-300 font-medium">
                        {isRTL ? 'قريباً' : 'Coming Soon'}
                      </p>
                      <p className="text-sm text-orange-600 dark:text-orange-400">
                        {isRTL ? 'سيتم الإطلاق قريباً' : 'Will be available soon'}
                      </p>
                    </div>
                  </>
                ) : availableStock > 0 ? (
                  <>
                    <Check className="w-6 h-6 text-green-500" />
                    <div className="text-center">
                      <p className="text-green-700 dark:text-green-300 font-medium">
                        {t.common.inStock}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        {availableStock} {isRTL ? 'متوفر' : 'available'}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    <div className="text-center">
                      <p className="text-red-700 dark:text-red-300 font-medium">
                        {t.common.outOfStock}
                      </p>
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {isRTL ? 'سيتم إعادة التوريد قريباً' : 'Will be restocked soon'}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-4">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <h3 className="font-semibold text-lg text-center">{isRTL ? 'اختر المقاس' : 'Select Size'}</h3>
                    <Button variant="link" className="text-sm text-center">
                      {isRTL ? 'دليل المقاسات' : 'Size Guide'}
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {product.sizes.map((sizeData) => (
                      <Button
                        key={sizeData.id}
                        variant={selectedSize === sizeData.id ? "default" : "outline"}
                        className={`h-12 px-4 relative text-center ${
                          sizeData.stock === 0 ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800/60' : 'hover:scale-105 transition-transform'
                        }`}
                        onClick={() => sizeData.stock > 0 && setSelectedSize(sizeData.id)}
                        disabled={sizeData.stock === 0}
                      >
                        <span className="font-medium">{sizeData.size}</span>
                        {sizeData.stock === 0 && (
                          <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                            ×
                          </span>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-center">{isRTL ? 'الكمية' : 'Quantity'}</h3>
                <div className={`flex items-center space-x-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-center`}>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-12 h-12 p-0"
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                  <span className="w-16 text-center font-bold text-lg">{quantity}</span>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= availableStock}
                    className="w-12 h-12 p-0"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    size="lg"
                    className="h-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                    onClick={handleBuyNow}
                    disabled={availableStock === 0 || (product.isLaunch && product.isLaunchActive)}
                  >
                    <ShoppingCart className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {product.isLaunch && product.isLaunchActive 
                      ? (isRTL ? 'قريباً' : 'Coming Soon')
                      : t.common.buyNow
                    }
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 border-2 font-semibold hover:bg-primary hover:text-white transition-all duration-300 text-center"
                    onClick={handleAddToCart}
                    disabled={availableStock === 0 || (product.isLaunch && product.isLaunchActive)}
                  >
                    <Package className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {product.isLaunch && product.isLaunchActive 
                      ? (isRTL ? 'قريباً' : 'Coming Soon')
                      : t.common.addToCart
                    }
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Card>
              <CardContent className="p-6">
                <div className={`flex space-x-8 border-b mb-6 border-gray-200 dark:border-gray-700 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  {tabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? 'default' : 'ghost'}
                      onClick={() => setActiveTab(tab.id)}
                      className="relative text-center"
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        />
                      )}
                    </Button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === 'description' && (
                    <motion.div
                      key="description"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="prose prose-gray max-w-none text-center"
                    >
                      <p className="text-muted-foreground leading-relaxed text-center">
                        {isRTL ? product.descriptionAr || product.description : product.description}
                      </p>
                    </motion.div>
                  )}

                  {activeTab === 'features' && (
                    <motion.div
                      key="features"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      {product.features ? (
                        <ul className="space-y-2 text-center">
                          {product.features.map((feature, index) => (
                            <li key={index} className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-center`}>
                              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-center">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground text-center">
                          {isRTL ? 'لا توجد مميزات متاحة لهذا المنتج' : 'No features available for this product'}
                        </p>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'specifications' && (
                    <motion.div
                      key="specifications"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      {product.specifications ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(product.specifications).map(([key, value]) => (
                            <div key={key} className={`flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                              <span className="font-medium text-center">{key}</span>
                              <span className="text-muted-foreground text-center">{value}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center">
                          {isRTL ? 'لا توجد مواصفات متاحة لهذا المنتج' : 'No specifications available for this product'}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

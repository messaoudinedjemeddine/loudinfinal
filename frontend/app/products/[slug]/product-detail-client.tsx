'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  MapPin
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useCartStore } from '@/lib/store'
import { useLocaleStore } from '@/lib/locale-store'
import { toast } from 'sonner'

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
  stock: number;
  reference?: string;
  images: string[];
  sizes: Array<{ id: string; size: string; stock: number }>;
  features?: string[];
  specifications?: Record<string, string>;
}

interface ProductDetailClientProps {
  product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

  const addItem = useCartStore((state) => state.addItem)
  const { t, isRTL } = useLocaleStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

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
    handleAddToCart()
    router.push('/checkout')
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted 
      ? (isRTL ? 'تم إزالة من المفضلة' : 'Removed from wishlist')
      : (isRTL ? 'تم الإضافة للمفضلة' : 'Added to wishlist')
    )
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
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
            <Link href="/products" className="hover:text-foreground transition-colors">
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
              <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-2xl">
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
                      fill
                      className="object-cover"
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

              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={`aspect-square p-0 overflow-hidden rounded-lg ${
                        currentImageIndex === index ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <Image
                        src={image}
                        alt={`${isRTL ? product.nameAr || product.name : product.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </Button>
                  ))}
                </div>
              )}
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
                  <Badge variant="outline" className="text-sm font-medium text-center">
                    {isRTL 
                      ? (typeof product.category === 'string' 
                          ? (product.categoryAr || product.category) 
                          : (product.category.nameAr || product.category.name))
                      : (typeof product.category === 'string' 
                          ? product.category 
                          : product.category.name)
                    }
                  </Badge>
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

              {/* Stock Status */}
              <div className={`flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                {availableStock > 0 ? (
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
                          sizeData.stock === 0 
                            ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800' 
                            : 'hover:scale-105 transition-transform'
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
                    disabled={availableStock === 0}
                  >
                    <ShoppingCart className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t.common.buyNow}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 border-2 font-semibold hover:bg-primary hover:text-white transition-all duration-300 text-center"
                    onClick={handleAddToCart}
                    disabled={availableStock === 0}
                  >
                    <Package className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t.common.addToCart}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Card>
              <CardContent className="p-6">
                <div className={`flex space-x-8 border-b mb-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
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

      <Footer />
    </div>
  )
}
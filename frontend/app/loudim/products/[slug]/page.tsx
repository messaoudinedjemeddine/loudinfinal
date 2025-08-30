'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Truck,
  Shield,
  Headphones,
  CreditCard,
  Loader2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react'
import { useCartStore, useWishlistStore } from '@/lib/store'
import { useLocaleStore } from '@/lib/locale-store'
import { Navbar } from '@/components/navbar'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  nameAr?: string
  description?: string
  descriptionAr?: string
  price: number
  oldPrice?: number
  image: string
  images: string[]
  slug: string
  rating?: number
  isOnSale?: boolean
  stock: number
  sizes: Array<{ id: string; size: string; stock: number }>
  category: {
    id: string
    name: string
    nameAr?: string
    slug: string
  }
  brand: {
    id: string
    name: string
    slug: string
  }
}

export default function LoudimProductPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)

  const addItem = useCartStore((state) => state.addItem)
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore()
  const { isRTL } = useLocaleStore()

  // Features for LOUDIM
  const features = [
    {
      icon: Truck,
      title: isRTL ? 'شحن مجاني' : 'Free Shipping',
      description: isRTL ? 'شحن مجاني لجميع الطلبات' : 'Free shipping on all orders'
    },
    {
      icon: Shield,
      title: isRTL ? 'جودة مضمونة' : 'Quality Guaranteed',
      description: isRTL ? 'أقمشة فاخرة وخياطة متقنة' : 'Premium fabrics and expert craftsmanship'
    },
    {
      icon: Headphones,
      title: isRTL ? 'دعم شخصي' : 'Personal Support',
      description: isRTL ? 'استشارة مجانية لاختيار المقاس المناسب' : 'Free consultation for perfect fit'
    },
    {
      icon: CreditCard,
      title: isRTL ? 'دفع آمن' : 'Secure Payment',
      description: isRTL ? 'دفع عند الاستلام أو تحويل بنكي' : 'Cash on delivery or bank transfer'
    }
  ]

  // Fetch LOUDIM product
  useEffect(() => {
    if (!slug) return

    async function fetchProduct() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/products/slug/${slug}?brand=loudim`)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Product not found')
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }
        
        setProduct(data.product)
      } catch (error) {
        console.error('Failed to fetch product:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch product')
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
      <div className="min-h-screen bg-gradient-to-br from-warm-100 via-cream-50 to-warm-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </div>
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">
              {isRTL ? 'جاري تحميل المنتج...' : 'Loading product...'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-100 via-cream-50 to-warm-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </div>
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">
              {isRTL ? 'المنتج غير موجود' : 'Product Not Found'}
            </h1>
            <p className="text-muted-foreground mb-8">
              {isRTL 
                ? 'عذراً، المنتج الذي تبحث عنه غير موجود أو تم إزالته.'
                : 'Sorry, the product you are looking for does not exist or has been removed.'
              }
            </p>
            <div className="space-y-4">
              <Button asChild className="w-full">
                <Link href="/loudim/products">
                  <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? 'العودة للمنتجات' : 'Back to Products'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert(isRTL ? 'يرجى اختيار المقاس' : 'Please select a size')
      return
    }
    
    addItem({
      id: product.id,
      name: isRTL ? product.nameAr || product.name : product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      quantity
    })
  }

  const handleWishlist = () => {
    const isCurrentlyWishlisted = isInWishlist(product.id)
    if (isCurrentlyWishlisted) {
      removeFromWishlist(product.id)
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
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-100 via-cream-50 to-warm-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      
      {/* Product Detail Content */}
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
              <li>
                <Link href="/loudim" className="hover:text-primary">
                  {isRTL ? 'الرئيسية' : 'Home'}
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/loudim/products" className="hover:text-primary">
                  {isRTL ? 'المنتجات' : 'Products'}
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground">
                {isRTL ? product.nameAr || product.name : product.name}
              </li>
            </ol>
          </nav>

          {/* Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square relative overflow-hidden rounded-lg">
                <Image
                  src={product.image || '/placeholder.svg'}
                  alt={isRTL ? product.nameAr || product.name : product.name}
                  fill
                  className="object-cover"
                />
                {product.isOnSale && (
                  <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">
                    {isRTL ? 'تخفيض' : 'Sale'}
                  </Badge>
                )}
              </div>
              
              {/* Additional Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((image, index) => (
                    <div key={index} className="aspect-square relative overflow-hidden rounded-lg">
                      <Image
                        src={image}
                        alt={`${isRTL ? product.nameAr || product.name : product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {isRTL ? product.nameAr || product.name : product.name}
                </h1>
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < (product.rating || 4) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({product.rating || 4})
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="text-lg text-gray-500 line-through">
                    ${product.oldPrice}
                  </span>
                )}
                <span className="text-3xl font-bold text-primary">
                  ${product.price}
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="font-semibold mb-2">
                    {isRTL ? 'الوصف' : 'Description'}
                  </h3>
                  <p className="text-muted-foreground">
                    {isRTL ? product.descriptionAr || product.description : product.description}
                  </p>
                </div>
              )}

              {/* Size Selection */}
              <div>
                <h3 className="font-semibold mb-2">
                  {isRTL ? 'المقاس' : 'Size'}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size.id}
                      variant={selectedSize === size.size ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setSelectedSize(size.size)}
                      disabled={size.stock === 0}
                    >
                      {size.size}
                      {size.stock === 0 && (
                        <span className="text-xs text-red-500 ml-1">
                          {isRTL ? 'نفذ' : 'Out'}
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="font-semibold mb-2">
                  {isRTL ? 'الكمية' : 'Quantity'}
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button 
                  className="flex-1" 
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {isRTL ? 'أضف للسلة' : 'Add to Cart'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleWishlist}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>

              {/* Stock Status */}
              <div className="text-sm text-muted-foreground">
                {product.stock > 0 ? (
                  <span className="text-green-600">
                    {isRTL ? 'متوفر في المخزون' : 'In Stock'}
                  </span>
                ) : (
                  <span className="text-red-600">
                    {isRTL ? 'نفذ من المخزون' : 'Out of Stock'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <section className="py-16">
            <h2 className="text-2xl font-bold mb-8 text-center">
              {isRTL ? 'مميزاتنا' : 'Our Features'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ backgroundColor: '#a58a66' }}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

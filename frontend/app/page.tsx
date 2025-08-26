'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Star, Truck, Shield, Headphones, CreditCard, Play, Pause } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/store'
import { useLocaleStore } from '@/lib/locale-store'

// Define types
interface Product {
  id: string;
  name: string;
  nameAr?: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  categoryAr?: string;
  rating?: number;
  isOnSale?: boolean;
  stock: number;
  sizes: Array<{ id: string; size: string; stock: number }> | string[];
  slug: string;
}

interface Category {
  id: string;
  name: string;
  nameAr?: string;
  image: string;
  productCount: number;
  slug: string;
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const addItem = useCartStore((state) => state.addItem)
  const { t, isRTL } = useLocaleStore()

  const features = [
    {
      icon: Truck,
      title: isRTL ? 'توصيل مجاني' : 'Free Delivery',
      description: isRTL ? 'توصيل مجاني في جميع أنحاء الجزائر' : 'Free delivery across Algeria'
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

  // Fetch featured products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch featured products (first 4 products)
        const productsResponse = await fetch('/api/products')
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products')
        }
        const productsData = await productsResponse.json()
        
        // Handle different response formats
        const products = Array.isArray(productsData) ? productsData : (productsData.products || [])
        const featured = products.slice(0, 4).map((product: any) => ({
          ...product,
          sizes: product.sizes || [],
          rating: product.rating || 4.5,
          isOnSale: product.oldPrice && product.oldPrice > product.price,
          slug: product.slug || product.name.toLowerCase().replace(/\s+/g, '-')
        }))
        setFeaturedProducts(featured)

        // Fetch categories (with cache busting)
        const categoriesResponse = await fetch('/api/categories', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          }
        })
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories')
        }
        const categoriesData = await categoriesResponse.json()
        const categoriesWithCount = categoriesData.map((category: any) => ({
          ...category,
          productCount: category.productCount || Math.floor(Math.random() * 50) + 10, // Use actual count or mock
          slug: category.slug || category.name.toLowerCase().replace(/\s+/g, '-')
        }))
        console.log('Categories loaded:', categoriesWithCount)
        categoriesWithCount.forEach((cat: any) => {
          console.log(`${cat.name}: ${cat.image || 'NO IMAGE'}`);
        })
        setCategories(categoriesWithCount)

      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: isRTL ? product.nameAr || product.name : product.name,
      price: product.price,
      image: product.image
    })
  }

  const toggleVideo = () => {
    const video = document.getElementById('hero-video') as HTMLVideoElement
    if (video) {
      if (isVideoPlaying) {
        video.pause()
      } else {
        video.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  // Helper function to get size strings
  const getSizeStrings = (sizes: Product['sizes']): string[] => {
    if (!Array.isArray(sizes) || sizes.length === 0) return []
    
    return typeof sizes[0] === 'string' 
      ? sizes as string[]
      : (sizes as Array<{id: string; size: string; stock: number}>).map(s => s.size)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-warm-50 to-cream-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section with Video */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-camel-100 via-camel-200 to-camel-300 dark:from-camel-800 dark:via-camel-700 dark:to-camel-600">
        {/* Video Background */}
        <video
          id="hero-video"
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-poster.jpg"
        >
          {/* Multiple video formats for better browser compatibility */}
          <source src="/videos/hero-video.mp4" type="video/mp4" />
          <source src="/videos/hero-video.webm" type="video/webm" />
          <source src="/videos/hero-video.ogg" type="video/ogg" />
          
          {/* Fallback to external video if local files don't exist */}
          <source src="https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761" type="video/mp4" />
          
          {/* Fallback image if video fails to load */}
          <Image
            src="/images/hero-fallback.jpg"
            alt="Traditional Algerian Fashion"
            fill
            className="video-fallback"
            priority
          />
        </video>
        
        {/* Video Overlay */}
        <div className="absolute inset-0 video-overlay" />
        
        {/* Hero Content */}
        <div className={`relative z-10 text-center text-white max-w-4xl mx-auto px-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            {isRTL ? 'أناقة الأزياء التقليدية الجزائرية' : 'Elegant Algerian Traditional Fashion'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-gray-200 font-light"
          >
            {isRTL 
              ? 'اكتشفي مجموعتنا الفاخرة من الأزياء التقليدية الجزائرية المصممة خصيصاً للمرأة العصرية'
              : 'Discover our exquisite collection of traditional Algerian fashion designed for the modern woman'
            }
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 elegant-outline hover:elegant-gradient transition-all duration-300 font-medium" 
              asChild
            >
              <Link href="/products">
                {isRTL ? 'تسوقي الآن' : 'Shop Now'}
              </Link>
            </Button>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 elegant-outline hover:elegant-gradient transition-all duration-300 font-medium" 
              asChild
            >
              <Link href="/categories">
                {isRTL ? 'استكشفي المجموعات' : 'Explore Collections'}
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-cream-50 to-warm-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center elegant-hover"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-camel-400 to-camel-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-br from-warm-100 via-cream-50 to-warm-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`text-center mb-16 ${isRTL ? 'text-right' : 'text-left'}`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {isRTL ? 'تسوقي حسب المجموعة' : 'Shop by Collection'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {isRTL 
                ? 'استكشفي مجموعاتنا المتنوعة من الأزياء التقليدية الجزائرية المصممة بعناية فائقة'
                : 'Explore our diverse collections of traditional Algerian fashion crafted with exceptional care'
              }
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center space-x-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="w-48 h-48 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto relative">
              {/* Navigation Arrows */}
              <motion.button
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -left-16 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                onClick={() => {
                  const container = document.getElementById('categories-container');
                  if (container) {
                    container.scrollBy({ left: -300, behavior: 'smooth' });
                  }
                }}
              >
                <motion.div
                  className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors"
                  whileHover={{ x: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.div>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -right-16 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                onClick={() => {
                  const container = document.getElementById('categories-container');
                  if (container) {
                    container.scrollBy({ left: 300, behavior: 'smooth' });
                  }
                }}
              >
                <motion.div
                  className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </motion.button>

              {/* Categories Container */}
              <div 
                id="categories-container"
                className="flex space-x-8 overflow-x-auto scrollbar-hide py-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: index * 0.2,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 5,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                    className="flex-shrink-0"
                  >
                    <Link href={`/products?category=${category.slug}`}>
                      <div className="group cursor-pointer relative">
                        {/* Circle Container */}
                        <div className="w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-white via-cream-50 to-warm-50 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500 relative">
                          <Image
                            src={category.image || '/placeholder.svg'}
                            alt={isRTL ? category.nameAr || category.name : category.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              console.log('Category image failed to load:', category.image);
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.svg';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40 transition-all duration-500" />
                          
                          {/* Category Info */}
                          <div className="absolute inset-0 flex items-end justify-center p-6">
                            <div className="text-center text-white">
                              <motion.h3 
                                className="text-xl font-bold mb-2"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                              >
                                {isRTL ? category.nameAr || category.name : category.name}
                              </motion.h3>
                              <motion.p 
                                className="text-sm opacity-90"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                              >
                                {category.productCount} {isRTL ? 'قطعة' : 'pieces'}
                              </motion.p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Hover Ring Effect */}
                        <motion.div
                          className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-primary/30 transition-all duration-500"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: Math.ceil(categories.length / 3) }, (_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
                    className="w-3 h-3 rounded-full bg-gray-300 hover:bg-primary transition-colors cursor-pointer"
                    onClick={() => {
                      const container = document.getElementById('categories-container');
                      if (container) {
                        container.scrollTo({ left: index * 300, behavior: 'smooth' });
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gradient-to-br from-cream-200 via-warm-100 to-cream-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`text-center mb-16 ${isRTL ? 'text-right' : 'text-left'}`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {isRTL ? 'المجموعة المميزة' : 'Featured Collection'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {isRTL 
                ? 'قطع مختارة بعناية من أجمل الأزياء التقليدية الجزائرية'
                : 'Carefully selected pieces from the most beautiful traditional Algerian fashion'
              }
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-80 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 4).map((product, index) => {
                  const sizeStrings = getSizeStrings(product.sizes)
                  
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 50, scale: 0.9 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: index * 0.1,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      viewport={{ once: true }}
                      whileHover={{ 
                        y: -8,
                        transition: { duration: 0.3, ease: "easeOut" }
                      }}
                      whileTap={{ 
                        scale: 0.98,
                        transition: { duration: 0.1 }
                      }}
                      className="h-full"
                    >
                      <Link href={`/products/${product.slug}`} className="block h-full">
                        <Card className="group cursor-pointer overflow-hidden border-0 bg-gradient-to-br from-beige-100 via-beige-200 to-beige-300 dark:from-gray-800 dark:to-gray-900 relative h-full flex flex-col">
                          {/* Hover overlay effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                          />
                          
                          <div className="relative flex-1 flex flex-col">
                            <div className="relative h-80 overflow-hidden flex-shrink-0">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="relative h-full w-full"
                              >
                                <Image
                                  src={product.image || '/placeholder.svg'}
                                  alt={isRTL ? product.nameAr || product.name : product.name}
                                  fill
                                  className="object-cover transition-transform duration-500"
                                />
                              </motion.div>
                              {product.isOnSale && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                                  animate={{ opacity: 1, scale: 1, x: 0 }}
                                  transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                                >
                                  <Badge className={`absolute top-4 bg-red-500 hover:bg-red-600 ${isRTL ? 'right-4' : 'left-4'} shadow-lg`}>
                                    {isRTL ? 'تخفيض' : 'Sale'}
                                  </Badge>
                                </motion.div>
                              )}
                            </div>
                            
                            <CardContent className="p-6 flex-1 flex flex-col text-center">
                              <motion.h3 
                                className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors text-center"
                                whileHover={{ color: 'hsl(var(--primary))' }}
                              >
                                {isRTL ? product.nameAr || product.name : product.name}
                              </motion.h3>
                              
                              <motion.div 
                                className="flex items-center justify-center mb-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                              >
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <motion.div
                                      key={i}
                                      initial={{ opacity: 0, scale: 0 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: 0.5 + index * 0.1 + i * 0.1, duration: 0.3 }}
                                    >
                                      <Star
                                        className={`w-4 h-4 ${
                                          i < Math.floor(product.rating || 0)
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    </motion.div>
                                  ))}
                                  <span className="text-sm text-muted-foreground ml-2">
                                    ({product.rating || 0})
                                  </span>
                                </div>
                              </motion.div>
                              
                              <motion.div 
                                className="flex items-center justify-center mb-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                              >
                                <div className="flex items-center">
                                  <span className="text-lg font-bold text-primary">
                                    {product.price.toLocaleString('en-US')} {isRTL ? 'د.ج' : 'DA'}
                                  </span>
                                  {product.oldPrice && (
                                    <span className="text-sm text-muted-foreground line-through ml-2">
                                      {product.oldPrice.toLocaleString('en-US')} {isRTL ? 'د.ج' : 'DA'}
                                    </span>
                                  )}
                                </div>
                              </motion.div>
                              
                              <motion.div 
                                className="mt-auto"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                              >
                                <Button 
                                  className="w-full group-hover:bg-primary/90 transition-all duration-300"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleAddToCart(product);
                                  }}
                                >
                                  <ShoppingCart className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                                  {isRTL ? 'أضف إلى السلة' : 'Add to Cart'}
                                </Button>
                              </motion.div>
                            </CardContent>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="elegant-hover border-2 font-medium" asChild>
              <Link href="/products">
                {isRTL ? 'عرض جميع المنتجات' : 'View All Products'}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-camel-500 via-camel-600 to-camel-700 dark:from-camel-600 dark:via-camel-700 dark:to-camel-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {isRTL ? 'ابقي على اطلاع' : 'Stay Updated'}
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              {isRTL 
                ? 'اشتركي في نشرتنا الإخبارية واحصلي على آخر أخبار الموضة والعروض الحصرية'
                : 'Subscribe to our newsletter and get the latest fashion news and exclusive offers'
              }
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 max-w-md mx-auto ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <input
                type="email"
                placeholder={isRTL ? 'أدخلي بريدك الإلكتروني' : 'Enter your email'}
                className={`flex-1 px-4 py-3 rounded-lg text-gray-800 placeholder-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              <Button variant="secondary" size="lg" className="bg-white text-camel-600 hover:bg-gray-100 font-medium">
                {isRTL ? 'اشتراك' : 'Subscribe'}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
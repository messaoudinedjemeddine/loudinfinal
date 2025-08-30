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
import { Navbar } from '@/components/navbar'
import { Counter } from '@/components/counter'

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

        // Fetch featured products from both brands (first 4 products)
        const productsResponse = await fetch('/api/products?limit=8')
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

        // Fetch categories from both brands (with cache busting)
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
        const categories = categoriesData.categories || []
        const categoriesWithCount = categories.map((category: any) => ({
          ...category,
          productCount: category.productCount || Math.floor(Math.random() * 50) + 10,
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
        {/* Navbar positioned over video */}
        <div className="absolute top-0 left-0 right-0 z-50">
          <Navbar />
        </div>
        
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
          <img
            src="/images/hero-fallback.jpg"
            alt="LOUD BRANDS Hero"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </video>

        {/* Video Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl mb-6 tracking-wider group cursor-pointer">
              <span className="inline-block">
                <span className="text-primary transition-colors duration-300 group-hover:text-white font-bold">LOUD</span>
                <span className="relative inline-block ml-2">
                  <span className="text-white transition-colors duration-300 group-hover:text-primary font-light">BRANDS</span>
                  <motion.span
                    className="absolute inset-0 bg-primary origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ zIndex: -1 }}
                  />
                </span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
              {isRTL 
                ? 'اكتشفي الأناقة الجزائرية الأصيلة مع مجموعتنا المميزة من الأزياء التقليدية والعصرية'
                : 'Discover authentic Algerian elegance with our exclusive collection of traditional and modern fashion'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.div
                whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="/loudim">
                  <div className="bg-primary hover:bg-primary/90 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Image
                      src="/logos/logo-light.png"
                      alt="LOUDIM - Explore Collection"
                      width={80}
                      height={32}
                      className="h-6 w-auto"
                    />
                  </div>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="/loud-styles">
                  <div className="bg-primary hover:bg-primary/90 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Image
                      src="/logos/logo-md.png"
                      alt="LOUD STYLES - Explore Collection"
                      width={80}
                      height={32}
                      className="h-6 w-auto brightness-0 invert"
                    />
                  </div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* About Us Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className={`${isRTL ? 'lg:order-2' : ''}`}
            >
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
              >
                {isRTL ? 'من نحن' : 'About Us'}
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-lg text-gray-600 mb-6 leading-relaxed"
              >
                {isRTL 
                  ? 'نحن فخورون بتقديم أجمل الأزياء الجزائرية التقليدية والعصرية، مصممة بعناية فائقة لتناسب كل مناسبة.'
                  : 'We are proud to offer the most beautiful traditional and modern Algerian fashion, carefully designed to suit every occasion.'
                }
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="text-lg text-gray-600 mb-8 leading-relaxed"
              >
                {isRTL 
                  ? 'نحن نؤمن بأن الأناقة ليست مجرد مظهر خارجي، بل هي تعبير عن الهوية والثقافة والثقة بالنفس.'
                  : 'We believe that elegance is not just an outward appearance, but an expression of identity, culture, and self-confidence.'
                }
              </motion.p>

              {/* Statistics Cards */}
              <div className="grid grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-3xl font-bold text-primary mb-2">
                    <Counter end={5000} duration={2} />
                  </div>
                  <p className="text-gray-600 font-medium">
                    {isRTL ? 'عميلة سعيدة' : 'Happy Customers'}
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-3xl font-bold text-primary mb-2">
                    <Counter end={1000} duration={2} />
                  </div>
                  <p className="text-gray-600 font-medium">
                    {isRTL ? 'تصميم فريد' : 'Unique Designs'}
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className={`${isRTL ? 'lg:order-1' : ''}`}
            >
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="LOUD BRANDS Collection - Traditional Algerian Fashion"
                  width={600}
                  height={600}
                  className="w-full h-[600px] object-cover rounded-2xl shadow-2xl"
                />
                
                {/* Floating Badge */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                  viewport={{ once: true }}
                  className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold shadow-lg"
                >
                  100% {isRTL ? 'جزائري' : 'Algerian'}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 text-gray-900" style={{ backgroundColor: '#ede2d1' }}>
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            {isRTL ? 'قصتنا' : 'Our Story'}
          </motion.h2>

          <div className="space-y-16">
            {/* Story Point 1 */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Our Beginning - Traditional Fashion Workshop"
                  width={500}
                  height={400}
                  className="w-full h-[400px] object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute -top-4 -left-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold">
                  2019
                </div>
                <div className="absolute top-1/2 right-4 w-8 h-8 bg-yellow-400 rounded-full"></div>
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-4">
                  {isRTL ? 'البداية' : 'The Beginning'}
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {isRTL 
                    ? 'بدأت رحلتنا بحلم بسيط: تقديم أجمل الأزياء الجزائرية للعالم. بدأنا بورشة صغيرة في قلب الجزائر العاصمة.'
                    : 'Our journey began with a simple dream: to bring the most beautiful Algerian fashion to the world. We started with a small workshop in the heart of Algiers.'
                  }
                </p>
              </div>
            </motion.div>

            {/* Story Point 2 */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div className="lg:order-2 relative">
                <Image
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Growth and Innovation - Modern Fashion Design"
                  width={500}
                  height={400}
                  className="w-full h-[400px] object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold">
                  2021
                </div>
                <div className="absolute top-1/2 left-4 w-8 h-8 bg-white rounded-full"></div>
              </div>
              <div className="lg:order-1">
                <h3 className="text-3xl font-bold mb-4">
                  {isRTL ? 'النمو والابتكار' : 'Growth & Innovation'}
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {isRTL 
                    ? 'مع نمو علامتنا التجارية، بدأنا في دمج التقاليد الجزائرية مع التصاميم العصرية، مما أدى إلى إنشاء مجموعات فريدة.'
                    : 'As our brand grew, we began integrating Algerian traditions with modern designs, creating unique collections that honor our heritage.'
                  }
                </p>
              </div>
            </motion.div>

            {/* Story Point 3 */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2026&q=80"
                  alt="Today and Beyond - Luxury Fashion Collection"
                  width={500}
                  height={400}
                  className="w-full h-[400px] object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute -top-4 -left-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold">
                  2024
                </div>
                <div className="absolute top-1/2 right-4 w-8 h-8 bg-yellow-400 rounded-full"></div>
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-4">
                  {isRTL ? 'اليوم والمستقبل' : 'Today & Beyond'}
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {isRTL 
                    ? 'اليوم، نحن فخورون بأن نكون علامة تجارية رائدة في الأزياء الجزائرية، مع رؤية واضحة للمستقبل وخطط للتوسع العالمي.'
                    : 'Today, we are proud to be a leading brand in Algerian fashion, with a clear vision for the future and plans for global expansion.'
                  }
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Structure */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {isRTL ? 'علاماتنا التجارية' : 'Our Brands'}
            </h2>
            <p className="text-xl max-w-3xl mx-auto text-gray-600">
              {isRTL 
                ? 'اكتشفي مجموعتنا المتنوعة من الأزياء التقليدية والعصرية'
                : 'Discover our diverse collection of traditional and modern fashion'
              }
            </p>
          </motion.div>

          {/* Brand Cards Layout */}
          <div className="space-y-20">
            {/* LOUDIM Brand - First Card */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true, amount: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              {/* Brand Info Section */}
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Title Group */}
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    LOUDIM
                  </h3>
                  <p className="text-lg font-medium text-gray-600">
                    {isRTL ? 'ملابس طلعة أنيقة، كاجوال بلمسة راقية' : 'Elegant casual wear with a sophisticated touch'}
                  </p>
                </div>

                {/* Description */}
                <p className="text-lg leading-relaxed text-gray-600">
                  {isRTL 
                    ? 'مجموعة LOUDIM تجمع بين الأناقة والراحة، مصممة للمرأة العصرية التي تبحث عن التميز في كل مناسبة.'
                    : 'LOUDIM collection combines elegance and comfort, designed for the modern woman seeking distinction in every occasion.'
                  }
                </p>

                {/* Feature List */}
                <ul className="space-y-3">
                  {[
                    isRTL ? 'تصاميم عصرية وأنيقة' : 'Modern and elegant designs',
                    isRTL ? 'أقمشة عالية الجودة' : 'High-quality fabrics',
                    isRTL ? 'مناسبة لجميع المناسبات' : 'Perfect for all occasions'
                  ].map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center text-gray-600"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Link href="/loudim">
                      {isRTL ? 'استكشفي LOUDIM' : 'Explore LOUDIM'}
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Image Section */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <div className="relative h-[500px] rounded-2xl shadow-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="LOUDIM Collection - Casual Fashion"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  
                  {/* Brand Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.1 }}
                    viewport={{ once: true }}
                    className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
                  >
                    <span className="text-gray-900 font-bold">LOUDIM</span>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* LOUD STYLES Brand - Second Card (Alternating Layout) */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              {/* Image Section - First on mobile, second on desktop */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative lg:order-1"
              >
                <div className="relative h-[500px] rounded-2xl shadow-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2026&q=80"
                    alt="LOUD STYLES Collection - Luxury Fashion"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  
                  {/* Brand Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                    viewport={{ once: true }}
                    className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
                  >
                    <span className="text-gray-900 font-bold">LOUD STYLES</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Brand Info Section */}
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 lg:order-2"
              >
                {/* Title Group */}
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    LOUD STYLES
                  </h3>
                  <p className="text-lg font-medium text-gray-600">
                    {isRTL ? 'فساتين أعراس وسهرات فاخرة' : 'Wedding dresses and luxury evening wear'}
                  </p>
                </div>

                {/* Description */}
                <p className="text-lg leading-relaxed text-gray-600">
                  {isRTL 
                    ? 'مجموعة LOUD STYLES تقدم أجمل فساتين الأعراس والملابس الفاخرة للمناسبات الخاصة.'
                    : 'LOUD STYLES collection offers the most beautiful wedding dresses and luxury wear for special occasions.'
                  }
                </p>

                {/* Feature List */}
                <ul className="space-y-3">
                  {[
                    isRTL ? 'فساتين أعراس فاخرة' : 'Luxury wedding dresses',
                    isRTL ? 'ملابس سهرات أنيقة' : 'Elegant evening wear',
                    isRTL ? 'تفاصيل يدوية دقيقة' : 'Handcrafted details'
                  ].map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center text-gray-600"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Link href="/loud-styles">
                      {isRTL ? 'استكشفي LOUD STYLES' : 'Explore LOUD STYLES'}
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
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
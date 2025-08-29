'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Star, Truck, Shield, Headphones, CreditCard } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/store'

interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  rating?: number;
  isOnSale?: boolean;
  stock: number;
  sizes: Array<{ id: string; size: string; stock: number }> | string[];
  slug: string;
}

export default function LoudimPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const addItem = useCartStore((state) => state.addItem)

  const features = [
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'Free delivery across Algeria'
    },
    {
      icon: Shield,
      title: 'Quality Guaranteed',
      description: 'Premium fabrics and expert craftsmanship'
    },
    {
      icon: Headphones,
      title: 'Personal Support',
      description: 'Free consultation for perfect fit'
    },
    {
      icon: CreditCard,
      title: 'Secure Payment',
      description: 'Cash on delivery or bank transfer'
    }
  ]

  // Fetch Loudim products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch products (you can filter by brand/category later)
        const productsResponse = await fetch('/api/products')
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products')
        }
        const productsData = await productsResponse.json()
        
        // Handle different response formats
        const allProducts = Array.isArray(productsData) ? productsData : (productsData.products || [])
        const loudimProducts = allProducts.slice(0, 8).map((product: any) => ({
          ...product,
          sizes: product.sizes || [],
          rating: product.rating || 4.5,
          isOnSale: product.oldPrice && product.oldPrice > product.price,
          slug: product.slug || product.name.toLowerCase().replace(/\s+/g, '-')
        }))
        setProducts(loudimProducts)

      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      size: product.sizes.length > 0 ? (typeof product.sizes[0] === 'string' ? product.sizes[0] : product.sizes[0].size) : undefined
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-camel-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-camel-50 to-warm-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-camel-800 dark:text-camel-200 mb-6">
              Loudim
            </h1>
            <p className="text-xl md:text-2xl text-camel-600 dark:text-camel-300 mb-8 max-w-3xl mx-auto">
              Discover our premium Loudim collection featuring elegant designs and exceptional quality
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-camel-600 hover:bg-camel-700 text-white">
                Shop Collection
              </Button>
              <Button size="lg" variant="outline" className="border-camel-600 text-camel-600 hover:bg-camel-50">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-camel-100 dark:bg-camel-900 rounded-full flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-camel-600 dark:text-camel-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-camel-800 dark:text-camel-200 mb-4">
              Loudim Collection
            </h2>
            <p className="text-xl text-camel-600 dark:text-camel-300">
              Explore our latest Loudim designs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="relative overflow-hidden">
                    <Image
                      src={product.image || '/placeholder-product.jpg'}
                      alt={product.name}
                      width={400}
                      height={500}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isOnSale && (
                      <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                        Sale
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-camel-600 dark:text-camel-400">
                          {product.price.toFixed(2)} DH
                        </span>
                        {product.oldPrice && (
                          <span className="text-lg text-gray-500 line-through">
                            {product.oldPrice.toFixed(2)} DH
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {product.rating}
                        </span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-camel-600 hover:bg-camel-700 text-white"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-camel-600 dark:bg-camel-800">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Experience Loudim?
            </h2>
            <p className="text-xl text-camel-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust Loudim for their fashion needs
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-camel-600 hover:bg-gray-100">
              Shop Now
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

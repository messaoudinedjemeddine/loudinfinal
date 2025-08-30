'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LoudStylesNavbar } from '@/components/loud-styles-navbar'
import { useLocaleStore } from '@/lib/locale-store'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'

// Import the existing product detail component
import ProductDetailClient from '@/app/products/[slug]/product-detail-client'

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
}

export default function LoudStylesProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isRTL } = useLocaleStore()

  const slug = params.slug as string

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!slug) return

    async function fetchProduct() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/products/${slug}`)
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
        
        setProduct(data)
      } catch (error) {
        console.error('Failed to fetch product:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  if (!mounted) return null

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#b6b8b2' }} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="fixed top-0 left-0 right-0 z-50">
          <LoudStylesNavbar />
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
      <div className="min-h-screen" style={{ backgroundColor: '#b6b8b2' }} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="fixed top-0 left-0 right-0 z-50">
          <LoudStylesNavbar />
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
                <Link href="/loud-styles/products">
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#b6b8b2' }} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <LoudStylesNavbar />
      </div>
      
      {/* Product Detail Content */}
      <div className="pt-20">
        <ProductDetailClient product={product} />
      </div>
    </div>
  )
}

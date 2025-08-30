'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { useLocaleStore } from '@/lib/locale-store'
import { motion } from 'framer-motion'
import { Search, Home, ArrowLeft } from 'lucide-react'

export default function LoudimProductNotFound() {
  const { isRTL } = useLocaleStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-100 via-cream-50 to-warm-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      
      <div className="flex items-center justify-center min-h-screen pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-muted-foreground" />
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
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/loudim">
                <Home className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {isRTL ? 'العودة للرئيسية' : 'Back to Home'}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

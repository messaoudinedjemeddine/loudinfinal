'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Grid, List, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useLocaleStore } from '@/lib/locale-store'
import { api } from '@/lib/api'

interface Category {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export default function CategoriesPage() {
  const { isRTL } = useLocaleStore()
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true)
        const response = await api.categories.getAll()
        console.log('API Response:', response)
        
        // Ensure we have an array of categories
        const fetchedCategories = Array.isArray(response) 
          ? response 
          : ((response as any)?.categories || (response as any)?.data || [])
        console.log('Processed categories:', fetchedCategories)
        
        setCategories(fetchedCategories)
        setFilteredCategories(fetchedCategories)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        setCategories([])
        setFilteredCategories([])
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (category.nameAr && category.nameAr.toLowerCase().includes(searchQuery.toLowerCase())) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredCategories(filtered)
    } else {
      setFilteredCategories(categories)
    }
  }, [searchQuery, categories])

  const CategoryCard = ({ category, index }: { category: Category, index: number }) => {
    const name = isRTL ? category.nameAr || category.name : category.name
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="h-full"
      >
        <Link href={`/products?category=${category.slug}`} className="block h-full">
          <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
            <div className="relative h-56 overflow-hidden">
              <Image
                src={category.image || '/placeholder.svg'}
                alt={name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-xl font-bold text-white shadow-md">
                  {name}
                </h3>
              </div>
              <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
                <Badge variant="secondary" className="bg-white/90 text-black shadow-lg">
                  {category.productCount} {isRTL ? 'منتجات' : 'products'}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-6 flex-1 flex flex-col">
              <p className="text-muted-foreground mb-4 flex-1">
                {category.description}
              </p>
              <div className={`flex items-center space-x-2 text-primary font-semibold group-hover:underline ${isRTL ? 'justify-end flex-row-reverse' : 'justify-start'}`}>
                <span>{isRTL ? 'تسوق الآن' : 'Shop Now'}</span>
                <span>→</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      
      <div className="pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 dark:from-primary/20 dark:via-primary/10 dark:to-secondary/20 py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {isRTL ? 'تسوق حسب الفئة' : 'Shop by Category'}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {isRTL ? 'استكشف مجموعتنا الواسعة من الفئات واعثر على ما تبحث عنه بالضبط' : 'Explore our wide range of categories and find exactly what you\'re looking for'}
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Search and View Controls */}
          <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <div className="relative flex-1 max-w-md w-full">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4`} />
              <Input
                placeholder={isRTL ? 'ابحث في الفئات...' : 'Search categories...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={isRTL ? 'pr-10' : 'pl-10'}
              />
            </div>

            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <p className="text-muted-foreground">
                {filteredCategories.length} {isRTL ? 'فئات' : 'categories'}
              </p>
            </div>
          </div>

          {/* Categories Grid/List */}
          {loading ? (
            <div className="text-center py-16">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
              <p className="mt-4 text-muted-foreground">{isRTL ? 'جاري تحميل الفئات...' : 'Loading categories...'}</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{isRTL ? 'لم يتم العثور على فئات' : 'No categories found'}</h3>
              <p className="text-muted-foreground mb-6">
                {isRTL ? 'حاول تعديل معايير البحث الخاصة بك' : 'Try adjusting your search criteria'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.isArray(filteredCategories) && filteredCategories.map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
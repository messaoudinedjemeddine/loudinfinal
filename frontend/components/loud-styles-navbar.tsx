'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  ShoppingCart, 
  Menu, 
  Search, 
  Heart,
  X,
  Phone,
  Mail,
  Sun,
  Moon,
  Settings,
  ChevronDown
} from 'lucide-react'
import { useCartStore, useWishlistStore } from '@/lib/store'
import { useLocaleStore } from '@/lib/locale-store'
import { CartSheet } from '@/components/cart-sheet'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useTheme } from 'next-themes'

export function LoudStylesNavbar() {
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const { items, getTotalItems } = useCartStore()
  const { getWishlistCount } = useWishlistStore()
  const { t, isRTL } = useLocaleStore()
  const { theme, setTheme } = useTheme()

  const totalItems = getTotalItems()
  const wishlistCount = getWishlistCount()

  // Loud Styles specific navigation
  const navigation = [
    { name: isRTL ? 'الرئيسية' : 'Home', href: '/' },
    { name: isRTL ? 'المنتجات' : 'Products', href: '/loud-styles/products' },
    { name: isRTL ? 'الفئات' : 'Categories', href: '/loud-styles/categories' },
    { name: isRTL ? 'من نحن' : 'About', href: '/about' },
    { name: isRTL ? 'اتصلي بنا' : 'Contact', href: '/contact' },
  ]

  const logoText = 'LOUD'
  const logoSubtext = 'STYLES'

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!mounted) return null

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const searchUrl = `/loud-styles/products?search=${encodeURIComponent(searchQuery.trim())}`
      router.push(searchUrl)
      setSearchQuery('')
      setIsSearchOpen(false)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const clearCache = () => {
    console.log('🧹 Clearing frontend cache...');
    
    // Clear localStorage
    localStorage.clear();
    console.log('✅ localStorage cleared');
    
    // Clear sessionStorage
    sessionStorage.clear();
    console.log('✅ sessionStorage cleared');
    
    // Clear any cached data in memory
    if (window.caches) {
      caches.keys().then(function(names) {
        for (let name of names) {
          caches.delete(name);
        }
      });
      console.log('✅ Cache storage cleared');
    }
    
    // Reload the page to ensure fresh data
    window.location.reload();
  };

  return (
    <>
             <motion.nav
         initial={{ y: -100 }}
         animate={{ y: 0 }}
         transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
         className={`w-full z-50 transition-all duration-300 h-16 ${
           isScrolled 
             ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:bg-gray-900/95 dark:border-gray-700' 
             : 'bg-transparent'
         }`}
         dir={isRTL ? 'rtl' : 'ltr'}
       >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between h-16 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <Link href="/loud-styles" className="flex items-center group">
                <motion.div 
                  className="transition-transform duration-300 group-hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                                     <h1 className="text-xl md:text-2xl tracking-wider cursor-pointer font-semibold">
                     <span className="inline-block">
                       <span className={`transition-colors duration-300 group-hover:text-white font-bold ${isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>{logoText}</span>
                       <span className="relative inline-block ml-2">
                         <span className={`transition-colors duration-300 group-hover:text-primary font-light ${isScrolled ? 'text-gray-600 dark:text-gray-300' : 'text-white'}`}>{logoSubtext}</span>
                         <motion.span
                           className="absolute inset-0 bg-primary origin-left"
                           initial={{ scaleX: 0 }}
                           whileHover={{ scaleX: 1 }}
                           transition={{ duration: 0.3, ease: "easeInOut" }}
                           style={{ zIndex: -1 }}
                         />
                       </span>
                       <span className={`transition-colors duration-300 group-hover:text-white font-light text-xs ml-1 ${isScrolled ? 'text-gray-600 dark:text-gray-300' : 'text-white'}`}>®</span>
                     </span>
                   </h1>
                </motion.div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className={`hidden lg:flex items-center justify-center flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center space-x-6 ${isRTL ? 'space-x-reverse' : ''}`}>
                {navigation.map((item) => (
                                     <Link
                     key={item.name}
                     href={item.href}
                     className={`relative px-4 py-2 rounded-lg font-semibold text-base transition-all duration-300 group
                       ${pathname === item.href 
                         ? `${isScrolled ? 'text-primary bg-primary/10' : 'text-white bg-primary/30'}` 
                         : `${isScrolled ? 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/10' : 'text-white hover:text-primary hover:bg-primary/20'}`
                       }
                     `}
                   >
                    {item.name}
                    <div className="absolute inset-0 rounded-lg bg-primary/0 group-hover:bg-primary/20 transition-all duration-300" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              {/* Search */}
                             <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => setIsSearchOpen(true)}
                 className={`relative p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                   isScrolled 
                     ? 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/10' 
                     : 'text-white hover:text-primary hover:bg-primary/20'
                 }`}
               >
                <Search className="w-5 h-5" />
              </Button>

              {/* Theme Toggle */}
                             <Button
                 variant="ghost"
                 size="sm"
                 onClick={toggleTheme}
                 className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                   isScrolled 
                     ? 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/10' 
                     : 'text-white hover:text-primary hover:bg-primary/20'
                 }`}
               >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              {/* Cache Clear Button */}
                             <Button
                 variant="ghost"
                 size="sm"
                 onClick={clearCache}
                 className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                   isScrolled 
                     ? 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/10' 
                     : 'text-white hover:text-primary hover:bg-primary/20'
                 }`}
                 title="Clear cache and reload fresh data"
               >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </Button>

              {/* Language Switcher */}
              <LanguageSwitcher isTransparent={false} />

              {/* Wishlist */}
                             <Button 
                 variant="ghost" 
                 size="sm" 
                 className={`relative p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                   isScrolled 
                     ? 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/10' 
                     : 'text-white hover:text-primary hover:bg-primary/20'
                 }`}
                 onClick={() => router.push('/wishlist')}
               >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>

              {/* Cart */}
                             <Button 
                 variant="ghost" 
                 size="sm" 
                 className={`relative p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                   isScrolled 
                     ? 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/10' 
                     : 'text-white hover:text-primary hover:bg-primary/20'
                 }`}
                 onClick={() => setIsCartOpen(true)}
               >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary hover:bg-primary/80">
                    {totalItems}
                  </Badge>
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                                     <Button
                     variant="ghost"
                     size="sm"
                     className={`lg:hidden p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                       isScrolled 
                         ? 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/10' 
                         : 'text-white hover:text-primary hover:bg-primary/20'
                     }`}
                   >
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side={isRTL ? 'right' : 'left'} className="w-80" style={{ backgroundColor: '#b6b8b2' }}>
                  <div className="flex flex-col h-full">
                    {/* Mobile Menu Header */}
                    <div className="flex items-center justify-between mb-6">
                      <Link href="/loud-styles" className="flex items-center space-x-2">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-gray-800">{logoText}</span>
                          <span className="text-xs font-medium text-gray-600 -mt-1">{logoSubtext}</span>
                        </div>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-gray-700 hover:text-gray-900"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex-1">
                      <div className="space-y-2">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={`block px-4 py-3 rounded-lg transition-colors ${
                              pathname === item.href 
                                ? 'text-gray-900 bg-gray-200/50' 
                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/30'
                            }`}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </nav>

                    {/* Mobile Footer */}
                    <div className="border-t border-gray-300 pt-4">
                      <div className="flex items-center justify-between">
                        <LanguageSwitcher isTransparent={false} />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleTheme}
                          className="text-gray-700 hover:text-gray-900"
                        >
                          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Search Bar */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-300"
              >
                <form onSubmit={handleSearch} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder={isRTL ? 'البحث في المنتجات...' : 'Search products...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </div>
                    <Button type="submit" className="bg-gray-800 hover:bg-gray-900">
                      {isRTL ? 'بحث' : 'Search'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Cart Sheet */}
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  )
}

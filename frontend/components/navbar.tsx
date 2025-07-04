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
  User, 
  Heart,
  X,
  Phone,
  Mail,
  Sun,
  Moon,
  Settings,
  ChevronDown
} from 'lucide-react'
import { useCartStore, useAuthStore, useWishlistStore } from '@/lib/store'
import { useLocaleStore } from '@/lib/locale-store'
import { CartSheet } from '@/components/cart-sheet'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useTheme } from 'next-themes'

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  const router = useRouter()
  const pathname = usePathname()
  const { items, getTotalItems } = useCartStore()
  const { user, logout } = useAuthStore()
  const { getWishlistCount } = useWishlistStore()
  const { t, isRTL } = useLocaleStore()
  const { theme, setTheme } = useTheme()

  const totalItems = getTotalItems()
  const wishlistCount = getWishlistCount()

  const navigation = [
    { name: isRTL ? 'الرئيسية' : 'Home', href: '/' },
    { name: isRTL ? 'المنتجات' : 'Products', href: '/products' },
    { name: isRTL ? 'المجموعات' : 'Collections', href: '/categories' },
    { name: isRTL ? 'من نحن' : 'About', href: '/about' },
    { name: isRTL ? 'اتصلي بنا' : 'Contact', href: '/contact' },
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!mounted) return null

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`w-full z-50 transition-all duration-300 arabic-font ${
          isScrolled 
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-camel-200/20 dark:border-gray-700/20 shadow-lg' 
            : 'bg-gradient-to-r from-camel-50/90 to-warm-50/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className={`flex items-center justify-between h-20 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center group">
                <div className="relative w-20 h-20 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/logos/logo-dark.png"
                    alt="Algerian Elegance Logo"
                    width={80}
                    height={80}
                    className="w-full h-full object-contain dark:hidden"
                  />
                  <Image
                    src="/logos/logo-light.png"
                    alt="Algerian Elegance Logo"
                    width={80}
                    height={80}
                    className="w-full h-full object-contain hidden dark:block"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className={`hidden lg:flex items-center justify-center flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 group
                      ${pathname === item.href 
                        ? 'text-camel-800 dark:text-camel-200 bg-camel-100/50 dark:bg-camel-900/30' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-camel-700 dark:hover:text-camel-200 hover:bg-camel-50/50 dark:hover:bg-camel-900/20'
                      }
                    `}
                  >
                    {item.name}
                    <div className="absolute inset-0 rounded-lg bg-camel-100/0 group-hover:bg-camel-100/30 dark:group-hover:bg-camel-900/20 transition-all duration-300" />
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
                className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-camel-700 dark:hover:text-camel-200 hover:bg-camel-50/50 dark:hover:bg-camel-900/20 rounded-lg transition-all duration-300"
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-camel-700 dark:hover:text-camel-200 hover:bg-camel-50/50 dark:hover:bg-camel-900/20 rounded-lg transition-all duration-300"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              {/* Language Switcher */}
              <LanguageSwitcher isTransparent={false} />

              {/* Wishlist */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-camel-700 dark:hover:text-camel-200 hover:bg-camel-50/50 dark:hover:bg-camel-900/20 rounded-lg transition-all duration-300" 
                asChild
              >
                <Link href="/wishlist">
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <Badge className={`absolute -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold bg-gradient-to-r from-red-500 to-red-700 text-white border-2 border-white dark:border-gray-900 ${
                      isRTL ? '-left-1' : '-right-1'
                    }`}>
                      {wishlistCount}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-camel-700 dark:hover:text-camel-200 hover:bg-camel-50/50 dark:hover:bg-camel-900/20 rounded-lg transition-all duration-300"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <Badge className={`absolute -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold bg-gradient-to-r from-camel-500 to-camel-700 text-white border-2 border-white dark:border-gray-900 ${
                    isRTL ? '-left-1' : '-right-1'
                  }`}>
                    {totalItems}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              {user ? (
                <div className={`flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 text-gray-700 dark:text-gray-300 hover:text-camel-700 dark:hover:text-camel-200 hover:bg-camel-50/50 dark:hover:bg-camel-900/20 rounded-lg transition-all duration-300" 
                    asChild
                  >
                    <Link href="/admin">
                      <User className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="p-2 text-gray-700 dark:text-gray-300 hover:text-camel-700 dark:hover:text-camel-200 hover:bg-camel-50/50 dark:hover:bg-camel-900/20 rounded-lg transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  className="bg-gradient-to-r from-camel-500 to-camel-700 hover:from-camel-600 hover:to-camel-800 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                  asChild
                >
                  <Link href="/admin/login">
                    {isRTL ? 'تسجيل الدخول' : 'Login'}
                  </Link>
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-camel-700 dark:hover:text-camel-200 hover:bg-camel-50/50 dark:hover:bg-camel-900/20 rounded-lg transition-all duration-300"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side={isRTL ? 'right' : 'left'} className="w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-camel-200/20 dark:border-gray-700/20">
                  <div className="flex flex-col h-full">
                    {/* Mobile Navigation */}
                    <div className="flex-1 py-8">
                      <div className="space-y-2">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300
                              ${pathname === item.href 
                                ? 'text-camel-800 dark:text-camel-200 bg-camel-100/50 dark:bg-camel-900/30' 
                                : 'text-gray-700 dark:text-gray-300 hover:text-camel-700 dark:hover:text-camel-200 hover:bg-camel-50/50 dark:hover:bg-camel-900/20'
                              }
                            `}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Mobile Actions */}
                    <div className="border-t border-camel-200/20 dark:border-gray-700/20 pt-4">
                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-gray-700 dark:text-gray-300 hover:text-camel-700 dark:hover:text-camel-200 hover:bg-camel-50/50 dark:hover:bg-camel-900/20"
                          onClick={() => setIsSearchOpen(true)}
                        >
                          <Search className="w-4 h-4 mr-3" />
                          {isRTL ? 'البحث' : 'Search'}
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-gray-700 dark:text-gray-300 hover:text-camel-700 dark:hover:text-camel-200 hover:bg-camel-50/50 dark:hover:bg-camel-900/20"
                          onClick={() => setIsCartOpen(true)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-3" />
                          {isRTL ? 'السلة' : 'Cart'} ({totalItems})
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-gray-700 dark:text-gray-300 hover:text-camel-700 dark:hover:text-camel-200 hover:bg-camel-50/50 dark:hover:bg-camel-900/20"
                          asChild
                        >
                          <Link href="/wishlist">
                            <Heart className="w-4 h-4 mr-3" />
                            {isRTL ? 'المفضلة' : 'Wishlist'} ({wishlistCount})
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isRTL ? 'ابحثي عن المنتجات...' : 'Search products...'}
                  className="w-full px-4 py-3 pl-12 pr-4 bg-white dark:bg-gray-900 border border-camel-200 dark:border-gray-700 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-camel-500 focus:border-transparent"
                  autoFocus
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-camel-500 to-camel-700 hover:from-camel-600 hover:to-camel-800 text-white"
                >
                  {isRTL ? 'بحث' : 'Search'}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sheet */}
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  )
}
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
  Settings
} from 'lucide-react'
import { useCartStore, useAuthStore } from '@/lib/store'
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
  const totalItems = useCartStore((state) => state.getTotalItems())
  const { user, logout } = useAuthStore()
  const { t, isRTL } = useLocaleStore()
  const { theme, setTheme } = useTheme()

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
      const heroHeight = window.innerHeight
      setIsScrolled(scrollTop > heroHeight * 0.1) // Start transition when 10% down the hero
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
        className={`w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-sm border-b shadow-sm' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 navbar-container">
          <div className={`flex items-center justify-between h-16 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Left Section - Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <div className="relative w-24 h-24">
                  <Image
                    src="/logos/logo-light.png"
                    alt="Algerian Elegance Logo"
                    width={96}
                    height={96}
                    className="w-full h-full object-contain dark:hidden"
                  />
                  <Image
                    src="/logos/logo-dark.png"
                    alt="Algerian Elegance Logo"
                    width={96}
                    height={96}
                    className="w-full h-full object-contain hidden dark:block"
                  />
                </div>
              </Link>
            </div>

            {/* Center Section - Desktop Navigation */}
            <div className={`hidden lg:flex items-center justify-center navbar-center-nav ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center space-x-8 ${isRTL ? 'space-x-reverse' : ''}`}>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-medium transition-colors relative navbar-link-hover
                      ${pathname === item.href ? (item.href === '/' ? 'text-primary' : 'text-primary') : 'text-muted-foreground'}
                      ${!isScrolled ? 'drop-shadow-lg' : ''}
                    `}
                  >
                    {item.name}
                    {pathname === item.href && item.href !== '/' && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${isScrolled ? 'bg-primary' : 'bg-white'}`}
                      />
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Section - Compact Icons */}
            <div className={`flex items-center navbar-compact-icons ${isRTL ? 'space-x-reverse' : ''}`}>
              {/* Search Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className={`ghost-button btn-hover-effect p-2 ${!isScrolled ? 'text-white hover:bg-white/20' : ''}`}
              >
                <Search className="w-4 h-4" />
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className={`ghost-button btn-hover-effect p-2 ${!isScrolled ? 'text-white hover:bg-white/20' : ''}`}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              {/* Language Switcher */}
              <LanguageSwitcher isTransparent={!isScrolled} />

              {/* Wishlist */}
              <Button variant="ghost" size="sm" className={`ghost-button btn-hover-effect p-2 ${!isScrolled ? 'text-white hover:bg-white/20' : ''}`} asChild>
                <Link href="/wishlist">
                  <Heart className="w-4 h-4" />
                </Link>
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className={`relative ghost-button btn-hover-effect p-2 ${!isScrolled ? 'text-white hover:bg-white/20' : ''}`}
              >
                <ShoppingCart className="w-4 h-4" />
                {totalItems > 0 && (
                  <Badge className={`absolute -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-camel-400 to-camel-600 ${
                    isRTL ? '-left-2' : '-right-2'
                  }`}>
                    {totalItems}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              {user ? (
                <div className={`flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <Button variant="ghost" size="sm" className={`ghost-button btn-hover-effect p-2 ${!isScrolled ? 'text-white hover:bg-white/20' : ''}`} asChild>
                    <Link href="/admin">
                      <User className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className={`hidden sm:flex ghost-button btn-hover-effect text-xs px-2 py-1 ${!isScrolled ? 'text-white hover:bg-white/20' : ''}`}
                  >
                    {isRTL ? 'تسجيل الخروج' : 'Logout'}
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="sm" className={`ghost-button btn-hover-effect p-2 ${!isScrolled ? 'text-white hover:bg-white/20' : ''}`} asChild>
                  <Link href="/admin/login">
                    <User className="w-4 h-4" />
                  </Link>
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(true)}
                className={`ghost-button btn-hover-effect p-2 ${!isScrolled ? 'text-white hover:bg-white/20' : ''}`}
              >
                <Menu className="w-4 h-4" />
                <span className="ml-1 hidden sm:inline text-xs">{isRTL ? 'القائمة' : 'Menu'}</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side={isRTL ? "left" : "right"} className="w-[300px] sm:w-[400px]">
          <div className="flex flex-col h-full">
            <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12">
                  <Image
                    src="/logos/logo-light.png"
                    alt="Algerian Elegance Logo"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain dark:hidden"
                  />
                  <Image
                    src="/logos/logo-dark.png"
                    alt="Algerian Elegance Logo"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain hidden dark:block"
                  />
                </div>
                <h2 className="text-lg font-semibold">{isRTL ? 'القائمة' : 'Menu'}</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(false)}
                className="ghost-button"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Search on Mobile */}
            <div className="mb-6">
              <form onSubmit={handleSearch} className={`flex space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <input
                  type="text"
                  placeholder={isRTL ? 'البحث عن المنتجات...' : 'Search products...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`flex-1 px-3 py-2 border rounded-md ${isRTL ? 'text-right' : 'text-left'}`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                <Button type="submit" size="sm" className="elegant-gradient btn-hover-effect">
                  <Search className="w-4 h-4" />
                </Button>
              </form>
            </div>

            {/* Main Navigation Links */}
            <div className="flex flex-col space-y-4 mb-6">
              <h3 className={`text-sm font-semibold text-muted-foreground uppercase tracking-wide ${isRTL ? 'text-right' : 'text-left'}`}>
                {isRTL ? 'التنقل الرئيسي' : 'Main Navigation'}
              </h3>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-lg font-medium transition-colors hover:text-primary flex items-center space-x-3 ${
                    pathname === item.href
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  } ${isRTL ? 'text-right space-x-reverse' : 'text-left'}`}
                >
                  <span>{item.name}</span>
                  {pathname === item.href && (
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>
            
            {/* Customer Services */}
            <div className="flex flex-col space-y-4 mb-6">
              <h3 className={`text-sm font-semibold text-muted-foreground uppercase tracking-wide ${isRTL ? 'text-right' : 'text-left'}`}>
                {isRTL ? 'خدمة العملاء' : 'Customer Services'}
              </h3>
              <Link
                href="/wishlist"
                onClick={() => setIsMenuOpen(false)}
                className={`text-lg font-medium text-muted-foreground hover:text-primary ${isRTL ? 'text-right' : 'text-left'}`}
              >
                {isRTL ? 'المفضلة' : 'Wishlist'}
              </Link>
              <Link
                href="/track-order"
                onClick={() => setIsMenuOpen(false)}
                className={`text-lg font-medium text-muted-foreground hover:text-primary ${isRTL ? 'text-right' : 'text-left'}`}
              >
                {isRTL ? 'تتبع الطلب' : 'Track Order'}
              </Link>
              <Link
                href="/faq"
                onClick={() => setIsMenuOpen(false)}
                className={`text-lg font-medium text-muted-foreground hover:text-primary ${isRTL ? 'text-right' : 'text-left'}`}
              >
                {isRTL ? 'الأسئلة الشائعة' : 'FAQ'}
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className={`text-lg font-medium text-muted-foreground hover:text-primary ${isRTL ? 'text-right' : 'text-left'}`}
              >
                {isRTL ? 'اتصل بنا' : 'Contact Us'}
              </Link>
            </div>

            {/* User Actions */}
            <div className="mt-auto space-y-4">
              <h3 className={`text-sm font-semibold text-muted-foreground uppercase tracking-wide ${isRTL ? 'text-right' : 'text-left'}`}>
                {isRTL ? 'الحساب' : 'Account'}
              </h3>
              {user ? (
                <>
                  <Button variant="outline" className="w-full outline-button btn-hover-effect" asChild>
                    <Link href="/admin">{isRTL ? 'لوحة الإدارة' : 'Admin Dashboard'}</Link>
                  </Button>
                  <Button variant="outline" className="w-full outline-button btn-hover-effect" onClick={logout}>
                    {isRTL ? 'تسجيل الخروج' : 'Logout'}
                  </Button>
                </>
              ) : (
                <>
                  <Button className="w-full elegant-gradient btn-hover-effect" asChild>
                    <Link href="/admin/login">{isRTL ? 'تسجيل الدخول' : 'Login'}</Link>
                  </Button>
                  <Button variant="outline" className="w-full outline-button btn-hover-effect" asChild>
                    <Link href="/register">{isRTL ? 'إنشاء حساب' : 'Register'}</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-lg p-6 w-full max-w-2xl mx-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className={`flex space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                <input
                  type="text"
                  placeholder={isRTL ? 'البحث عن الأزياء التقليدية...' : 'Search for traditional fashion...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`flex-1 px-4 py-3 border rounded-md text-lg ${isRTL ? 'text-right' : 'text-left'}`}
                  autoFocus
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                <Button type="submit" size="lg" className="elegant-gradient btn-hover-effect">
                  <Search className="w-5 h-5" />
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
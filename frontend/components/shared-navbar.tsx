'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useLocaleStore } from '@/lib/locale-store'
import { LanguageSwitcher } from './language-switcher'

interface SharedNavbarProps {
  brandName: string
  brandSlug: string
  navigationLinks: Array<{
    href: string
    label: string
    labelAr: string
  }>
}

export default function SharedNavbar({ brandName, brandSlug, navigationLinks }: SharedNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isRTL } = useLocaleStore()

  return (
    <motion.nav
      className="absolute top-0 left-0 right-0 z-50 !bg-transparent"
      style={{ backgroundColor: 'transparent !important' }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between h-16 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={`/${brandSlug}`} className="flex items-center group">
              <div className="transition-transform duration-300 group-hover:scale-105">
                <h1 className="text-xl md:text-2xl font-bold tracking-wider cursor-pointer">
                  <span className="inline-block">
                    <span className="text-primary transition-colors duration-300 group-hover:text-white">LOUD</span>
                    <span className="relative inline-block ml-2">
                      <span className="text-white transition-colors duration-300 group-hover:text-primary">{brandName}</span>
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
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white font-bold text-lg px-4 py-2 rounded-lg transition-all duration-300 hover:text-primary hover:bg-primary/20"
              >
                {isRTL ? link.labelAr : link.label}
              </Link>
            ))}
          </div>

          {/* Language Switcher */}
          <div className="hidden md:flex items-center space-x-2">
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 text-white hover:text-primary hover:bg-primary/20"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side={isRTL ? 'right' : 'left'} className="!bg-transparent">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-white font-bold text-lg px-4 py-2 rounded-lg transition-all duration-300 hover:text-primary hover:bg-primary/20"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {isRTL ? link.labelAr : link.label}
                    </Link>
                  ))}
                  <div className="pt-4">
                    <LanguageSwitcher />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

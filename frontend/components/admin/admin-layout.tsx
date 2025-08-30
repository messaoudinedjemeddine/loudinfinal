'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  Tag,
  BarChart3,
  Home,
  Truck,
  Phone,
  FileText,
  MapPin,
  Sun,
  Moon,
  User
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { useTheme } from 'next-themes'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useLocaleStore } from '@/lib/locale-store'

// Role-based navigation configuration
const getNavigationByRole = (role: string, t: any) => {
  switch (role) {
    case 'ADMIN':
      return [
        { name: t?.admin?.dashboard || 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: t?.admin?.products || 'Products', href: '/admin/products', icon: Package },
        { name: t?.admin?.inventory || 'Inventory', href: '/admin/inventory', icon: Package },
        { name: t?.admin?.orders || 'Orders', href: '/admin/orders', icon: ShoppingCart },
        { name: t?.admin?.categories || 'Categories', href: '/admin/categories', icon: Tag },
        { name: t?.admin?.users || 'Users', href: '/admin/users', icon: Users },
        { name: t?.admin?.shipping || 'Shipping', href: '/admin/shipping', icon: Truck },
        { name: t?.admin?.analytics || 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        { name: 'Profit Analytics', href: '/admin/analytics/profit', icon: BarChart3 },
        { name: t?.admin?.settings || 'Settings', href: '/admin/settings', icon: Settings },
      ]
    case 'CONFIRMATRICE':
      return [
        { name: 'Dashboard Confirmatrice', href: '/confirmatrice/dashboard', icon: LayoutDashboard },
      ]
    case 'AGENT_LIVRAISON':
      return [
        { name: 'Dashboard Livraison', href: '/agent-livraison/dashboard', icon: LayoutDashboard },
      ]
    default:
      return [
        { name: t?.admin?.dashboard || 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: t?.admin?.orders || 'Orders', href: '/admin/orders', icon: ShoppingCart },
        { name: t?.admin?.settings || 'Settings', href: '/admin/settings', icon: Settings },
      ]
  }
}

// Role display names
const getRoleDisplayName = (role: string, t: any) => {
  switch (role) {
    case 'ADMIN':
      return 'Administrateur'
    case 'CONFIRMATRICE':
      return 'Confirmatrice (Centre d\'Appel)'
    case 'AGENT_LIVRAISON':
      return 'Agent de Livraison'
    default:
      return 'Utilisateur'
  }
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const { t, isRTL, direction } = useLocaleStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Check authentication after mount
    if (mounted && !isAuthenticated()) {
      router.push('/admin/login')
      return
    }

    // Redirect to appropriate dashboard if on main admin page
    if (mounted && user && pathname === '/admin') {
      const role = user.role.toLowerCase()
      router.push(`/admin/dashboard/${role}`)
    }
  }, [mounted, isAuthenticated, user, pathname, router])

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  if (!mounted) return null

  // Show loading while checking authentication
  if (!isAuthenticated()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{t?.common?.loading || 'Loading...'}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{t?.common?.loading || 'Loading...'}</p>
        </div>
      </div>
    )
  }

  const navigation = getNavigationByRole(user.role, t)
  const roleDisplayName = getRoleDisplayName(user.role, t)

  const Sidebar = ({ className = '' }: { className?: string }) => (
    <div className={`flex flex-col h-full ${className}`} dir={direction}>
      {/* Logo */}
      <div className={`flex items-center px-6 py-4 border-b ${isRTL ? 'border-l' : 'border-r'}`}>
        <Link href={`/admin/dashboard/${user.role.toLowerCase()}`} className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src={theme === 'dark' ? '/logos/logo-light.png' : '/logos/logo-dark.png'}
              alt="Loudim Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xl font-bold block truncate">{t?.admin?.sidebarTitle || 'Admin Dashboard'}</span>
            <p className="text-xs text-muted-foreground truncate">{roleDisplayName}</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'} flex-shrink-0`} />
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Profile & Actions */}
      <div className={`p-4 border-t ${isRTL ? 'border-l' : 'border-r'}`}>
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-4`}>
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src={user.avatar} alt={user.firstName} />
            <AvatarFallback>
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="flex-1"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
          
          <LanguageSwitcher />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex-1"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background" dir={direction}>
      <div className="flex">
        {/* Sidebar */}
        <div className={`hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 ${isRTL ? 'lg:right-0' : 'lg:left-0'}`}>
          <Sidebar className="bg-card" />
        </div>

        {/* Mobile sidebar */}
        <div className="lg:hidden">
          {/* Mobile sidebar implementation would go here */}
        </div>

        {/* Main content */}
        <div className={`lg:flex-1 ${isRTL ? 'lg:pr-64' : 'lg:pl-64'}`}>
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
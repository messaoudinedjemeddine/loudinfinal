'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Menu,
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

// Role-based navigation configuration
const getNavigationByRole = (role: string) => {
  switch (role) {
    case 'ADMIN':
    case 'SUPERADMIN':
      return [
        { name: 'Dashboard', href: '/admin/dashboard/admin', icon: LayoutDashboard },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Inventory', href: '/admin/inventory', icon: Package },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
        { name: 'Shipping', href: '/admin/shipping', icon: Truck },
        { name: 'Categories', href: '/admin/categories', icon: Tag },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
      ]
    case 'CALL_CENTER':
      return [
        { name: 'Dashboard', href: '/admin/dashboard/call_center', icon: LayoutDashboard },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
        { name: 'Customer Calls', href: '/admin/calls', icon: Phone },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
      ]
    case 'ORDER_CONFIRMATION':
      return [
        { name: 'Dashboard', href: '/admin/dashboard/order_confirmation', icon: LayoutDashboard },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
        { name: 'Order Processing', href: '/admin/processing', icon: FileText },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
      ]
    case 'DELIVERY_COORDINATOR':
      return [
        { name: 'Dashboard', href: '/admin/dashboard/delivery_coordinator', icon: LayoutDashboard },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
        { name: 'Delivery Areas', href: '/admin/shipping', icon: MapPin },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
      ]
    default:
      return [
        { name: 'Dashboard', href: '/admin/dashboard/admin', icon: LayoutDashboard },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
      ]
  }
}

// Role display names
const getRoleDisplayName = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return 'Administrator'
    case 'SUPERADMIN':
      return 'Super Administrator'
    case 'CALL_CENTER':
      return 'Call Center Agent'
    case 'ORDER_CONFIRMATION':
      return 'Order Processor'
    case 'DELIVERY_COORDINATOR':
      return 'Delivery Agent'
    default:
      return 'User'
  }
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuthStore()
  const { theme, setTheme } = useTheme()

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
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    )
  }

  const navigation = getNavigationByRole(user.role)
  const roleDisplayName = getRoleDisplayName(user.role)

  const Sidebar = ({ className = '' }: { className?: string }) => (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b">
        <Link href={`/admin/dashboard/${user.role.toLowerCase()}`} className="flex items-center space-x-3">
          <div className="relative w-10 h-10">
            <Image
              src={theme === 'dark' ? '/logos/logo-light.png' : '/logos/logo-dark.png'}
              alt="Loudim Logo"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <span className="text-xl font-bold">Loudim Dashboard</span>
            <p className="text-xs text-muted-foreground">{roleDisplayName}</p>
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
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {roleDisplayName}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start" asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              View Store
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start" 
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-muted/30 border-r">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Menu Button - Only visible on mobile */}
        <div className="lg:hidden p-4 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
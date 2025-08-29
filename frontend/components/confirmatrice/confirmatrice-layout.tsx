'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  FileText, 
  BarChart3,
  LogOut,
  Phone,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { useTheme } from 'next-themes'
import { LanguageSwitcher } from '@/components/language-switcher'

const navigation = [
  { name: 'Dashboard Confirmatrice', href: '/confirmatrice/dashboard', icon: LayoutDashboard },
  { name: 'Commandes en Attente', href: '/confirmatrice/orders/pending', icon: ShoppingCart },
  { name: 'Confirmer Commandes', href: '/confirmatrice/orders/confirm', icon: FileText },
  { name: 'Historique', href: '/confirmatrice/orders/history', icon: BarChart3 },
]

interface ConfirmatriceLayoutProps {
  children: React.ReactNode
}

export function ConfirmatriceLayout({ children }: ConfirmatriceLayoutProps) {
  const [mounted, setMounted] = useState(false)
  const { user, logout } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (user && user.role !== 'CONFIRMATRICE' && user.role !== 'ADMIN') {
      router.push('/admin/login')
    }
  }, [user, router])

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  if (!mounted) return null

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-lg border-r">
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <div className="flex items-center">
            <Phone className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-semibold text-foreground">Confirmatrice</span>
          </div>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary border-r-2 border-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-card">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                Confirmatrice
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

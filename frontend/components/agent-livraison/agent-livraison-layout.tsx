'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  MapPin,
  LogOut,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { useTheme } from 'next-themes'
import { LanguageSwitcher } from '@/components/language-switcher'

const navigation = [
  { name: 'Dashboard Livraison', href: '/agent-livraison/dashboard', icon: LayoutDashboard },
  { name: 'Commandes Prêtes', href: '/agent-livraison/orders/ready', icon: Package },
  { name: 'En Transit', href: '/agent-livraison/orders/in-transit', icon: Truck },
  { name: 'Statistiques par Ville', href: '/agent-livraison/stats/city', icon: MapPin },
]

interface AgentLivraisonLayoutProps {
  children: React.ReactNode
}

export function AgentLivraisonLayout({ children }: AgentLivraisonLayoutProps) {
  const [mounted, setMounted] = useState(false)
  const { user, logout } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (user && user.role !== 'AGENT_LIVRAISON' && user.role !== 'ADMIN') {
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
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <div className="flex items-center">
            <Truck className="h-8 w-8 text-green-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">Agent Livraison</span>
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
                      ? 'bg-green-100 text-green-700 border-r-2 border-green-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className="bg-green-100 text-green-600">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                Agent de Livraison
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-400 hover:text-gray-600"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-gray-900">
                Gestion des Livraisons
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

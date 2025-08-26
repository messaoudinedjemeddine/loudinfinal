'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Shield,
  ArrowRight,
  AlertCircle,
  Users,
  ChevronDown,
  ChevronUp,
  Copy,
  Check
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { useLocaleStore } from '@/lib/locale-store'

export default function AdminLoginPage() {
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [showCredentials, setShowCredentials] = useState(false)
  const [copiedUser, setCopiedUser] = useState<string | null>(null)

  const router = useRouter()
  const { setAuth, isAuthenticated } = useAuthStore()
  const { t } = useLocaleStore()

  // User credentials for all roles
  const userCredentials = [
    {
      role: t?.admin?.roleNames?.SUPERADMIN || 'Super Admin',
      email: 'superadmin@example.com',
      password: 'super123',
      description: 'Full system access and user management'
    },
    {
      role: t?.admin?.roleNames?.ADMIN || 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      description: 'Complete store management and analytics'
    },
    {
      role: t?.admin?.roleNames?.CALL_CENTER || 'Call Center',
      email: 'callcenter@example.com',
      password: 'call123',
      description: 'Customer order management and communications'
    },
    {
      role: t?.admin?.roleNames?.ORDER_CONFIRMATION || 'Order Confirmation',
      email: 'orderconfirmation@example.com',
      password: 'order123',
      description: 'Order processing and delivery preparation'
    },
    {
      role: t?.admin?.roleNames?.DELIVERY_COORDINATOR || 'Delivery Coordinator',
      email: 'delivery@example.com',
      password: 'delivery123',
      description: 'Delivery tracking and customer interactions'
    }
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Check if already authenticated after mount
    if (mounted && isAuthenticated()) {
      router.push('/admin')
    }
  }, [mounted, isAuthenticated, router])

  if (!mounted) return null

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Use the API client to call the backend
      const data = await api.auth.login(email, password) as {
        user: {
          id: string;
          email: string;
          firstName: string;
          lastName: string;
          role: string;
        };
        token: string;
      }
      
      // Check if user has admin role
      const adminRoles = ['SUPERADMIN', 'ADMIN', 'CALL_CENTER', 'ORDER_CONFIRMATION', 'DELIVERY_COORDINATOR']
      if (!adminRoles.includes(data.user.role)) {
        toast.error('Access denied. Admin privileges required.')
        setErrors({ 
          email: 'Admin access required',
          password: 'Admin access required'
        })
        return
      }
      
      setAuth(data.user, data.token)
      toast.success('Welcome back! Login successful.')
      router.push('/admin')
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || 'Login failed. Please try again.')
      setErrors({ 
        email: 'Invalid credentials',
        password: 'Invalid credentials'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fillCredentials = (userEmail: string, userPassword: string) => {
    setEmail(userEmail)
    setPassword(userPassword)
    setErrors({}) // Clear any existing errors
    toast.success('Credentials filled! Click Sign In to continue.')
  }

  const copyCredentials = async (userEmail: string, userPassword: string) => {
    try {
      await navigator.clipboard.writeText(`Email: ${userEmail}\nPassword: ${userPassword}`)
      setCopiedUser(userEmail)
      toast.success('Credentials copied to clipboard!')
      setTimeout(() => setCopiedUser(null), 2000)
    } catch (err) {
      toast.error('Failed to copy credentials')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-warm-50 to-camel-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C4A47C' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} 
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-6"
            >
              <img
                src="/logos/logo-dark.png"
                alt="Loudim Logo"
                className="w-full h-full object-contain"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <CardTitle className="text-2xl font-bold mb-2">Admin Login</CardTitle>
              <p className="text-muted-foreground">
                Access your admin dashboard
              </p>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6">
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">{t?.checkout?.email || 'Email'}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm">
                  Remember me
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </motion.form>

            {/* Test Credentials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="border-t pt-6"
            >
              <Button
                type="button"
                variant="outline"
                className="w-full mb-4"
                onClick={() => setShowCredentials(!showCredentials)}
              >
                <Users className="w-4 h-4 mr-2" />
                Test Credentials
                {showCredentials ? (
                  <ChevronUp className="w-4 h-4 ml-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-2" />
                )}
              </Button>

              {showCredentials && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  {userCredentials.map((user, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg bg-muted/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {user.role}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => fillCredentials(user.email, user.password)}
                            className="h-6 px-2 text-xs"
                          >
                            Fill
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyCredentials(user.email, user.password)}
                            className="h-6 px-2 text-xs"
                          >
                            {copiedUser === user.email ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs space-y-1">
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Password:</strong> {user.password}</p>
                        <p className="text-muted-foreground">{user.description}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
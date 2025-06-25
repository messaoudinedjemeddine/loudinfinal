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

// User credentials for all roles
const userCredentials = [
  {
    role: 'Super Admin',
    email: 'superadmin@example.com',
    password: 'super123',
    description: 'Full system access and user management'
  },
  {
    role: 'Admin',
    email: 'admin@example.com',
    password: 'admin123',
    description: 'Complete store management and analytics'
  },
  {
    role: 'Call Center',
    email: 'callcenter@example.com',
    password: 'call123',
    description: 'Customer order management and communications'
  },
  {
    role: 'Order Confirmation',
    email: 'orderconfirmation@example.com',
    password: 'order123',
    description: 'Order processing and delivery preparation'
  },
  {
    role: 'Delivery Agent',
    email: 'delivery@example.com',
    password: 'delivery123',
    description: 'Delivery tracking and customer interactions'
  }
]

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
              className="flex justify-center mb-6"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-camel-400 to-camel-600 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <CardTitle className="text-2xl font-bold text-foreground mb-2">
              Loudim Dashboard
            </CardTitle>
            <p className="text-muted-foreground">
              Sign in to manage your store
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors(prev => ({ ...prev, email: undefined }))
                    }}
                    className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                    placeholder="admin@algerian-elegance.com"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center space-x-1 text-destructive text-sm">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors(prev => ({ ...prev, password: undefined }))
                    }}
                    className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center space-x-1 text-destructive text-sm">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Remember me for 30 days
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full elegant-gradient hover:shadow-lg transition-all duration-300 font-medium"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* User Credentials Section */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowCredentials(!showCredentials)}
                className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-dashed border-muted-foreground/30 hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Test User Credentials
                  </span>
                </div>
                {showCredentials ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {showCredentials && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 space-y-2"
                >
                  {userCredentials.map((user, index) => (
                    <motion.div
                      key={user.email}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 bg-white rounded-lg border border-muted-foreground/20 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {user.role}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{user.description}</p>
                          <div className="text-xs space-y-1">
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Password:</strong> {user.password}</p>
                          </div>
                        </div>
                        <div className="flex space-x-1 ml-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => fillCredentials(user.email, user.password)}
                            className="h-7 px-2 text-xs"
                          >
                            Fill
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyCredentials(user.email, user.password)}
                            className="h-7 px-2 text-xs"
                          >
                            {copiedUser === user.email ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Footer Links */}
            <div className="text-center space-y-2">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => toast.info('Password reset functionality would be implemented here')}
              >
                Forgot your password?
              </button>
              <div className="text-xs text-muted-foreground">
                Need help? Contact{' '}
                <a href="mailto:support@algerian-elegance.com" className="text-primary hover:underline">
                  support@algerian-elegance.com
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Store Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
            <a href="/">
              ← Back to Algerian Elegance Store
            </a>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
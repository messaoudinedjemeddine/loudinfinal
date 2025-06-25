'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Shield,
  User,
  Loader2,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/admin-layout'
import { api } from '@/lib/api'
import { toast } from 'sonner'

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

const roleColors = {
  USER: 'bg-blue-100 text-blue-800',
  ADMIN: 'bg-green-100 text-green-800',
  CALL_CENTER: 'bg-purple-100 text-purple-800',
  ORDER_CONFIRMATION: 'bg-orange-100 text-orange-800',
  DELIVERY_COORDINATOR: 'bg-yellow-100 text-yellow-800',
  SUPERADMIN: 'bg-red-100 text-red-800'
}

const roleIcons = {
  USER: User,
  ADMIN: Shield,
  CALL_CENTER: Phone,
  ORDER_CONFIRMATION: Users,
  DELIVERY_COORDINATOR: Users,
  SUPERADMIN: Shield
}

export default function AdminUsersPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchUsers()
    }
  }, [mounted, pagination.page, searchQuery, roleFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined
      }

      const data = await api.admin.getUsers(params) as {
        users: User[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      }
      
      setUsers(data.users)
      setFilteredUsers(data.users)
      setPagination(prev => ({
        ...prev,
        total: data.pagination.total,
        pages: data.pagination.pages
      }))

    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err instanceof Error ? err.message : 'Failed to load users')
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  if (loading && users.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error && users.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchUsers}>Retry</Button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId))
    toast.success('User deleted successfully')
  }

  const handleUpdateRole = (userId: string, newRole: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ))
    toast.success('User role updated')
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-muted-foreground">
              Manage user accounts and permissions
            </p>
          </div>
          <Button className="elegant-gradient" asChild>
            <Link href="/admin/users/new">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">
                  Total registered users
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <User className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.filter(u => u.role === 'USER').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Regular customers
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Staff</CardTitle>
                <Shield className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.filter(u => u.role !== 'USER').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Admin & staff accounts
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="USER">Customer</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="CALL_CENTER">Call Center</SelectItem>
                  <SelectItem value="ORDER_CONFIRMATION">Order Confirmation</SelectItem>
                  <SelectItem value="DELIVERY_COORDINATOR">Delivery Coordinator</SelectItem>
                  <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user, index) => {
                const RoleIcon = roleIcons[user.role as keyof typeof roleIcons]

                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-camel-400 to-camel-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium">
                            {user.firstName} {user.lastName}
                          </h3>
                          <Badge className={roleColors[user.role as keyof typeof roleColors]}>
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {user.role}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Mail className="w-3 h-3" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="w-3 h-3" />
                            <span>{user.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        {user.role === 'USER' && (
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <span className="text-muted-foreground">
                              Orders: <span className="font-medium">{user.orderCount}</span>
                            </span>
                            <span className="text-muted-foreground">
                              Spent: <span className="font-medium">{(user.totalSpent || 0).toLocaleString()} DA</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleUpdateRole(user.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">Customer</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="CALL_CENTER">Call Center</SelectItem>
                          <SelectItem value="ORDER_CONFIRMATION">Order Confirmation</SelectItem>
                          <SelectItem value="DELIVERY_COORDINATOR">Delivery Coordinator</SelectItem>
                          <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/users/${user.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/users/${user.id}/edit`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                )
              })}

              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No users found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or add a new user
                  </p>
                  <Button asChild>
                    <Link href="/admin/users/new">Add User</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
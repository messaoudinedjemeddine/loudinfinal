const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      const parsedData = JSON.parse(authData);
      return parsedData?.state?.token || parsedData?.token || null;
    }
  } catch (error) {
    console.warn('Failed to parse auth token:', error);
  }
  return null;
};

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = getAuthToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Products
  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    inStock?: boolean;
    onSale?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const query = searchParams.toString();
    return this.request(`/products${query ? `?${query}` : ''}`);
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`);
  }

  async getFeaturedProducts() {
    return this.request('/products/featured/list');
  }

  // Categories
  async getCategories() {
    return this.request('/categories');
  }

  async getCategory(slug: string) {
    return this.request(`/categories/${slug}`);
  }

  // Orders
  async createOrder(orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    deliveryType: 'HOME_DELIVERY' | 'PICKUP';
    deliveryAddress?: string;
    cityId: string;
    deliveryDeskId?: string;
    notes?: string;
    items: Array<{
      productId: string;
      quantity: number;
      sizeId?: string;
    }>;
  }) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`);
  }

  // Auth
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Admin endpoints
  async getDashboardStats() {
    return this.request('/admin/dashboard/stats');
  }

  async getRecentOrders() {
    return this.request('/admin/dashboard/recent-orders');
  }

  async getLowStockProducts() {
    return this.request('/admin/dashboard/low-stock');
  }

  async getAdminOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const query = searchParams.toString();
    return this.request(`/admin/orders${query ? `?${query}` : ''}`);
  }

  async updateOrderStatus(
    orderId: string,
    status: {
      callCenterStatus?: string;
      deliveryStatus?: string;
    }
  ) {
    return this.request(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(status),
    });
  }

  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }) {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const query = searchParams.toString();
    return this.request(`/admin/users${query ? `?${query}` : ''}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Utility functions for common API calls
export const api = {
  // Products
  products: {
    getAll: (params?: Parameters<typeof apiClient.getProducts>[0]) => 
      apiClient.getProducts(params),
    getById: (id: string) => apiClient.getProduct(id),
    getFeatured: () => apiClient.getFeaturedProducts(),
  },

  // Categories
  categories: {
    getAll: () => apiClient.getCategories(),
    getBySlug: (slug: string) => apiClient.getCategory(slug),
  },

  // Orders
  orders: {
    create: (data: Parameters<typeof apiClient.createOrder>[0]) => 
      apiClient.createOrder(data),
    getById: (id: string) => apiClient.getOrder(id),
  },

  // Auth
  auth: {
    login: (email: string, password: string) => apiClient.login(email, password),
    register: (data: Parameters<typeof apiClient.register>[0]) => 
      apiClient.register(data),
    getCurrentUser: () => apiClient.getCurrentUser(),
  },

  // Admin
  admin: {
    getDashboardStats: () => apiClient.getDashboardStats(),
    getRecentOrders: () => apiClient.getRecentOrders(),
    getLowStockProducts: () => apiClient.getLowStockProducts(),
    getOrders: (params?: Parameters<typeof apiClient.getAdminOrders>[0]) => 
      apiClient.getAdminOrders(params),
    updateOrderStatus: (
      orderId: string, 
      status: Parameters<typeof apiClient.updateOrderStatus>[1]
    ) => apiClient.updateOrderStatus(orderId, status),
    getUsers: (params?: Parameters<typeof apiClient.getUsers>[0]) => 
      apiClient.getUsers(params),
    createUser: (data: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      password: string;
      role?: string;
    }) => apiClient.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    updateUser: (id: string, data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      role?: string;
      password?: string;
    }) => apiClient.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    deleteUser: (id: string) => apiClient.request(`/admin/users/${id}`, {
      method: 'DELETE',
    }),
    // Products management
    getProducts: (params?: Parameters<typeof apiClient.getProducts>[0]) => 
      apiClient.getProducts(params),
    getProduct: (id: string) => apiClient.getProduct(id),
    createProduct: (data: any) => apiClient.request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    updateProduct: (id: string, data: any) => apiClient.request(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    deleteProduct: (id: string) => apiClient.request(`/admin/products/${id}`, {
      method: 'DELETE',
    }),
    // Inventory management
    getInventory: (params?: {
      page?: number;
      limit?: number;
      search?: string;
      category?: string;
      stockFilter?: string;
      status?: string;
    }) => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }
      const query = searchParams.toString();
      return apiClient.request(`/admin/inventory${query ? `?${query}` : ''}`);
    },
    exportInventory: async () => {
      const response = await fetch(`${API_BASE_URL}/admin/inventory/export`, {
        headers: {
          'Content-Type': 'text/csv',
          ...(typeof window !== 'undefined' ? {
            Authorization: `Bearer ${getAuthToken()}`
          } : {})
        }
      });
      
      if (!response.ok) {
        throw new Error(`Export failed: ${response.status}`);
      }
      
      return await response.text();
    },
    importInventory: (data: any) => apiClient.request('/admin/inventory/import', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    // Orders export
    exportOrders: async () => {
      const response = await fetch(`${API_BASE_URL}/admin/orders/export`, {
        headers: {
          'Content-Type': 'text/csv',
          ...(typeof window !== 'undefined' ? {
            Authorization: `Bearer ${getAuthToken()}`
          } : {})
        }
      });
      
      if (!response.ok) {
        throw new Error(`Export failed: ${response.status}`);
      }
      
      return await response.text();
    },
    // Categories management
    getCategories: () => apiClient.request('/admin/categories'),
    createCategory: (data: any) => apiClient.request('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    updateCategory: (id: string, data: any) => apiClient.request(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    deleteCategory: (id: string) => apiClient.request(`/admin/categories/${id}`, {
      method: 'DELETE',
    }),
  },

  // Shipping (Yalidine)
  shipping: {
    getStatus: () => apiClient.request('/shipping/status'),
    getWilayas: () => apiClient.request('/shipping/wilayas'),
    getCommunes: (wilayaId?: number) => {
      const params = wilayaId ? `?wilayaId=${wilayaId}` : '';
      return apiClient.request(`/shipping/communes${params}`);
    },
    getCenters: (wilayaId?: number) => {
      const params = wilayaId ? `?wilayaId=${wilayaId}` : '';
      return apiClient.request(`/shipping/centers${params}`);
    },
    calculateFees: (data: any) => apiClient.request('/shipping/calculate-fees', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    createShipment: (data: any) => apiClient.request('/shipping/create-shipment', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getShipment: (tracking: string) => apiClient.request(`/shipping/shipment/${tracking}`),
    getTracking: (tracking: string) => apiClient.request(`/shipping/tracking/${tracking}`),
    updateShipment: (tracking: string, data: any) => apiClient.request(`/shipping/shipment/${tracking}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    deleteShipment: (tracking: string) => apiClient.request(`/shipping/shipment/${tracking}`, {
      method: 'DELETE',
    }),
  },
};

export default apiClient;
// =============================================
// Frontend API Service — Connects to MySQL Backend
// =============================================
// 
// HOW TO USE:
// 1. Set up the backend (see DATABASE_SETUP.md)
// 2. Start the backend: cd backend && npm start
// 3. The frontend will automatically fetch from the API
//
// Currently the app works with static data (src/data/products.ts).
// To switch to the database, replace static imports with API calls.
// See examples below.
// =============================================

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

// =============================================
// Generic fetch helper
// =============================================
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return response.json();
}

// =============================================
// Product API
// =============================================
export const productApi = {
  // Get all products with optional filters
  getAll: (params?: {
    category?: string;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    search?: string;
    featured?: boolean;
    isNew?: boolean;
    limit?: number;
    offset?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return apiFetch<{ success: boolean; count: number; products: any[] }>(
      `/products${query ? `?${query}` : ''}`
    );
  },

  // Get single product by ID
  getById: (id: number) => {
    return apiFetch<{ success: boolean; product: any; relatedProducts: any[] }>(
      `/products/${id}`
    );
  },

  // Get products by category
  getByCategory: (category: string, sort?: string) => {
    const query = sort ? `?sort=${sort}` : '';
    return apiFetch<{ success: boolean; count: number; products: any[] }>(
      `/products/category/${encodeURIComponent(category)}${query}`
    );
  },

  // Search products
  search: (query: string) => {
    return apiFetch<{ success: boolean; count: number; products: any[] }>(
      `/products/search?q=${encodeURIComponent(query)}`
    );
  },

  // Create product (admin)
  create: (product: any) => {
    return apiFetch<{ success: boolean; product: any }>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  // Update product (admin)
  update: (id: number, updates: any) => {
    return apiFetch<{ success: boolean; product: any }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Delete product (admin)
  delete: (id: number) => {
    return apiFetch<{ success: boolean; message: string }>(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// =============================================
// Cart API
// =============================================
export const cartApi = {
  // Get user's cart
  get: (userId: number) => {
    return apiFetch<{ success: boolean; items: any[]; totalItems: number; totalPrice: number }>(
      `/cart/${userId}`
    );
  },

  // Add item to cart
  add: (userId: number, productId: number, quantity = 1) => {
    return apiFetch<{ success: boolean; message: string }>('/cart', {
      method: 'POST',
      body: JSON.stringify({ userId, productId, quantity }),
    });
  },

  // Update cart item quantity
  update: (cartItemId: number, quantity: number) => {
    return apiFetch<{ success: boolean; message: string }>(`/cart/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  // Remove item from cart
  remove: (cartItemId: number) => {
    return apiFetch<{ success: boolean; message: string }>(`/cart/${cartItemId}`, {
      method: 'DELETE',
    });
  },

  // Clear entire cart
  clear: (userId: number) => {
    return apiFetch<{ success: boolean; message: string }>(`/cart/clear/${userId}`, {
      method: 'DELETE',
    });
  },
};

// =============================================
// Wishlist API
// =============================================
export const wishlistApi = {
  // Get user's wishlist
  get: (userId: number) => {
    return apiFetch<{ success: boolean; count: number; items: any[] }>(
      `/wishlist/${userId}`
    );
  },

  // Toggle wishlist item (add if not exists, remove if exists)
  toggle: (userId: number, productId: number) => {
    return apiFetch<{ success: boolean; action: 'added' | 'removed'; message: string }>(
      '/wishlist',
      {
        method: 'POST',
        body: JSON.stringify({ userId, productId }),
      }
    );
  },

  // Remove from wishlist
  remove: (wishlistItemId: number) => {
    return apiFetch<{ success: boolean; message: string }>(
      `/wishlist/${wishlistItemId}`,
      { method: 'DELETE' }
    );
  },
};

// =============================================
// Order API
// =============================================
export const orderApi = {
  // Create order (checkout)
  create: (orderData: {
    userId: number;
    items: { productId: number; quantity: number }[];
    shipping: {
      firstName: string;
      lastName: string;
      address: string;
      city: string;
      state: string;
      zip: string;
      phone?: string;
    };
    email: string;
    paymentMethod?: string;
    cardLastFour?: string;
    couponCode?: string;
    notes?: string;
  }) => {
    return apiFetch<{ success: boolean; order: any }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Get user's orders
  getAll: (userId: number) => {
    return apiFetch<{ success: boolean; count: number; orders: any[] }>(
      `/orders/${userId}`
    );
  },

  // Get order details
  getDetail: (orderId: number) => {
    return apiFetch<{ success: boolean; order: any }>(
      `/orders/detail/${orderId}`
    );
  },

  // Update order status (admin)
  updateStatus: (orderId: number, status: string) => {
    return apiFetch<{ success: boolean; message: string }>(
      `/orders/${orderId}/status`,
      {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }
    );
  },
};

// =============================================
// USAGE EXAMPLES
// =============================================
//
// // In a React component:
//
// import { productApi, cartApi } from '../services/api';
//
// // Fetch all handbag products
// const { products } = await productApi.getByCategory('Handbags');
//
// // Search products
// const { products: results } = await productApi.search('leather bag');
//
// // Add to cart
// await cartApi.add(userId, productId, 1);
//
// // Get cart
// const { items, totalPrice } = await cartApi.get(userId);
//
// // Place order
// const { order } = await orderApi.create({
//   userId: 1,
//   items: [{ productId: 101, quantity: 2 }],
//   shipping: { firstName: 'John', lastName: 'Doe', address: '123 Main St', city: 'NYC', state: 'NY', zip: '10001' },
//   email: 'john@example.com',
// });
//
// =============================================
// SWITCHING FROM STATIC TO DATABASE:
// =============================================
//
// Replace this:
//   import { handbagProducts } from '../data/products';
//   const products = handbagProducts;
//
// With this:
//   import { productApi } from '../services/api';
//   const [products, setProducts] = useState([]);
//   useEffect(() => {
//     productApi.getByCategory('Handbags').then(res => setProducts(res.products));
//   }, []);
//

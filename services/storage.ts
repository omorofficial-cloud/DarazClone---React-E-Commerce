import { Product, User, Order, CATEGORIES } from '../types';

// Mock Initial Data
const INITIAL_PRODUCTS: Product[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `prod-${i + 1}`,
  title: `Sample Product ${i + 1} - High Quality Item`,
  price: Math.floor(Math.random() * 5000) + 100,
  originalPrice: Math.floor(Math.random() * 6000) + 5200,
  description: "This is a high-quality product that meets your daily needs. Durable, stylish, and affordable. Order now to get the best deal!",
  category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
  image: `https://picsum.photos/seed/${i + 1}/300/300`,
  rating: Number((Math.random() * 2 + 3).toFixed(1)),
  reviews: Math.floor(Math.random() * 500),
  sellerId: 'seller-1'
}));

const INITIAL_USER: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'user@example.com',
  role: 'user'
};

const STORAGE_KEYS = {
  PRODUCTS: 'daraz_clone_products',
  CART: 'daraz_clone_cart',
  USER: 'daraz_clone_user',
  ORDERS: 'daraz_clone_orders'
};

export const StorageService = {
  getProducts: (): Product[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(stored);
  },

  saveProduct: (product: Product) => {
    const products = StorageService.getProducts();
    const existingIndex = products.findIndex(p => p.id === product.id);
    if (existingIndex >= 0) {
      products[existingIndex] = product;
    } else {
      products.push(product);
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  deleteProduct: (id: string) => {
    const products = StorageService.getProducts();
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
  },

  getUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  },

  login: (role: 'user' | 'seller', name: string) => {
    const user: User = {
      id: role === 'seller' ? 'seller-1' : 'user-1',
      name: name,
      email: `${name.toLowerCase().replace(' ', '')}@example.com`,
      role: role
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  getOrders: (userId: string): Order[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const orders: Order[] = stored ? JSON.parse(stored) : [];
    return orders.filter(o => o.userId === userId);
  },

  createOrder: (order: Order) => {
    const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const orders: Order[] = stored ? JSON.parse(stored) : [];
    orders.push(order);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }
};
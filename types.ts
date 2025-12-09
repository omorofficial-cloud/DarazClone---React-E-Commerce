export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  sellerId: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'seller';
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  date: string;
  paymentMethod: 'cod' | 'bkash' | 'nagad';
}

export const CATEGORIES = [
  "Electronic Devices",
  "TV & Home Appliances",
  "Health & Beauty",
  "Babies & Toys",
  "Groceries & Pets",
  "Home & Lifestyle",
  "Women's Fashion",
  "Men's Fashion",
  "Watches & Accessories",
  "Sports & Outdoor"
];
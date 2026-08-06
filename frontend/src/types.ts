/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PageId =
  | 'home'
  | 'membership'
  | 'shop'
  | 'contact'
  | 'journals'
  | 'admin'
  | 'cart'
  | 'login'
  | 'gaming'
  | 'about'
  | 'payment-success'
  | 'payment-failed';

export type ColorTheme = 'classic' | 'neon-mint' | 'crimson-moon' | 'mono-minimal' | 'monochrome';

export interface AtmosphereConfig {
  petalCount: number;
  driftVelocity: number;
  windAngle: number;
  gravity: number;
  colorTheme: ColorTheme;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  image?: string;
  rank?: string;
  size?: string;
  inStock?: boolean;
  type?: string;
}

export interface ApparelItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  inStock?: boolean;
  rating?: number;
  reviewsCount?: number;
  sizes?: string[];
  features?: string[];
}

export interface RankItem {
  id: string;
  title: string;
  price: number;
  badge: string;
  icon: string;
  description: string;
  features: string[];
}

export interface JournalPost {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  image: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'user' | 'vip';
  avatar?: string;
}

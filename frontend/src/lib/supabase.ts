/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);

// Local storage fallback helpers
const getLocalStorage = (key: string, fallback: any) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

const setLocalStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
};

export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Math.random()}.${fileExt}`;
      const { error } = await supabase.storage.from('avatars').upload(filePath, file);
      if (!error) {
        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        return data.publicUrl;
      }
    } catch {
      // Fallback
    }
  }
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

export async function getDBAddresses(userId: string): Promise<any[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from('addresses').select('*').eq('user_id', userId);
      if (data) return data;
    } catch {
      // Fallback
    }
  }
  return getLocalStorage(`addresses_${userId}`, [
    { id: '1', title: 'Home Sanctuary', street: '124 Cherry Blossom Way', city: 'Kyoto', zip: '600-0000', default: true }
  ]);
}

export async function saveDBAddress(userId: string, address: any): Promise<any> {
  const current = await getDBAddresses(userId);
  const newAddr = { id: address.id || Date.now().toString(), ...address };
  const updated = [...current.filter((a: any) => a.id !== newAddr.id), newAddr];
  setLocalStorage(`addresses_${userId}`, updated);
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('addresses').upsert({ ...newAddr, user_id: userId });
    } catch {
      // Ignore
    }
  }
  return newAddr;
}

export async function deleteDBAddress(userId: string, addressId: string): Promise<boolean> {
  const current = await getDBAddresses(userId);
  const updated = current.filter((a: any) => a.id !== addressId);
  setLocalStorage(`addresses_${userId}`, updated);
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('addresses').delete().eq('id', addressId);
    } catch {
      // Ignore
    }
  }
  return true;
}

export async function getDBOrders(userId: string): Promise<any[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from('orders').select('*').eq('user_id', userId);
      if (data) return data;
    } catch {
      // Fallback
    }
  }
  return getLocalStorage(`orders_${userId}`, [
    { id: 'ORD-8921', date: '2026-07-28', total: 145.0, status: 'Completed', itemsCount: 2 }
  ]);
}

export async function createDBOrder(userId: string, orderData: any): Promise<any> {
  const orders = await getDBOrders(userId);
  const newOrder = { id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`, date: new Date().toISOString().split('T')[0], ...orderData };
  const updated = [newOrder, ...orders];
  setLocalStorage(`orders_${userId}`, updated);
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('orders').insert({ ...newOrder, user_id: userId });
    } catch {
      // Ignore
    }
  }
  return newOrder;
}

export async function getDBWishlist(userId: string): Promise<string[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from('wishlists').select('product_id').eq('user_id', userId);
      if (data) return data.map((d: any) => d.product_id);
    } catch {
      // Fallback
    }
  }
  return getLocalStorage(`wishlist_${userId}`, ['1', '3']);
}

export async function toggleDBWishlist(userId: string, productId: string): Promise<string[]> {
  const current = await getDBWishlist(userId);
  const exists = current.includes(productId);
  const updated = exists ? current.filter((id) => id !== productId) : [...current, productId];
  setLocalStorage(`wishlist_${userId}`, updated);
  if (isSupabaseConfigured && supabase) {
    try {
      if (exists) {
        await supabase.from('wishlists').delete().match({ user_id: userId, product_id: productId });
      } else {
        await supabase.from('wishlists').insert({ user_id: userId, product_id: productId });
      }
    } catch {
      // Ignore
    }
  }
  return updated;
}

export async function getDBCart(userId: string): Promise<any[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from('cart').select('*').eq('user_id', userId);
      if (data) return data;
    } catch {
      // Fallback
    }
  }
  return getLocalStorage(`cart_${userId}`, []);
}

export async function saveDBCart(userId: string, cartItems: any[]): Promise<void> {
  setLocalStorage(`cart_${userId}`, cartItems);
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('cart').delete().eq('user_id', userId);
      if (cartItems.length > 0) {
        await supabase.from('cart').insert(cartItems.map((item) => ({ ...item, user_id: userId })));
      }
    } catch {
      // Ignore
    }
  }
}

export async function getWebsiteSettings(): Promise<Record<string, any>> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from('settings').select('*').single();
      if (data) return data;
    } catch {
      // Fallback
    }
  }
  return getLocalStorage('website_settings', { siteName: 'INEFFABLE', maintenanceMode: false });
}

export async function saveWebsiteSettings(settings: Record<string, any>): Promise<void> {
  setLocalStorage('website_settings', settings);
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('settings').upsert({ id: '1', ...settings });
    } catch {
      // Ignore
    }
  }
}

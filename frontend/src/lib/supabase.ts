/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL');

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Storage Helpers
 */

// Upload a user avatar to Supabase Storage
export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  if (!supabase) {
    console.warn('Supabase not configured. Falling back.');
    return null;
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `avatars/${userId}-${Date.now()}.${fileExt}`;

    // Upload file to 'inefontop-assets' bucket
    const { data, error } = await supabase.storage
      .from('inefontop-assets')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('inefontop-assets')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (err) {
    console.error('Error uploading avatar:', err);
    return null;
  }
}

// Upload a product image to Supabase Storage
export async function uploadProductImage(productId: string, file: File): Promise<string | null> {
  if (!supabase) {
    console.warn('Supabase not configured. Falling back.');
    return null;
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `products/${productId}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('inefontop-assets')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('inefontop-assets')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (err) {
    console.error('Error uploading product image:', err);
    return null;
  }
}

/**
 * Database Helpers
 */

// Profiles table
export async function getProfile(userId: string) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Error fetching profile from DB, using fallback:', err);
    return null;
  }
}

export async function upsertProfile(userId: string, username: string, avatarUrl?: string) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('profiles').upsert({
      id: userId,
      username,
      avatar_url: avatarUrl || null,
      updated_at: new Date().toISOString()
    }).select();
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Error upserting profile in DB:', err);
    return null;
  }
}

// Cart table
export async function getDBCart(userId: string) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('cart').select('*').eq('user_id', userId).single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 means no row found
    return data ? data.items : [];
  } catch (err) {
    console.warn('Error fetching cart from DB:', err);
    return null;
  }
}

export async function saveDBCart(userId: string, items: any[]) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('cart').upsert({
      user_id: userId,
      items,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' }).select();
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Error saving cart to DB:', err);
    return null;
  }
}

// Wishlist table
export async function getDBWishlist(userId: string): Promise<string[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase.from('wishlist').select('product_id').eq('user_id', userId);
    if (error) throw error;
    return data ? data.map((item: any) => item.product_id) : [];
  } catch (err) {
    console.warn('Error fetching wishlist from DB:', err);
    return [];
  }
}

export async function toggleDBWishlist(userId: string, productId: string) {
  if (!supabase) return null;
  try {
    const { data: existing } = await supabase.from('wishlist').select('*').eq('user_id', userId).eq('product_id', productId);
    if (existing && existing.length > 0) {
      const { error } = await supabase.from('wishlist').delete().eq('user_id', userId).eq('product_id', productId);
      if (error) throw error;
      return { action: 'removed', productId };
    } else {
      const { error } = await supabase.from('wishlist').insert({
        user_id: userId,
        product_id: productId,
        created_at: new Date().toISOString()
      });
      if (error) throw error;
      return { action: 'added', productId };
    }
  } catch (err) {
    console.warn('Error toggling wishlist in DB:', err);
    return null;
  }
}

// Addresses table
export async function getDBAddresses(userId: string) {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase.from('addresses').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Error fetching addresses from DB:', err);
    return [];
  }
}

export async function saveDBAddress(userId: string, address: any) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('addresses').insert({
      user_id: userId,
      full_name: address.full_name,
      street: address.street,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
      country: address.country,
      is_default: address.is_default || false,
      created_at: new Date().toISOString()
    }).select();
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Error saving address to DB:', err);
    return null;
  }
}

export async function deleteDBAddress(userId: string, addressId: string) {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('addresses').delete().eq('user_id', userId).eq('id', addressId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Error deleting address from DB:', err);
    return false;
  }
}

// Orders table
export async function getDBOrders(userId: string) {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase.from('orders').select(`
      *,
      order_items (*)
    `).eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Error fetching orders from DB:', err);
    return [];
  }
}

export async function createDBOrder(userId: string, total: number, discordUsername: string, items: any[]) {
  if (!supabase) return null;
  try {
    const { data: orderData, error: orderError } = await supabase.from('orders').insert({
      user_id: userId,
      total,
      discord_username: discordUsername,
      status: 'completed',
      created_at: new Date().toISOString()
    }).select().single();

    if (orderError) throw orderError;

    const orderItemsToInsert = items.map(item => ({
      order_id: orderData.id,
      product_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItemsToInsert);
    if (itemsError) throw itemsError;

    return orderData;
  } catch (err) {
    console.warn('Error creating order in DB:', err);
    return null;
  }
}

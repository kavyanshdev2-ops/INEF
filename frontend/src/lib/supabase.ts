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

    // Upload file to 'ineffable-assets' bucket
    const { data, error } = await supabase.storage
      .from('ineffable-assets')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('ineffable-assets')
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
      .from('ineffable-assets')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('ineffable-assets')
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

// List all tables in the database (for audit)
export async function listTables() {
  if (!supabase) return [];
  try {
    // Query information_schema to get table names
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (error) throw error;
    return data?.map(row => row.table_name) || [];
  } catch (err) {
    console.error('Error listing tables:', err);
    return [];
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

// =============================================
// ADMIN PANEL DATABASE HELPERS
// =============================================

// Products
export async function getProducts(): Promise<any[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
}

export async function createProduct(product: any): Promise<any> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('products')
      .insert({
        ...product,
        slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error creating product:', err);
    return null;
  }
}

export async function updateProduct(id: string, product: any): Promise<any> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ ...product, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error updating product:', err);
    return null;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error deleting product:', err);
    return false;
  }
}

// Categories
export async function getCategories(): Promise<any[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order');
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching categories:', err);
    return [];
  }
}

// Orders (admin view)
export async function getAdminOrders(): Promise<any[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customer:customers(*),
        order_items(*)
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching admin orders:', err);
    return [];
  }
}

export async function updateOrderStatus(id: string, status: string, paymentStatus?: string): Promise<any> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, payment_status: paymentStatus, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error updating order status:', err);
    return null;
  }
}

// Customers
export async function getCustomers(): Promise<any[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching customers:', err);
    return [];
  }
}

// Media Library
export async function getMedia(): Promise<any[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('media_library')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching media:', err);
    return [];
  }
}

export async function uploadMedia(file: File, adminId?: string): Promise<any> {
  if (!supabase) return null;
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `media/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

    const { data: storageData, error: storageError } = await supabase.storage
      .from('ineffable-assets')
      .upload(fileName, file, { cacheControl: '3600', upsert: true });
    if (storageError) throw storageError;

    const { data: { publicUrl } } = supabase.storage
      .from('ineffable-assets')
      .getPublicUrl(fileName);

    const { data, error } = await supabase
      .from('media_library')
      .insert({
        file_name: file.name,
        original_name: file.name,
        file_url: publicUrl,
        file_type: file.type,
        file_size: file.size,
        mime_type: file.type,
        created_by: adminId
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error uploading media:', err);
    return null;
  }
}

export async function deleteMedia(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('media_library')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error deleting media:', err);
    return false;
  }
}

// Settings
export async function getWebsiteSettings(): Promise<Record<string, any>> {
  if (!supabase) return {};
  try {
    const { data, error } = await supabase
      .from('website_settings')
      .select('*');
    if (error) throw error;
    const settings: Record<string, any> = {};
    (data || []).forEach((row: any) => {
      settings[row.key] = row.value;
    });
    return settings;
  } catch (err) {
    console.error('Error fetching settings:', err);
    return {};
  }
}

export async function updateWebsiteSettings(key: string, value: any, adminId?: string): Promise<any> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('website_settings')
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString(),
        updated_by: adminId
      }, { onConflict: 'key' })
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error updating setting:', err);
    return null;
  }
}

// Announcements
export async function getAnnouncements(): Promise<any[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('display_order')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching announcements:', err);
    return [];
  }
}

// Admin Management
export async function getProfiles(): Promise<any[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching profiles:', err);
    return [];
  }
}

export async function updateProfileIsAdmin(userId: string, isAdmin: boolean): Promise<any> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_admin: isAdmin, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error updating profile admin status:', err);
    return null;
  }
}

export async function inviteAdmin(email: string): Promise<any> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: window.location.origin,
      data: { is_admin: true }
    });
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error inviting admin:', err);
    throw err;
  }
}

// Analytics
export async function getAnalytics(): Promise<any> {
  if (!supabase) return null;
  try {
    // Simple analytics - count orders, calculate totals
    const [orders, customers] = await Promise.all([
      getAdminOrders(),
      getCustomers()
    ]);

    const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
    const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
    const failedPayments = orders.filter((o: any) => o.payment_status === 'failed').length;

    return {
      today_sales: 0,
      week_sales: 0,
      month_revenue: totalRevenue,
      total_orders: orders.length,
      pending_orders: pendingOrders,
      failed_payments: failedPayments,
      total_customers: customers.length,
      low_stock_products: [],
      recent_orders: orders.slice(0, 5)
    };
  } catch (err) {
    console.error('Error fetching analytics:', err);
    return null;
  }
}

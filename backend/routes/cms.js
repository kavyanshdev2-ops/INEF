const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

// ===========================================
// PRODUCTS ROUTES
// ===========================================
router.get('/products', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/products', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').insert([req.body]).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').update({ ...req.body, updated_at: new Date().toISOString() }).eq('id', req.params.id).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('products').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ===========================================
// INVENTORY ROUTES
// ===========================================
router.get('/inventory/history', async (req, res) => {
  try {
    const { data, error } = await supabase.from('inventory_history').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/inventory/adjust', async (req, res) => {
  const { product_id, change_amount, reason } = req.body;
  try {
    // Get current product
    const { data: product, error: productError } = await supabase.from('products').select('stock_quantity').eq('id', product_id).single();
    if (productError) throw productError;

    const new_quantity = product.stock_quantity + change_amount;

    // Update product stock
    const { data: updatedProduct, error: updateError } = await supabase.from('products').update({ stock_quantity: new_quantity, updated_at: new Date().toISOString() }).eq('id', product_id).select();
    if (updateError) throw updateError;

    // Add to inventory history
    const { data: history, error: historyError } = await supabase.from('inventory_history').insert([{ product_id, change_amount, new_quantity, reason }]).select();
    if (historyError) throw historyError;

    res.json({ product: updatedProduct[0], history: history[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ===========================================
// SHOP SETTINGS ROUTES
// ===========================================
router.get('/settings/shop', async (req, res) => {
  try {
    const { data, error } = await supabase.from('shop_settings').select('*').limit(1).single();
    if (error) {
      if (error.code === 'PGRST116') {
        const { data: newSettings, error: insertError } = await supabase.from('shop_settings').insert([{}]).select();
        if (insertError) throw insertError;
        return res.json(newSettings[0]);
      }
      throw error;
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/settings/shop', async (req, res) => {
  try {
    const { data, error } = await supabase.from('shop_settings').select('id');
    if (error) throw error;

    let updatedSettings;
    if (data.length > 0) {
      const { data: updateData, error: updateError } = await supabase.from('shop_settings').update({ ...req.body, updated_at: new Date().toISOString() }).eq('id', data[0].id).select();
      if (updateError) throw updateError;
      updatedSettings = updateData[0];
    } else {
      const { data: insertData, error: insertError } = await supabase.from('shop_settings').insert([req.body]).select();
      if (insertError) throw insertError;
      updatedSettings = insertData[0];
    }

    res.json(updatedSettings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ===========================================
// WEBSITE CONTENT ROUTES
// ===========================================
router.get('/content', async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_content').select('*');
    if (error) throw error;
    // Convert to key-value object
    const content = {};
    data.forEach(item => { content[item.key] = item.value; });
    res.json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/content', async (req, res) => {
  try {
    const { key, value } = req.body;
    const { data, error } = await supabase.from('website_content').upsert([{ key, value, updated_at: new Date().toISOString() }], { onConflict: 'key' }).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ===========================================
// MEDIA LIBRARY ROUTES
// ===========================================
router.get('/media', async (req, res) => {
  try {
    const { data, error } = await supabase.from('media_library').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/media', async (req, res) => {
  try {
    const { data, error } = await supabase.from('media_library').insert([req.body]).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/media/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('media_library').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ===========================================
// ORDERS ROUTES
// ===========================================
router.get('/orders', async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/orders/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/orders', async (req, res) => {
  try {
    const order_number = `ORD-${Date.now()}`;
    const { data, error } = await supabase.from('orders').insert([{ ...req.body, order_number }]).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/orders/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders').update({ ...req.body, updated_at: new Date().toISOString() }).eq('id', req.params.id).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ===========================================
// CUSTOMERS ROUTES
// ===========================================
router.get('/customers', async (req, res) => {
  try {
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/customers', async (req, res) => {
  try {
    const { data, error } = await supabase.from('customers').insert([req.body]).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ===========================================
// DISCORD SETTINGS ROUTES
// ===========================================
router.get('/settings/discord', async (req, res) => {
  try {
    const { data, error } = await supabase.from('discord_settings').select('*').limit(1).single();
    if (error) {
      if (error.code === 'PGRST116') {
        const { data: newSettings, error: insertError } = await supabase.from('discord_settings').insert([{}]).select();
        if (insertError) throw insertError;
        return res.json(newSettings[0]);
      }
      throw error;
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/settings/discord', async (req, res) => {
  try {
    const { data, error } = await supabase.from('discord_settings').select('id');
    if (error) throw error;

    let updatedSettings;
    if (data.length > 0) {
      const { data: updateData, error: updateError } = await supabase.from('discord_settings').update({ ...req.body, updated_at: new Date().toISOString() }).eq('id', data[0].id).select();
      if (updateError) throw updateError;
      updatedSettings = updateData[0];
    } else {
      const { data: insertData, error: insertError } = await supabase.from('discord_settings').insert([req.body]).select();
      if (insertError) throw insertError;
      updatedSettings = insertData[0];
    }

    res.json(updatedSettings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ===========================================
// SOCIAL LINKS ROUTES
// ===========================================
router.get('/settings/social', async (req, res) => {
  try {
    const { data, error } = await supabase.from('social_links').select('*');
    if (error) throw error;
    const social = {};
    data.forEach(item => { social[item.platform] = item.url; });
    res.json(social);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/settings/social', async (req, res) => {
  try {
    const updates = Object.entries(req.body).map(([platform, url]) => ({ platform, url }));
    const { data, error } = await supabase.from('social_links').upsert(updates, { onConflict: 'platform' }).select();
    if (error) throw error;
    const social = {};
    data.forEach(item => { social[item.platform] = item.url; });
    res.json(social);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ===========================================
// SEO SETTINGS ROUTES
// ===========================================
router.get('/settings/seo', async (req, res) => {
  try {
    const { data, error } = await supabase.from('seo_settings').select('*').limit(1).single();
    if (error) {
      if (error.code === 'PGRST116') {
        const { data: newSettings, error: insertError } = await supabase.from('seo_settings').insert([{}]).select();
        if (insertError) throw insertError;
        return res.json(newSettings[0]);
      }
      throw error;
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/settings/seo', async (req, res) => {
  try {
    const { data, error } = await supabase.from('seo_settings').select('id');
    if (error) throw error;

    let updatedSettings;
    if (data.length > 0) {
      const { data: updateData, error: updateError } = await supabase.from('seo_settings').update({ ...req.body, updated_at: new Date().toISOString() }).eq('id', data[0].id).select();
      if (updateError) throw updateError;
      updatedSettings = updateData[0];
    } else {
      const { data: insertData, error: insertError } = await supabase.from('seo_settings').insert([req.body]).select();
      if (insertError) throw insertError;
      updatedSettings = insertData[0];
    }

    res.json(updatedSettings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ===========================================
// ANNOUNCEMENTS ROUTES
// ===========================================
router.get('/announcements', async (req, res) => {
  try {
    const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/announcements', async (req, res) => {
  try {
    const { data, error } = await supabase.from('announcements').insert([req.body]).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/announcements/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('announcements').update({ ...req.body, updated_at: new Date().toISOString() }).eq('id', req.params.id).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/announcements/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('announcements').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ===========================================
// ANALYTICS DASHBOARD
// ===========================================
router.get('/analytics/dashboard', async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get orders
    const { data: orders } = await supabase.from('orders').select('*');
    // Get products
    const { data: products } = await supabase.from('products').select('id, name, stock_quantity');
    // Get customers
    const { data: customers } = await supabase.from('customers').select('*');

    // Calculate metrics
    const todayOrders = orders.filter(o => new Date(o.created_at) >= new Date(new Date().setHours(0, 0, 0, 0)));
    const weekOrders = orders.filter(o => new Date(o.created_at) >= startOfWeek);
    const monthOrders = orders.filter(o => new Date(o.created_at) >= startOfMonth);

    const todaySales = todayOrders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
    const weekSales = weekOrders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
    const monthRevenue = monthOrders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const failedPayments = orders.filter(o => o.payment_status === 'failed').length;
    const lowStockProducts = products.filter(p => p.stock_quantity < 10);

    const analytics = {
      today_sales: todaySales,
      week_sales: weekSales,
      month_revenue: monthRevenue,
      total_orders: orders.length,
      pending_orders: pendingOrders,
      failed_payments: failedPayments,
      total_customers: customers.length,
      low_stock_products: lowStockProducts,
      recent_customers: customers.slice(-5).reverse(),
      recent_orders: orders.slice(-10).reverse()
    };

    res.json(analytics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

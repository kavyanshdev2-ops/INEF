import React, { useState, useEffect } from 'react';
import { AtmosphereConfig, PageId } from '../types';
import { getThemeStyles } from '../lib/theme';
import { supabase } from '../lib/supabase';
import {
  Shield, Users, FileText, Trash2, RefreshCw, AlertTriangle,
  Key, ArrowLeft, Lock, CheckCircle, Database, Eye, Plus,
  Edit, Copy, Package, ShoppingCart, Settings, Image as ImageIcon,
  Layout, Activity, Bell, Link, Search, BarChart3
} from 'lucide-react';

interface AdminViewProps {
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
  currentUser: string | null;
  setCurrentPage: (page: PageId) => void;
}

const API_BASE = (import.meta as unknown as { env: Record<string, string> }).env.VITE_API_URL || 'https://backend.inef.cc/api/v1';

export const AdminView: React.FC<AdminViewProps> = ({
  activeAtmosphere,
  isDarkMode,
  currentUser,
  setCurrentPage,
}) => {
  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check admin status
  useEffect(() => {
    const checkAdmin = async () => {
      if (!currentUser) {
        setIsAdmin(false);
        return;
      }
      
      // First check the username fallback
      const usernameLower = currentUser.toLowerCase();
      if (usernameLower === 'kavyanshshakya' || usernameLower === 'admin') {
        setIsAdmin(true);
        return;
      }

      // Then check the email from Supabase
      if (supabase) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email === 'kavyanshshakya251@gmail.com') {
            setIsAdmin(true);
            return;
          }
          if (user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('is_admin')
              .eq('id', user.id)
              .single();
            if (profile?.is_admin) {
              setIsAdmin(true);
              return;
            }
          }
        } catch (err) {
          console.warn('Error checking admin status:', err);
        }
      }
      
      setIsAdmin(false);
    };
    
    checkAdmin();
  }, [currentUser]);

  // Admin States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [passwordInput, setPasswordInput] = useState('');
  const [bypassSuccess, setBypassSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Data states
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [shopSettings, setShopSettings] = useState<any>({});
  const [seoSettings, setSeoSettings] = useState<any>({});
  const [discordSettings, setDiscordSettings] = useState<any>({});
  const [socialLinks, setSocialLinks] = useState<any>({});
  const [mediaLibrary, setMediaLibrary] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({});

  // Form states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: '', description: '', short_description: '', price: '', sale_price: '',
    stock_quantity: '', sku: '', barcode: '', brand: '', categories: [],
    tags: [], sizes: [], colors: []
  });

  // Load all data
  useEffect(() => {
    if (isAdmin || bypassSuccess) {
      loadAllData();
    }
  }, [isAdmin, bypassSuccess]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        productsRes, ordersRes, customersRes,
        shopSettingsRes, seoSettingsRes, discordSettingsRes, socialLinksRes,
        mediaRes, announcementsRes, analyticsRes
      ] = await Promise.all([
        fetch(`${API_BASE}/cms/products`),
        fetch(`${API_BASE}/cms/orders`),
        fetch(`${API_BASE}/cms/customers`),
        fetch(`${API_BASE}/cms/settings/shop`),
        fetch(`${API_BASE}/cms/settings/seo`),
        fetch(`${API_BASE}/cms/settings/discord`),
        fetch(`${API_BASE}/cms/settings/social`),
        fetch(`${API_BASE}/cms/media`),
        fetch(`${API_BASE}/cms/announcements`),
        fetch(`${API_BASE}/cms/analytics/dashboard`)
      ]);

      if (productsRes.ok) setProducts(await productsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (customersRes.ok) setCustomers(await customersRes.json());
      if (shopSettingsRes.ok) setShopSettings(await shopSettingsRes.json());
      if (seoSettingsRes.ok) setSeoSettings(await seoSettingsRes.json());
      if (discordSettingsRes.ok) setDiscordSettings(await discordSettingsRes.json());
      if (socialLinksRes.ok) setSocialLinks(await socialLinksRes.json());
      if (mediaRes.ok) setMediaLibrary(await mediaRes.json());
      if (announcementsRes.ok) setAnnouncements(await announcementsRes.json());
      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    try {
      const res = editingProduct
        ? await fetch(`${API_BASE}/cms/products/${editingProduct.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productForm)
          })
        : await fetch(`${API_BASE}/cms/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productForm)
          });

      if (res.ok) {
        await loadAllData();
        setShowProductModal(false);
        setEditingProduct(null);
        setProductForm({
          name: '', description: '', short_description: '', price: '', sale_price: '',
          stock_quantity: '', sku: '', barcode: '', brand: '', categories: [],
          tags: [], sizes: [], colors: []
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${API_BASE}/cms/products/${id}`, { method: 'DELETE' });
      if (res.ok) await loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm(product);
    setShowProductModal(true);
  };

  const handleDuplicateProduct = (product: any) => {
    const { id, ...copy } = product;
    copy.name = `${product.name} (Copy)`;
    setEditingProduct(null);
    setProductForm(copy);
    setShowProductModal(true);
  };

  const handleSaveSettings = async (type: string, data: any) => {
    try {
      const res = await fetch(`${API_BASE}/cms/settings/${type}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) await loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const adjustInventory = async (productId: string, changeAmount: number, reason: string) => {
    try {
      const res = await fetch(`${API_BASE}/cms/inventory/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, change_amount: changeAmount, reason })
      });
      if (res.ok) await loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const addMedia = async (url: string) => {
    try {
      const res = await fetch(`${API_BASE}/cms/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_name: url.split('/').pop() || 'media', file_type: 'image', file_url: url })
      });
      if (res.ok) await loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMedia = async (id: string) => {
    if (!confirm('Delete this media?')) return;
    try {
      const res = await fetch(`${API_BASE}/cms/media/${id}`, { method: 'DELETE' });
      if (res.ok) await loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const addAnnouncement = async (data: any) => {
    try {
      const res = await fetch(`${API_BASE}/cms/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) await loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm('Delete this announcement?')) return;
    try {
      const res = await fetch(`${API_BASE}/cms/announcements/${id}`, { method: 'DELETE' });
      if (res.ok) await loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Check bypass password
  const handleBypassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'inefrunner0725') {
      setBypassSuccess(true);
    } else {
      alert('Invalid passkey');
    }
  };

  // Render Access Denied if not admin
  if (!isAdmin && !bypassSuccess) {
    return (
      <div id="admin-access-denied" className="max-w-xl mx-auto px-6 py-32 text-center space-y-8">
        <div className="relative inline-block">
          <div className="absolute -inset-1 rounded-full bg-rose-500/20 blur-xl animate-pulse" />
          <div className="relative bg-zinc-950/60 border border-rose-500/40 p-6 rounded-full inline-flex items-center justify-center">
            <Lock className="w-12 h-12 text-rose-500" />
          </div>
        </div>

        <div className="space-y-3">
          <span className="font-mono text-[10px] tracking-[0.3em] text-rose-500 font-extrabold uppercase block">
            INEFFABLE // SHIELD PROTOCOL
          </span>
          <h2 className="text-3xl font-sans tracking-tight font-extrabold uppercase text-white">
            ADMIN ACCESS RESTRICTED
          </h2>
        </div>

        {/* Password Bypass Form */}
        <div className={`max-w-sm mx-auto ${themeStyles.bgCard} border ${themeStyles.borderMain} rounded-2xl p-6 space-y-4 shadow-xl text-left`}>
          <form onSubmit={handleBypassSubmit} className="space-y-3">
            <input
              type="password"
              placeholder="Enter Admin Passkey"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full bg-zinc-900/60 border border-zinc-800 px-3 py-2.5 rounded-lg text-zinc-100 font-mono text-xs focus:outline-none focus:border-rose-500 transition-colors"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-rose-950 hover:bg-rose-900 border border-rose-900 text-rose-200 font-mono text-[10px] tracking-widest font-extrabold rounded-lg transition-colors cursor-pointer"
            >
              DECRYPT ACCESS PORT
            </button>
          </form>
        </div>

        <button
          onClick={() => setCurrentPage('home')}
          className="inline-flex items-center space-x-2 font-mono text-[10px] tracking-widest text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO LOBBY</span>
        </button>
      </div>
    );
  }

  return (
    <div id="admin-panel-container" className="max-w-7xl mx-auto px-6 py-24 pt-32 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-zinc-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-rose-950 text-rose-300 border border-rose-900 px-2.5 py-0.5 rounded-full font-mono text-[9px] tracking-widest font-bold">
              SUPERADMIN PORTAL
            </span>
          </div>
          <h2 className="text-3xl font-sans tracking-tight font-extrabold uppercase text-white flex items-center space-x-3">
            <Shield className="w-8 h-8 text-rose-500" />
            <span>INEFFABLE ADMIN</span>
          </h2>
        </div>

        <div className="flex gap-3">
          <button
            onClick={loadAllData}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl font-mono text-[10px] tracking-widest text-zinc-300 transition-colors cursor-pointer flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>REFRESH</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-4">
        {[
          { id: 'dashboard', label: 'DASHBOARD', icon: <BarChart3 className="w-3.5 h-3.5" /> },
          { id: 'products', label: 'PRODUCTS', icon: <Package className="w-3.5 h-3.5" /> },
          { id: 'inventory', label: 'INVENTORY', icon: <Database className="w-3.5 h-3.5" /> },
          { id: 'orders', label: 'ORDERS', icon: <ShoppingCart className="w-3.5 h-3.5" /> },
          { id: 'customers', label: 'CUSTOMERS', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'media', label: 'MEDIA', icon: <ImageIcon className="w-3.5 h-3.5" /> },
          { id: 'announcements', label: 'ANNOUNCEMENTS', icon: <Bell className="w-3.5 h-3.5" /> },
          { id: 'shop-settings', label: 'SHOP SETTINGS', icon: <Settings className="w-3.5 h-3.5" /> },
          { id: 'seo', label: 'SEO', icon: <Search className="w-3.5 h-3.5" /> },
          { id: 'social', label: 'SOCIAL', icon: <Link className="w-3.5 h-3.5" /> },
          { id: 'discord', label: 'DISCORD', icon: <Database className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl font-mono text-[10px] tracking-widest font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-rose-950 text-rose-300 border border-rose-900'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="text-center py-16 text-zinc-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="font-mono text-sm">LOADING...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'TODAY\'S SALES', value: analytics.today_sales || 0, prefix: '₹' },
                  { label: 'WEEK SALES', value: analytics.week_sales || 0, prefix: '₹' },
                  { label: 'MONTH REVENUE', value: analytics.month_revenue || 0, prefix: '₹' },
                  { label: 'TOTAL ORDERS', value: analytics.total_orders || 0 },
                  { label: 'PENDING ORDERS', value: analytics.pending_orders || 0 },
                  { label: 'FAILED PAYMENTS', value: analytics.failed_payments || 0 },
                  { label: 'TOTAL CUSTOMERS', value: analytics.total_customers || 0 },
                  { label: 'LOW STOCK', value: (analytics.low_stock_products || []).length },
                ].map((stat, i) => (
                  <div key={i} className={`${themeStyles.bgCard} border border-zinc-800 rounded-2xl p-4`}>
                    <span className="font-mono text-[9px] text-zinc-500 block uppercase">{stat.label}</span>
                    <p className="text-2xl font-bold text-white mt-1">
                      {stat.prefix}{stat.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`${themeStyles.bgCard} border border-zinc-800 rounded-2xl p-4`}>
                  <h4 className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase mb-3">RECENT ORDERS</h4>
                  {(analytics.recent_orders || []).map((order: any, i: number) => (
                    <div key={i} className="py-2 border-b border-zinc-800 last:border-b-0">
                      <p className="text-sm text-white">{order.order_number}</p>
                      <p className="text-xs text-zinc-500">₹{order.total_amount} • {order.status}</p>
                    </div>
                  ))}
                </div>
                <div className={`${themeStyles.bgCard} border border-zinc-800 rounded-2xl p-4`}>
                  <h4 className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase mb-3">LOW STOCK PRODUCTS</h4>
                  {(analytics.low_stock_products || []).map((p: any, i: number) => (
                    <div key={i} className="py-2 border-b border-zinc-800 last:border-b-0">
                      <p className="text-sm text-white">{p.name}</p>
                      <p className="text-xs text-zinc-500">Stock: {p.stock_quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className={`${themeStyles.bgCard} border border-zinc-800 rounded-2xl overflow-hidden`}>
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <h4 className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">PRODUCTS</h4>
                <button
                  onClick={() => setShowProductModal(true)}
                  className="px-3 py-1.5 bg-emerald-900 text-emerald-300 border border-emerald-800 rounded-lg font-mono text-[9px] tracking-widest font-bold hover:bg-emerald-800 transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD PRODUCT</span>
                </button>
              </div>

              <div className="divide-y divide-zinc-800">
                {products.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500">No products yet</div>
                ) : (
                  products.map((p) => (
                    <div key={p.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-white">{p.name}</p>
                        <p className="text-xs text-zinc-500">
                          ₹{p.price} • {p.stock_quantity} in stock • {p.status}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDuplicateProduct(p)}
                          className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-lg transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEditProduct(p)}
                          className="p-1.5 bg-blue-900 hover:bg-blue-800 text-blue-300 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 bg-rose-900 hover:bg-rose-800 text-rose-300 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className={`${themeStyles.bgCard} border border-zinc-800 rounded-2xl overflow-hidden`}>
              <div className="p-4 border-b border-zinc-800">
                <h4 className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">ORDERS</h4>
              </div>
              <div className="divide-y divide-zinc-800">
                {orders.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500">No orders yet</div>
                ) : (
                  orders.map((o) => (
                    <div key={o.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-white">{o.order_number}</p>
                        <span className={`px-2 py-0.5 rounded text-xs font-mono ${
                          o.status === 'completed' ? 'bg-emerald-900 text-emerald-300' :
                          o.status === 'pending' ? 'bg-yellow-900 text-yellow-300' : 'bg-zinc-900 text-zinc-300'
                        }`}>
                          {o.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">
                        ₹{o.total_amount} • {o.payment_status} • {new Date(o.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Shop Settings Tab */}
          {activeTab === 'shop-settings' && (
            <div className={`${themeStyles.bgCard} border border-zinc-800 rounded-2xl overflow-hidden`}>
              <div className="p-4 border-b border-zinc-800">
                <h4 className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">SHOP SETTINGS</h4>
              </div>
              <div className="p-4 space-y-4">
                {Object.entries(shopSettings).map(([key, value]: [string, any]) => (
                  key !== 'id' && key !== 'created_at' && key !== 'updated_at' && (
                    <div key={key} className="space-y-1">
                      <label className="text-xs font-mono text-zinc-400 uppercase">{key.replace(/_/g, ' ')}</label>
                      {typeof value === 'object' ? (
                        <textarea
                          value={JSON.stringify(value, null, 2)}
                          onChange={(e) => {
                            try {
                              setShopSettings({ ...shopSettings, [key]: JSON.parse(e.target.value) });
                            } catch {}
                          }}
                          rows={4}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      ) : (
                        <input
                          type="text"
                          value={value || ''}
                          onChange={(e) => setShopSettings({ ...shopSettings, [key]: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      )}
                    </div>
                  )
                ))}
                <button
                  onClick={() => handleSaveSettings('shop', shopSettings)}
                  className="w-full px-4 py-2 bg-rose-900 hover:bg-rose-800 text-rose-200 border border-rose-800 rounded-lg font-mono text-[10px] tracking-widest font-bold transition-colors cursor-pointer"
                >
                  SAVE SETTINGS
                </button>
              </div>
            </div>
          )}

          {/* SEO Settings Tab */}
          {activeTab === 'seo' && (
            <div className={`${themeStyles.bgCard} border border-zinc-800 rounded-2xl overflow-hidden`}>
              <div className="p-4 border-b border-zinc-800">
                <h4 className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">SEO SETTINGS</h4>
              </div>
              <div className="p-4 space-y-4">
                {Object.entries(seoSettings).map(([key, value]: [string, any]) => (
                  key !== 'id' && key !== 'created_at' && key !== 'updated_at' && (
                    <div key={key} className="space-y-1">
                      <label className="text-xs font-mono text-zinc-400 uppercase">{key.replace(/_/g, ' ')}</label>
                      {Array.isArray(value) ? (
                        <input
                          type="text"
                          value={value.join(', ')}
                          onChange={(e) => setSeoSettings({ ...seoSettings, [key]: e.target.value.split(', ') })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      ) : (
                        <input
                          type="text"
                          value={value || ''}
                          onChange={(e) => setSeoSettings({ ...seoSettings, [key]: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      )}
                    </div>
                  )
                ))}
                <button
                  onClick={() => handleSaveSettings('seo', seoSettings)}
                  className="w-full px-4 py-2 bg-rose-900 hover:bg-rose-800 text-rose-200 border border-rose-800 rounded-lg font-mono text-[10px] tracking-widest font-bold transition-colors cursor-pointer"
                >
                  SAVE SEO SETTINGS
                </button>
              </div>
            </div>
          )}

          {/* Social Links Tab */}
          {activeTab === 'social' && (
            <div className={`${themeStyles.bgCard} border border-zinc-800 rounded-2xl overflow-hidden`}>
              <div className="p-4 border-b border-zinc-800">
                <h4 className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">SOCIAL LINKS</h4>
              </div>
              <div className="p-4 space-y-4">
                {Object.entries(socialLinks).map(([platform, url]: [string, string]) => (
                  <div key={platform} className="space-y-1">
                    <label className="text-xs font-mono text-zinc-400 uppercase">{platform}</label>
                    <input
                      type="text"
                      value={url || ''}
                      onChange={(e) => setSocialLinks({ ...socialLinks, [platform]: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                ))}
                <button
                  onClick={() => handleSaveSettings('social', socialLinks)}
                  className="w-full px-4 py-2 bg-rose-900 hover:bg-rose-800 text-rose-200 border border-rose-800 rounded-lg font-mono text-[10px] tracking-widest font-bold transition-colors cursor-pointer"
                >
                  SAVE SOCIAL LINKS
                </button>
              </div>
            </div>
          )}

          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <div className={`${themeStyles.bgCard} border border-zinc-800 rounded-2xl overflow-hidden`}>
              <div className="p-4 border-b border-zinc-800">
                <h4 className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">CUSTOMERS</h4>
              </div>
              <div className="divide-y divide-zinc-800">
                {customers.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500">No customers yet</div>
                ) : (
                  customers.map((c) => (
                    <div key={c.id} className="p-4">
                      <p className="text-sm font-bold text-white">{c.name}</p>
                      <p className="text-xs text-zinc-500">
                        {c.email} • {c.phone || 'No phone'}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <div className={`${themeStyles.bgCard} border border-zinc-800 rounded-2xl overflow-hidden`}>
              <div className="p-4 border-b border-zinc-800">
                <h4 className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">INVENTORY</h4>
              </div>
              <div className="p-4 space-y-4">
                {products.map((p) => (
                  <div key={p.id} className="space-y-2 border border-zinc-800 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-white">{p.name}</p>
                      <p className="text-xs text-zinc-400">Stock: {p.stock_quantity}</p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Change amount"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value) {
                            const change = parseInt(e.currentTarget.value);
                            adjustInventory(p.id, change, 'Manual adjustment');
                          }
                        }}
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          const input = document.querySelector(`input[placeholder="Change amount"]`) as HTMLInputElement;
                          if (input && input.value) {
                            adjustInventory(p.id, parseInt(input.value), 'Manual adjustment');
                          }
                        }}
                        className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border border-emerald-800 rounded-lg font-mono text-[9px] tracking-widest font-bold transition-colors cursor-pointer"
                      >
                        ADJUST
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Media Library Tab */}
          {activeTab === 'media' && (
            <div className={`${themeStyles.bgCard} border border-zinc-800 rounded-2xl overflow-hidden`}>
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <h4 className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">MEDIA LIBRARY</h4>
                <button
                  onClick={() => {
                    const url = prompt('Enter media URL:');
                    if (url) addMedia(url);
                  }}
                  className="px-3 py-1.5 bg-emerald-900 text-emerald-300 border border-emerald-800 rounded-lg font-mono text-[9px] tracking-widest font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
                >
                  ADD MEDIA
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                {mediaLibrary.length === 0 ? (
                  <div className="col-span-full text-center text-zinc-500 py-8">No media yet</div>
                ) : (
                  mediaLibrary.map((m) => (
                    <div key={m.id} className="relative group">
                      <img
                        src={m.file_url}
                        alt={m.file_name}
                        className="w-full aspect-square object-cover rounded-lg bg-zinc-900"
                      />
                      <button
                        onClick={() => deleteMedia(m.id)}
                        className="absolute top-2 right-2 p-1.5 bg-rose-900/80 text-rose-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <p className="text-xs text-zinc-400 mt-1 truncate">{m.file_name}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className={`${themeStyles.bgCard} border border-zinc-800 rounded-2xl overflow-hidden`}>
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <h4 className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">ANNOUNCEMENTS</h4>
                <button
                  onClick={() => {
                    const title = prompt('Announcement title:');
                    if (title) addAnnouncement({ title, content: '', type: 'general', is_active: true });
                  }}
                  className="px-3 py-1.5 bg-emerald-900 text-emerald-300 border border-emerald-800 rounded-lg font-mono text-[9px] tracking-widest font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
                >
                  ADD ANNOUNCEMENT
                </button>
              </div>
              <div className="divide-y divide-zinc-800">
                {announcements.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500">No announcements yet</div>
                ) : (
                  announcements.map((a) => (
                    <div key={a.id} className="p-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-white">{a.title}</p>
                        <p className="text-xs text-zinc-500 mt-1">
                          {a.type} • {a.is_active ? 'Active' : 'Inactive'}
                        </p>
                        {a.content && <p className="text-xs text-zinc-400 mt-2">{a.content}</p>}
                      </div>
                      <button
                        onClick={() => deleteAnnouncement(a.id)}
                        className="p-1.5 bg-rose-900 hover:bg-rose-800 text-rose-300 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Discord Settings Tab */}
          {activeTab === 'discord' && (
            <div className={`${themeStyles.bgCard} border border-zinc-800 rounded-2xl overflow-hidden`}>
              <div className="p-4 border-b border-zinc-800">
                <h4 className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">DISCORD SETTINGS</h4>
              </div>
              <div className="p-4 space-y-4">
                {Object.entries(discordSettings).map(([key, value]: [string, any]) => (
                  key !== 'id' && key !== 'created_at' && key !== 'updated_at' && (
                    <div key={key} className="space-y-1">
                      <label className="text-xs font-mono text-zinc-400 uppercase">{key.replace(/_/g, ' ')}</label>
                      {Array.isArray(value) ? (
                        <input
                          type="text"
                          value={value.join(', ')}
                          onChange={(e) => setDiscordSettings({ ...discordSettings, [key]: e.target.value.split(', ') })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      ) : (
                        <input
                          type="text"
                          value={value || ''}
                          onChange={(e) => setDiscordSettings({ ...discordSettings, [key]: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      )}
                    </div>
                  )
                ))}
                <button
                  onClick={() => handleSaveSettings('discord', discordSettings)}
                  className="w-full px-4 py-2 bg-rose-900 hover:bg-rose-800 text-rose-200 border border-rose-800 rounded-lg font-mono text-[10px] tracking-widest font-bold transition-colors cursor-pointer"
                >
                  SAVE DISCORD SETTINGS
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`${themeStyles.bgCard} border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto`}>
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h3 className="font-mono text-sm font-bold text-white uppercase">
                {editingProduct ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
              </h3>
              <button
                onClick={() => {
                  setShowProductModal(false);
                  setEditingProduct(null);
                  setProductForm({
                    name: '', description: '', short_description: '', price: '', sale_price: '',
                    stock_quantity: '', sku: '', barcode: '', brand: '', categories: [],
                    tags: [], sizes: [], colors: []
                  });
                }}
                className="text-zinc-400 hover:text-white"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {[
                'name', 'description', 'short_description', 'price', 'sale_price',
                'stock_quantity', 'sku', 'barcode', 'brand'
              ].map((field) => (
                <div key={field} className="space-y-1">
                  <label className="text-xs font-mono text-zinc-400 uppercase">{field.replace(/_/g, ' ')}</label>
                  {['description', 'short_description'].includes(field) ? (
                    <textarea
                      value={productForm[field as keyof typeof productForm] || ''}
                      onChange={(e) => setProductForm({ ...productForm, [field]: e.target.value })}
                      rows={3}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={productForm[field as keyof typeof productForm] || ''}
                      onChange={(e) => setProductForm({ ...productForm, [field]: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  )}
                </div>
              ))}
              {['categories', 'tags', 'sizes', 'colors'].map((field) => (
                <div key={field} className="space-y-1">
                  <label className="text-xs font-mono text-zinc-400 uppercase">{field} (comma-separated)</label>
                  <input
                    type="text"
                    value={(productForm[field as keyof typeof productForm] as string[]).join(', ') || ''}
                    onChange={(e) => setProductForm({
                      ...productForm,
                      [field]: e.target.value.split(', ').filter(v => v)
                    })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              ))}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={handleSaveProduct}
                  className="flex-1 px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border border-emerald-800 rounded-lg font-mono text-[10px] tracking-widest font-bold transition-colors cursor-pointer"
                >
                  SAVE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

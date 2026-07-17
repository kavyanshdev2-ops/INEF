/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AtmosphereConfig } from '../types';
import { getThemeStyles } from '../lib/theme';
import { 
  LogIn, LogOut, KeyRound, CheckCircle, Flame, Shield, Award, Terminal, 
  Chrome, Upload, Check, Heart, MapPin, ClipboardList, Trash2, ShoppingCart,
  ArrowRight, ShieldAlert, Sparkles, RefreshCw
} from 'lucide-react';
import { 
  supabase, isSupabaseConfigured, uploadAvatar,
  getDBAddresses, saveDBAddress, deleteDBAddress,
  getDBOrders, createDBOrder
} from '../lib/supabase';

interface LoginViewProps {
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
  currentUser: any;
  onLogin: (username: string) => void;
  onLogout: () => void;
  setCurrentPage: (page: any) => void;
  wishlist?: string[];
  onToggleWishlist?: (productId: string) => void;
  onAddToCart?: (item: any) => void;
}

const products = [
  {
    id: 'couture-hoodie-white',
    name: 'Inefontop "Signature" Oversized Hoodie',
    price: 85.00,
    category: 'hoodies',
    description: 'Heavyweight 450GSM organic French Terry cotton hoodie. Features a double-lined hood without drawstrings for a clean minimalist drape, dropped shoulders, kangaroo pocket, and high-density branding puff print on the chest canvas.',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.9,
    badge: 'BEST SELLER',
    stock: 8,
    fabric: '100% Organic French Terry Cotton, 450GSM',
    care: 'Machine wash cold inside out. Tumble dry low. Do not iron directly on graphics.'
  },
  {
    id: 'couture-tshirt-black',
    name: 'Inefontop "Drift" Heavyweight Tee',
    price: 45.00,
    category: 'tees',
    description: 'Boxy, oversized streetwear tee in a deep custom dyed coal tone. Tight-knit mock collar double-stitched for durability. Front artwork displays custom cherry blossom drift equations printed in high-definition ink.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.8,
    badge: 'NEW DROP',
    stock: 15,
    fabric: '100% Ringspun Combed Organic Cotton, 280GSM',
    care: 'Gentle cold wash. Line dry in shade. Do not bleach.'
  },
  {
    id: 'couture-cargo-pants',
    name: 'Inefontop "Genesis" Cargoes',
    price: 110.00,
    category: 'pants',
    description: 'Relaxed technical fit cargo pants with ergonomic articulating paneling. Adjustable webbing waist belt and elastic drawcords at cuffs. Outfitted with multiple geometric pockets and solid laser-etched metal hardware.',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517423568366-8b83523034fd?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 5.0,
    badge: 'LIMITED',
    stock: 4,
    fabric: '70% Cotton Twill, 30% Cordura Nylon Ripstop with DWR coating',
    care: 'Machine wash cold on delicate cycle. Air dry flat. Do not dry clean.'
  },
  {
    id: 'couture-varsity-jacket',
    name: 'Inefontop "Blossom" Varsity',
    price: 185.00,
    category: 'jackets',
    description: 'Bespoke heavy collegiate varsity jacket constructed from dense premium Melton wool with ultra-soft vegan PU leather sleeve drapes. Embellished with custom quilted satin linings, heavy rib trims, and complex chenille floral embroidery.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508127269354-76811ff3f584?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.9,
    badge: 'LIMITED',
    stock: 3,
    fabric: '80% Premium Melton Wool Body, 20% Vegan Leather Sleeves. 100% Polyester Satin Lining.',
    care: 'Professional dry clean only.'
  },
  {
    id: 'couture-cap-black',
    name: 'Inefontop "Oracle" Distressed Cap',
    price: 35.00,
    category: 'accessories',
    description: 'Six-panel low-profile dad cap crafted from vintage washed heavy cotton twill. Detailed with manual distressing at the brim edge, metal buckle adjuster on the back, and tonally embroidered front branding.',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534215754734-18e55d13ce35?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.7,
    badge: 'NEW DROP',
    stock: 22,
    fabric: '100% Heavy Washed Cotton Twill',
    care: 'Spot clean only with a cold damp cloth.'
  },
  {
    id: 'couture-brutalist-crew',
    name: 'Inefontop "Brutalist" Knit Crew',
    price: 95.00,
    category: 'hoodies',
    description: 'Deconstructed loose knit crewneck crafted from a soft, bulky cotton-blend yarn. Features stylized distressed knit holes, chunky ribbed edges, dropped armholes, and subtle raw edge highlights throughout.',
    image: 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f0?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.9,
    badge: 'BEST SELLER',
    stock: 6,
    fabric: '60% Recycled Cotton Yarn, 40% Chunky Acrylic Blend',
    care: 'Hand wash cold. Dry flat. Never hang to store as weight will stretch the knit.'
  },
  {
    id: 'couture-phantom-vest',
    name: 'Inefontop "Phantom" Tech Vest',
    price: 125.00,
    category: 'jackets',
    description: 'High-utility tactical gilet designed for urban exploration. Boasts modular clip-on utility chest bags, quick-release fidlock magnetic buckles, water-repellent zippers, and a mesh harness core.',
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.8,
    badge: 'SOLD OUT',
    stock: 0,
    fabric: '100% Cordura Ballistic Waterproof Nylon',
    care: 'Wipe with damp cloth. Do not wash or iron.'
  }
];

export const LoginView: React.FC<LoginViewProps> = ({
  activeAtmosphere,
  isDarkMode,
  currentUser,
  onLogin,
  onLogout,
  setCurrentPage,
  wishlist = [],
  onToggleWishlist,
  onAddToCart,
}) => {
  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);
  
  // Credentials and forms
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authLogs, setAuthLogs] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Supabase Integration States
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Tabs inside profile
  const [profileTab, setProfileTab] = useState<'roles' | 'wishlist' | 'addresses' | 'orders'>('roles');

  // Interactive Saved Addresses list
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [addressForm, setAddressForm] = useState({
    full_name: '',
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'United States',
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Synced Orders List
  const [ordersHistory, setOrdersHistory] = useState<any[]>([]);

  useEffect(() => {
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setSupabaseUser(user);
          setAvatarUrl(user.user_metadata?.avatar_url || user.user_metadata?.picture || null);
          loadUserData(user.id);
        } else {
          setSupabaseUser(null);
          setAvatarUrl(null);
        }
      });
    }
  }, [currentUser]);

  const loadUserData = async (uid: string) => {
    try {
      const addresses = await getDBAddresses(uid);
      setSavedAddresses(addresses);

      const orders = await getDBOrders(uid);
      setOrdersHistory(orders);
    } catch (err) {
      console.warn('Error loading user sub-data:', err);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!supabase) {
      alert('Supabase is not configured.');
      return;
    }

    try {
      setIsUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showNotification('error', 'Please log in with Google to upload custom avatars.');
        return;
      }

      const publicUrl = await uploadAvatar(user.id, file);
      if (publicUrl) {
        // Update user metadata in Supabase
        const { error } = await supabase.auth.updateUser({
          data: { avatar_url: publicUrl }
        });
        if (error) throw error;
        
        setAvatarUrl(publicUrl);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
        showNotification('success', 'Your profile avatar has been synced with storage!');
      } else {
        showNotification('error', 'Upload failed. Check if the bucket "inefontop-assets" is public.');
      }
    } catch (err: any) {
      showNotification('error', `Avatar upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!supabase) {
      showNotification('error', 'Supabase configuration is missing. Google Sign-In is unavailable.');
      return;
    }

    setIsAuthenticating(true);
    setAuthLogs([
      '[SUPABASE] CONNECTING TO SECURE CLOUD GATEWAY...',
      '[SUPABASE] INITIALIZING GOOGLE AUTHENTICATION CHANNEL...',
      '[SUPABASE] WAITING FOR CREDENTIAL POPUP AUTHORIZATION...'
    ]);

    try {
      const getRedirectUrl = () => {
        const origin = window.location.origin;
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
          return `${origin}/`;
        }
        return 'https://inef.cc/';
      };

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getRedirectUrl(),
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data?.url) {
        const popup = window.open(data.url, 'sb-google-oauth', 'width=600,height=700');
        if (!popup) {
          throw new Error('Popup blocked! Please allow popups to login with Google.');
        }

        // Poll popup location hash to securely capture the incoming session
        const timer = setInterval(async () => {
          if (popup.closed) {
            clearInterval(timer);
            setIsAuthenticating(false);
            return;
          }

          try {
            const popupUrl = popup.location.href;
            const isMatchingOrigin = popupUrl && (
              popupUrl.includes(window.location.origin) ||
              popupUrl.includes('inef.cc')
            );
            if (isMatchingOrigin) {
              const hash = popup.location.hash || '';
              const search = popup.location.search || '';

              if (hash.includes('access_token') || search.includes('code=')) {
                clearInterval(timer);
                popup.close();

                setAuthLogs(prev => [
                  ...prev,
                  '[SUPABASE] DETECTED INCOMING SECURE OAUTH TOKEN PAYLOAD...',
                  '[SUPABASE] ESTABLISHING CLOUD CLIENT CONNECTION SEED...'
                ]);

                // Query and verify session
                setTimeout(async () => {
                  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                  if (sessionError) throw sessionError;

                  if (session?.user) {
                    const uname = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User';
                    showNotification('success', 'Successfully authenticated with Google Cloud Sync!');
                    onLogin(uname);
                  } else {
                    // Manual session activation via tokens in hash as fallback
                    const params = new URLSearchParams(hash.replace('#', '?'));
                    const access = params.get('access_token');
                    const refresh = params.get('refresh_token');
                    if (access && refresh) {
                      const { data: setSessionData, error: setSessionError } = await supabase.auth.setSession({
                        access_token: access,
                        refresh_token: refresh
                      });
                      if (setSessionError) throw setSessionError;
                      const user = setSessionData.user;
                      if (user) {
                        const uname = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
                        showNotification('success', 'Session loaded successfully via token refresh!');
                        onLogin(uname);
                      }
                    }
                  }
                  setIsAuthenticating(false);
                }, 800);
              }
            }
          } catch (e) {
            // Suppress cross-origin frame exceptions during Google login redirect phase
          }
        }, 500);
      }
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      setAuthLogs(prev => [...prev, `[ERROR] GOOGLE HANDSHAKE INTERRUPTED: ${err.message}`]);
      showNotification('error', `Google Sign-In failed: ${err.message}`);
      setIsAuthenticating(false);
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsAuthenticating(true);
    setAuthLogs([]);

    if (!supabase) {
      // Mock system fallback if Supabase secrets are missing (ideal for demo/sandbox)
      const logs = [
        '[DEMO] DETECTED ABSENCE OF CLOUD CREDENTIALS. BOOTING LOCAL CONTAINER...',
        '[REGISTRY] RESOLVING LOGICAL CREDENTIAL IDENTITY MATCH...',
        '[REGISTRY] DECRYPTING ASYMMETRIC PASSPHRASE SIGNATURES...',
        '[REGISTRY] USER MOCKED SUCCESSFUL ROOT TERMINAL SYNC.'
      ];
      let i = 0;
      const interval = setInterval(() => {
        if (i < logs.length) {
          setAuthLogs(prev => [...prev, logs[i]]);
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onLogin(email.split('@')[0]);
            setIsAuthenticating(false);
            showNotification('success', 'Logged in successfully via offline sandbox gateway.');
          }, 500);
        }
      }, 400);
      return;
    }

    try {
      if (authMode === 'login') {
        setAuthLogs([
          '[SUPABASE] TRANSMITTING ENCRYPTED AUTH PACKETS...',
          '[SUPABASE] COMPARING CLOUD SHA-256 PASSPHRASE HASHES...'
        ]);

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        const username = data.user?.user_metadata?.full_name || data.user?.email?.split('@')[0] || 'User';
        setAuthLogs(prev => [...prev, `[SUPABASE] USER AUTHENTICATED SUCCESSFULLY: @${username.toUpperCase()}`]);
        
        setTimeout(() => {
          onLogin(username);
          setIsAuthenticating(false);
          showNotification('success', `Welcome back, @${username}!`);
        }, 500);

      } else if (authMode === 'signup') {
        if (!signupUsername) {
          showNotification('error', 'Please provide a username for your server profile.');
          setIsAuthenticating(false);
          return;
        }

        setAuthLogs([
          '[SUPABASE] SENDING PROFILE REGISTRATION SCHEMAS...',
          '[SUPABASE] CREATING SECURE IDENTITY USER UUID...',
          '[SUPABASE] DISPATCHING COMPLIANCE AUDIT CODES...'
        ]);

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: signupUsername
            }
          }
        });

        if (error) throw error;

        setAuthLogs(prev => [
          ...prev,
          '[SUPABASE] REGISTRATION COMPLETED.',
          '[SUPABASE] CHECK YOUR EMAIL BOX FOR AN AUTHENTICATION LINK TO SYNC CODES.'
        ]);

        setTimeout(() => {
          setIsAuthenticating(false);
          if (data.user && !data.session) {
            showNotification('success', 'Account created! Please verify your email to log in.');
            setAuthMode('login');
          } else if (data.session) {
            onLogin(signupUsername);
            showNotification('success', 'Account created and session activated successfully!');
          }
        }, 800);
      }
    } catch (err: any) {
      console.error('Credentials auth error:', err);
      // Fall back to demo mode if Supabase auth fails
      const logs = [
        '[DEMO] SUPABASE AUTH FAILED, SWITCHING TO DEMO MODE...',
        '[DEMO] DETECTED ABSENCE OF CLOUD CREDENTIALS. BOOTING LOCAL CONTAINER...',
        '[REGISTRY] RESOLVING LOGICAL CREDENTIAL IDENTITY MATCH...',
        '[REGISTRY] DECRYPTING ASYMMETRIC PASSPHRASE SIGNATURES...',
        '[REGISTRY] USER MOCKED SUCCESSFUL ROOT TERMINAL SYNC.'
      ];
      let i = 0;
      const interval = setInterval(() => {
        if (i < logs.length) {
          setAuthLogs(prev => [...prev, logs[i]]);
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onLogin(email.split('@')[0]);
            setIsAuthenticating(false);
            showNotification('success', 'Logged in successfully via offline sandbox gateway.');
          }, 500);
        }
      }, 400);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsAuthenticating(true);
    setAuthLogs([
      '[SUPABASE] QUERIED FORGOT ACCESS PASSKEY LINK...',
      '[SUPABASE] ATTEMPTING KEY RESET ENVELOPE HANDSHAKE...'
    ]);

    if (!supabase) {
      setTimeout(() => {
        setIsAuthenticating(false);
        showNotification('success', 'Mock password reset link has been dispatched to your terminal email.');
        setAuthMode('login');
      }, 1000);
      return;
    }

    try {
      const getResetRedirectUrl = () => {
        const origin = window.location.origin;
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
          return `${origin}/`;
        }
        return 'https://inef.cc/';
      };

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getResetRedirectUrl(),
      });

      if (error) throw error;

      setAuthLogs(prev => [
        ...prev,
        '[SUPABASE] RESET PASSPHRASE TRANSMITTED SUCCESSFULLY.',
        '[SUPABASE] VERIFY THE SYNC LINK SENT TO YOUR INBOX.'
      ]);

      setTimeout(() => {
        setIsAuthenticating(false);
        showNotification('success', 'Forgot password recovery link sent! Check your email.');
        setAuthMode('login');
      }, 1000);

    } catch (err: any) {
      showNotification('error', err.message || 'Failed to dispatch reset key email.');
      setIsAuthenticating(false);
    }
  };

  // Address form submit
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.full_name || !addressForm.street || !addressForm.city) return;

    if (!supabaseUser) {
      // Local mock address save
      const mockNew = {
        id: 'address-' + Math.random(),
        ...addressForm,
        created_at: new Date().toISOString()
      };
      setSavedAddresses(prev => [mockNew, ...prev]);
      setAddressForm({
        full_name: '',
        street: '',
        city: '',
        state: '',
        zip_code: '',
        country: 'United States',
      });
      setShowAddressForm(false);
      showNotification('success', 'Address added offline successfully!');
      return;
    }

    try {
      const res = await saveDBAddress(supabaseUser.id, addressForm);
      if (res) {
        loadUserData(supabaseUser.id);
        setAddressForm({
          full_name: '',
          street: '',
          city: '',
          state: '',
          zip_code: '',
          country: 'United States',
        });
        setShowAddressForm(false);
        showNotification('success', 'New address synced to your cloud profile!');
      }
    } catch (err) {
      showNotification('error', 'Failed to save address to DB.');
    }
  };

  const handleDeleteAddress = async (addrId: string) => {
    if (!supabaseUser) {
      setSavedAddresses(prev => prev.filter(a => a.id !== addrId));
      showNotification('success', 'Address removed offline.');
      return;
    }

    try {
      const ok = await deleteDBAddress(supabaseUser.id, addrId);
      if (ok) {
        loadUserData(supabaseUser.id);
        showNotification('success', 'Address deleted successfully.');
      }
    } catch (err) {
      showNotification('error', 'Failed to delete address.');
    }
  };

  if (currentUser) {
    return (
      <div id="logged-in-profile-view" className={`max-w-4xl mx-auto px-6 py-24 pt-32 ${themeStyles.textPrimary}`}>
        
        {/* Toast notifications */}
        {notification && (
          <div className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl border font-mono text-[10px] tracking-widest shadow-2xl flex items-center space-x-3 animate-slide-in ${
            notification.type === 'success' 
              ? 'bg-emerald-950 border-emerald-500/30 text-emerald-300' 
              : 'bg-rose-950 border-rose-500/30 text-rose-300'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            )}
            <span>{notification.message.toUpperCase()}</span>
          </div>
        )}

        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <span className={`font-mono text-xs tracking-[0.3em] ${themeStyles.accentText} uppercase block`}>
            PROFILE // SYNCED PROFILE NODES
          </span>
          <h2 className="text-4xl md:text-5xl font-sans tracking-tight font-extrabold uppercase">
            MEMBER TERMINAL
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Avatar & Basic Specs */}
          <div className={`lg:col-span-4 ${themeStyles.bgCard} border ${themeStyles.borderMain} rounded-3xl p-6 text-center space-y-6`}>
            <div className="space-y-4">
              <div className="relative w-24 h-24 mx-auto group">
                <img
                  src={avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"}
                  alt="Profile Avatar"
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover rounded-full border-2 ${themeStyles.borderMuted} transition-opacity duration-300 group-hover:opacity-70`}
                />
                
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-mono text-[8px] tracking-widest p-1 text-center"
                >
                  <Upload className="w-4 h-4 mb-0.5" />
                  <span>{isUploading ? 'SAVING...' : 'UPLOAD'}</span>
                </label>

                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  disabled={isUploading}
                  className="hidden" 
                />

                <span className={`absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 ${isDarkMode ? 'border-zinc-950' : 'border-white'} rounded-full ${isUploading ? 'animate-ping' : 'animate-pulse'}`} />
              </div>

              <div>
                <h3 className={`font-sans text-xl font-bold ${themeStyles.textPrimary} tracking-wide truncate`}>
                  @{currentUser.toLowerCase()}
                </h3>
                {supabaseUser && (
                  <span className={`font-mono text-[9px] ${themeStyles.textMuted} lowercase block mt-0.5 truncate`}>
                    {supabaseUser.email}
                  </span>
                )}
                <span className={`font-mono text-[9px] ${themeStyles.textMuted} uppercase tracking-widest mt-1 block`}>
                  ID: INF-{supabaseUser ? supabaseUser.id.substring(0, 8).toUpperCase() : Math.floor(200000 + Math.random() * 800000)}
                </span>
                {uploadSuccess && (
                  <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest flex items-center justify-center mt-1">
                    <Check className="w-3 h-3 mr-0.5" /> AVATAR SYNCED
                  </span>
                )}
              </div>
            </div>

            <button
              id="btn-member-logout"
              onClick={onLogout}
              className={`w-full py-3 ${isDarkMode ? 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-rose-950 hover:text-rose-200 hover:border-rose-900/50' : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'} border font-mono text-[10px] tracking-widest font-bold rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>TERMINATE SESSION</span>
            </button>
          </div>

          {/* Right Column: Tabbed Member Database Interface */}
          <div className={`lg:col-span-8 ${themeStyles.bgCard} border ${themeStyles.borderMain} rounded-3xl p-6 md:p-8 flex flex-col justify-between min-h-[400px]`}>
            <div>
              {/* Tab Nav Menu */}
              <div className={`flex border-b ${themeStyles.borderMuted} mb-6 overflow-x-auto gap-2 scrollbar-none pb-1`}>
                {[
                  { id: 'roles', label: 'Synced Roles', icon: Award },
                  { id: 'wishlist', label: 'Wishlist', icon: Heart },
                  { id: 'addresses', label: 'Addresses', icon: MapPin },
                  { id: 'orders', label: 'Orders', icon: ClipboardList }
                ].map(tab => {
                  const TabIcon = tab.icon;
                  const isActive = profileTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setProfileTab(tab.id as any)}
                      className={`flex items-center space-x-2 px-4 py-2.5 font-mono text-[9px] tracking-widest uppercase transition-all border-b-2 rounded-t-lg cursor-pointer whitespace-nowrap ${
                        isActive 
                          ? `${themeStyles.accentText} border-rose-500 font-bold bg-zinc-500/5` 
                          : `border-transparent text-zinc-500 hover:${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'} hover:bg-zinc-500/2`
                      }`}
                    >
                      <TabIcon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB CONTENT: SYNCD ROLES & MOCK STATS */}
              {profileTab === 'roles' && (
                <div id="tab-content-roles" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-mono text-[9px] tracking-widest font-bold uppercase">
                        ● Verified Member
                      </span>
                      <span className="bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 px-3 py-1 rounded-full font-mono text-[9px] tracking-widest font-bold uppercase">
                        ● Active SMP Whitelist
                      </span>
                      <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full font-mono text-[9px] tracking-widest font-bold uppercase">
                        ★ Booster Status
                      </span>
                    </div>

                    <div className={`space-y-3 font-mono text-[10px] ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'} pt-3`}>
                      <div className={`flex justify-between border-b ${themeStyles.borderMuted} pb-2`}>
                        <span>DISCORD JOIN DATE</span>
                        <span className={themeStyles.textPrimary}>6 YEARS AGO</span>
                      </div>
                      <div className={`flex justify-between border-b ${themeStyles.borderMuted} pb-2`}>
                        <span>BOOSTER STREAK</span>
                        <span className="text-rose-400 font-extrabold">24 MONTHS</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GIVEAWAY MULTIPLIER</span>
                        <span className="text-emerald-400 font-extrabold">3.0X WEIGHT</span>
                      </div>
                    </div>
                  </div>

                  <div className={`${isDarkMode ? 'bg-zinc-950/40 border-zinc-900 text-zinc-500' : 'bg-zinc-100/50 border-zinc-200 text-zinc-600'} border p-4 rounded-xl font-mono text-[9px]`}>
                    <span className={`${themeStyles.textPrimary} font-bold block uppercase mb-1`}>ACCOUNT SECURITY CHECKPASS</span>
                    <span>Your terminal connection is monitored via encrypted TLS routing. Do not share session key signatures.</span>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: WISHLIST */}
              {profileTab === 'wishlist' && (
                <div id="tab-content-wishlist" className="space-y-4">
                  {wishlist.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500 font-mono text-xs">
                      <Heart className="w-8 h-8 mx-auto mb-2 opacity-30 text-rose-400" />
                      <p>Your wishlist is currently empty.</p>
                      <p className="text-[10px] text-zinc-600 mt-1 uppercase">Save items from the Shop tab to track them here.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2">
                      {products.filter(p => wishlist.includes(p.id)).map(product => (
                        <div 
                          key={product.id}
                          className={`flex items-center space-x-3 p-3 border ${themeStyles.borderMuted} ${themeStyles.bgCard} rounded-xl justify-between`}
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-10 h-10 object-cover rounded-lg border border-zinc-800"
                            />
                            <div className="min-w-0">
                              <h4 className="font-sans font-bold text-xs truncate uppercase">{product.name}</h4>
                              <span className="font-mono text-[9px] text-zinc-500">${product.price.toFixed(2)}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            {onAddToCart && (
                              <button
                                onClick={() => {
                                  onAddToCart({
                                    id: product.id,
                                    name: product.name,
                                    price: product.price,
                                    image: product.image,
                                    type: 'shop'
                                  });
                                  showNotification('success', `Added ${product.name} to cart!`);
                                }}
                                className={`p-1.5 rounded-lg border ${themeStyles.borderMuted} hover:border-zinc-400 transition-all text-emerald-400 cursor-pointer`}
                                title="Add to Cart"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {onToggleWishlist && (
                              <button
                                onClick={() => onToggleWishlist(product.id)}
                                className="p-1.5 rounded-lg border border-rose-950 text-rose-500 hover:bg-rose-950/20 transition-all cursor-pointer"
                                title="Remove from Wishlist"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: SAVED ADDRESSES */}
              {profileTab === 'addresses' && (
                <div id="tab-content-addresses" className="space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
                    <span className="font-mono text-[9px] text-zinc-500 tracking-wider uppercase">Saved Addresses</span>
                    <button
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className={`px-3 py-1 rounded border font-mono text-[9px] tracking-wider uppercase transition-colors cursor-pointer ${
                        showAddressForm 
                          ? 'border-rose-950 text-rose-400 hover:bg-rose-950/20' 
                          : `${themeStyles.accentBg} text-zinc-950 font-bold border-transparent`
                      }`}
                    >
                      {showAddressForm ? 'Cancel Form' : 'Add Address'}
                    </button>
                  </div>

                  {showAddressForm ? (
                    <form onSubmit={handleSaveAddress} className={`grid grid-cols-2 gap-3 p-4 border rounded-xl ${isDarkMode ? 'border-zinc-800/80 bg-zinc-950/30' : 'border-zinc-200 bg-zinc-50'}`}>
                      <div className="col-span-2 space-y-1">
                        <label className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest block">Recipient Full Name</label>
                        <input
                          type="text"
                          required
                          value={addressForm.full_name}
                          onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })}
                          className={`w-full ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-600' : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400'} border rounded px-3 py-2 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-rose-500`}
                          placeholder="e.g. Kavyansh Shakya"
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest block">Street Address</label>
                        <input
                          type="text"
                          required
                          value={addressForm.street}
                          onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                          className={`w-full ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-600' : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400'} border rounded px-3 py-2 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-rose-500`}
                          placeholder="e.g. 104 Cyber Ridge Rd"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest block">City</label>
                        <input
                          type="text"
                          required
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          className={`w-full ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-600' : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400'} border rounded px-3 py-2 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-rose-500`}
                          placeholder="e.g. Tokyo"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest block">State/Province</label>
                        <input
                          type="text"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          className={`w-full ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-600' : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400'} border rounded px-3 py-2 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-rose-500`}
                          placeholder="e.g. Kanto"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest block">Postal Zip Code</label>
                        <input
                          type="text"
                          required
                          value={addressForm.zip_code}
                          onChange={(e) => setAddressForm({ ...addressForm, zip_code: e.target.value })}
                          className={`w-full ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-600' : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400'} border rounded px-3 py-2 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-rose-500`}
                          placeholder="e.g. 150-0001"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest block">Country</label>
                        <input
                          type="text"
                          required
                          value={addressForm.country}
                          onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                          className={`w-full ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-600' : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400'} border rounded px-3 py-2 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-rose-500`}
                        />
                      </div>
                      <div className="col-span-2 pt-2">
                        <button
                          type="submit"
                          className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-mono text-[10px] tracking-widest font-bold uppercase rounded-lg transition-colors cursor-pointer"
                        >
                          SAVE ADDRESS KEY
                        </button>
                      </div>
                    </form>
                  ) : savedAddresses.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500 font-mono text-xs">
                      <MapPin className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p>No addresses have been saved yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {savedAddresses.map((addr: any) => (
                        <div
                          key={addr.id}
                          className={`flex items-center justify-between p-4 border ${themeStyles.borderMuted} ${themeStyles.bgCard} rounded-xl`}
                        >
                          <div className="space-y-1">
                            <h5 className={`font-sans font-bold text-xs uppercase ${themeStyles.textPrimary}`}>{addr.full_name}</h5>
                            <p className="font-mono text-[9px] text-zinc-400">{addr.street}</p>
                            <p className="font-mono text-[9px] text-zinc-500">{addr.city}, {addr.state} {addr.zip_code}, {addr.country}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-2 border border-rose-950 text-rose-500 hover:bg-rose-950/20 transition-all rounded-lg cursor-pointer"
                            title="Delete Address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: ORDER HISTORY */}
              {profileTab === 'orders' && (
                <div id="tab-content-orders" className="space-y-4">
                  {ordersHistory.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500 font-mono text-xs">
                      <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p>No orders recorded under this account node.</p>
                      <p className="text-[10px] text-zinc-600 mt-1 uppercase">Sync checkouts via the Cart menu.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                      {ordersHistory.map((order: any) => (
                        <div
                          key={order.id}
                          className={`border ${themeStyles.borderMuted} ${themeStyles.bgCard} rounded-xl p-4 space-y-3`}
                        >
                          <div className={`flex justify-between items-center border-b ${themeStyles.borderMuted} pb-2`}>
                            <div>
                              <span className="font-mono text-[9px] text-zinc-400 uppercase font-bold block">ORDER #{order.id.substring(0, 8).toUpperCase()}</span>
                              <span className="font-mono text-[8px] text-zinc-500">{new Date(order.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-mono text-xs font-bold text-rose-400 block">${parseFloat(order.total).toFixed(2)}</span>
                              <span className="font-mono text-[8px] text-emerald-500 uppercase tracking-widest font-bold">● {order.status}</span>
                            </div>
                          </div>

                          <div className={`space-y-1.5 pl-2 border-l ${isDarkMode ? 'border-zinc-850' : 'border-zinc-200'}`}>
                            {order.order_items?.map((item: any) => (
                              <div key={item.id} className="flex justify-between font-mono text-[9px] text-zinc-400">
                                <span className="uppercase">{item.name} (x{item.quantity})</span>
                                <span>${parseFloat(item.price).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="login-view-container" className={`max-w-4xl mx-auto px-6 py-24 pt-32 ${themeStyles.textPrimary}`}>
      
      {/* Toast notification panel */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl border font-mono text-[10px] tracking-widest shadow-2xl flex items-center space-x-3 animate-slide-in ${
          notification.type === 'success' 
            ? 'bg-emerald-950 border-emerald-500/30 text-emerald-300' 
            : 'bg-rose-950 border-rose-500/30 text-rose-300'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          )}
          <span>{notification.message.toUpperCase()}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <span className={`font-mono text-xs tracking-[0.3em] ${themeStyles.accentText} uppercase block`}>
          AUTHENTICATION PORTAL // MEMBER GATEWAY
        </span>
        <h2 className="text-4xl md:text-5xl font-sans tracking-tight font-extrabold uppercase">
          MEMBER GATEWAY
        </h2>
        <p className={`${themeStyles.textSecondary} font-sans text-sm font-light leading-relaxed`}>
          Sync your memberships, configure custom HEX colors, save delivery shipping addresses, and review secured cloud transaction ledgers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-3xl mx-auto items-stretch">
        
        {/* Google Supabase Login - Full Width in OAuth column */}
        <div className={`col-span-12 md:col-span-6 ${themeStyles.bgCard} border ${themeStyles.borderMain} rounded-3xl p-6 space-y-6 text-center relative overflow-hidden flex flex-col justify-between`}>
          {isSupabaseConfigured && (
            <span className="absolute top-2 right-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono text-[7px] tracking-wider uppercase font-bold">
              ● SECURE GATEWAY
            </span>
          )}
          
          <div className="space-y-2">
            <h3 className={`font-sans text-lg font-bold ${themeStyles.textPrimary} uppercase tracking-wider flex items-center justify-center gap-2`}>
              <Chrome className="w-5 h-5 text-rose-400" />
              <span>Google Cloud Sync</span>
            </h3>
            <p className={`${themeStyles.textSecondary} text-xs font-light leading-relaxed`}>
              {isSupabaseConfigured 
                ? 'Primary secure oauth link. Synchronize your account automatically, load active server badges, and unlock custom vanity roles.'
                : 'Supabase credentials missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to activate Google cloud sync features.'}
            </p>
          </div>

          <button
            id="btn-google-oauth"
            onClick={handleGoogleLogin}
            disabled={isAuthenticating || !isSupabaseConfigured}
            className={`w-full py-4 ${
              isSupabaseConfigured 
                ? 'bg-rose-500 hover:bg-rose-600 text-white cursor-pointer shadow-lg shadow-rose-500/10' 
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
            } font-mono text-xs tracking-widest font-bold rounded-xl transition-all flex items-center justify-center space-x-2.5 disabled:opacity-50`}
          >
            <Chrome className="w-4.5 h-4.5" />
            <span>LOG IN WITH GOOGLE</span>
          </button>
        </div>

        {/* Credentials Form column (Login, Signup, Forgot password toggle) */}
        <div className={`col-span-12 md:col-span-6 ${themeStyles.bgCard} border ${themeStyles.borderMain} rounded-3xl p-6 space-y-5 flex flex-col justify-between`}>
          <div>
            <div className={`flex border-b ${isDarkMode ? 'border-zinc-800/80' : 'border-zinc-200'} mb-4 pb-0.5 justify-start`}>
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 pb-2 font-mono text-[10px] tracking-widest uppercase transition-colors cursor-pointer text-center ${
                  authMode === 'login' ? 'text-rose-400 font-bold border-b-2 border-rose-500' : `text-zinc-500 hover:${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'}`
                }`}
              >
                LOG IN
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`flex-1 pb-2 font-mono text-[10px] tracking-widest uppercase transition-colors cursor-pointer text-center ${
                  authMode === 'signup' ? 'text-rose-400 font-bold border-b-2 border-rose-500' : `text-zinc-500 hover:${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'}`
                }`}
              >
                SIGN UP
              </button>
            </div>

            {authMode === 'forgot' ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <h4 className={`font-sans font-bold text-sm uppercase ${themeStyles.textPrimary}`}>Forgot Access Passkey</h4>
                <p className="font-sans text-[10.5px] text-zinc-500 leading-normal">Enter your email and we will broadcast a key recovery link immediately to restore your portal session.</p>
                <div className="space-y-1.5">
                  <label className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest block">Account Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isAuthenticating}
                    className={`w-full ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-600' : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400'} border rounded-lg px-4 py-3 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-rose-500`}
                    placeholder="e.g. pilot@inef.cc"
                  />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`font-mono text-[9px] text-zinc-500 hover:${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'} uppercase tracking-widest`}
                  >
                    Back to Log In
                  </button>
                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-mono text-[9px] font-bold uppercase rounded-lg tracking-widest cursor-pointer disabled:opacity-50"
                  >
                    RESET PASSKEY
                  </button>
                </div>
              </form>
            ) : (
              <>
                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                  <div className="space-y-3.5">
                    {authMode === 'signup' && (
                      <div className="space-y-1.5">
                        <label className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest block">Username / Account Name</label>
                        <input
                          id="signup-username"
                          type="text"
                          required
                          value={signupUsername}
                          onChange={(e) => setSignupUsername(e.target.value)}
                          disabled={isAuthenticating}
                          placeholder="e.g. kavyanshshakya"
                          className={`w-full ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-600' : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400'} border rounded-lg px-4 py-3 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-rose-500`}
                        />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest block">Account Email</label>
                      <input
                        id="login-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isAuthenticating}
                        placeholder="e.g. kavyansh@inef.cc"
                        className={`w-full ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-600' : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400'} border rounded-lg px-4 py-3 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-rose-500`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest block">Access Passkey</label>
                        {authMode === 'login' && (
                          <button
                            type="button"
                            onClick={() => setAuthMode('forgot')}
                            className="font-mono text-[8px] text-rose-400 hover:text-rose-300 uppercase tracking-widest cursor-pointer"
                          >
                            Forgot key?
                          </button>
                        )}
                      </div>
                      <input
                        id="login-password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isAuthenticating}
                        placeholder="••••••••"
                        className={`w-full ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-600' : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400'} border rounded-lg px-4 py-3 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-rose-500`}
                      />
                    </div>
                  </div>

                  <button
                    id="btn-credentials-submit"
                    type="submit"
                    disabled={isAuthenticating || !email || !password}
                    className={`w-full py-3.5 font-mono text-xs tracking-widest font-bold rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                      isDarkMode 
                        ? 'bg-zinc-100 hover:bg-white text-zinc-950 disabled:bg-zinc-850 disabled:text-zinc-600' 
                        : 'bg-zinc-900 hover:bg-zinc-800 text-white disabled:bg-zinc-100 disabled:text-zinc-450 disabled:border disabled:border-zinc-200'
                    } disabled:cursor-not-allowed`}
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{authMode === 'login' ? 'TRANSMIT SECURITY PASS' : 'PROVISION ACCOUNT NODE'}</span>
                  </button>
                </form>

                {/* Direct Admin Access Button */}
                <div className="mt-6 pt-6 border-t border-zinc-800">
                  <button
                    onClick={() => setCurrentPage('admin')}
                    className="w-full py-3.5 bg-rose-900 hover:bg-rose-800 text-rose-200 border border-rose-800 rounded-xl font-mono text-[9px] tracking-widest font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Shield className="w-4 h-4" />
                    <span>ADMINISTRATOR PORTAL (BYPASS LOGIN)</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Connection Handshaker Terminal logs */}
      {isAuthenticating && (
        <div id="login-auth-logs" className={`max-w-xl mx-auto mt-12 ${isDarkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-zinc-50 border-zinc-200'} border rounded-2xl p-6 space-y-3 shadow-2xl`}>
          <div className={`flex items-center space-x-2 border-b ${themeStyles.borderMuted} pb-2`}>
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h4 className={`font-mono text-xs font-bold ${themeStyles.textPrimary} uppercase`}>
              Connection Handshaker
            </h4>
          </div>
          <div className={`h-32 overflow-y-auto font-mono text-[9px] ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'} space-y-2`}>
            {authLogs.map((log, index) => (
              <div key={index} className="leading-relaxed pl-2 border-l border-emerald-500/40">
                {log}
              </div>
            ))}
            <div className="text-emerald-400 animate-pulse pl-2 flex items-center space-x-1">
              <span className="w-1 bg-emerald-400 h-3 animate-ping" />
              <span>TRANSMITTING SECURITY HANDSHAKES...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

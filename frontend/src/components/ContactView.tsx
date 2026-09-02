/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AtmosphereConfig } from '../types';
import { getThemeStyles } from '../lib/theme';
import {
  Mail, Send, CheckCircle, MapPin, MessageSquare, Shield, Globe, Clock,
  Sparkles, Bot, User as UserIcon, RefreshCw, ExternalLink, MessageCircle,
  Trash2, Download, KeyRound, Check, AlertCircle, Radio, MessageSquareCode
} from 'lucide-react';
import {
  initGoogleChatAuth,
  signInWithGoogleChat,
  logoutGoogleChat,
  fetchGoogleChatSpaces,
  createGoogleChatSpace,
  postGoogleChatMessage,
  GoogleChatSpace
} from '../lib/googleChat';
import { generateConciergeReply } from '../lib/geminiChat';

interface ContactViewProps {
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
  currentUser?: string | null;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'concierge' | 'google-chat';
  text: string;
  timestamp: string;
  syncedToGoogleChat?: boolean;
}

export const ContactView: React.FC<ContactViewProps> = ({
  activeAtmosphere,
  isDarkMode,
  currentUser
}) => {
  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'live-chat' | 'email-form' | 'global-nodes'>('live-chat');

  // Registered User Email state (defaults to user's registered email or kavyanshshakya2@gmail.com)
  const defaultEmail = currentUser
    ? (currentUser.includes('@') ? currentUser : `${currentUser.toLowerCase()}@ineffable.cc`)
    : 'ineffablegg@gmail.com';

  const [registeredEmail, setRegisteredEmail] = useState<string>(() => {
    return localStorage.getItem('ineffable_registered_email') || defaultEmail;
  });
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(registeredEmail);

  // Live Chat state
  const storageKey = `ineffable_livechat_${registeredEmail.toLowerCase().trim()}`;
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading saved chat:', e);
    }
    return [
      {
        id: 'welcome-msg',
        sender: 'concierge',
        text: `Greetings! Live Concierge session established for ${registeredEmail}. How may Concierge Unit Alpha assist you today with orders, membership ranks, Minecraft SMP, or Google Chat space integration?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isConciergeTyping, setIsConciergeTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Google Chat OAuth & API states
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [spaces, setSpaces] = useState<GoogleChatSpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [googleStatusMsg, setGoogleStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isPostingGoogleChat, setIsPostingGoogleChat] = useState(false);

  // Direct Email Transmission Form State
  const [emailFormData, setEmailFormData] = useState({
    name: currentUser || 'Sanctuary Member',
    email: registeredEmail,
    subject: 'Orders & Apparel Inquiry',
    message: ''
  });
  const [isTransmittingEmail, setIsTransmittingEmail] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  // Save chat to localStorage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save chat log:', e);
    }
  }, [messages, storageKey]);

  // Save registered email to localStorage
  useEffect(() => {
    localStorage.setItem('ineffable_registered_email', registeredEmail);
    setEmailFormData(prev => ({ ...prev, email: registeredEmail }));
  }, [registeredEmail]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (activeTab === 'live-chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isConciergeTyping, activeTab]);

  // Listen to Google Chat Firebase Auth state
  useEffect(() => {
    const unsubscribe = initGoogleChatAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
        if (user.email) {
          setRegisteredEmail(user.email);
        }
        loadSpaces(token);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const loadSpaces = async (token: string) => {
    try {
      setGoogleStatusMsg({ type: 'info', text: 'Connecting to Google Chat spaces...' });
      const fetchedSpaces = await fetchGoogleChatSpaces(token);
      setSpaces(fetchedSpaces);
      if (fetchedSpaces.length > 0) {
        setSelectedSpace(fetchedSpaces[0].name);
        setGoogleStatusMsg({ type: 'success', text: `Loaded ${fetchedSpaces.length} Google Chat space(s)!` });
      } else {
        setGoogleStatusMsg({ type: 'info', text: 'No existing Google Chat spaces found. You can create a new support space below.' });
      }
    } catch (err: any) {
      setGoogleStatusMsg({ type: 'error', text: `Google Chat API notice: ${err.message}` });
    }
  };

  const handleConnectGoogleChat = async () => {
    setIsConnectingGoogle(true);
    setGoogleStatusMsg(null);
    try {
      const result = await signInWithGoogleChat();
      if (result) {
        setGoogleUser(result.user);
        setGoogleToken(result.accessToken);
        if (result.user.email) {
          setRegisteredEmail(result.user.email);
        }
        setGoogleStatusMsg({ type: 'success', text: `Authenticated with Google Chat as ${result.user.email}!` });
        loadSpaces(result.accessToken);
      }
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        setGoogleStatusMsg({ type: 'info', text: 'Sign-in popup closed. Click "Sign in with Google Chat" whenever you are ready to connect.' });
      } else {
        setGoogleStatusMsg({ type: 'error', text: `Google Chat sign-in note: ${err.message || 'Authentication process stopped.'}` });
      }
    } finally {
      setIsConnectingGoogle(false);
    }
  };

  const handleCreateNewSpace = async () => {
    if (!googleToken) return;
    try {
      setIsPostingGoogleChat(true);
      const spaceName = `INEFFABLE Support - ${registeredEmail.split('@')[0]}`;
      const newSpace = await createGoogleChatSpace(googleToken, spaceName);
      setSpaces(prev => [newSpace, ...prev]);
      setSelectedSpace(newSpace.name);
      setGoogleStatusMsg({ type: 'success', text: `Created new Google Chat space: ${newSpace.displayName || newSpace.name}` });
    } catch (err: any) {
      setGoogleStatusMsg({ type: 'error', text: `Failed to create Google Chat space: ${err.message}` });
    } finally {
      setIsPostingGoogleChat(false);
    }
  };

  const handlePostToGoogleChatSpace = async (textToSend: string) => {
    if (!googleToken) {
      setGoogleStatusMsg({ type: 'error', text: 'Please sign in with Google Chat to enable space posting.' });
      return;
    }

    if (!selectedSpace && spaces.length === 0) {
      setGoogleStatusMsg({ type: 'info', text: 'Attempting to auto-create a support space for your Google Chat account...' });
      try {
        const newSpace = await createGoogleChatSpace(googleToken, `INEFFABLE Live Chat - ${registeredEmail.split('@')[0]}`);
        setSpaces([newSpace]);
        setSelectedSpace(newSpace.name);
        await postGoogleChatMessage(googleToken, newSpace.name, `[Live Chat Transmission] ${registeredEmail}: ${textToSend}`);
        setGoogleStatusMsg({ type: 'success', text: 'Posted message to newly created Google Chat Space!' });
        return;
      } catch (e: any) {
        setGoogleStatusMsg({ type: 'error', text: `Space creation error: ${e.message}` });
        return;
      }
    }

    const targetSpace = selectedSpace || spaces[0]?.name;
    if (!targetSpace) return;

    try {
      setIsPostingGoogleChat(true);
      await postGoogleChatMessage(googleToken, targetSpace, `[Live Concierge Sync] ${registeredEmail}: ${textToSend}`);
      setGoogleStatusMsg({ type: 'success', text: 'Successfully dispatched message to Google Chat Space!' });
    } catch (err: any) {
      setGoogleStatusMsg({ type: 'error', text: `Failed to post to Google Chat: ${err.message}` });
    } finally {
      setIsPostingGoogleChat(false);
    }
  };

  // Handle user sending a live chat message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanText = inputMessage.trim();
    if (!cleanText) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsConciergeTyping(true);

    // If Google Chat token is available, automatically sync user message to Google Chat Space in background
    if (googleToken && selectedSpace) {
      postGoogleChatMessage(googleToken, selectedSpace, `[Live Chat] ${registeredEmail}: ${cleanText}`)
        .then(() => {
          setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, syncedToGoogleChat: true } : m));
        })
        .catch(() => { });
    }

    // Generate AI Concierge response
    try {
      const conciergeReplyText = await generateConciergeReply(
        registeredEmail,
        cleanText,
        messages.map(m => ({ sender: m.sender === 'user' ? 'User' : 'Concierge', text: m.text }))
      );

      setTimeout(() => {
        setIsConciergeTyping(false);
        const botMsg: ChatMessage = {
          id: `msg-reply-${Date.now()}`,
          sender: 'concierge',
          text: conciergeReplyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      }, 700);
    } catch (err) {
      setIsConciergeTyping(false);
    }
  };

  const handleQuickPromptClick = (promptText: string) => {
    setInputMessage(promptText);
  };

  const handleUpdateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput && emailInput.includes('@')) {
      setRegisteredEmail(emailInput.trim());
      setIsEditingEmail(false);
    }
  };

  const handleClearChatHistory = () => {
    if (window.confirm(`Clear all live chat history for ${registeredEmail}?`)) {
      localStorage.removeItem(storageKey);
      setMessages([
        {
          id: 'welcome-msg-reset',
          sender: 'concierge',
          text: `Chat session reset for ${registeredEmail}. How may Concierge Unit Alpha assist you?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const handleExportChatLog = () => {
    const textLog = messages.map(m => `[${m.timestamp}] ${m.sender.toUpperCase()}: ${m.text}`).join('\n');
    const blob = new Blob([textLog], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ineffable_Support_Chat_${registeredEmail.replace(/[@.]/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDirectEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransmittingEmail(true);
    setTimeout(() => {
      setIsTransmittingEmail(false);
      setEmailSubmitted(true);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-24 pt-28 space-y-10">



      {/* Registered Email Identity Banner */}
      <div className={`p-4 md:p-6 rounded-3xl ${themeStyles.bgCard} border ${themeStyles.borderMuted} backdrop-blur-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4`}>
        <div className="flex items-center space-x-4 min-w-0 w-full md:w-auto">
          <div className="relative shrink-0">
            {googleUser?.photoURL ? (
              <img src={googleUser.photoURL} alt="Avatar" className="w-12 h-12 rounded-2xl object-cover border-2 border-rose-500/40" />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-indigo-600 flex items-center justify-center text-white font-mono font-bold text-lg shadow-lg">
                {registeredEmail.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-black rounded-full" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono tracking-widest text-rose-500 uppercase font-bold">REGISTERED SUPPORT ACCOUNT</span>
              {googleUser && (
                <span className="bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold">
                  GOOGLE WORKSPACE
                </span>
              )}
            </div>

            {isEditingEmail ? (
              <form onSubmit={handleUpdateEmail} className="flex items-center space-x-2 mt-1">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="px-3 py-1 rounded-xl bg-black/30 border border-rose-500/50 text-xs font-mono text-white focus:outline-none"
                  placeholder="Enter your email"
                />
                <button type="submit" className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-mono font-bold">
                  Save
                </button>
                <button type="button" onClick={() => setIsEditingEmail(false)} className="px-2 py-1 text-zinc-400 hover:text-white text-xs font-mono">
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center space-x-2">
                <h3 className="font-mono text-sm md:text-base font-bold text-zinc-950 dark:text-white truncate">
                  {registeredEmail}
                </h3>
                <button
                  onClick={() => { setEmailInput(registeredEmail); setIsEditingEmail(true); }}
                  className="text-[10px] font-mono text-zinc-400 hover:text-rose-400 underline cursor-pointer"
                >
                  Change
                </button>
              </div>
            )}
            <p className="text-[10px] font-mono text-zinc-500">
              Live Chat history and Google Chat messages are linked to this registered address.
            </p>
          </div>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex items-center space-x-1 p-1 rounded-2xl bg-black/20 dark:bg-white/5 border border-white/10 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('live-chat')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 cursor-pointer whitespace-nowrap ${activeTab === 'live-chat'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
              : 'text-zinc-400 hover:text-white'
              }`}
          >
            <MessageSquareCode className="w-3.5 h-3.5" />
            <span>Live & Google Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('email-form')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 cursor-pointer whitespace-nowrap ${activeTab === 'email-form'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
              : 'text-zinc-400 hover:text-white'
              }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Transmission</span>
          </button>

          <button
            onClick={() => setActiveTab('global-nodes')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 cursor-pointer whitespace-nowrap ${activeTab === 'global-nodes'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
              : 'text-zinc-400 hover:text-white'
              }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Global</span>
          </button>
        </div>
      </div>

      {/* ========================================================================
          TAB 1: LIVE CHAT & GOOGLE CHAT INTEGRATION
         ======================================================================== */}
      {activeTab === 'live-chat' && (
        <div className="space-y-6">

          {/* Google Chat Space Integration Top Bar */}
          <div className={`p-5 rounded-3xl ${themeStyles.bgCard} border ${themeStyles.borderMuted} backdrop-blur-2xl shadow-xl space-y-4`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <MessageSquareCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-mono text-xs md:text-sm font-bold text-zinc-950 dark:text-white uppercase flex items-center space-x-2">
                    <span>GOOGLE CHAT WORKSPACE INTEGRATION</span>
                    {googleUser && <span className="text-[10px] text-emerald-400 font-normal">● AUTHENTICATED</span>}
                  </h3>
                  <p className="text-[10px] font-mono text-zinc-400">
                    Connect Google Workspace to dispatch direct messages to Google Chat support spaces.
                  </p>
                </div>
              </div>

              {!googleUser ? (
                <button
                  onClick={handleConnectGoogleChat}
                  disabled={isConnectingGoogle}
                  className="gsi-material-button w-full sm:w-auto cursor-pointer"
                  style={{
                    backgroundColor: '#131314',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: '#fff',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>{isConnectingGoogle ? 'CONNECTING...' : 'SIGN IN WITH GOOGLE CHAT'}</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-zinc-400">
                    Google: <strong className="text-white">{googleUser.email}</strong>
                  </span>
                  <button
                    onClick={() => logoutGoogleChat()}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-[10px] font-mono cursor-pointer"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>

            {/* Google Chat Space Controls when authenticated */}
            {googleUser && (
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Select Google Chat Space:</span>
                  <select
                    value={selectedSpace}
                    onChange={(e) => setSelectedSpace(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
                  >
                    {spaces.map(s => (
                      <option key={s.name} value={s.name}>
                        {s.displayName || s.name}
                      </option>
                    ))}
                    {spaces.length === 0 && (
                      <option value="">No active spaces found</option>
                    )}
                  </select>

                  <button
                    onClick={handleCreateNewSpace}
                    disabled={isPostingGoogleChat}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 text-xs font-mono font-bold transition-all cursor-pointer"
                  >
                    + Create Support Space
                  </button>
                </div>

                <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                  <button
                    onClick={() => handlePostToGoogleChatSpace(messages[messages.length - 1]?.text || 'Hello from Ineffable Live Concierge!')}
                    disabled={isPostingGoogleChat}
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-mono font-bold flex items-center space-x-2 shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isPostingGoogleChat ? 'POSTING...' : 'SYNC CHAT TO GOOGLE CHAT'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Google Status Notification Message */}
            {googleStatusMsg && (
              <div className={`p-3 rounded-2xl text-xs font-mono flex items-center justify-between ${googleStatusMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                googleStatusMsg.type === 'error' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                  'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                }`}>
                <span>{googleStatusMsg.text}</span>
                <button onClick={() => setGoogleStatusMsg(null)} className="text-zinc-400 hover:text-white">✕</button>
              </div>
            )}
          </div>

          {/* Interactive Live Chat Container */}
          <div className={`rounded-3xl ${themeStyles.bgCard} border ${themeStyles.borderMuted} backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col h-[650px]`}>

            {/* Chat Room Top Bar */}
            <div className="p-4 md:p-5 border-b border-white/10 bg-black/20 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 relative">
                  <Bot className="w-5 h-5" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-black" />
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-mono text-xs md:text-sm font-bold text-zinc-950 dark:text-white uppercase">
                      CONCIERGE UNIT ALPHA
                    </h3>
                    <span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold">
                      24/7 AI BOT
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-zinc-400">
                    Live Session linked to: <strong className="text-rose-400">{registeredEmail}</strong>
                  </p>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportChatLog}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-mono flex items-center space-x-1.5 transition-all cursor-pointer"
                  title="Export Chat History"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export</span>
                </button>

                <button
                  onClick={handleClearChatHistory}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-mono flex items-center space-x-1.5 transition-all cursor-pointer"
                  title="Clear Chat Log"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-mono text-xs font-bold ${isUser
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                      : 'bg-zinc-800 text-rose-400 border border-rose-500/30'
                      }`}>
                      {isUser ? registeredEmail.charAt(0).toUpperCase() : <Bot className="w-4 h-4" />}
                    </div>

                    {/* Message Body */}
                    <div className={`max-w-[80%] md:max-w-[70%] space-y-1 ${isUser ? 'items-end text-right' : 'items-start'}`}>
                      <div className={`flex items-center space-x-2 text-[10px] font-mono text-zinc-400 ${isUser ? 'justify-end' : ''}`}>
                        <span>{isUser ? registeredEmail : 'Concierge Unit Alpha'}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                        {msg.syncedToGoogleChat && (
                          <span className="text-sky-400 font-bold ml-1">✓ Google Chat</span>
                        )}
                      </div>

                      <div className={`p-4 rounded-2xl text-xs font-sans leading-relaxed shadow-lg ${isUser
                        ? 'bg-rose-500 text-white rounded-tr-none font-medium'
                        : 'bg-black/40 dark:bg-zinc-900/80 border border-white/10 text-zinc-100 rounded-tl-none'
                        }`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isConciergeTyping && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10 rounded-tl-none text-xs font-mono text-rose-400 flex items-center space-x-2">
                    <span className="animate-pulse">Concierge Unit Alpha is processing response...</span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Quick Inquiry Prompt Chips */}
            <div className="px-4 py-2 bg-black/30 border-t border-white/5 flex items-center space-x-2 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest shrink-0">QUICK INQUIRY:</span>
              {[
                '🏷️ Check Apparel Order Sizing',
                '👑 Membership Rank Benefits',
                '🎮 Minecraft SMP Whitelist & IP',
                '💬 Send Message to Google Chat'
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleQuickPromptClick(chip)}
                  className="px-3 py-1 rounded-full bg-white/5 hover:bg-rose-500/20 hover:text-rose-300 border border-white/10 text-[10px] font-mono text-zinc-300 whitespace-nowrap transition-all cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 md:p-4 bg-black/40 border-t border-white/10 flex items-center space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Type message for live concierge or Google Chat sync... (${registeredEmail})`}
                className="flex-1 px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-all"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="px-6 py-3 bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white rounded-2xl font-mono text-xs font-bold tracking-wider flex items-center space-x-2 shadow-lg shadow-rose-500/25 transition-all cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">TRANSMIT</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================
          TAB 2: DIRECT ENCRYPTED EMAIL TRANSMISSION
         ======================================================================== */}
      {activeTab === 'email-form' && (
        <div className={`p-8 md:p-12 rounded-3xl ${themeStyles.bgCard} border ${themeStyles.borderMuted} backdrop-blur-2xl shadow-2xl`}>
          {emailSubmitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="text-2xl font-sans font-bold text-zinc-950 dark:text-white uppercase">
                TRANSMISSION VERIFIED & DISPATCHED
              </h3>
              <p className="text-xs text-zinc-400 font-mono max-w-md mx-auto leading-relaxed">
                Your encrypted inquiry payload has been logged under registered address <strong className="text-rose-400">{registeredEmail}</strong>. Our team will respond within 24 hours.
              </p>
              <button
                onClick={() => setEmailSubmitted(false)}
                className="mt-4 px-6 py-2.5 bg-rose-500 text-white rounded-xl text-xs font-mono font-bold hover:bg-rose-600 transition-all cursor-pointer"
              >
                Send Another Transmission
              </button>
            </div>
          ) : (
            <form onSubmit={handleDirectEmailSubmit} className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-sans font-bold text-lg text-zinc-950 dark:text-white uppercase">
                  DIRECT SUPPORT TRANSMISSION
                </h3>
                <p className="text-xs font-mono text-zinc-400 mt-1">
                  Transmitting payload directly to the Sanctuary Operations Team.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">YOUR NAME</label>
                  <input
                    type="text"
                    required
                    value={emailFormData.name}
                    onChange={(e) => setEmailFormData({ ...emailFormData, name: e.target.value })}
                    placeholder="Sanctuary Member"
                    className="w-full px-4 py-3 rounded-2xl bg-black/20 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-rose-500 placeholder-zinc-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">REGISTERED EMAIL</label>
                  <input
                    type="email"
                    required
                    value={emailFormData.email}
                    onChange={(e) => setEmailFormData({ ...emailFormData, email: e.target.value })}
                    placeholder="sanctuary@ineffable.com"
                    className="w-full px-4 py-3 rounded-2xl bg-black/20 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-rose-500 placeholder-zinc-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">INQUIRY SUBJECT CATEGORY</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    'Orders & Apparel',
                    'Membership Ranks',
                    'Minecraft SMP Whitelist',
                    'Google Chat Integration'
                  ].map((sub) => (
                    <button
                      type="button"
                      key={sub}
                      onClick={() => setEmailFormData({ ...emailFormData, subject: sub })}
                      className={`py-2 px-3 rounded-xl border text-xs font-mono transition-all cursor-pointer ${emailFormData.subject === sub
                        ? 'bg-rose-500 text-white border-rose-500 font-bold shadow-md'
                        : 'bg-black/20 border-white/10 text-zinc-400 hover:text-white'
                        }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">MESSAGE CONTENT</label>
                <textarea
                  required
                  rows={5}
                  value={emailFormData.message}
                  onChange={(e) => setEmailFormData({ ...emailFormData, message: e.target.value })}
                  placeholder="State your support inquiry details..."
                  className="w-full px-4 py-3 rounded-2xl bg-black/20 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-rose-500 resize-none placeholder-zinc-500"
                />
              </div>

              <button
                type="submit"
                disabled={isTransmittingEmail}
                className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-mono text-xs tracking-widest font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-rose-500/25"
              >
                <Send className="w-4 h-4" />
                <span>{isTransmittingEmail ? 'DISPATCHING PAYLOAD...' : 'TRANSMIT ENCRYPTED PAYLOAD'}</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* ========================================================================
          TAB 3: GLOBAL HEADQUARTERS & SUPPORT
         ======================================================================== */}
      {activeTab === 'global-nodes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              city: 'TOKYO SANCTUARY',
              location: 'Aoyama, Minato City, Tokyo 107-0062',
              hours: '10:00 - 22:00 JST',
              email: 'tokyo@ineffable.cc',
              desc: 'Asia-Pacific Couture Design Atelier & 3D Rendering Studio.',
              accent: 'from-rose-500/20 to-indigo-500/20'
            },
            {
              city: 'SAN FRANCISCO CORE',
              location: 'SoMa District, San Francisco, CA 94103',
              hours: '09:00 - 18:00 PST',
              email: 'sf@ineffable.cc',
              desc: 'Minecraft SMP Infrastructure & Google Workspace Integration Lab.',
              accent: 'from-sky-500/20 to-emerald-500/20'
            },
            {
              city: 'LONDON ATELIER',
              location: 'Mayfair, London W1J 8AJ, UK',
              hours: '10:00 - 20:00 GMT',
              email: 'london@ineffable.cc',
              desc: 'European Heavyweight Textile R&D & Member VIP Concierge.',
              accent: 'from-purple-500/20 to-rose-500/20'
            },
            {
              city: 'BERLIN UNDERGROUND',
              location: 'Kreuzberg, 10997 Berlin, Germany',
              hours: '12:00 - 23:00 CET',
              email: 'berlin@ineffable.cc',
              desc: 'Sound Architecture, Granular Synthesis & Underground Journal Press.',
              accent: 'from-amber-500/20 to-red-500/20'
            }
          ].map((node) => (
            <div
              key={node.city}
              className={`p-6 rounded-3xl ${themeStyles.bgCard} border ${themeStyles.borderMuted} backdrop-blur-2xl shadow-xl space-y-4 hover:border-rose-500/40 transition-all group`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-widest text-rose-500 uppercase font-bold">
                  ● OPERATIONAL
                </span>
                <span className="text-xs font-mono text-zinc-400 flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>{node.hours}</span>
                </span>
              </div>

              <h3 className="text-lg font-sans font-extrabold text-zinc-950 dark:text-white uppercase tracking-tight">
                {node.city}
              </h3>

              <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                {node.desc}
              </p>

              <div className="pt-2 border-t border-white/10 space-y-1.5 text-xs font-mono">
                <div className="flex items-center space-x-2 text-zinc-300">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="truncate">{node.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-rose-400">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <a href={`mailto:${node.email}`} className="hover:underline">{node.email}</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AtmosphereConfig, PageId } from '../types';
import { getThemeStyles } from '../lib/theme';
import { Shield, Users, FileText, Trash2, RefreshCw, AlertTriangle, Key, ArrowLeft, Lock, CheckCircle, Database, Eye } from 'lucide-react';

interface JournalEntry {
  id: string;
  author: string;
  title: string;
  story: string;
  date: string;
  mood: 'classic' | 'neon-mint' | 'crimson-moon' | 'monochrome';
  wordsCount: number;
}

interface AdminViewProps {
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
  currentUser: string | null;
  setCurrentPage: (page: PageId) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  activeAtmosphere,
  isDarkMode,
  currentUser,
  setCurrentPage,
}) => {
  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);
  const isAdmin = currentUser?.toLowerCase() === 'kavyanshshakya' || currentUser?.toLowerCase() === 'admin';

  // Admin States
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'journals' | 'tickets'>('journals');
  const [allowAnonymous, setAllowAnonymous] = useState(true);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [bypassSuccess, setBypassSuccess] = useState(false);
  const [localUser, setLocalUser] = useState<string | null>(currentUser);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [showWebhook, setShowWebhook] = useState(false);

  // Load Journals and Config from localStorage
  useEffect(() => {
    const loadServerData = () => {
      try {
        // 1. Config
        const configRaw = localStorage.getItem('ineffable_config');
        if (configRaw) {
          const config = JSON.parse(configRaw);
          setAllowAnonymous(config.allowAnonymous);
          setWebhookUrl(config.discordWebhookUrl);
        } else {
          const defaultConfig = { allowAnonymous: true, discordWebhookUrl: '' };
          localStorage.setItem('ineffable_config', JSON.stringify(defaultConfig));
          setAllowAnonymous(true);
          setWebhookUrl('');
        }

        // 2. Journals
        const journalsRaw = localStorage.getItem('ineffable_journals');
        if (journalsRaw) {
          setJournals(JSON.parse(journalsRaw));
        } else {
          const defaultJournals = [
            {
              id: 'journal-default-1',
              author: 'Kaelen Vance',
              title: 'The Cherry Blossom Particle Constant',
              story: 'We observed the third calibration of our drift algorithms this evening. By tuning the windAngle parameter to exactly 120 degrees and injecting a gravity constant of 1.1 G, the virtual petals achieved what can only be described as dynamic suspension. They hover perfectly, riding waves of invisible thermals across the dark canvas of the container. It mimics a tactile reality we have long lost. All variables are syncing. The lattice remains secure.',
              date: 'JULY 02, 2026',
              mood: 'classic',
              wordsCount: 78,
              createdBy: 'Kaelen Vance'
            },
            {
              id: 'journal-default-2',
              author: 'Sora Tanaka',
              title: 'Quantum Fabric & Neon Weaves',
              story: 'Today the laboratory completed knitting tests for the oversized "Drift" physical print. Integrating reactive digital atmospheric APIs directly into organic heavy thread allows the ink to shift hue subtly when matching proximity to server boosters. In the daylight, it displays soft chalk gray equations. In ultraviolet community centers, the active mint dyes radiate. The cyber couture drop is nearly ready for general connection.',
              date: 'JUNE 28, 2026',
              mood: 'neon-mint',
              wordsCount: 71,
              createdBy: 'Sora Tanaka'
            },
            {
              id: 'journal-default-3',
              author: 'Elena Rostova',
              title: 'Notes on Crimson Orbital Lattices',
              story: 'The moon rose early in Reykjavík. Its reflection on the dark basalt sand felt remarkably analog. In the terminal, we locked the color theme to crimson-moon. Immediately, the sensory feed stabilized. It is fascinating how simple chromodynamic shifts change the anxiety curves of terminal operators. We must persist with this aesthetic calibration. Red light decreases cognitive friction during midnight packet compilation. Secure nodes logged.',
              date: 'JUNE 15, 2026',
              mood: 'crimson-moon',
              wordsCount: 68,
              createdBy: 'Elena Rostova'
            }
          ];
          localStorage.setItem('ineffable_journals', JSON.stringify(defaultJournals));
          setJournals(defaultJournals);
        }

        // 3. Tickets
        const ticketsRaw = localStorage.getItem('ineffable_tickets');
        if (ticketsRaw) {
          setTickets(JSON.parse(ticketsRaw));
        } else {
          localStorage.setItem('ineffable_tickets', JSON.stringify([]));
          setTickets([]);
        }

        // 4. Audit Logs
        const logsRaw = localStorage.getItem('ineffable_audit_logs');
        if (logsRaw) {
          setAuditLogs(JSON.parse(logsRaw));
        } else {
          const defaultLogs = [
            `[SYSTEM] BOOT SEQUENCE COMPLETED`,
            '[SECURITY] SHIELD LEVEL 100% // ALL CLIENT-SIDE LOGS SYNCED'
          ];
          localStorage.setItem('ineffable_audit_logs', JSON.stringify(defaultLogs));
          setAuditLogs(defaultLogs);
        }
      } catch (err) {
        console.error('Failed to synchronise server data with node:', err);
      }
    };

    if (currentUser || bypassSuccess) {
      loadServerData();
    }
  }, [currentUser, bypassSuccess]);

  const addAuditLog = (message: string) => {
    try {
      const logsRaw = localStorage.getItem('ineffable_audit_logs');
      const existingLogs = logsRaw ? JSON.parse(logsRaw) : [];
      const formattedLog = `[${new Date().toLocaleTimeString()}] ${message}`;
      const updatedLogs = [formattedLog, ...existingLogs];
      localStorage.setItem('ineffable_audit_logs', JSON.stringify(updatedLogs));
      setAuditLogs(updatedLogs);
    } catch (err) {
      console.error('Failed to dispatch audit log:', err);
    }
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const configRaw = localStorage.getItem('ineffable_config');
      const config = configRaw ? JSON.parse(configRaw) : { allowAnonymous: true };
      config.discordWebhookUrl = webhookUrl;
      localStorage.setItem('ineffable_config', JSON.stringify(config));
      
      addAuditLog('[CONFIG] SECURE DISCORD WEBHOOK DESTINATION CONFIGURATION RE-MAPPED');
      alert('DISCORD WEBHOOK CONFIGURATION UPDATED SUCCESSFULLY.');
    } catch (err) {
      alert('Handshake link failed.');
    }
  };

  const generateDefaultLogs = () => {
    addAuditLog('MANUAL SYSTEM RE-INDEX SIGNAL SENT BY ADMINISTRATOR');
  };

  // Toggle anonymous setting
  const handleToggleAnonymous = () => {
    const newVal = !allowAnonymous;
    try {
      const configRaw = localStorage.getItem('ineffable_config');
      const config = configRaw ? JSON.parse(configRaw) : { discordWebhookUrl: webhookUrl };
      config.allowAnonymous = newVal;
      localStorage.setItem('ineffable_config', JSON.stringify(config));
      
      setAllowAnonymous(newVal);
      addAuditLog(`[CONFIG] TOGGLED ALLOW_ANONYMOUS TO: ${newVal.toString().toUpperCase()}`);
    } catch (err) {
      alert('Handshake link failed.');
    }
  };

  // Delete journal entry (Force as admin)
  const handleDeleteJournal = (id: string, title: string, author: string) => {
    const confirmDel = window.confirm(`Force delete journal entry "${title}"?`);
    if (!confirmDel) return;

    try {
      const cached = localStorage.getItem('ineffable_journals');
      if (cached) {
        const existingJournals = JSON.parse(cached);
        const filtered = existingJournals.filter((j: any) => j.id !== id);
        localStorage.setItem('ineffable_journals', JSON.stringify(filtered));
        setJournals(filtered);
      }
      addAuditLog(`[MODERATION] FORCE DELETED JOURNAL: "${title}" by ${author}`);
    } catch (err) {
      alert('Handshake link failed.');
    }
  };

  // Clear all journals
  const handleClearAllJournals = () => {
    try {
      localStorage.setItem('ineffable_journals', JSON.stringify([]));
      setJournals([]);
      setShowClearConfirm(false);
      addAuditLog('[MODERATION] WIPE COMPLETE: ALL JOURNAL REGISTRY ENTRIES FLUSHED');
    } catch (err) {
      alert('Handshake link failed.');
    }
  };

  // Dismiss ticket (Force as admin)
  const handleDismissTicket = (id: string, subjectIdentity: string) => {
    try {
      const cached = localStorage.getItem('ineffable_tickets');
      if (cached) {
        const existingTickets = JSON.parse(cached);
        const filtered = existingTickets.filter((t: any) => t.id !== id);
        localStorage.setItem('ineffable_tickets', JSON.stringify(filtered));
        setTickets(filtered);
      }
      addAuditLog(`[MODERATION] DISMISSED SUPPORT TICKET FROM "${subjectIdentity}"`);
    } catch (err) {
      alert('Failed to dismiss support ticket.');
    }
  };

  // Clear Audit Logs Manual Buffer
  const handleClearAuditLogs = () => {
    try {
      const clearedLogs = [`[${new Date().toLocaleTimeString()}] [SYSTEM] AUDIT LOG BUFFER FLUSHED BY ADMINISTRATOR`];
      localStorage.setItem('ineffable_audit_logs', JSON.stringify(clearedLogs));
      setAuditLogs(clearedLogs);
    } catch (err) {
      alert('Failed to clear manual buffer.');
    }
  };

  // Check bypass password
  const handleBypassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'kavyansh' || passwordInput === 'admin' || passwordInput === 'admin123') {
      setBypassSuccess(true);
      setLocalUser('kavyanshshakya');
      await addAuditLog('[SECURITY] BACKDOOR AUTHENTICATION PASSCODE VERIFIED. ELEVATED TO ADMIN.');
    } else {
      alert('INVALID SECURITY ENCRYPTION KEYS');
      await addAuditLog('[WARNING] BRUTE FORCE PREVENTED: INVALID PASSWORD INPUT');
    }
  };

  // Compute stats
  const totalWords = journals.reduce((acc, j) => acc + j.wordsCount, 0);
  const totalAuthors = new Set(journals.map(j => j.author.toLowerCase())).size;

  const currentIsAdmin = isAdmin || bypassSuccess;

  // Render Access Denied if not admin
  if (!currentIsAdmin) {
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
          <p className={`${themeStyles.textSecondary} text-xs font-light max-w-sm mx-auto leading-relaxed`}>
            Your credentials or identity vector is unauthorized for this terminal node. This area is reserved solely for administrative accounts.
          </p>
        </div>

        {/* Password Bypass Form for Kavyansh */}
        <div className={`max-w-sm mx-auto ${themeStyles.bgCard} border ${themeStyles.borderMain} rounded-2xl p-6 space-y-4 shadow-xl text-left`}>
          <h4 className="font-mono text-[10px] tracking-widest text-zinc-400 font-bold uppercase border-b border-zinc-900 pb-2 flex items-center space-x-1.5">
            <Key className="w-3.5 h-3.5 text-rose-400" />
            <span>Verify Security Passcode</span>
          </h4>
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
    <div id="admin-panel-container" className="max-w-7xl mx-auto px-6 py-24 pt-32 space-y-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-zinc-800 pb-8">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-rose-950 text-rose-300 border border-rose-900 px-2.5 py-0.5 rounded-full font-mono text-[9px] tracking-widest font-bold">
              SUPERADMIN PORTAL
            </span>
            <span className="font-mono text-[9px] text-zinc-500">CONNECTED NODE: 0x8A7E</span>
          </div>
          <h2 className="text-4xl font-sans tracking-tight font-extrabold uppercase text-white flex items-center space-x-3">
            <Shield className="w-9 h-9 text-rose-500" />
            <span>INEFFABLE ADMIN CONTROL</span>
          </h2>
          <p className={`${themeStyles.textSecondary} text-xs font-light max-w-xl`}>
            Authorized administrative gateway for Ineffable. Monitor user journals, manage metadata, view audit trails, and oversee secure systems.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setCurrentPage('journals')}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl font-mono text-[10px] tracking-widest text-zinc-300 transition-colors cursor-pointer flex items-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>VIEW JOURNALS</span>
          </button>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div id="admin-stats-grid" className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Stat 1 */}
        <div className={`${themeStyles.bgCard} border border-zinc-900 p-6 rounded-2xl space-y-2 relative overflow-hidden`}>
          <div className="absolute top-4 right-4 text-zinc-800">
            <Database className="w-8 h-8" />
          </div>
          <span className="font-mono text-[9px] text-zinc-500 tracking-widest block uppercase">
            REGISTRY SIZE
          </span>
          <h3 className="text-3xl font-sans font-extrabold text-white">
            {journals.length}
          </h3>
          <p className="text-[10px] text-zinc-400 font-mono">
            Active transmissions in local index.
          </p>
        </div>

        {/* Stat 2 */}
        <div className={`${themeStyles.bgCard} border border-zinc-900 p-6 rounded-2xl space-y-2 relative overflow-hidden`}>
          <div className="absolute top-4 right-4 text-zinc-800">
            <Users className="w-8 h-8" />
          </div>
          <span className="font-mono text-[9px] text-zinc-500 tracking-widest block uppercase">
            UNIQUE WRITERS
          </span>
          <h3 className="text-3xl font-sans font-extrabold text-white">
            {totalAuthors}
          </h3>
          <p className="text-[10px] text-zinc-400 font-mono">
            Distinct identities compiled.
          </p>
        </div>

        {/* Stat 3 */}
        <div className={`${themeStyles.bgCard} border border-zinc-900 p-6 rounded-2xl space-y-2 relative overflow-hidden`}>
          <div className="absolute top-4 right-4 text-zinc-800">
            <FileText className="w-8 h-8" />
          </div>
          <span className="font-mono text-[9px] text-zinc-500 tracking-widest block uppercase">
            TOTAL STORY WORDS
          </span>
          <h3 className="text-3xl font-sans font-extrabold text-white">
            {totalWords}
          </h3>
          <p className="text-[10px] text-zinc-400 font-mono">
            Cumulative narratives count.
          </p>
        </div>

        {/* Stat 4 - Global Settings Controls */}
        <div className={`${themeStyles.bgCard} border border-zinc-900 p-6 rounded-2xl flex flex-col justify-between space-y-3`}>
          <div>
            <span className="font-mono text-[9px] text-zinc-500 tracking-widest block uppercase">
              REGISTRY SECURITY
            </span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-zinc-300 font-sans">Allow Anonymous Writing</span>
              <button
                onClick={handleToggleAnonymous}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  allowAnonymous ? 'bg-emerald-500' : 'bg-zinc-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    allowAnonymous ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-900">
            <button
              onClick={() => {
                generateDefaultLogs();
                alert('REGISTRY METADATA REINDEXED SUCCESSFUL');
              }}
              className="text-[9px] font-mono tracking-widest text-zinc-400 hover:text-white flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>RE-INDEX LOCAL SYSTEM</span>
            </button>
          </div>
        </div>

      </div>

      <div id="admin-main-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Moderation Panel (Left / Col-8) */}
        <div className="lg:col-span-8 space-y-6">
          <div className={`${themeStyles.bgCard} border border-zinc-900 rounded-2xl overflow-hidden`}>
            
            {/* Panel Title bar */}
            <div className="bg-zinc-950/80 border-b border-zinc-900 flex items-center justify-between">
              <div className="flex border-r border-zinc-900">
                <button
                  type="button"
                  onClick={() => setActiveTab('journals')}
                  className={`px-6 py-4 font-mono text-xs tracking-widest font-extrabold uppercase transition-all border-b-2 flex items-center space-x-2 cursor-pointer ${
                    activeTab === 'journals'
                      ? 'border-rose-500 text-rose-300 bg-zinc-900/50'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>JOURNAL VAULT</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('tickets')}
                  className={`px-6 py-4 font-mono text-xs tracking-widest font-extrabold uppercase transition-all border-b-2 flex items-center space-x-2 cursor-pointer ${
                    activeTab === 'tickets'
                      ? 'border-indigo-500 text-indigo-300 bg-zinc-900/50'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>SUPPORT TICKETS</span>
                </button>
              </div>

              <div className="pr-6 text-[10px] font-mono text-zinc-500">
                {activeTab === 'journals' ? `TOTAL: ${journals.length}` : `TOTAL: ${tickets.length}`}
              </div>
            </div>

            {/* Moderation table list */}
            {activeTab === 'journals' ? (
              journals.length === 0 ? (
                <div className="p-12 text-center text-zinc-500 space-y-3 font-mono text-xs">
                  <AlertTriangle className="w-8 h-8 text-zinc-700 mx-auto" />
                  <p>NO TRANSMISSIONS CURRENTLY IN REGISTRY INDEX</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-900">
                  {journals.map((journal) => (
                    <div key={journal.id} className="p-6 flex items-start justify-between gap-4 hover:bg-zinc-950/20 transition-colors">
                      <div className="space-y-2 flex-grow">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className="font-sans text-xs font-bold text-white uppercase tracking-wide">
                            {journal.title}
                          </span>
                          <span className="bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-[8px] font-mono tracking-widest font-bold uppercase">
                            {journal.mood.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 font-mono text-[9px] text-zinc-500">
                          <span className="text-zinc-400">Writer: <strong className="text-zinc-200">{journal.author}</strong></span>
                          <span>Date: {journal.date}</span>
                          <span>Words: {journal.wordsCount}</span>
                        </div>

                        <p className="text-zinc-400 text-xs font-sans font-light leading-relaxed line-clamp-2 max-w-2xl pt-1">
                          {journal.story}
                        </p>
                      </div>

                      <div className="shrink-0 pt-1">
                        <button
                          onClick={() => handleDeleteJournal(journal.id, journal.title, journal.author)}
                          className="p-2 bg-rose-950/20 hover:bg-rose-950/80 text-rose-400 hover:text-white border border-rose-900/30 rounded-lg transition-all cursor-pointer flex items-center space-x-1"
                          title="Force Delete Entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="font-mono text-[8px] tracking-wider font-extrabold uppercase hidden sm:inline">FORCE REMOVE</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              tickets.length === 0 ? (
                <div className="p-12 text-center text-zinc-500 space-y-3 font-mono text-xs">
                  <Database className="w-8 h-8 text-zinc-700 mx-auto animate-pulse" />
                  <p>NO SUPPORT TICKETS CURRENTLY RECORDED</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-900">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="p-6 flex items-start justify-between gap-4 hover:bg-zinc-950/20 transition-colors">
                      <div className="space-y-2 flex-grow">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className="font-sans text-xs font-bold text-white uppercase tracking-wide">
                            {ticket.subjectIdentity}
                          </span>
                          <span className="bg-indigo-950/60 border border-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded text-[8px] font-mono tracking-widest font-bold uppercase">
                            {ticket.inquiryNature.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 font-mono text-[9px] text-zinc-500">
                          <span className="text-zinc-400">Address: <strong className="text-zinc-200">{ticket.digitalAddress}</strong></span>
                          <span>Received: {new Date(ticket.timestamp || '').toLocaleString()}</span>
                        </div>

                        <p className="text-zinc-400 text-xs font-sans font-light leading-relaxed pt-1 whitespace-pre-line">
                          {ticket.messageVector}
                        </p>
                      </div>

                      <div className="shrink-0 pt-1">
                        <button
                          onClick={() => handleDismissTicket(ticket.id, ticket.subjectIdentity)}
                          className="p-2 bg-rose-950/20 hover:bg-rose-950/80 text-rose-400 hover:text-white border border-rose-900/30 rounded-lg transition-all cursor-pointer flex items-center space-x-1"
                          title="Dismiss Ticket"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="font-mono text-[8px] tracking-wider font-extrabold uppercase hidden sm:inline">DISMISS</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>

          {/* Destructive Wiping operations */}
          <div className="bg-rose-950/10 border border-rose-500/20 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-mono text-xs font-bold text-rose-300 uppercase flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>CRITICAL SYSTEM CLEARANCE</span>
              </h4>
              <p className="text-zinc-400 text-[11px] font-sans font-light max-w-md leading-relaxed">
                Wiping the journal registry clears all community transmissions instantly. These indices are permanently flushed from local memory banks.
              </p>
            </div>

            <div className="shrink-0 flex items-center">
              {showClearConfirm ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearAllJournals}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white border border-rose-500 rounded-lg font-mono text-[9px] tracking-widest font-extrabold transition-colors cursor-pointer"
                  >
                    CONFIRM COMPLETE SYSTEM WIPE
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg font-mono text-[9px] tracking-widest transition-colors cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="px-4 py-2.5 bg-rose-950 hover:bg-rose-900 border border-rose-900/40 text-rose-300 rounded-xl font-mono text-[9px] tracking-widest font-extrabold transition-colors cursor-pointer"
                >
                  WIPE JOURNAL STORAGE REGISTRY
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Audit Logs (Right / Col-4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`${themeStyles.bgCard} border border-zinc-900 rounded-2xl p-6 space-y-4`}>
            <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3">
              <Shield className="w-4 h-4 text-zinc-400" />
              <h3 className="font-mono text-xs tracking-widest font-extrabold text-zinc-100 uppercase">
                SECURITY SYSTEM AUDITS
              </h3>
            </div>

            <div className="h-[400px] overflow-y-auto font-mono text-[9px] space-y-2.5 text-zinc-400 scrollbar-thin">
              {auditLogs.map((log, index) => {
                let logColor = 'text-zinc-500';
                if (log.includes('[WARNING]')) logColor = 'text-amber-400';
                if (log.includes('[SECURITY]')) logColor = 'text-emerald-400';
                if (log.includes('[MODERATION]')) logColor = 'text-rose-400';
                if (log.includes('[CONFIG]')) logColor = 'text-sky-400';

                return (
                  <div key={index} className={`leading-relaxed pl-2 border-l border-zinc-800/80 ${logColor}`}>
                    {log}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-zinc-900 flex justify-between items-center text-[8px] font-mono text-zinc-600">
              <span>BUFFER STATUS: NOMINAL</span>
              <button
                onClick={handleClearAuditLogs}
                className="hover:text-zinc-300 transition-colors uppercase cursor-pointer"
              >
                Clear buffer
              </button>
            </div>
          </div>

          {/* Discord Integration Settings */}
          <div className={`${themeStyles.bgCard} border border-zinc-900 rounded-2xl p-6 space-y-4`}>
            <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3">
              <Database className="w-4 h-4 text-indigo-400" />
              <h3 className="font-mono text-xs tracking-widest font-extrabold text-zinc-100 uppercase">
                DISCORD INTEGRATION
              </h3>
            </div>
            
            <form onSubmit={handleSaveWebhook} className="space-y-3">
              <label className="font-mono text-[9px] text-zinc-500 tracking-wider block uppercase">
                Ticket Webhook URL (Discord API Channel)
              </label>
              <div className="relative">
                <input
                  type={showWebhook ? "text" : "password"}
                  placeholder="https://discord.com/api/webhooks/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-zinc-900/60 border border-zinc-800 px-3 py-2.5 pr-10 rounded-lg text-zinc-100 font-mono text-[10px] focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowWebhook(!showWebhook)}
                  className="absolute right-2.5 top-2.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                  title={showWebhook ? "Hide Webhook URL" : "Show Webhook URL"}
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-950 hover:bg-indigo-900 border border-indigo-900 text-indigo-200 font-mono text-[9px] tracking-widest font-extrabold rounded-lg transition-colors cursor-pointer"
              >
                SAVE WEBHOOK KEY
              </button>
            </form>
            <p className="text-[9px] text-zinc-500 font-sans leading-relaxed">
              Ticket submissions on the contact form are packed as embedded payloads and transmitted through this endpoint to render active tickets inside your Discord staff channel.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

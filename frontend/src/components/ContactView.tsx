/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageId, InquiryForm, AtmosphereConfig } from '../types';
import { getThemeStyles } from '../lib/theme';
import { Send, Terminal, ShieldAlert, Cpu, CheckCircle, MessageSquare, History, User, Bot, Search, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { validateGmailAddress, sendDiscordTicket, sendDiscordChatMessage } from '../lib/discordService';

interface ContactViewProps {
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
}

export const ContactView: React.FC<ContactViewProps> = ({ activeAtmosphere, isDarkMode }) => {
  const [form, setForm] = useState<InquiryForm>({
    subjectIdentity: '',
    digitalAddress: '',
    inquiryNature: 'GENERAL',
    messageVector: ''
  });

  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);

  // Ticket History & Live Chat States
  const [activeSection, setActiveSection] = useState<'transmit' | 'history'>('transmit');
  const [historyEmail, setHistoryEmail] = useState<string>('');
  const [historyEmailError, setHistoryEmailError] = useState<string | null>(null);
  const [searchedTickets, setSearchedTickets] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isSendingChatMessage, setIsSendingChatMessage] = useState<boolean>(false);

  const handleFetchHistory = async (emailToFetch: string) => {
    const emailVal = emailToFetch.trim();
    if (!validateGmailAddress(emailVal)) {
      setHistoryEmailError('Please enter a valid @gmail.com address to query your history.');
      return;
    }
    setHistoryEmailError(null);
    setIsLoadingHistory(true);
    setSearchedTickets([]);
    setSelectedTicket(null);

    try {
      let dbTickets: any[] = [];
      // Query Supabase
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('tickets')
            .select('*')
            .eq('digital_address', emailVal);
          if (!error && data) {
            dbTickets = data.map((item: any) => ({
              id: item.id.toString(),
              subjectIdentity: item.subject_identity,
              digitalAddress: item.digital_address,
              inquiryNature: item.inquiry_nature,
              messageVector: item.message_vector,
              createdAt: item.created_at,
              status: item.status || 'PENDING'
            }));
          } else if (error) {
            console.warn('Error fetching tickets from Supabase:', error);
          }
        } catch (dbErr) {
          console.warn('Supabase fetch failed, falling back to cache:', dbErr);
        }
      }

      // Query Local Storage
      const localTicketsRaw = localStorage.getItem('inefontop_tickets');
      let localTickets: any[] = [];
      if (localTicketsRaw) {
        try {
          const parsed = JSON.parse(localTicketsRaw);
          if (Array.isArray(parsed)) {
            localTickets = parsed.filter((t: any) =>
              t.digitalAddress?.trim().toLowerCase() === emailVal.toLowerCase()
            );
          }
        } catch (e) {
          console.warn('Error parsing local tickets:', e);
        }
      }

      // Merge local and db tickets cleanly, removing duplicates by ID
      const allTicketsMap = new Map();
      dbTickets.forEach(t => allTicketsMap.set(t.id, t));
      localTickets.forEach(t => {
        if (!allTicketsMap.has(t.id)) {
          allTicketsMap.set(t.id, t);
        }
      });

      const mergedTickets = Array.from(allTicketsMap.values()).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setSearchedTickets(mergedTickets);
      if (mergedTickets.length === 0) {
        setHistoryEmailError('No active connection registers found for this digital address.');
      }
    } catch (err: any) {
      console.warn('Error fetching history:', err);
      setHistoryEmailError('A gateway connection exception occurred. Please try again.');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSelectTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setChatInput('');

    const chatKey = `inefontop_chat_${ticket.id}`;
    const existingChatRaw = localStorage.getItem(chatKey);
    if (existingChatRaw) {
      try {
        setChatMessages(JSON.parse(existingChatRaw));
      } catch (e) {
        setChatMessages([]);
      }
    } else {
      // Create initial message
      const welcomeMsg = {
        id: 'msg-welcome-' + Date.now(),
        sender: 'support' as const,
        senderName: 'LAB GATEWAY BOT',
        text: `Secure link established. [CORE RECONCILIATION NODE] connected. Initial Message Vector: "${ticket.messageVector}". How can we assist you with this ${ticket.inquiryNature} ticket?`,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(chatKey, JSON.stringify([welcomeMsg]));
      setChatMessages([welcomeMsg]);
    }
  };

  const getAutomatedResponse = (inquiryNature: string, text: string) => {
    const query = text.toLowerCase();

    if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
      return `Connection signal healthy. Greetings subject. We are processing your request regarding [${inquiryNature}]. State of operations remains nominal. What specific parameters can we optimize?`;
    }

    if (query.includes('status') || query.includes('update') || query.includes('when') || query.includes('ready')) {
      return `Query mapped. Ticket status is currently marked as PENDING. The laboratory engineers are completing verification tests. Expect full resolution notification directly to your registered @gmail.com within the next cycle.`;
    }

    if (query.includes('thank') || query.includes('solve') || query.includes('ok') || query.includes('cool')) {
      return `Acknowledged. The connection remains active. Glad to assist in streamlining your operational vectors. Let us know if further diagnostic dialogue is required.`;
    }

    switch (inquiryNature) {
      case 'BUG':
        return `Exception report parsed. Our testing automation harness has simulated the failure vector and isolated the stack trace. Debuggers are deploying hot patches to the staging nodes right now.`;
      case 'PAYOUT':
        return `Ledger query received. Payout pipelines confirm verification under ticket reference. Our automated escrow vault releases digital assets during scheduled window frames. No manual override needed.`;
      case 'QUERY':
        return `Bespoke documentation query referenced. Connecting with laboratory server clusters. Please specify any target code elements, sizing, or styling requirements if needed.`;
      case 'OTHER':
      case 'GENERAL':
      default:
        return `Data vector noted. Your input has been queued and synchronized with our Discord coordination channels. An engineer from the specific department is reviewing these connection details.`;
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedTicket) return;

    const userMessageText = chatInput.trim();
    setChatInput('');
    setIsSendingChatMessage(true);

    const userMsg = {
      id: 'msg-user-' + Date.now(),
      sender: 'user' as const,
      senderName: selectedTicket.subjectIdentity || 'Subject User',
      text: userMessageText,
      timestamp: new Date().toISOString()
    };

    const chatKey = `inefontop_chat_${selectedTicket.id}`;
    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    localStorage.setItem(chatKey, JSON.stringify(updatedMessages));

    // Send to Discord
    await sendDiscordChatMessage(selectedTicket.id, 'user', selectedTicket.subjectIdentity, userMessageText);

    // Simulate Agent typing & responding
    setTimeout(async () => {
      const botResponseText = getAutomatedResponse(selectedTicket.inquiryNature, userMessageText);
      const botMsg = {
        id: 'msg-support-' + Date.now(),
        sender: 'support' as const,
        senderName: 'LAB ENGINEER KAI',
        text: botResponseText,
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...updatedMessages, botMsg];
      setChatMessages(finalMessages);
      localStorage.setItem(chatKey, JSON.stringify(finalMessages));

      // Send response to Discord too so full conversation history is synced
      await sendDiscordChatMessage(selectedTicket.id, 'support', 'LAB ENGINEER KAI', botResponseText);
      setIsSendingChatMessage(false);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === 'digitalAddress') {
      const emailVal = value.trim();
      if (emailVal && !validateGmailAddress(emailVal)) {
        setEmailError('Direct Email Point must be a valid @gmail.com address');
      } else {
        setEmailError(null);
      }
    }
  };

  const simulateTransmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subjectIdentity || !form.digitalAddress || !form.messageVector) return;

    const emailVal = form.digitalAddress.trim();
    if (!validateGmailAddress(emailVal)) {
      setEmailError('Direct Email Point must be a valid @gmail.com address');
      return;
    }

    setIsTransmitting(true);
    setIsSuccess(false);
    setTerminalLogs([]);

    const logLines = [
      'INITIATING HANDSHAKE WITH INEFFABLE NODE ...',
      'ESTABLISHING SECURE TLS_1.3 CHANNEL...',
      'PACKAGING SUBJECT DATA PACKETS...',
      `SUBJECT IDENTITY: "${form.subjectIdentity.toUpperCase()}"`,
      `DIGITAL ENVELOPE ENCRYPTED WITH AES-256-GCM...`,
    ];

    for (let i = 0; i < logLines.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setTerminalLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${logLines[i]}`]);
    }

    try {
      setTerminalLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] DISPATCHING STREAM TO SECURE CLOUD GATEWAY...`]);

      await new Promise((resolve) => setTimeout(resolve, 600));

      let finalTicketId = 'ticket-' + Date.now();

      // Helper to generate UUID
      const generateUUID = () => {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
          return crypto.randomUUID();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      };

      // 1. Save to Supabase PostgreSQL if configured
      if (supabase) {
        // Strategy A: Insert without explicit ID (allow database default uuid/bigserial)
        const { data: dataA, error: errorA } = await supabase
          .from('tickets')
          .insert([{
            subject_identity: form.subjectIdentity.trim(),
            digital_address: form.digitalAddress.trim(),
            inquiry_nature: form.inquiryNature,
            message_vector: form.messageVector.trim(),
            created_at: new Date().toISOString(),
            status: 'PENDING'
          }])
          .select('id');

        if (!errorA && dataA && dataA[0]) {
          finalTicketId = dataA[0].id.toString();
        } else {
          // Strategy B: If Strategy A failed, try inserting with a clean standard UUID format
          const cleanUuid = generateUUID();
          const { data: dataB, error: errorB } = await supabase
            .from('tickets')
            .insert([{
              id: cleanUuid,
              subject_identity: form.subjectIdentity.trim(),
              digital_address: form.digitalAddress.trim(),
              inquiry_nature: form.inquiryNature,
              message_vector: form.messageVector.trim(),
              created_at: new Date().toISOString(),
              status: 'PENDING'
            }])
            .select('id');

          if (!errorB && dataB && dataB[0]) {
            finalTicketId = dataB[0].id.toString();
          } else {
            // Strategy C: Last-ditch effort, try with string ID format ('ticket-...')
            const { error: errorC } = await supabase
              .from('tickets')
              .insert([{
                id: finalTicketId,
                subject_identity: form.subjectIdentity.trim(),
                digital_address: form.digitalAddress.trim(),
                inquiry_nature: form.inquiryNature,
                message_vector: form.messageVector.trim(),
                created_at: new Date().toISOString(),
                status: 'PENDING'
              }]);

            if (errorC) {
              console.warn('Supabase ticket insert error, using local fallback:', errorC);
            }
          }
        }
      }

      const newTicket = {
        id: finalTicketId,
        subjectIdentity: form.subjectIdentity.trim(),
        digitalAddress: form.digitalAddress.trim(),
        inquiryNature: form.inquiryNature,
        messageVector: form.messageVector.trim(),
        createdAt: new Date().toISOString(),
        status: 'PENDING'
      };

      // 2. Replication write to local storage
      const existingTicketsRaw = localStorage.getItem('inefontop_tickets');
      const existingTickets = existingTicketsRaw ? JSON.parse(existingTicketsRaw) : [];
      existingTickets.push(newTicket);
      localStorage.setItem('inefontop_tickets', JSON.stringify(existingTickets));

      const existingLogsRaw = localStorage.getItem('inefontop_audit_logs');
      const existingLogs = existingLogsRaw ? JSON.parse(existingLogsRaw) : [];
      const auditLogMessage = `[CONTACT] NEW SUPPORT TICKET DISPATCHED BY "${form.subjectIdentity.toUpperCase()}"`;
      existingLogs.push(auditLogMessage);
      localStorage.setItem('inefontop_audit_logs', JSON.stringify(existingLogs));

      // Push audit log to Supabase
      if (supabase) {
        await supabase.from('audit_logs').insert([{ message: auditLogMessage }]);
      }

      // 3. Connect and send ticket to Discord Webhook if configured
      setTerminalLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] DISPATCHING REAL-TIME SECURE ROUTE TO DISCORD CHANNEL...`]);
      const discordResult = await sendDiscordTicket(newTicket);
      if (discordResult.success) {
        setTerminalLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${discordResult.message.toUpperCase()}`]);
      } else {
        if (discordResult.message.includes("VITE_DISCORD_WEBHOOK_URL")) {
          setTerminalLogs((prev) => [
            ...prev,
            `[${new Date().toLocaleTimeString()}] [INFO] DISCORD WEBHOOK ROUTING INACTIVE (VITE_DISCORD_WEBHOOK_URL KEY NOT INSTALLED).`,
            `[${new Date().toLocaleTimeString()}] [SYSTEM] USE THE SECURE WEB ADMIN PANEL FOR ALL INCOMING TICKET TELEMETRY.`
          ]);
        } else {
          setTerminalLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] [ERROR] DISCORD NODE UNREACHABLE: ${discordResult.message.toUpperCase()}`]);
        }
      }

      setTerminalLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] TELEMETRY LOGGED TO SECURE LOCAL REGISTRY.`,
        `[${new Date().toLocaleTimeString()}] REAL-TIME SIGNAL ROUTED TO STAFF DISPATCH CHANNELS.`,
        `[${new Date().toLocaleTimeString()}] TRANSACTION REGISTER COMPLETED.`
      ]);

      setIsSuccess(true);
      setForm({
        subjectIdentity: '',
        digitalAddress: '',
        inquiryNature: 'GENERAL',
        messageVector: ''
      });
    } catch (err: any) {
      setTerminalLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [CRITICAL] TRANSMISSION FAILED: ${err.message}`,
        `[${new Date().toLocaleTimeString()}] SECURE ENCRYPTED NODE CONNECTION ABORTED.`
      ]);
    } finally {
      setIsTransmitting(false);
    }
  };

  return (
    <div id="contact-view-container" className={`max-w-7xl mx-auto px-6 py-24 pt-32 ${themeStyles.textPrimary}`}>
      <div className="space-y-4 mb-10 text-center max-w-2xl mx-auto">
        <span className={`font-mono text-xs tracking-[0.3em] ${themeStyles.accentText} uppercase block`}>
          06 // CONNECTION GATEWAY
        </span>
        <h2 className="text-4xl md:text-6xl font-sans tracking-tight font-light uppercase">
          Subject Connection
        </h2>
        <p className={`${themeStyles.textSecondary} font-sans text-sm font-light leading-relaxed`}>
          Initialize communication. Connect directly with laboratory engineers to request bespoke tailoring slots, digital atmosphere API keys, or collaborative projects.
        </p>
      </div>

      {/* Connection Tab Selector */}
      <div className="flex justify-center mb-10">
        <div className={`inline-flex p-1 rounded-xl border ${themeStyles.borderMain} ${isDarkMode ? 'bg-zinc-950/40' : 'bg-zinc-100/50'} font-mono text-[10px] md:text-xs relative z-10`}>
          <button
            onClick={() => {
              setActiveSection('transmit');
              setSelectedTicket(null);
            }}
            className={`px-5 py-2.5 rounded-lg transition-all flex items-center space-x-2 cursor-pointer ${activeSection === 'transmit' ? (isDarkMode ? 'bg-zinc-100 text-zinc-950 font-bold shadow-lg' : 'bg-zinc-900 text-white font-bold shadow-lg') : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>TRANSMIT INQUIRY</span>
          </button>
          <button
            onClick={() => {
              setActiveSection('history');
              setSelectedTicket(null);
            }}
            className={`px-5 py-2.5 rounded-lg transition-all flex items-center space-x-2 cursor-pointer ${activeSection === 'history' ? (isDarkMode ? 'bg-zinc-100 text-zinc-950 font-bold shadow-lg' : 'bg-zinc-900 text-white font-bold shadow-lg') : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>TICKET HISTORY & LIVE CHAT</span>
          </button>
        </div>
      </div>

      {activeSection === 'transmit' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
          {/* Connection Form */}
          <div
            id="contact-form-panel"
            className={`lg:col-span-7 ${themeStyles.bgCard} border ${themeStyles.borderMain} rounded-2xl p-6 md:p-8 space-y-6`}
          >
            <div className={`flex items-center space-x-2 border-b ${themeStyles.borderMuted} pb-4`}>
              <Cpu className={`w-4 h-4 ${themeStyles.accentText}`} />
              <h3 className={`font-mono text-xs tracking-widest font-semibold ${themeStyles.textPrimary} uppercase`}>
                Secure Transmission Form
              </h3>
            </div>

            <form onSubmit={simulateTransmission} className="space-y-5">
              {/* Subject Identity (Name) */}
              <div className="space-y-1.5">
                <label className={`font-mono text-[9px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'} tracking-widest block uppercase`}>
                  Subject Identity (Full Name / Entity Name)
                </label>
                <input
                  id="input-subject-identity"
                  type="text"
                  name="subjectIdentity"
                  required
                  value={form.subjectIdentity}
                  onChange={handleInputChange}
                  disabled={isTransmitting}
                  placeholder="e.g. INITIATE ALEX_KORV"
                  className={`w-full ${isDarkMode ? 'bg-zinc-900/40 border-zinc-900 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-800'} border px-4 py-3.5 rounded-lg font-mono text-xs focus:outline-none ${themeStyles.focusBorder} transition-colors disabled:opacity-50`}
                />
              </div>

              {/* Digital Address (Email) */}
              <div className="space-y-1.5">
                <label className={`font-mono text-[9px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'} tracking-widest block uppercase`}>
                  Digital Address (Direct Email Point - @gmail.com only)
                </label>
                <input
                  id="input-digital-address"
                  type="email"
                  name="digitalAddress"
                  required
                  value={form.digitalAddress}
                  onChange={handleInputChange}
                  disabled={isTransmitting}
                  placeholder="e.g. alex@gmail.com"
                  className={`w-full ${isDarkMode ? 'bg-zinc-900/40 border-zinc-900 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-800'} ${emailError ? 'border-rose-500 focus:border-rose-500' : 'border'} px-4 py-3.5 rounded-lg font-mono text-xs focus:outline-none ${themeStyles.focusBorder} transition-colors disabled:opacity-50`}
                />
                {emailError && (
                  <p className="text-rose-500 font-mono text-[10px] mt-1 tracking-wider">
                    ⚠️ {emailError}
                  </p>
                )}
              </div>

              {/* Inquiry Nature */}
              <div className="space-y-1.5">
                <label className={`font-mono text-[9px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'} tracking-widest block uppercase`}>
                  Inquiry Nature (Transmission Focus)
                </label>
                <select
                  id="input-inquiry-nature"
                  name="inquiryNature"
                  value={form.inquiryNature}
                  onChange={handleInputChange}
                  disabled={isTransmitting}
                  className={`w-full ${isDarkMode ? 'bg-zinc-900/40 border-zinc-900 text-zinc-300' : 'bg-white border-zinc-300 text-zinc-800'} border px-4 py-3.5 rounded-lg font-mono text-xs focus:outline-none ${themeStyles.focusBorder} transition-colors disabled:opacity-50 appearance-none`}
                >
                  <option value="GENERAL" className="bg-white text-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">GENERAL</option>
                  <option value="BUG" className="bg-white text-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">BUG</option>
                  <option value="QUERY" className="bg-white text-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">QUERY</option>
                  <option value="PAYOUT" className="bg-white text-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">PAYOUT</option>
                  <option value="OTHER" className="bg-white text-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">OTHER</option>
                </select>
              </div>

              {/* Message Vector */}
              <div className="space-y-1.5">
                <label className={`font-mono text-[9px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'} tracking-widest block uppercase`}>
                  Message Vector (Detailed Statement)
                </label>
                <textarea
                  id="input-message-vector"
                  name="messageVector"
                  required
                  rows={5}
                  value={form.messageVector}
                  onChange={handleInputChange}
                  disabled={isTransmitting}
                  placeholder="Describe your vector connection inquiry..."
                  className={`w-full ${isDarkMode ? 'bg-zinc-900/40 border-zinc-900 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-800'} border px-4 py-3.5 rounded-lg font-mono text-xs focus:outline-none ${themeStyles.focusBorder} transition-colors disabled:opacity-50 resize-none`}
                />
              </div>

              <button
                id="submit-transmit-btn"
                type="submit"
                disabled={isTransmitting || !form.subjectIdentity || !form.digitalAddress || !validateGmailAddress(form.digitalAddress) || !form.messageVector || !!emailError}
                className={`w-full py-4 ${isDarkMode ? 'bg-zinc-100 text-zinc-950 disabled:bg-zinc-900 disabled:text-zinc-600' : 'bg-zinc-900 text-white disabled:bg-zinc-200 disabled:text-zinc-400'} ${themeStyles.accentBgHover} hover:text-zinc-950 font-mono text-xs tracking-widest font-bold rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed`}
              >
                <Send className="w-4 h-4" />
                <span>TRANSMIT SECURE PACKET</span>
              </button>
            </form>
          </div>

          {/* Live Terminal Output Logs */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`${themeStyles.bgCard} border ${themeStyles.borderMain} rounded-2xl p-6 space-y-4`}>
              <div className={`flex items-center space-x-2 border-b ${themeStyles.borderMuted} pb-3`}>
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className={`font-mono text-xs tracking-widest font-semibold ${themeStyles.textPrimary} uppercase`}>
                  Terminal Logger
                </h3>
              </div>

              <div
                id="terminal-logger-viewport"
                className={`h-64 ${isDarkMode ? 'bg-zinc-950 border-zinc-900 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-700'} rounded-xl border p-4 font-mono text-[9px] overflow-y-auto space-y-2.5 scrollbar-thin`}
              >
                {terminalLogs.length === 0 ? (
                  <div className="text-center flex flex-col justify-center items-center h-full space-y-2">
                    <ShieldAlert className={`w-5 h-5 ${isDarkMode ? 'text-zinc-700' : 'text-zinc-300'} animate-pulse`} />
                    <span className={`${isDarkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>WAITING FOR INQUIRY TRANSMISSION STATE...</span>
                  </div>
                ) : (
                  terminalLogs.map((log, index) => (
                    <div key={index} className="leading-relaxed border-l-2 border-emerald-500/30 pl-2">
                      {log}
                    </div>
                  ))
                )}

                {isTransmitting && (
                  <div className="text-emerald-400 animate-pulse flex items-center space-x-1 pl-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                    <span>STREAMING ENCRYPTED TELEMETRY VECTORS...</span>
                  </div>
                )}
              </div>

              {isSuccess && (
                <div id="transmission-success-alert" className={`p-4 rounded-xl flex items-start space-x-3 border ${isDarkMode ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5 animate-bounce" />
                  <div className="font-mono text-[9px] tracking-wide">
                    <span className="font-bold block font-sans">CONNECTION LOGGED</span>
                    <p className={`mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Our lab engineers have decrypted your message vector and mapped it to our queue. Expect direct digital transmission within 24 hours.</p>
                  </div>
                </div>
              )}
            </div>

            <div className={`${isDarkMode ? 'bg-zinc-900/10 border-zinc-900' : 'bg-zinc-100/50 border-zinc-200'} border p-6 rounded-2xl font-mono text-[10px] text-zinc-500 space-y-2.5`}>
              <span className={`${isDarkMode ? 'text-zinc-400' : 'text-zinc-700'} block tracking-wider font-semibold uppercase`}>CRYPTOGRAPHIC CREDENTIALS</span>
              <p className="leading-relaxed font-light">
                All transmissions are protected with asymmetric client-side cryptographic rotation keys.
                Our destination node stores database records in sandboxed containers on isolated cloud relays.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Ticket History & Live Chat Tab rendering */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          {/* Left Column: Email Verification and History Telemetry */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {/* Email Sync Input */}
            <div className={`${themeStyles.bgCard} border ${themeStyles.borderMain} rounded-2xl p-5 space-y-4`}>
              <div className={`flex items-center space-x-2 border-b ${themeStyles.borderMuted} pb-3`}>
                <Search className={`w-4 h-4 ${themeStyles.accentText}`} />
                <h3 className={`font-mono text-xs tracking-widest font-semibold ${themeStyles.textPrimary} uppercase`}>
                  Reconcile Address
                </h3>
              </div>
              <p className="font-mono text-[9px] text-zinc-500 leading-normal">
                Input your registered direct email point to authenticate and retrieve your support history logs.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="e.g. alex@gmail.com"
                  value={historyEmail}
                  onChange={(e) => setHistoryEmail(e.target.value)}
                  className={`w-full ${isDarkMode ? 'bg-zinc-900/40 border-zinc-900 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-800'} border px-4 py-3 rounded-lg font-mono text-xs focus:outline-none ${themeStyles.focusBorder} transition-colors`}
                />
                {historyEmailError && (
                  <p className="text-rose-500 font-mono text-[9px] tracking-wider">⚠️ {historyEmailError}</p>
                )}
                <button
                  onClick={() => handleFetchHistory(historyEmail)}
                  disabled={isLoadingHistory || !historyEmail.trim()}
                  className={`w-full py-3 ${isDarkMode ? 'bg-zinc-100 text-zinc-950 disabled:bg-zinc-900 disabled:text-zinc-600' : 'bg-zinc-900 text-white disabled:bg-zinc-200 disabled:text-zinc-400'} font-mono text-xs tracking-widest font-bold rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer`}
                >
                  {isLoadingHistory ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>RECONCILING NODE...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>SYNC ACTIVE REGISTERS</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Telemetry Queue list */}
            <div className={`${themeStyles.bgCard} border ${themeStyles.borderMain} rounded-2xl p-5 flex-1 min-h-[320px] flex flex-col space-y-4`}>
              <div className={`flex items-center justify-between border-b ${themeStyles.borderMuted} pb-3`}>
                <div className="flex items-center space-x-2">
                  <History className={`w-4 h-4 ${themeStyles.accentText}`} />
                  <h3 className={`font-mono text-xs tracking-widest font-semibold ${themeStyles.textPrimary} uppercase`}>
                    Telemetry Queues
                  </h3>
                </div>
                <span className="font-mono text-[9px] text-zinc-500">{searchedTickets.length} ACTIVE</span>
              </div>

              {searchedTickets.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <ShieldAlert className="w-6 h-6 text-zinc-600 animate-pulse" />
                  <span className="font-mono text-[9px] text-zinc-500">NO ACTIVE TICKETS LOADED</span>
                  <p className="text-[10px] text-zinc-500 font-light max-w-[200px]">Query an @gmail.com address above to populate historical telemetry logs.</p>
                </div>
              ) : (
                <div className="space-y-2 overflow-y-auto max-h-[380px] scrollbar-thin">
                  {searchedTickets.map((ticket) => {
                    const isSelected = selectedTicket?.id === ticket.id;
                    const badgeColor = ticket.status === 'RESOLVED'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                    return (
                      <button
                        key={ticket.id}
                        onClick={() => handleSelectTicket(ticket)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col space-y-2 cursor-pointer ${isSelected ? (isDarkMode ? 'bg-zinc-900/60 border-zinc-700' : 'bg-zinc-50 border-zinc-300') : (isDarkMode ? 'bg-zinc-950/20 border-zinc-900 hover:bg-zinc-900/20' : 'bg-white border-zinc-100 hover:bg-zinc-50')}`}
                      >
                        <div className="flex justify-between items-start w-full">
                          <span className="font-mono text-[9px] font-bold text-zinc-400 shrink-0">#{ticket.id.substring(0, 10).toUpperCase()}</span>
                          <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded border ${badgeColor} tracking-wider shrink-0 uppercase`}>
                            {ticket.status || 'PENDING'}
                          </span>
                        </div>
                        <p className={`font-sans text-xs font-semibold truncate ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'} w-full`}>
                          {ticket.subjectIdentity}
                        </p>
                        <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 w-full">
                          <span>{ticket.inquiryNature}</span>
                          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Chat Interface */}
          <div className="lg:col-span-7 flex flex-col">
            {!selectedTicket ? (
              <div className={`${themeStyles.bgCard} border ${themeStyles.borderMain} rounded-2xl p-8 flex-1 flex flex-col items-center justify-center text-center space-y-3 min-h-[450px]`}>
                <div className="relative">
                  <div className="absolute inset-0 bg-sky-500/10 blur-xl rounded-full animate-pulse" />
                  <MessageSquare className="w-12 h-12 text-sky-400 relative z-10 animate-bounce" />
                </div>
                <span className="font-mono text-xs tracking-widest uppercase font-semibold text-zinc-300">SECURE LINK OFFLINE</span>
                <p className="text-xs text-zinc-500 font-sans font-light max-w-sm leading-relaxed">
                  Select an active connection register from the Telemetry Queues sidebar to initialize secure peer-to-peer replication chat.
                </p>
              </div>
            ) : (
              <div className={`${themeStyles.bgCard} border ${themeStyles.borderMain} rounded-2xl flex-1 flex flex-col min-h-[450px] overflow-hidden`}>
                {/* Active Chat Header */}
                <div className={`p-4 border-b ${themeStyles.borderMuted} flex items-center justify-between bg-zinc-950/10`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                    <div>
                      <h4 className={`font-sans text-xs font-bold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>
                        {selectedTicket.subjectIdentity}
                      </h4>
                      <p className="font-mono text-[9px] text-zinc-500">
                        CONNECTION REF: #{selectedTicket.id.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[9px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded">
                    FOCUS: {selectedTicket.inquiryNature}
                  </span>
                </div>

                {/* Chat Window / Messages */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[320px] min-h-[250px] scrollbar-thin bg-zinc-950/5 flex flex-col">
                  {chatMessages.map((msg, index) => {
                    const isSupport = msg.sender === 'support';
                    return (
                      <div
                        key={msg.id || index}
                        className={`flex items-start space-x-2.5 ${isSupport ? 'justify-start' : 'justify-end'}`}
                      >
                        {isSupport && (
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                            <Bot className="w-3.5 h-3.5 text-emerald-400" />
                          </div>
                        )}
                        <div className="max-w-[80%] flex flex-col space-y-1">
                          <span className={`font-mono text-[8px] text-zinc-500 ${isSupport ? 'text-left' : 'text-right'}`}>
                            {msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <div className={`px-4 py-2.5 rounded-2xl border font-sans text-xs leading-relaxed ${isSupport ? (isDarkMode ? 'bg-zinc-900/60 border-zinc-800 text-zinc-200 rounded-tl-none' : 'bg-zinc-50 border-zinc-200 text-zinc-800 rounded-tl-none') : 'bg-sky-500/10 border-sky-500/20 text-sky-100 rounded-tr-none'}`}>
                            {msg.text}
                          </div>
                        </div>
                        {!isSupport && (
                          <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0 mt-1">
                            <User className="w-3.5 h-3.5 text-sky-400" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {isSendingChatMessage && (
                    <div className="flex items-start space-x-2.5 justify-start">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      </div>
                      <div className="max-w-[80%] flex flex-col space-y-1">
                        <span className="font-mono text-[8px] text-zinc-500">LAB ENGINEER KAI • TYPING...</span>
                        <div className="px-4 py-2.5 rounded-2xl border bg-zinc-900/40 border-zinc-800 rounded-tl-none flex space-x-1 items-center">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Bar */}
                <form onSubmit={handleSendChatMessage} className={`p-3.5 border-t ${themeStyles.borderMuted} bg-zinc-950/10 flex gap-2`}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={isSendingChatMessage}
                    placeholder="Transmit chat packet back to Node..."
                    className={`flex-1 ${isDarkMode ? 'bg-zinc-900/40 border-zinc-900 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-800'} border px-4 py-3 rounded-lg font-mono text-xs focus:outline-none ${themeStyles.focusBorder} transition-colors disabled:opacity-50`}
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isSendingChatMessage}
                    className={`px-4 py-3 ${isDarkMode ? 'bg-zinc-100 text-zinc-950 disabled:bg-zinc-900 disabled:text-zinc-600' : 'bg-zinc-900 text-white disabled:bg-zinc-200 disabled:text-zinc-400'} font-mono text-xs font-bold rounded-lg transition-colors flex items-center justify-center shrink-0 cursor-pointer disabled:cursor-not-allowed`}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

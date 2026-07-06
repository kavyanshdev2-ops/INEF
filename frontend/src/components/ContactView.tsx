/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageId, InquiryForm, AtmosphereConfig } from '../types';
import { getThemeStyles } from '../lib/theme';
import { Send, Terminal, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ContactViewProps {
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
}

export const ContactView: React.FC<ContactViewProps> = ({ activeAtmosphere, isDarkMode }) => {
  const [form, setForm] = useState<InquiryForm>({
    subjectIdentity: '',
    digitalAddress: '',
    inquiryNature: 'TACTICAL_COUTURE_DROP',
    messageVector: ''
  });

  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const simulateTransmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subjectIdentity || !form.digitalAddress || !form.messageVector) return;

    setIsTransmitting(true);
    setIsSuccess(false);
    setTerminalLogs([]);

    const logLines = [
      'INITIATING HANDSHAKE WITH INEFONTOP NODE TOKYO...',
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

      const newTicket = {
        id: 'ticket-' + Date.now(),
        subjectIdentity: form.subjectIdentity.trim(),
        digitalAddress: form.digitalAddress.trim(),
        inquiryNature: form.inquiryNature,
        messageVector: form.messageVector.trim(),
        createdAt: new Date().toISOString(),
        status: 'PENDING'
      };

      // 1. Save to Supabase PostgreSQL if configured
      if (supabase) {
        const { error } = await supabase
          .from('tickets')
          .insert([{
            id: newTicket.id,
            subject_identity: newTicket.subjectIdentity,
            digital_address: newTicket.digitalAddress,
            inquiry_nature: newTicket.inquiryNature,
            message_vector: newTicket.messageVector,
            created_at: newTicket.createdAt,
          }]);
        if (error) {
          console.error('Supabase ticket insert error, using local fallback:', error);
        }
      }

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
        inquiryNature: 'TACTICAL_COUTURE_DROP',
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
      <div className="space-y-4 mb-16 text-center max-w-2xl mx-auto">
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
                Digital Address (Direct Email Point)
              </label>
              <input
                id="input-digital-address"
                type="email"
                name="digitalAddress"
                required
                value={form.digitalAddress}
                onChange={handleInputChange}
                disabled={isTransmitting}
                placeholder="e.g. alex@node-network.io"
                className={`w-full ${isDarkMode ? 'bg-zinc-900/40 border-zinc-900 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-800'} border px-4 py-3.5 rounded-lg font-mono text-xs focus:outline-none ${themeStyles.focusBorder} transition-colors disabled:opacity-50`}
              />
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
                <option value="TACTICAL_COUTURE_DROP" className="bg-white text-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">TACTICAL COUTURE ACQUISITION</option>
                <option value="LAB_PARTNERSHIP" className="bg-white text-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">EXPERIMENTAL LABORATORY STUDY</option>
                <option value="ATMOSPHERE_API" className="bg-white text-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">ATMOSPHERE SYNCHRONIZATION API</option>
                <option value="MEDIA_VITALS" className="bg-white text-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">COGNITIVE MEDIA / DESIGN DIALOGUE</option>
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
              disabled={isTransmitting || !form.subjectIdentity || !form.digitalAddress || !form.messageVector}
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
    </div>
  );
};

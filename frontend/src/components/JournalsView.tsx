/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AtmosphereConfig } from '../types';
import { getThemeStyles } from '../lib/theme';
import { PenTool, BookOpen, User, Calendar, Trash2, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Sparkles, Filter, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface JournalEntry {
  id: string;
  author: string;
  title: string;
  story: string;
  date: string;
  mood: 'classic' | 'neon-mint' | 'crimson-moon' | 'monochrome';
  wordsCount: number;
  createdBy?: string;
}

interface JournalsViewProps {
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
  currentUser: string | null;
}

const MOOD_IMAGES = {
  'classic': 'https://images.unsplash.com/photo-1522083165195-3427ec02927a?q=80&w=600&auto=format&fit=crop',
  'neon-mint': 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?q=80&w=600&auto=format&fit=crop',
  'crimson-moon': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
  'monochrome': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
};

const MOOD_LABELS = {
  'classic': 'CLASSIC DRIFT',
  'neon-mint': 'NEON EMERALD',
  'crimson-moon': 'CRIMSON MOON',
  'monochrome': 'CHALK COUTURE',
};

const INITIAL_JOURNALS: JournalEntry[] = [
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

export const JournalsView: React.FC<JournalsViewProps> = ({ activeAtmosphere, isDarkMode, currentUser }) => {
  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);
  
  // State
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [mood, setMood] = useState<'classic' | 'neon-mint' | 'crimson-moon' | 'monochrome'>('classic');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'classic' | 'neon-mint' | 'crimson-moon' | 'monochrome'>('all');
  
  const [showForm, setShowForm] = useState(false);
  const [expandedEntries, setExpandedEntries] = useState<Record<string, boolean>>({});
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [sessionCreatedIds, setSessionCreatedIds] = useState<string[]>([]);

  // Automatically prefill author if user is logged in
  useEffect(() => {
    if (currentUser) {
      setAuthor(currentUser);
    } else {
      setAuthor('');
    }
  }, [currentUser, showForm]);

  // Load Journals from Supabase or localStorage
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        if (supabase) {
          const { data, error } = await supabase
            .from('journals')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data && data.length > 0) {
            const mapped: JournalEntry[] = data.map((item: any) => ({
              id: item.id,
              author: item.author,
              title: item.title,
              story: item.story,
              date: item.date,
              mood: item.mood,
              wordsCount: item.wordsCount || item.story.split(/\s+/).filter(Boolean).length,
              createdBy: item.createdBy || item.author,
            }));
            setJournals(mapped);
            return;
          } else if (error) {
            console.warn('Supabase journal fetch failed or empty, using localStorage:', error);
          }
        }

        const cached = localStorage.getItem('inefontop_journals');
        if (cached) {
          setJournals(JSON.parse(cached));
        } else {
          localStorage.setItem('inefontop_journals', JSON.stringify(INITIAL_JOURNALS));
          setJournals(INITIAL_JOURNALS);
        }
      } catch (err) {
        setJournals(INITIAL_JOURNALS);
      }
    };
    fetchJournals();

    // Load session created ids if any
    const savedSessionIds = sessionStorage.getItem('session_created_journal_ids');
    if (savedSessionIds) {
      try {
        setSessionCreatedIds(JSON.parse(savedSessionIds));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Helper to count words
  const countWords = (text: string): number => {
    if (!text || text.trim() === '') return 0;
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
  };

  const currentWords = countWords(story);
  const isOverLimit = currentWords > 3000;

  // Handle story text area input with physically enforced word limit of 3000
  const handleStoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    
    if (words.length <= 3000) {
      setStory(text);
    } else {
      // Reconstruct exactly up to 3000 words to enforce hard cap
      const truncated = text.split(/\s+/).slice(0, 3000).join(' ');
      setStory(truncated);
    }
  };

  // Submit new entry
  const handleSubmitEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !title.trim() || !story.trim() || isOverLimit) return;

    try {
      const wordsCount = story.trim().split(/\s+/).filter(w => w.length > 0).length;
      const newEntry: JournalEntry = {
        id: 'journal-' + Date.now(),
        author: author.trim(),
        title: title.trim(),
        story: story.trim(),
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }).toUpperCase(),
        mood,
        wordsCount,
        createdBy: currentUser || 'anonymous'
      };

      // 1. Save to Supabase if configured
      if (supabase) {
        const { error } = await supabase
          .from('journals')
          .insert([{
            id: newEntry.id,
            author: newEntry.author,
            title: newEntry.title,
            story: newEntry.story,
            date: newEntry.date,
            mood: newEntry.mood,
            wordsCount: newEntry.wordsCount,
            createdBy: newEntry.createdBy
          }]);
        if (error) {
          console.warn('Supabase write error, using fallback:', error);
        }
      }

      // 2. Replication write to local cache
      const cached = localStorage.getItem('inefontop_journals');
      const existingJournals: JournalEntry[] = cached ? JSON.parse(cached) : INITIAL_JOURNALS;
      const updatedJournals = [newEntry, ...existingJournals];
      localStorage.setItem('inefontop_journals', JSON.stringify(updatedJournals));
      setJournals(updatedJournals);

      // Log to audit log
      const existingLogsRaw = localStorage.getItem('inefontop_audit_logs');
      const existingLogs = existingLogsRaw ? JSON.parse(existingLogsRaw) : [];
      existingLogs.push(`[JOURNAL] NEW ENTRY TRANSMITTED: "${title.trim().toUpperCase()}" BY ${author.trim().toUpperCase()}`);
      localStorage.setItem('inefontop_audit_logs', JSON.stringify(existingLogs));

      // Also push audit log to Supabase if configured
      if (supabase) {
        await supabase.from('audit_logs').insert([{ message: `[JOURNAL] NEW ENTRY TRANSMITTED: "${title.trim().toUpperCase()}" BY ${author.trim().toUpperCase()}` }]);
      }

      // Update session IDs
      const updatedSessionIds = [...sessionCreatedIds, newEntry.id];
      setSessionCreatedIds(updatedSessionIds);
      sessionStorage.setItem('session_created_journal_ids', JSON.stringify(updatedSessionIds));

      // Reset Form
      setAuthor(currentUser || '');
      setTitle('');
      setStory('');
      setMood('classic');
      setShowForm(false);
      
      // Toast Alert
      setSuccessToast('TRANSMITTED JOURNAL ENTRY');
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err: any) {
      alert('Local vector error transmitting journal entry.');
    }
  };

  // Delete entry
  const handleDeleteEntry = async (id: string) => {
    const journal = journals.find(j => j.id === id);
    if (!journal) return;

    const isAdmin = currentUser?.toLowerCase() === 'kavyanshshakya' || currentUser?.toLowerCase() === 'admin';
    const canDelete = isAdmin || (currentUser && (journal.createdBy?.toLowerCase() === currentUser.toLowerCase() || journal.author?.toLowerCase() === currentUser.toLowerCase())) || sessionCreatedIds.includes(journal.id);

    if (!canDelete) {
      alert('ACCESS DENIED: You are not authorized to delete other writers\' entries.');
      return;
    }

    const confirmDel = window.confirm(`Are you sure you want to delete "${journal.title}"?`);
    if (!confirmDel) return;

    try {
      // 1. Delete from Supabase
      if (supabase) {
        const { error } = await supabase
          .from('journals')
          .delete()
          .eq('id', id);
        if (error) {
          console.warn('Supabase delete error:', error);
        }
      }

      // 2. Replicate locally
      const cached = localStorage.getItem('inefontop_journals');
      if (cached) {
        const existingJournals: JournalEntry[] = JSON.parse(cached);
        const filtered = existingJournals.filter(j => j.id !== id);
        localStorage.setItem('inefontop_journals', JSON.stringify(filtered));
        setJournals(filtered);
      }

      // Log to audit log
      const existingLogsRaw = localStorage.getItem('inefontop_audit_logs');
      const existingLogs = existingLogsRaw ? JSON.parse(existingLogsRaw) : [];
      existingLogs.push(`[JOURNAL] REMOVED ENTRY: "${journal.title.toUpperCase()}" BY ${journal.author.toUpperCase()}`);
      localStorage.setItem('inefontop_audit_logs', JSON.stringify(existingLogs));

      if (supabase) {
        await supabase.from('audit_logs').insert([{ message: `[JOURNAL] REMOVED ENTRY: "${journal.title.toUpperCase()}" BY ${journal.author.toUpperCase()}` }]);
      }

      setSuccessToast('REMOVED JOURNAL ENTRY');
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err) {
      alert('Local vector error deleting journal entry.');
    }
  };

  // Toggle single story expansion
  const toggleExpand = (id: string) => {
    setExpandedEntries(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredJournals = selectedFilter === 'all'
    ? journals
    : journals.filter(j => j.mood === selectedFilter);

  return (
    <div id="journals-view-container" className={`max-w-7xl mx-auto px-6 py-24 pt-32 ${themeStyles.textPrimary}`}>
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className={`font-mono text-xs tracking-[0.3em] ${themeStyles.accentText} uppercase block`}>
          ARCHIVE // COMMUNITY TRANSMISSIONS
        </span>
        <h2 className="text-4xl md:text-6xl font-sans tracking-tight font-extrabold uppercase">
          INEFONTOP JOURNALS
        </h2>
        <p className={`${themeStyles.textSecondary} font-sans text-sm md:text-base font-light leading-relaxed`}>
          A space to record thoughts, digital logs, sensory studies, and custom server experiences. Every entry is persistent and structured with high-contrast tactical framing.
        </p>

        <div className="pt-4 flex justify-center">
          <button
            id="toggle-write-journal-btn"
            onClick={() => setShowForm(!showForm)}
            className={`px-6 py-3 font-mono text-xs tracking-widest font-bold rounded-xl transition-all flex items-center space-x-2 border shadow-lg cursor-pointer ${
              showForm
                ? 'bg-rose-950 text-rose-200 border-rose-900/50'
                : `${isDarkMode ? 'bg-zinc-100 text-zinc-950 border-white hover:bg-white' : 'bg-zinc-900 text-white border-zinc-950 hover:bg-zinc-800'}`
            }`}
          >
            <PenTool className="w-4 h-4 animate-pulse" />
            <span>{showForm ? 'CANCEL WRITING' : 'WRITE NEW JOURNAL ENTRY'}</span>
          </button>
        </div>
      </div>

      {/* Success Toast Notification */}
      {successToast && (
        <div id="journal-toast-success" className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] tracking-widest px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-slide-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Write Entry Form Container */}
      {showForm && (
        <div 
          id="write-journal-form-panel"
          className={`max-w-2xl mx-auto ${themeStyles.bgCard} border ${themeStyles.borderMain} rounded-2xl p-6 md:p-8 space-y-6 mb-16 shadow-2xl`}
        >
          <div className={`flex items-center space-x-2 border-b ${themeStyles.borderMuted} pb-4`}>
            <Sparkles className={`w-4 h-4 ${themeStyles.accentText}`} />
            <h3 className={`font-mono text-xs tracking-widest font-semibold ${themeStyles.textPrimary} uppercase`}>
              Compile Journal Transmission
            </h3>
          </div>

          <form onSubmit={handleSubmitEntry} className="space-y-5">
            {/* Identity & Title row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className={`font-mono text-[9px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'} tracking-widest block uppercase`}>
                  AUTHOR IDENTITY (NAME / ENTITY)
                </label>
                <div className="relative">
                  <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${themeStyles.textMuted}`} />
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. SUBJECT_04"
                    className={`w-full ${isDarkMode ? 'bg-zinc-900/40 border-zinc-900 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-800'} border pl-11 pr-4 py-3.5 rounded-lg font-mono text-xs focus:outline-none ${themeStyles.focusBorder} transition-colors`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`font-mono text-[9px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'} tracking-widest block uppercase`}>
                  JOURNAL TITLE
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Atmospheric Drift Paradox"
                  className={`w-full ${isDarkMode ? 'bg-zinc-900/40 border-zinc-900 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-800'} border px-4 py-3.5 rounded-lg font-mono text-xs focus:outline-none ${themeStyles.focusBorder} transition-colors`}
                />
              </div>
            </div>

            {/* Backdrop / Mood Style */}
            <div className="space-y-1.5">
              <label className={`font-mono text-[9px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'} tracking-widest block uppercase`}>
                BACKDROP ART MOOD (MATCHES THEME CARD STYLE)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(Object.keys(MOOD_LABELS) as Array<keyof typeof MOOD_LABELS>).map((key) => {
                  const isActive = mood === key;
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setMood(key)}
                      className={`px-3 py-2.5 font-mono text-[9px] tracking-widest border rounded-lg transition-all text-center cursor-pointer ${
                        isActive
                          ? `${themeStyles.accentBg} text-zinc-950 font-bold border-white`
                          : `${themeStyles.bgCard} ${themeStyles.textSecondary} ${themeStyles.borderMuted} hover:${themeStyles.textPrimary}`
                      }`}
                    >
                      {MOOD_LABELS[key]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Story text Area */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className={`font-mono text-[9px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'} tracking-widest block uppercase`}>
                  JOURNAL NARRATIVE (STORY)
                </label>
                <div className={`font-mono text-[9px] ${currentWords > 2800 ? 'text-rose-500 animate-pulse' : themeStyles.textSecondary}`}>
                  {currentWords} / 3000 WORDS
                </div>
              </div>
              <textarea
                required
                value={story}
                onChange={handleStoryChange}
                placeholder="Compose your story here... Limit 3,000 words. Real-time validation active."
                className={`w-full h-48 ${isDarkMode ? 'bg-zinc-900/40 border-zinc-900 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-800'} border px-4 py-3.5 rounded-lg font-sans text-xs focus:outline-none ${themeStyles.focusBorder} transition-colors resize-none leading-relaxed`}
              />
              {/* Progress Bar of Words limit */}
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    currentWords > 2800 
                      ? 'bg-rose-500' 
                      : currentWords > 1500 
                        ? 'bg-amber-400' 
                        : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min((currentWords / 3000) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Submit btn */}
            <button
              id="submit-journal-entry-btn"
              type="submit"
              disabled={!author.trim() || !title.trim() || !story.trim() || currentWords > 3000}
              className={`w-full py-4 ${isDarkMode ? 'bg-zinc-100 text-zinc-950 disabled:bg-zinc-900 disabled:text-zinc-600' : 'bg-zinc-900 text-white disabled:bg-zinc-200 disabled:text-zinc-400'} font-mono text-xs tracking-widest font-bold rounded-xl transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed`}
            >
              <PenTool className="w-4 h-4" />
              <span>TRANSMIT TO SERVER REGISTRY</span>
            </button>
          </form>
        </div>
      )}

      {/* Mood Filter Controls */}
      <div id="journals-mood-filters" className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-zinc-800 pb-6 max-w-lg mx-auto">
        <span className={`font-mono text-[9px] ${themeStyles.textSecondary} uppercase tracking-widest mr-2`}>
          Filter Mood:
        </span>
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3.5 py-1.5 font-mono text-[9px] tracking-widest rounded-full border transition-all cursor-pointer ${
            selectedFilter === 'all'
              ? `${themeStyles.accentBg} text-zinc-950 border-white font-bold`
              : `${themeStyles.bgCard} ${themeStyles.textSecondary} ${themeStyles.borderMuted}`
          }`}
        >
          ALL ARCHIVE
        </button>
        {(Object.keys(MOOD_LABELS) as Array<keyof typeof MOOD_LABELS>).map((key) => {
          const isSelected = selectedFilter === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedFilter(key)}
              className={`px-3.5 py-1.5 font-mono text-[9px] tracking-widest rounded-full border transition-all cursor-pointer ${
                isSelected
                  ? `${themeStyles.accentBg} text-zinc-950 border-white font-bold`
                  : `${themeStyles.bgCard} ${themeStyles.textSecondary} ${themeStyles.borderMuted}`
              }`}
            >
              {MOOD_LABELS[key].split(' ')[0]}
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredJournals.length === 0 && (
        <div id="journals-empty-state" className="text-center py-24 max-w-md mx-auto space-y-4">
          <AlertCircle className={`w-12 h-12 ${themeStyles.textMuted} mx-auto animate-pulse`} />
          <h3 className={`font-sans text-lg font-bold text-white uppercase`}>No records decrypted</h3>
          <p className={`${themeStyles.textSecondary} text-xs font-light`}>
            No journal entries matching the chosen mood filter exist in the digital vault. Compile a new transmission.
          </p>
        </div>
      )}

      {/* Journals Grid (Card style like the Shop) */}
      <div id="journals-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredJournals.map((journal) => {
          const isExpanded = !!expandedEntries[journal.id];
          // Truncate story if not expanded
          const previewText = journal.story.length > 180 
            ? `${journal.story.slice(0, 180)}...` 
            : journal.story;

          return (
            <div
              id={`journal-card-${journal.id}`}
              key={journal.id}
              className={`group ${themeStyles.bgCard} border ${themeStyles.borderMuted} hover:border-zinc-500/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl`}
            >
              {/* Mood Image Backdrop (exactly like Shop product image) */}
              <div className="relative h-48 overflow-hidden bg-zinc-950">
                <img
                  src={MOOD_IMAGES[journal.mood]}
                  alt={journal.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-75 group-hover:brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-70" />

                {/* Floating Badge (exactly like shop tag badge) */}
                <div className="absolute top-4 left-4">
                  <span className="bg-zinc-950/85 backdrop-blur-md text-zinc-100 border border-zinc-800/80 px-3 py-1 rounded-full font-mono text-[9px] tracking-widest font-bold uppercase">
                    {MOOD_LABELS[journal.mood]}
                  </span>
                </div>

                {/* Floating words count */}
                <div className="absolute bottom-4 right-4 bg-zinc-950/80 backdrop-blur-md border border-zinc-800/60 px-2.5 py-1 rounded-lg flex items-center space-x-1 font-mono text-[9px] text-zinc-300">
                  <BookOpen className="w-3 h-3 text-rose-400" />
                  <span className="font-bold">{journal.wordsCount} WORDS</span>
                </div>
              </div>

              {/* Journal Info Content */}
              <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-zinc-400 font-mono text-[8px] tracking-[0.2em]">
                      <span className="flex items-center space-x-1">
                        <User className="w-2.5 h-2.5" />
                        <span className="font-bold">{journal.author.toUpperCase()}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-2.5 h-2.5" />
                        <span>{journal.date}</span>
                      </span>
                    </div>
                    <h3 className="font-sans text-lg font-bold text-white uppercase tracking-wide pt-1">
                      {journal.title}
                    </h3>
                  </div>

                  <p className={`${themeStyles.textSecondary} text-xs font-light leading-relaxed whitespace-pre-line`}>
                    {isExpanded ? journal.story : previewText}
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between gap-3 border-t border-zinc-900/40">
                  {/* Expand/Collapse story */}
                  {journal.story.length > 180 ? (
                    <button
                      onClick={() => toggleExpand(journal.id)}
                      className="text-[10px] font-mono tracking-widest font-bold uppercase text-zinc-400 hover:text-white flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <span>SHOW LESS</span>
                          <ChevronUp className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <span>READ FULL STORY</span>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-[9px] font-mono text-zinc-600">COMPLETE RECORD</span>
                  )}

                  {/* Delete Button / Lock Indicator */}
                  {(() => {
                    const isAdminUser = currentUser?.toLowerCase() === 'kavyanshshakya' || currentUser?.toLowerCase() === 'admin';
                    const canDelete = isAdminUser || (currentUser && (journal.createdBy?.toLowerCase() === currentUser.toLowerCase() || journal.author?.toLowerCase() === currentUser.toLowerCase())) || sessionCreatedIds.includes(journal.id);

                    if (canDelete) {
                      return (
                        <button
                          onClick={() => handleDeleteEntry(journal.id)}
                          className="p-1.5 text-zinc-600 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-950/20 cursor-pointer"
                          title="Delete entry from register"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      );
                    } else {
                      return (
                        <span 
                          className="p-1.5 text-zinc-700 hover:text-zinc-500 transition-colors flex items-center space-x-1" 
                          title="Protected: Only the author or administrator can delete this journal entry."
                        >
                          <Lock className="w-3.5 h-3.5 text-zinc-700" />
                          <span className="text-[8px] font-mono tracking-wider font-bold">SECURE</span>
                        </span>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

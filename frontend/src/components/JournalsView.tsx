/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AtmosphereConfig, JournalPost } from '../types';
import { getThemeStyles } from '../lib/theme';
import { BooksShowcase, BookCfg } from './BooksShowcase';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Sparkles,
  Calendar,
  User,
  Clock,
  Star,
  X,
  Book,
  Layers,
  Trash2,
  Edit3,
  Bookmark,
  Share2,
  Check
} from 'lucide-react';

interface JournalsViewProps {
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
  currentUser?: any;
}

const STORAGE_KEY = 'ineffable_journals_v1';

const defaultSampleBooks: (BookCfg & { content: string; category: string; date: string; readTime: string })[] = [
  {
    id: '1',
    title: 'The Cybernetics of Atmospheric UI',
    author: 'Kavyansh Shakya',
    year: '2026',
    stars: 5,
    desc: 'Exploring fluid particle canvas loops, dark mode luminescence, and brutalist typographic hierarchy in modern web applications.',
    content: `## Chapter 01: The Cybernetic Canvas
Modern user interfaces have evolved beyond static flat boxes into reactive, fluid environments. By pairing WebGL canvas loops with dark-mode luminescence, we construct interfaces that feel alive, responsive, and deeply atmospheric.

## Chapter 02: Particle Physics & Kinetic Energy
When a user moves their cursor across the viewport, ambient particles react to gravitational pull and velocity vectors. This kinetic feedback bridges physical intuition with digital software.

## Chapter 03: Brutalist Typographic Hierarchy
High-contrast typography cuts through ambient canvas reflections, giving users clear structural anchors while preserving aesthetic depth.

## Chapter 04: Future Frontiers
As GPU acceleration in web browsers continues to mature, real-time shaders and 3D UI components will replace traditional 2D DOM cards entirely.`,
    category: 'DESIGN ARCHITECTURE',
    date: '2026-07-30',
    readTime: '4 MIN READ',
    chapters: ['01. The Cybernetic Canvas', '02. Particle Physics', '03. Brutalist Typography', '04. Future Frontiers'],
    spineBg: '#881337',
    spineInk: '#fecdd3',
    backBg: '#4c0519',
    backInk: '#fecdd3',
    edge: '#ffe4e6'
  },
  {
    id: '2',
    title: 'Minecraft Season 5: Mystical Tier',
    author: 'Sanctuary Team',
    year: '2026',
    stars: 5,
    desc: 'Announcing custom enchantments, 4-row ender backpacks, and virtual anvils for all Mystical rank members.',
    content: `## Season 5 Release Notes & Mystical Mechanics
We are excited to unveil Season 5 of the Ineffable Survival Network! This update introduces high-tier RPG mechanics, custom enchanted weapons, and expanded player vaults.

### Core Highlights:
- **Mystical Rank Tier**: Access to exclusive 4-row portable ender backpacks and virtual anvils anywhere in the world.
- **Custom Enchantments**: Soulbound I, Kinetic Impact III, and Chrono Recall.
- **Economy & Market**: Player-driven auction houses with live trade metrics.`,
    category: 'COMMUNITY ANNOUNCEMENT',
    date: '2026-07-22',
    readTime: '6 MIN READ',
    chapters: ['01. Overview', '02. Mystical Tier Benefits', '03. Custom Enchantments', '04. Economy Updates'],
    spineBg: '#0f766e',
    spineInk: '#ccfbf1',
    backBg: '#134e4a',
    backInk: '#ccfbf1',
    edge: '#e6fffa'
  },
  
];

const PRESET_THEMES = [
  { name: 'Crimson Moon', spineBg: '#881337', spineInk: '#fecdd3', backBg: '#4c0519', backInk: '#fecdd3', edge: '#ffe4e6' },
  { name: 'Emerald Sanctuary', spineBg: '#0f766e', spineInk: '#ccfbf1', backBg: '#134e4a', backInk: '#ccfbf1', edge: '#e6fffa' },
  { name: 'Midnight Cyber', spineBg: '#1e1b4b', spineInk: '#c7d2fe', backBg: '#0f172a', backInk: '#c7d2fe', edge: '#e0e7ff' },
  { name: 'Violet Resonance', spineBg: '#581c87', spineInk: '#f5d0fe', backBg: '#3b0764', backInk: '#f5d0fe', edge: '#fae8ff' },
  { name: 'Monochrome Noir', spineBg: '#18181b', spineInk: '#f4f4f5', backBg: '#09090b', backInk: '#e4e4e7', edge: '#f4f4f5' },
  { name: 'Solar Amber', spineBg: '#78350f', spineInk: '#fef3c7', backBg: '#451a03', backInk: '#fef3c7', edge: '#fffbeb' },
];

export const JournalsView: React.FC<JournalsViewProps> = ({ activeAtmosphere, isDarkMode, currentUser }) => {
  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);

  // Load books from localStorage or fallback to default
  const [books, setBooks] = useState<BookCfg[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved journals:', e);
    }
    return defaultSampleBooks;
  });

  // Save to localStorage whenever books state updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch (e) {
      console.error('Failed to save journals to storage:', e);
    }
  }, [books]);

  const [viewMode, setViewMode] = useState<'3d' | 'grid'>('3d');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeReaderBook, setActiveReaderBook] = useState<BookCfg | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New book form state
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState(currentUser || 'Community Author');
  const [newCategory, setNewCategory] = useState('DESIGN ARCHITECTURE');
  const [newDesc, setNewDesc] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newStars, setNewStars] = useState(5);
  const [newYear, setNewYear] = useState('2026');
  const [newChapters, setNewChapters] = useState('01. Introduction, 02. Core Analysis, 03. Summary');
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);
  const [customCoverUrl, setCustomCoverUrl] = useState('');

  // Categories list
  const categories = ['ALL', ...Array.from(new Set(books.map((b) => b.category || 'GENERAL').filter(Boolean)))];

  // Filtered books
  const filteredBooks = books.filter((book) => {
    const matchesCategory = selectedCategory === 'ALL' || book.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.desc.toLowerCase().includes(q) ||
      (book.category && book.category.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const handleAddJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const theme = PRESET_THEMES[selectedThemeIndex];
    const chapterList = newChapters
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const newBook: BookCfg = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      author: newAuthor.trim() || 'Anonymous Author',
      year: newYear || '2026',
      stars: newStars,
      desc: newDesc.trim(),
      content: newContent.trim() || newDesc.trim(),
      category: newCategory.trim().toUpperCase(),
      date: new Date().toISOString().split('T')[0],
      readTime: `${Math.max(2, Math.ceil((newContent || newDesc).split(' ').length / 150))} MIN READ`,
      chapters: chapterList.length > 0 ? chapterList : ['01. Main Article'],
      spineBg: theme.spineBg,
      spineInk: theme.spineInk,
      backBg: theme.backBg,
      backInk: theme.backInk,
      edge: theme.edge,
      coverURL: customCoverUrl.trim() || null,
      images: customCoverUrl.trim() ? { front: customCoverUrl.trim() } : undefined,
    };

    setBooks((prev) => [newBook, ...prev]);
    setIsAddModalOpen(false);

    // Reset form
    setNewTitle('');
    setNewDesc('');
    setNewContent('');
    setCustomCoverUrl('');
  };

  const handleDeleteBook = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      setBooks((prev) => prev.filter((b) => b.id !== id));
      if (activeReaderBook?.id === id) setActiveReaderBook(null);
    }
  };

  const handleShare = (book: BookCfg) => {
    navigator.clipboard.writeText(`${window.location.origin} - Journal: ${book.title}`);
    setCopiedId(book.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-24 space-y-10">
      {/* Primary Control Toolbar */}
      <div className={`p-4 md:p-6 rounded-3xl ${themeStyles.bgCard} border ${themeStyles.borderMuted} backdrop-blur-2xl shadow-xl space-y-4`}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
          {/* Create Button & View Switcher */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center space-x-2 bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-full shadow-lg shadow-rose-500/25 transition-all transform hover:scale-105 active:scale-95 cursor-pointer text-xs md:text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Journal Entry</span>
            </button>

            <div className={`p-1 rounded-full bg-black/20 dark:bg-white/5 border ${themeStyles.borderMuted} flex items-center space-x-1 backdrop-blur-md`}>
              <button
                onClick={() => setViewMode('3d')}
                className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                  viewMode === '3d'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>3D Bookshelf</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Grid Catalog</span>
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search journals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-xl bg-black/20 dark:bg-white/5 border ${themeStyles.borderMuted} text-xs text-zinc-950 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/50 transition-all`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full pt-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-xs'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main View Display */}
      {viewMode === '3d' ? (
        <div className="space-y-6">
          <div className="h-[760px] w-full relative">
            <BooksShowcase
              books={filteredBooks}
              heroTitle="Chronicles"
              navTitle={`${filteredBooks.length} Books Available`}
              showNav={true}
              showDetailPanel={true}
              showCarousel={true}
              onOpenReader={(book) => setActiveReaderBook(book)}
            />
          </div>

          <div className="text-center text-xs font-mono text-zinc-500 flex items-center justify-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Pro-tip: Click and drag any 3D book cover to peel the cover, or open details to rotate the 3D book in real-time.</span>
          </div>
        </div>
      ) : (
        /* Grid Catalog View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <motion.div
              key={book.id}
              whileHover={{ y: -6 }}
              className={`p-6 rounded-3xl ${themeStyles.bgCard} border ${themeStyles.borderMuted} backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-4 hover:border-rose-500/40 transition-all group relative overflow-hidden`}
            >
              {/* Card Accent Top Bar */}
              <div
                className="h-1.5 w-full absolute top-0 left-0"
                style={{ backgroundColor: book.spineBg || '#881337' }}
              />

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold uppercase">
                    {book.category || 'JOURNAL'}
                  </span>
                  <span className="text-zinc-500 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{book.readTime || '5 MIN READ'}</span>
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl text-zinc-950 dark:text-white group-hover:text-rose-400 transition-colors">
                  {book.title}
                </h3>

                <p className="text-xs text-zinc-400 leading-relaxed font-light line-clamp-3">
                  {book.desc}
                </p>

                {/* Rating & Metadata */}
                <div className="flex items-center space-x-1 pt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < (book.stars || 5) ? 'text-rose-500 fill-rose-500' : 'text-zinc-700'
                      }`}
                    />
                  ))}
                  <span className="text-[10px] font-mono text-zinc-500 ml-2">({book.stars || 5}.0)</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                <div className="text-zinc-400">
                  <span className="block text-[9px] text-zinc-500">AUTHOR</span>
                  <span className="font-bold text-zinc-200">{book.author.toUpperCase()}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveReaderBook(book)}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold transition-all text-xs cursor-pointer shadow-md"
                  >
                    Read
                  </button>

                  <button
                    onClick={(e) => handleDeleteBook(book.id, e)}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-all cursor-pointer border border-white/5"
                    title="Delete Journal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* CREATE NEW JOURNAL MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl ${themeStyles.bgCard} border ${themeStyles.borderMuted} p-6 md:p-8 shadow-2xl space-y-6 relative text-zinc-950 dark:text-white`}
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-mono font-bold tracking-[0.2em] text-rose-500 uppercase">
                  PUBLISH A NEW BOOK / LOG
                </span>
                <h2 className="text-2xl font-display font-extrabold uppercase">
                  CREATE JOURNAL ENTRY
                </h2>
              </div>

              <form onSubmit={handleAddJournal} className="space-y-5 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-zinc-400 uppercase font-bold">Journal Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cybernetics of Fluid UI"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl bg-black/30 border ${themeStyles.borderMuted} text-white focus:outline-none focus:border-rose-500 transition-all`}
                    />
                  </div>

                  {/* Author */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-zinc-400 uppercase font-bold">Author Name</label>
                    <input
                      type="text"
                      placeholder="e.g. kk"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl bg-black/30 border ${themeStyles.borderMuted} text-white focus:outline-none focus:border-rose-500 transition-all`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-zinc-400 uppercase font-bold">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl bg-black/30 border ${themeStyles.borderMuted} text-white focus:outline-none focus:border-rose-500 transition-all`}
                    >
                      <option value="DESIGN ARCHITECTURE">DESIGN ARCHITECTURE</option>
                      <option value="DEV LOG">DEV LOG</option>
                      <option value="COMMUNITY ANNOUNCEMENT">COMMUNITY ANNOUNCEMENT</option>
                      <option value="CYBER COUTURE">CYBER COUTURE</option>
                      <option value="SOUND ARCHITECTURE">SOUND ARCHITECTURE</option>
                      <option value="SCIFI LORE">SCIFI LORE</option>
                    </select>
                  </div>

                  {/* Rating */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-zinc-400 uppercase font-bold">Rating (Stars)</label>
                    <select
                      value={newStars}
                      onChange={(e) => setNewStars(Number(e.target.value))}
                      className={`w-full px-4 py-2.5 rounded-xl bg-black/30 border ${themeStyles.borderMuted} text-white focus:outline-none focus:border-rose-500 transition-all`}
                    >
                      <option value={5}>5 Stars (★★★★★)</option>
                      <option value={4}>4 Stars (★★★★☆)</option>
                      <option value={3}>3 Stars (★★★☆☆)</option>
                    </select>
                  </div>

                  {/* Year */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-zinc-400 uppercase font-bold">Publication Year</label>
                    <input
                      type="text"
                      value={newYear}
                      onChange={(e) => setNewYear(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl bg-black/30 border ${themeStyles.borderMuted} text-white focus:outline-none focus:border-rose-500 transition-all`}
                    />
                  </div>
                </div>

                {/* Excerpt / Summary */}
                <div className="space-y-1.5">
                  <label className="font-mono text-zinc-400 uppercase font-bold">Short Excerpt / Abstract *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Brief summary displayed on 3D book panel and grid cards..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl bg-black/30 border ${themeStyles.borderMuted} text-white focus:outline-none focus:border-rose-500 transition-all`}
                  />
                </div>

                {/* Chapters */}
                <div className="space-y-1.5">
                  <label className="font-mono text-zinc-400 uppercase font-bold">Chapters Index (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. 01. Introduction, 02. Architecture, 03. Conclusion"
                    value={newChapters}
                    onChange={(e) => setNewChapters(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl bg-black/30 border ${themeStyles.borderMuted} text-white focus:outline-none focus:border-rose-500 transition-all`}
                  />
                </div>

                {/* Full Article Content */}
                <div className="space-y-1.5">
                  <label className="font-mono text-zinc-400 uppercase font-bold">Full Journal Content</label>
                  <textarea
                    rows={5}
                    placeholder="Write your full article / journal text here..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl bg-black/30 border ${themeStyles.borderMuted} text-white focus:outline-none focus:border-rose-500 transition-all font-mono text-[11px]`}
                  />
                </div>

                {/* 3D Cover Color Theme Presets */}
                <div className="space-y-2">
                  <label className="font-mono text-zinc-400 uppercase font-bold block">
                    3D Book Cover Theme Palette
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {PRESET_THEMES.map((theme, i) => (
                      <button
                        key={theme.name}
                        type="button"
                        onClick={() => setSelectedThemeIndex(i)}
                        className={`p-2.5 rounded-xl border transition-all text-left flex items-center space-x-2 cursor-pointer ${
                          selectedThemeIndex === i
                            ? 'border-rose-500 bg-rose-500/10 text-white'
                            : 'border-white/10 bg-black/20 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full inline-block border border-white/20 shrink-0"
                          style={{ backgroundColor: theme.spineBg }}
                        />
                        <span className="font-mono text-[11px] truncate">{theme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Custom Image URL */}
                <div className="space-y-1.5">
                  <label className="font-mono text-zinc-400 uppercase font-bold">Custom Cover Image URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={customCoverUrl}
                    onChange={(e) => setCustomCoverUrl(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl bg-black/30 border ${themeStyles.borderMuted} text-white focus:outline-none focus:border-rose-500 transition-all`}
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white font-mono font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold transition-all cursor-pointer shadow-lg shadow-rose-500/25"
                  >
                    Publish Journal Book
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL READER MODAL / SLIDE-OVER */}
      <AnimatePresence>
        {activeReaderBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className={`w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl ${themeStyles.bgCard} border ${themeStyles.borderMuted} p-6 md:p-10 shadow-2xl relative text-zinc-950 dark:text-white space-y-8`}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveReaderBook(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Reader Header */}
              <div className="space-y-4 border-b border-white/10 pb-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono text-xs font-bold uppercase">
                    {activeReaderBook.category || 'JOURNAL PUBLICATION'}
                  </span>
                  <div className="flex items-center space-x-4 text-xs font-mono text-zinc-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{activeReaderBook.readTime || '5 MIN READ'}</span>
                    </span>
                    <span>•</span>
                    <span>{activeReaderBook.date || activeReaderBook.year}</span>
                  </div>
                </div>

                <h1 className="text-3xl md:text-5xl font-display font-extrabold uppercase leading-tight">
                  {activeReaderBook.title}
                </h1>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold font-mono">
                      {activeReaderBook.author.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-mono text-zinc-400">AUTHOR</div>
                      <div className="text-sm font-bold">{activeReaderBook.author}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleShare(activeReaderBook)}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                    >
                      {copiedId === activeReaderBook.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                      <span>{copiedId === activeReaderBook.id ? 'Copied' : 'Share'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Chapters / Index Navigator */}
              {activeReaderBook.chapters && activeReaderBook.chapters.length > 0 && (
                <div className="p-4 rounded-2xl bg-black/20 dark:bg-white/5 border border-white/10 space-y-2">
                  <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest flex items-center space-x-1.5">
                    <Book className="w-3.5 h-3.5" />
                    <span>TABLE OF CONTENTS</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono text-zinc-400">
                    {activeReaderBook.chapters.map((ch, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                        <span className="truncate">{ch}</span>
                        <span className="text-[10px] text-zinc-500">P. {1 + idx * 4}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Body Content */}
              <div className="prose dark:prose-invert max-w-none text-zinc-300 space-y-4 font-sans text-sm md:text-base leading-relaxed whitespace-pre-line">
                {activeReaderBook.content || activeReaderBook.desc}
              </div>

              {/* Reader Footer */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Ineffable Publication &copy; {activeReaderBook.year || '2026'}</span>
                <button
                  onClick={() => setActiveReaderBook(null)}
                  className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold transition-all cursor-pointer"
                >
                  Close Reader
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JournalsView;

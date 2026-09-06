import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId, AtmosphereConfig } from '../types';
import { getThemeStyles } from '../lib/theme';
import akarshAvatar from '../../sivyassets/akarsh.webp';
import lavanyaAvatar from '../../sivyassets/lavanya.webp';
import lavanyaBanner from '../../sivyassets/lavanya_banner.webp';
import nancyAvatar from '../../sivyassets/nancy.png';
import {
  Users,
  Shield,
  Code,
  Sparkles,
  X,
  Award,
  Flame,
} from 'lucide-react';

interface AboutViewProps {
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
}

interface MemberProfile {
  id: string;
  name: string;
  discordTag: string;
  discordId?: string;
  role: string;
  category: 'founder' | 'cofounder' | 'owner' | 'coowner' | 'techlead' | 'executive' | 'admin';
  avatar: string;
  banner: string;
  badges: ('staff' | 'booster' | 'developer' | 'supporter')[];
}

const MEMBERS_DATA: MemberProfile[] = [
  {
    id: 'akarsh',
    name: 'Akarsh Arya',
    discordTag: 'akarsh.arya',
    discordId: '121287965938483200',
    role: 'Founder',
    category: 'founder',
    avatar: akarshAvatar,
    banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    badges: ['staff', 'booster', 'supporter'],
  },
  {
    id: 'harshil',
    name: 'Harshil Joshi',
    discordTag: 'Harshil_joshi',
    role: 'Co founder',
    category: 'cofounder',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop',
    badges: ['staff', 'developer'],
  },
  {
    id: 'abhi',
    name: 'Abhi',
    discordTag: 'abhi_quantum',
    role: 'Co founder',
    category: 'cofounder',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    badges: ['staff', 'developer'],
  },
  {
    id: 'ankeet',
    name: 'Ankeet',
    discordTag: 'ankeet_primal',
    role: 'Owner',
    category: 'owner',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
    badges: ['staff', 'booster'],
  },
  {
    id: 'kavyansh',
    name: 'Kavyansh',
    discordTag: 'kavyanshshakya',
    discordId: '241214041187123201',
    role: 'Owner',
    category: 'owner',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800&auto=format&fit=crop',
    badges: ['staff', 'developer', 'booster'],
  },
  {
    id: 'rajarshi',
    name: 'Rajarshi Mukherjee',
    discordTag: 'rajarshi_mukherjee',
    role: 'Co founder',
    category: 'cofounder',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=800&auto=format&fit=crop',
    badges: ['staff', 'supporter'],
  },
  {
    id: 'vixen',
    name: 'Vixen',
    discordTag: 'vixen_cyber',
    role: 'Owner',
    category: 'owner',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    badges: ['staff', 'booster'],
  },
  {
    id: 'kiwi',
    name: 'Kiwi',
    discordTag: 'kiwi_slice',
    role: 'Owner',
    category: 'owner',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=800&auto=format&fit=crop',
    badges: ['staff', 'booster'],
  },
  {
    id: 'Nancy',
    name: 'Nancy',
    discordTag: 'aw.nvm',
    role: 'Co owner',
    category: 'coowner',
    avatar: nancyAvatar,
    banner: '',
    badges: ['staff'],
  },
  {
    id: 'aris',
    name: 'Aris',
    discordTag: 'aris_couture',
    role: 'Co owner',
    category: 'coowner',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
    badges: ['staff', 'supporter'],
  },
  {
    id: 'viiiv',
    name: 'Viiv',
    discordTag: 'viiiv_3',
    role: 'Co owner',
    category: 'coowner',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
    badges: ['staff', 'supporter', 'booster'],
  },
  {
    id: 'lavanya-singh',
    name: 'Lavanya Singh',
    discordTag: 'lavanya_singh',
    role: 'Co owner',
    category: 'coowner',
    avatar: lavanyaAvatar,
    banner: lavanyaBanner,
    badges: ['staff'],
  },
  {
    id: 'aarav',
    name: 'Aarav',
    discordTag: 'aarav',
    role: 'Co founder',
    category: 'cofounder',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    badges: ['staff', 'developer'],
  },
  {
    id: 'poppy',
    name: 'Poppy',
    discordTag: 'poppy',
    role: 'Owner',
    category: 'owner',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=800&auto=format&fit=crop',
    badges: ['staff', 'supporter'],
  },
  {
    id: 'aloo-puri',
    name: 'Aloo Puri',
    discordTag: 'aloo_puri',
    role: 'Co owner',
    category: 'coowner',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop',
    badges: ['staff', 'supporter'],
  },
  {
    id: 'machi',
    name: 'Machi',
    discordTag: 'machi',
    role: 'Co owner',
    category: 'coowner',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=800&auto=format&fit=crop',
    badges: ['staff', 'booster'],
  },
  {
    id: 'kiara',
    name: 'Kiara',
    discordTag: 'kiara',
    role: 'Executive',
    category: 'executive',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
    badges: ['staff', 'supporter'],
  },
  {
    id: 'wayne',
    name: 'Wayne',
    discordTag: 'wayne',
    role: 'Executive',
    category: 'executive',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    badges: ['staff', 'developer'],
  },
  {
    id: 'kaz',
    name: 'Kaz',
    discordTag: 'kaz',
    role: 'Executive',
    category: 'executive',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
    badges: ['staff', 'supporter'],
  },
  {
    id: 'ritwik',
    name: 'Ritwik',
    discordTag: 'ritwik',
    role: 'Executive',
    category: 'executive',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800&auto=format&fit=crop',
    badges: ['staff', 'booster'],
  }
];

export const AboutView: React.FC<AboutViewProps> = ({ activeAtmosphere, isDarkMode }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'founder' | 'co-founder' | 'owner' | 'co-owner' | 'techlead' | 'executive' | 'admin'>('all');
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<MemberProfile | null>(null);

  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);

  // Filter members
  const filteredMembers = MEMBERS_DATA.filter(member => {
    if (selectedCategory === 'all') return true;
    return member.category === selectedCategory;
  });

  // Category counts
  const categoryCounts = {
    all: MEMBERS_DATA.length,
    founder: MEMBERS_DATA.filter(m => m.category === 'founder').length,
    cofounder: MEMBERS_DATA.filter(m => m.category === 'cofounder').length,
    owner: MEMBERS_DATA.filter(m => m.category === 'owner').length,
    coowner: MEMBERS_DATA.filter(m => m.category === 'coowner').length,
    techlead: MEMBERS_DATA.filter(m => m.category === 'techlead').length,
    executive: MEMBERS_DATA.filter(m => m.category === 'executive').length,
    admin: MEMBERS_DATA.filter(m => m.category === 'admin').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative">

      {/* Decorative Cyber Grid Overlay */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-linear-to-b from-transparent to-transparent pointer-events-none opacity-5 z-0"
        style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

      {/* Header Section */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center space-x-2">
          <div className={`h-[1px] w-8 ${themeStyles.accentLine} bg-linear-to-r`} />
          <span className={`font-mono text-[9px] tracking-[0.4em] uppercase ${themeStyles.accentText} font-extrabold`}>
            CONVERGENCE // SPECIFICATIONS
          </span>
          <div className={`h-[1px] w-8 ${themeStyles.accentLine} bg-linear-to-l`} />
        </div>

        <h1 className={`font-mono text-3xl md:text-5xl tracking-widest font-extrabold ${themeStyles.textPrimary} uppercase`}>
          ABOUT INEFFABLE
        </h1>

        <p className={`font-sans text-xs md:text-sm leading-relaxed ${themeStyles.textSecondary} max-w-xl mx-auto font-light`}>
          A historical community ledger charting our founders, owners, developers, coordinators, and administrators that maintain our digital convergence.
        </p>
      </div>
      {/* Roster Header */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-zinc-500/10 pb-6 mb-8">
        <div className="flex items-center space-x-3">
          <Users className={`w-5 h-5 ${themeStyles.accentText}`} />
          <h2 className={`font-mono text-sm tracking-widest font-bold ${themeStyles.textPrimary} uppercase`}>
            INEFFABLE ROSTER
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto max-w-full pb-2 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'ALL SECTORS' },
            { id: 'founder', label: 'FOUNDER' },
            { id: 'cofounder', label: 'CO FOUNDER' },
            { id: 'owner', label: 'OWNER' },
            { id: 'coowner', label: 'CO OWNER' },
            { id: 'techlead', label: 'TECH LEAD' },
            { id: 'executive', label: 'EXECUTIVE' },
            { id: 'admin', label: 'ADMIN' },
          ].map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-4 py-1.5 font-mono text-[9px] tracking-wider rounded-lg border transition-all duration-300 cursor-pointer ${isActive
                  ? `${themeStyles.accentBg} text-zinc-950 font-bold ${themeStyles.borderHighlight} shadow-sm`
                  : `border-transparent ${themeStyles.textSecondary} hover:${themeStyles.textPrimary} hover:bg-zinc-500/5`
                  }`}
              >
                {tab.label} ({categoryCounts[tab.id as keyof typeof categoryCounts]})
              </button>
            );
          })}
        </div>
      </div>

      {/* Categorized Rectangular Cards with Separators */}
      <div className="space-y-16 relative z-10">
        <AnimatePresence mode="popLayout">
          {[
            { id: 'founder', title: 'FOUNDER', subtitle: 'Supreme architect and system creator' },
            { id: 'cofounder', title: 'CO FOUNDER', subtitle: 'Strategic planning and development operations' },
            { id: 'owner', title: 'OWNER', subtitle: 'Ultimate owner of the digital convergence network' },
            { id: 'coowner', title: 'CO OWNER', subtitle: 'Co owner and server maintainer' },
            { id: 'techlead', title: 'TECH LEAD', subtitle: 'Interactive layout engineers and core architects' },
            { id: 'executive', title: 'EXECUTIVE', subtitle: 'Creative coordinators and executive directors' },
            { id: 'admin', title: 'ADMINISTRATOR', subtitle: 'Lattice gatekeepers and security managers' }
          ]
            .filter(group => {
              const membersInGroup = filteredMembers.filter(m => m.category === group.id);
              return membersInGroup.length > 0;
            })
            .map((group, groupIndex, arr) => {
              const membersInGroup = filteredMembers.filter(m => m.category === group.id);
              return (
                <motion.div
                  key={group.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Category Section Header */}
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between border-l-2 border-pink-500 pl-4 py-1">
                    <div>
                      <h3 className={`font-mono text-base tracking-[0.25em] font-black ${themeStyles.textPrimary} uppercase`}>
                        {group.title}
                      </h3>
                      <p className={`font-sans text-[11px] font-light ${themeStyles.textSecondary} mt-0.5`}>
                        {group.subtitle}
                      </p>
                    </div>
                    <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-[0.3em] mt-1 sm:mt-0">
                      SECTOR // 0{groupIndex + 1}
                    </span>
                  </div>

                  {/* Rectangular Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {membersInGroup.map((member) => {
                      const isHovered = hoveredMember === member.id;
                      return (
                        <motion.div
                          key={member.id}
                          layout
                          onMouseEnter={() => setHoveredMember(member.id)}
                          onMouseLeave={() => setHoveredMember(null)}
                          onClick={() => setSelectedMember(member)}
                          className={`group relative p-3.5 rounded-md border ${themeStyles.borderMuted} ${themeStyles.bgCard} hover:border-zinc-500/30 transition-all duration-300 overflow-hidden flex items-center space-x-3.5 cursor-pointer ${isHovered ? 'shadow-lg translate-y-[-2px]' : ''
                            }`}
                        >
                          {/* Background Card Hover Accent */}
                          <div className="absolute inset-0 bg-linear-to-tr from-transparent via-transparent to-zinc-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />

                          {/* Avatar Section */}
                          <div className="relative shrink-0">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 object-cover rounded-md border border-zinc-500/15"
                            />
                          </div>

                          {/* Text Info Section */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className={`font-mono text-[12px] tracking-wider font-extrabold ${themeStyles.textPrimary} truncate`}>
                                {member.name}
                              </h4>
                              <span className={`font-mono text-[6px] tracking-wider px-1.5 py-0.5 rounded-sm font-bold uppercase shrink-0 ${member.category === 'founder' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                member.category === 'cofounder' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                                  member.category === 'owner' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                    member.category === 'coowner' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                                      member.category === 'techlead' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                        member.category === 'executive' ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' :
                                          member.category === 'admin' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                            'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                                }`}>
                                {member.category === 'cofounder' ? 'co founder' : member.category === 'coowner' ? 'co owner' : member.category === 'techlead' ? 'tech lead' : member.category}
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-2 mt-0.5">
                              <p className="font-sans text-[10px] text-zinc-500 truncate">
                                {member.role}
                              </p>
                              <span className={`font-mono text-[7px] tracking-wider ${themeStyles.accentText} font-extrabold shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center space-x-0.5`}>
                                <span>VIEW</span>
                                <Sparkles className="w-2 h-2 animate-pulse" />
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Section Separator */}
                  {groupIndex < arr.length - 1 && (
                    <div className="pt-4 pb-2">
                      <div className="h-[1px] w-full bg-linear-to-r from-transparent via-zinc-500/10 to-transparent" />
                    </div>
                  )}
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>

      {/* DISCORD PROFILE INTERACTIVE MODAL */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Smooth dark glass backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm cursor-pointer z-[100]"
            />

            {/* Static profile card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`relative w-full max-w-[620px] max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl z-[101] border font-sans flex flex-col backdrop-blur-2xl transition-all duration-300 ${
                isDarkMode
                  ? 'bg-zinc-950/90 text-zinc-100 border-zinc-800/80 shadow-black/80'
                  : 'bg-white/95 text-zinc-900 border-zinc-200/90 shadow-2xl'
              }`}
            >
              {/* PROFILE HEADER */}
              <div className={`px-3.5 py-2 border-b flex items-center justify-between shrink-0 select-none backdrop-blur-md ${
                isDarkMode ? 'bg-zinc-900/80 border-zinc-800/80 text-zinc-400' : 'bg-zinc-100/90 border-zinc-200/80 text-zinc-600'
              }`}>
                <span className="font-mono text-[8px] font-black tracking-widest uppercase">
                  INEFFABLE // PROFILE
                </span>
              </div>

              {/* BANNER WITH BACKGROUND IMAGE */}
              <div className="relative h-28 w-full overflow-hidden shrink-0 bg-zinc-900">
                <img
                  src={selectedMember.banner}
                  alt="Discord Banner"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover select-none pointer-events-none filter brightness-90"
                />

                {/* Glassy Badge Overlay for Discord Name on the Banner */}
                <div className={`absolute bottom-2.5 left-2.5 font-mono text-[9px] tracking-[0.2em] px-3 py-1.5 rounded-md border flex items-center space-x-2 shadow-lg backdrop-blur-md ${
                  isDarkMode ? 'bg-black/80 text-white border-zinc-800/80' : 'bg-white/90 text-zinc-950 border-zinc-200/80'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span className="font-extrabold">
                    {selectedMember.discordTag}
                  </span>
                </div>

                {/* Subtle Close Button on Top Right */}
                <button
                  onClick={() => setSelectedMember(null)}
                  className={`absolute top-2.5 right-2.5 p-1.5 rounded-full transition-all duration-200 cursor-pointer z-10 border ${
                    isDarkMode
                      ? 'bg-black/60 text-white/80 hover:bg-black/90 hover:text-white border-zinc-800/40'
                      : 'bg-white/80 text-zinc-800 hover:bg-white hover:text-black border-zinc-300'
                  }`}
                  aria-label="Close Profile"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* OVERLAPPING AVATAR & BADGES ROW */}
              <div className={`relative px-4 pb-1 shrink-0 ${isDarkMode ? 'bg-zinc-950/80' : 'bg-white/80'}`}>
                <div className="absolute top-[-44px] left-4">
                  <div className="relative">
                    <img
                      src={selectedMember.avatar}
                      alt="Avatar"
                      referrerPolicy="no-referrer"
                      className={`w-[80px] h-[80px] rounded-full ring-[6px] object-cover ${
                        isDarkMode ? 'ring-zinc-950 bg-zinc-900' : 'ring-white bg-zinc-100'
                      }`}
                    />
                  </div>
                </div>

                {/* Discord Badges aligned on the right */}
                <div className="flex justify-end items-center h-10 space-x-1 pt-1.5">
                  <div className={`flex px-2 py-1 rounded-lg space-x-1.5 border shadow-xs ${
                    isDarkMode ? 'bg-zinc-900/80 border-zinc-800/80' : 'bg-zinc-100/90 border-zinc-200/90'
                  }`}>
                    {selectedMember.badges.includes('staff') && (
                      <div className="cursor-help" title="Ineffable Staff Team">
                        <Shield className="w-3.5 h-3.5 text-indigo-500" />
                      </div>
                    )}
                    {selectedMember.badges.includes('developer') && (
                      <div className="cursor-help" title="Core Web Developer">
                        <Code className="w-3.5 h-3.5 text-sky-500" />
                      </div>
                    )}
                    {selectedMember.badges.includes('booster') && (
                      <div className="cursor-help" title="Active Nitro Server Booster">
                        <Flame className="w-3.5 h-3.5 text-pink-500" />
                      </div>
                    )}
                    {selectedMember.badges.includes('supporter') && (
                      <div className="cursor-help" title="Lifetime Tier Supporter">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* DISCORD INNER CONTAINER PANEL */}
              <div className={`flex-1 overflow-y-auto scrollbar-none p-4 pt-3 pb-3 flex flex-col space-y-4 ${
                isDarkMode ? 'bg-zinc-950/60' : 'bg-zinc-50/60'
              }`}>

                <>
                    {/* Names block */}
                    <div className={`p-4 rounded-xl border space-y-2 shadow-xs shrink-0 transition-colors ${
                      isDarkMode ? 'bg-zinc-900/60 border-zinc-800/60' : 'bg-white/90 border-zinc-200/80'
                    }`}>
                      <div>
                        <h2 className={`text-lg font-bold tracking-wide font-sans flex items-center gap-1.5 ${
                          isDarkMode ? 'text-white' : 'text-zinc-900'
                        }`}>
                          {selectedMember.name}
                        </h2>
                        <p className={`text-[11px] font-medium font-mono mt-0.5 ${
                          isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                        }`}>
                          @{selectedMember.discordTag}
                        </p>
                      </div>

                    </div>

                    {/* ROLE CLUSTERS */}
                      <div className="space-y-2">
                        <h4 className={`text-[10px] font-extrabold tracking-wider uppercase font-mono ${
                          isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                        }`}>
                          ROLES
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          <span className={`text-[10px] font-sans px-2.5 py-1 rounded-md font-semibold flex items-center space-x-1.5 border ${
                            isDarkMode ? 'bg-zinc-800/80 text-zinc-200 border-zinc-700/60' : 'bg-zinc-100 text-zinc-800 border-zinc-300'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${selectedMember.category === 'founder' ? 'bg-[#f1c40f]' :
                              selectedMember.category === 'cofounder' ? 'bg-[#e67e22]' :
                                selectedMember.category === 'owner' ? 'bg-[#9b59b6]' :
                                  selectedMember.category === 'coowner' ? 'bg-[#34495e]' :
                                    selectedMember.category === 'techlead' ? 'bg-[#1abc9c]' :
                                      selectedMember.category === 'executive' ? 'bg-[#e91e63]' :
                                        selectedMember.category === 'admin' ? 'bg-[#3498db]' : 'bg-[#2ecc71]'
                              }`} />
                            <span>{selectedMember.role}</span>
                          </span>
                        </div>
                      </div>

                </>

              </div>

              {/* AUTHENTIC CHAT INPUT FOOTER BOX */}
              <div className={`p-3 border-t shrink-0 ${
                isDarkMode ? 'bg-zinc-950/90 border-zinc-800/60' : 'bg-white/90 border-zinc-200/80'
              }`}>
                <a
                  href="https://discord.gg/ineffable"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full rounded-md py-2.5 px-3.5 text-[11px] font-sans flex items-center justify-between transition-colors duration-200 cursor-pointer shadow-xs border ${
                    isDarkMode
                      ? 'bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 border-zinc-800'
                      : 'bg-zinc-100 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200 border-zinc-200'
                  }`}
                >
                  <span className="font-bold">Message @{selectedMember.discordTag}</span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono font-bold tracking-widest uppercase border shadow-xs ${
                    isDarkMode ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-white text-zinc-800 border-zinc-300'
                  }`}>DM</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

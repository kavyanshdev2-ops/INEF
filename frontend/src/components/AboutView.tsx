import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AtmosphereConfig } from '../types';
import { getThemeStyles } from '../lib/theme';
import akarshAvatar from '../../sivyassets/akarsh.webp';
import lavanyaAvatar from '../../sivyassets/lavanya.webp';
import lavanyaBanner from '../../sivyassets/lavanya_banner.webp';
import nancyAvatar from '../../sivyassets/nancy.png';
import {
  ArrowUpRight,
  Shield,
  Code,
  Flame,
  Award,
  X,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Linkedin,
  Globe
} from 'lucide-react';

const CHERRY_PINK = '#FA5F88';
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScJoinIneffableTeam/viewform';

interface AboutViewProps {
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
}

export type MemberCategory = 'all' | 'founder' | 'cofounder' | 'owner' | 'coowner' | 'executive';

export interface TeamMemberProfile {
  id: string;
  name: string;
  role: string;
  category: 'founder' | 'cofounder' | 'owner' | 'coowner' | 'executive';
  avatar: string;
  banner: string;
  discordTag: string;
  discordId?: string;
  badges: ('staff' | 'developer' | 'booster' | 'supporter')[];
  bio: string;
  since: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
}

// Custom X icon (Twitter)
const XIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ALL_TEAM_MEMBERS: TeamMemberProfile[] = [
  // ================= FOUNDER =================
  {
    id: 'akarsh',
    name: 'Akarsh Arya',
    role: 'Founder',
    category: 'founder',
    avatar: akarshAvatar,
    banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    discordTag: 'akarsh.arya',
    discordId: '121287965938483200',
    badges: ['staff', 'developer', 'booster', 'supporter'],
    bio: 'Supreme architect, visionary founder, and lead system creator of Ineffable.',
    since: 'EST. 2020 // ARCHITECT',
    twitter: 'https://x.com',
    linkedin: 'https://linkedin.com',
    website: 'https://ineffable.store'
  },

  // ================= CO FOUNDER =================
  {
    id: 'harshil',
    name: 'Harshil Joshi',
    role: 'Co founder',
    category: 'cofounder',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1200&auto=format&fit=crop',
    discordTag: 'Harshil_joshi',
    badges: ['staff', 'developer'],
    bio: 'Co-founder driving strategic planning, operations, and ecosystem expansion.',
    since: 'EST. 2020 // CO-FOUNDING',
    twitter: 'https://x.com',
    linkedin: 'https://linkedin.com',
    website: 'https://ineffable.store'
  },
  {
    id: 'abhi',
    name: 'Abhi',
    role: 'Co founder',
    category: 'cofounder',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    discordTag: 'abhi_quantum',
    badges: ['staff', 'developer'],
    bio: 'Co-founder managing technical infrastructure, bot development, and systems.',
    since: 'EST. 2021 // CORE DEV',
    twitter: 'https://x.com',
    linkedin: 'https://linkedin.com',
    website: 'https://ineffable.store'
  },
  {
    id: 'rajarshi',
    name: 'Rajarshi Mukherjee',
    role: 'Co founder',
    category: 'cofounder',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=1200&auto=format&fit=crop',
    discordTag: 'rajarshi_mukherjee',
    badges: ['staff', 'supporter'],
    bio: 'Co-founder leading brand strategy, public relations, and partnerships.',
    since: 'EST. 2021 // STRATEGY',
    twitter: 'https://x.com',
    linkedin: 'https://linkedin.com',
    website: 'https://ineffable.store'
  },
  {
    id: 'aarav',
    name: 'Aarav',
    role: 'Co founder',
    category: 'cofounder',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    discordTag: 'aarav',
    badges: ['staff', 'developer'],
    bio: 'Co-founder directing community software deployments and web experiences.',
    since: 'EST. 2021 // OPERATIONS',
    twitter: 'https://x.com',
    linkedin: 'https://linkedin.com',
    website: 'https://ineffable.store'
  },

  // ================= OWNER =================
  {
    id: 'ankeet',
    name: 'Ankeet',
    role: 'Owner',
    category: 'owner',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    discordTag: 'ankeet_primal',
    badges: ['staff', 'booster'],
    bio: 'Ultimate owner guiding digital convergence, governance, and stability.',
    since: 'EST. 2021 // OWNER',
    twitter: 'https://x.com',
    linkedin: 'https://linkedin.com',
    website: 'https://ineffable.store'
  },
  {
    id: 'kavyansh',
    name: 'Kavyansh',
    role: 'Owner',
    category: 'owner',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200&auto=format&fit=crop',
    discordTag: 'kavyanshshakya',
    discordId: '241214041187123201',
    badges: ['staff', 'developer', 'booster'],
    bio: 'Owner & lead web engineer building full-stack applications and cloud services.',
    since: 'EST. 2021 // LEAD DEV',
    twitter: 'https://x.com',
    linkedin: 'https://linkedin.com',
    website: 'https://ineffable.store'
  },
  {
    id: 'vixen',
    name: 'Vixen',
    role: 'Owner',
    category: 'owner',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop',
    discordTag: 'vixen_cyber',
    badges: ['staff', 'booster'],
    bio: 'Owner overseeing server culture, security policies, and community events.',
    since: 'EST. 2022 // EXECUTIVE',
    twitter: 'https://x.com',
    linkedin: 'https://linkedin.com',
    website: 'https://ineffable.store'
  },
  {
    id: 'kiwi',
    name: 'Kiwi',
    role: 'Owner',
    category: 'owner',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1200&auto=format&fit=crop',
    discordTag: 'kiwi_slice',
    badges: ['staff', 'booster'],
    bio: 'Owner supervising event planning, member coordination, and custom perks.',
    since: 'EST. 2022 // DIRECTOR',
    twitter: 'https://x.com',
    linkedin: 'https://linkedin.com',
    website: 'https://ineffable.store'
  },
  {
    id: 'poppy',
    name: 'Poppy',
    role: 'Owner',
    category: 'owner',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1200&auto=format&fit=crop',
    discordTag: 'poppy',
    badges: ['staff', 'supporter'],
    bio: 'Owner providing hospitality, member onboarding, and special gaming sessions.',
    since: 'EST. 2022 // COMMUNITY',
    twitter: 'https://x.com',
    linkedin: 'https://linkedin.com',
    website: 'https://ineffable.store'
  },

  // ================= CO OWNER =================
  {
    id: 'nancy',
    name: 'Nancy',
    role: 'Co owner',
    category: 'coowner',
    avatar: nancyAvatar,
    banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    discordTag: 'aw.nvm',
    badges: ['staff', 'booster'],
    bio: 'Co-owner and community supervisor ensuring safe, engaging environments.',
    since: 'EST. 2022 // CO-OWNER',
    twitter: 'https://x.com',
    linkedin: 'https://linkedin.com',
    website: 'https://ineffable.store'
  },
  {
    id: 'aris',
    name: 'Aris',
    role: 'Co owner',
    category: 'coowner',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
    discordTag: 'aris_couture',
    badges: ['staff', 'supporter'],
    bio: 'Co-owner maintaining server activities, tournament coordination, and roles.',
    since: 'EST. 2022 // OPERATIONS',
    twitter: 'https://x.com',
    linkedin: 'https://linkedin.com',
    website: 'https://ineffable.store'
  },
  {
    id: 'viiv',
    name: 'Viiv',
    role: 'Co owner',
    category: 'coowner',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop',
    discordTag: 'viiiv_3',
    badges: ['staff', 'supporter', 'booster'],
    bio: 'Co-owner overseeing media channels, announcements, and Nitro perks.',
    since: 'EST. 2022 // MEDIA LEAD',
    twitter: 'https://x.com',
    linkedin: 'https://linkedin.com',
    website: 'https://ineffable.store'
  },
  {
    id: 'lavanya',
    name: 'Lavanya Singh',
    role: 'Co owner',
    category: 'coowner',
    avatar: lavanyaAvatar,
    banner: lavanyaBanner,
    discordTag: 'lavanya_singh',
    badges: ['staff', 'supporter'],
    bio: 'Co-owner and community moderator facilitating member onboarding.',
    since: 'EST. 2022 // MODERATION',
    twitter: 'https://x.com',
    linkedin: 'https://linkedin.com',
    website: 'https://ineffable.store'
  },
  {
    id: 'aloo-puri',
    name: 'Aloo Puri',
    role: 'Co owner',
    category: 'coowner',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1200&auto=format&fit=crop',
    discordTag: 'aloo_puri',
    badges: ['staff', 'supporter'],
    bio: 'Co-owner organizing internal games, interactive sessions, and voice lounges.',
    since: 'EST. 2023 // EVENTS',
    twitter: 'https://x.com',
    linkedin: 'https://linkedin.com',
    website: 'https://ineffable.store'
  },
  {
    id: 'machi',
    name: 'Machi',
    role: 'Co owner',
    category: 'coowner',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=1200&auto=format&fit=crop',
    discordTag: 'machi',
    badges: ['staff', 'booster'],
    bio: 'Co-owner leading guild collaborations and community engagement.',
    since: 'EST. 2023 // GUILD OPS',
    twitter: 'https://x.com',
    linkedin: 'https://linkedin.com',
    website: 'https://ineffable.store'
  },

  // ================= EXECUTIVE =================
  {
    id: 'kiara',
    name: 'Kiara',
    role: 'Executive',
    category: 'executive',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    discordTag: 'kiara',
    badges: ['staff', 'supporter'],
    bio: 'Executive coordinator directing creative artworks, event execution, and spotlights.',
    since: 'EST. 2023 // CREATIVE',
    twitter: 'https://x.com',
    linkedin: 'https://linkedin.com',
    website: 'https://ineffable.store'
  },
  {
    id: 'wayne',
    name: 'Wayne',
    role: 'Executive',
    category: 'executive',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    discordTag: 'wayne',
    badges: ['staff', 'developer'],
    bio: 'Executive handling livestream productions, media bots, and integrations.',
    since: 'EST. 2023 // STREAM OPS',
    twitter: 'https://x.com',
    linkedin: 'https://linkedin.com',
    website: 'https://ineffable.store'
  },
  {
    id: 'kaz',
    name: 'Kaz',
    role: 'Executive',
    category: 'executive',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
    discordTag: 'kaz',
    badges: ['staff', 'supporter'],
    bio: 'Executive overseeing creative promotions, design assets, and voice channels.',
    since: 'EST. 2023 // PROMOTIONS',
    twitter: 'https://x.com',
    linkedin: 'https://linkedin.com',
    website: 'https://ineffable.store'
  },
  {
    id: 'ritwik',
    name: 'Ritwik',
    role: 'Executive',
    category: 'executive',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200&auto=format&fit=crop',
    discordTag: 'ritwik',
    badges: ['staff', 'booster'],
    bio: 'Executive monitoring server stability, community channels, and tournaments.',
    since: 'EST. 2023 // TOURNAMENTS',
    twitter: 'https://x.com',
    linkedin: 'https://linkedin.com',
    website: 'https://ineffable.store'
  }
];

const FILTER_TABS: { id: MemberCategory; label: string }[] = [
  { id: 'all', label: 'ALL ROLES' },
  { id: 'founder', label: 'FOUNDER' },
  { id: 'cofounder', label: 'CO FOUNDER' },
  { id: 'owner', label: 'OWNER' },
  { id: 'coowner', label: 'CO OWNER' },
  { id: 'executive', label: 'EXECUTIVE' }
];

export const AboutView: React.FC<AboutViewProps> = ({ activeAtmosphere, isDarkMode }) => {
  const [selectedCategory, setSelectedCategory] = useState<MemberCategory>('all');
  const [selectedMember, setSelectedMember] = useState<TeamMemberProfile | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);

  const handleCopyDiscord = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered member list
  const filteredMembers = ALL_TEAM_MEMBERS.filter(member => {
    if (selectedCategory === 'all') return true;
    return member.category === selectedCategory;
  });

  return (
    <div className="relative min-h-screen py-24 pt-32 transition-colors duration-300">
      
      {/* Background ambient glow matching theme */}
      <div 
        style={{
          background: `radial-gradient(ellipse at 50% 0%, rgba(250, 95, 136, 0.08) 0%, transparent 70%)`
        }}
        className="absolute top-0 left-0 right-0 h-[600px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 space-y-28 relative z-10">

        {/* ========================================================
            SECTION 1: TOP HEADER
            "About us" / "About the company"
        ======================================================== */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span 
            style={{ color: CHERRY_PINK }}
            className="font-mono text-xs md:text-sm font-semibold tracking-wide block"
          >
            About us
          </span>
          <h1 className={`text-4xl md:text-6xl font-sans tracking-tight font-extrabold ${
            isDarkMode ? 'text-white' : 'text-zinc-900'
          }`}>
            About the company
          </h1>
          <p className={`text-sm md:text-base font-light ${
            isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
          } max-w-xl mx-auto`}>
            Learn more about the company and the team behind it.
          </p>
        </div>

        {/* ========================================================
            SECTION 2: JOURNEY & METRICS SECTION
            Split 2-Column: Left Abstract Art, Right Journey + 2x2 Stats
        ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left: Atmospheric Art / Gradient Canvas */}
          <div className="lg:col-span-6">
            <div className={`relative aspect-[4/3] sm:aspect-square w-full rounded-2xl overflow-hidden border shadow-2xl ${
              isDarkMode ? 'border-white/10 shadow-black/40' : 'border-zinc-200 shadow-xl'
            }`}>
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
                alt="Ineffable Creative Journey"
                className="w-full h-full object-cover select-none"
              />
              <div 
                style={{
                  background: `linear-gradient(135deg, rgba(250, 95, 136, 0.25) 0%, rgba(139, 92, 246, 0.25) 50%, rgba(59, 130, 246, 0.3) 100%)`
                }}
                className="absolute inset-0 mix-blend-overlay" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Right: Copy & 2x2 Big Numbers Grid */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <span 
                style={{ color: CHERRY_PINK }}
                className="font-mono text-xs md:text-sm font-semibold tracking-wide block"
              >
                Build better, launch faster
              </span>
              <h2 className={`text-3xl md:text-5xl font-sans tracking-tight font-extrabold leading-tight ${
                isDarkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                We’re only just getting started on our journey
              </h2>
            </div>

            {/* 2x2 Stats Grid with Website Cherry Pink Accent */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 pt-4">
              
              {/* Stat 1 */}
              <div className="space-y-1.5">
                <div 
                  style={{ color: CHERRY_PINK }}
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-sans"
                >
                  400+
                </div>
                <div className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  Projects completed
                </div>
              </div>

              {/* Stat 2 */}
              <div className="space-y-1.5">
                <div 
                  style={{ color: CHERRY_PINK }}
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-sans"
                >
                  600%
                </div>
                <div className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  Return on investment
                </div>
              </div>

              {/* Stat 3 */}
              <div className="space-y-1.5">
                <div 
                  style={{ color: CHERRY_PINK }}
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-sans"
                >
                  10k
                </div>
                <div className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  Global downloads
                </div>
              </div>

              {/* Stat 4 */}
              <div className="space-y-1.5">
                <div 
                  style={{ color: CHERRY_PINK }}
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-sans"
                >
                  200+
                </div>
                <div className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  5-star reviews
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ========================================================
            SECTION 3: BRAND / LOGOS SOCIAL PROOF BAR
            "From startups to the world's largest companies."
        ======================================================== */}
        <div className="space-y-8 pt-6 pb-6 border-y border-white/5">
          <p className={`text-center text-xs md:text-sm font-light ${
            isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
          }`}>
            From startups to the world’s largest companies.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 lg:gap-16 opacity-80 hover:opacity-100 transition-opacity">
            
            {/* OdeaoLabs */}
            <div className="flex items-center space-x-2 font-bold tracking-tight text-sm md:text-base">
              <div className="flex space-x-0.5">
                <span className="w-2 h-2 rounded-xs bg-[#FA5F88]" />
                <span className="w-2 h-2 rounded-xs bg-indigo-500" />
                <span className="w-2 h-2 rounded-xs bg-sky-400" />
              </div>
              <span className={isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}>OdeaoLabs</span>
            </div>

            {/* Kintsugi */}
            <div className="flex items-center space-x-2 font-bold tracking-tight text-sm md:text-base">
              <span style={{ color: CHERRY_PINK }} className="text-lg">✹</span>
              <span className={isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}>Kintsugi</span>
            </div>

            {/* Stacked Lab */}
            <div className="flex items-center space-x-2 font-bold tracking-tight text-sm md:text-base">
              <svg className="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m12 2 10 5-10 5L2 7l10-5Z" />
                <path d="m2 17 10 5 10-5" />
                <path d="m2 12 10 5 10-5" />
              </svg>
              <span className={isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}>Stacked Lab</span>
            </div>

            {/* Magnolia */}
            <div className="flex items-center space-x-2 font-bold tracking-tight text-sm md:text-base">
              <span style={{ color: CHERRY_PINK }} className="text-base font-serif font-black">✿</span>
              <span className={isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}>Magnolia</span>
            </div>

            {/* Warpspeed */}
            <div className="flex items-center space-x-2 font-bold tracking-tight text-sm md:text-base">
              <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <span className={isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}>Warpspeed</span>
            </div>

            {/* Sisyphus */}
            <div className="flex items-center space-x-2 font-bold tracking-tight text-sm md:text-base">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
              <span className={isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}>Sisyphus</span>
            </div>

          </div>
        </div>

        {/* ========================================================
            SECTION 4: MEET OUR TEAM (EXACT FORMAT FROM SCREENSHOT)
            With Circular Avatars, Centered Bios, Social Icons,
            and Huge Openable Profile on Click
        ======================================================== */}
        <div id="meet-our-team-section" className="space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span 
              style={{ color: CHERRY_PINK }}
              className="font-mono text-xs md:text-sm font-semibold tracking-wide block"
            >
              We're hiring!
            </span>
            <h2 className={`text-3xl md:text-5xl font-sans tracking-tight font-extrabold ${
              isDarkMode ? 'text-white' : 'text-zinc-900'
            }`}>
              Meet our team
            </h2>
            <p className={`text-sm md:text-base font-light leading-relaxed ${
              isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
            } max-w-2xl mx-auto`}>
              Our philosophy is simple—hire a team of diverse, passionate people and foster a culture that empowers you to do your best work.
            </p>

            {/* Action Buttons: About us & Open positions (opens Google Form link) */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={scrollToTop}
                className={`px-5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all cursor-pointer border ${
                  isDarkMode
                    ? 'bg-white/5 text-zinc-200 border-white/10 hover:bg-white/10 hover:text-white'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                About us
              </button>

              <a
                id="join-our-team-btn"
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: CHERRY_PINK }}
                className="px-5 py-2 rounded-lg text-xs md:text-sm font-semibold text-white transition-all hover:brightness-110 cursor-pointer shadow-md shadow-[#FA5F88]/20 inline-flex items-center space-x-1.5"
              >
                <span>Open positions</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Role Filter Tabs Strip */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-b border-white/5 pb-6">
            {FILTER_TABS.map((tab) => {
              const count = tab.id === 'all'
                ? ALL_TEAM_MEMBERS.length
                : ALL_TEAM_MEMBERS.filter(m => m.category === tab.id).length;
              const isActive = selectedCategory === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-[#FA5F88] text-white border-[#FA5F88] shadow-md shadow-[#FA5F88]/20 font-bold'
                      : isDarkMode
                        ? 'bg-black/30 border-white/10 text-zinc-400 hover:text-white hover:bg-white/5'
                        : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {tab.label} ({count})
                </button>
              );
            })}
          </div>

          {/* 4-Column Team Card Grid matching the exact screenshot layout */}
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredMembers.map((member) => (
                <motion.div
                  key={member.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedMember(member)}
                  className={`p-6 sm:p-7 rounded-2xl border flex flex-col items-center text-center transition-all duration-300 group cursor-pointer ${
                    isDarkMode 
                      ? 'bg-black/30 backdrop-blur-md border-white/10 hover:bg-black/45 hover:border-[#FA5F88]/50 hover:shadow-xl hover:shadow-[#FA5F88]/10' 
                      : 'bg-white/70 backdrop-blur-md border-zinc-200/80 hover:bg-white hover:border-[#FA5F88]/50 hover:shadow-lg'
                  } hover:-translate-y-1`}
                >
                  {/* Circular Avatar */}
                  <div className="relative mb-5">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className={`w-20 h-20 rounded-full object-cover ring-2 transition-transform duration-300 group-hover:scale-105 shadow-md ${
                        isDarkMode ? 'ring-white/10' : 'ring-zinc-200'
                      }`}
                    />
                    {/* Active pulse status */}
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
                  </div>

                  {/* Name */}
                  <h3 className={`text-base font-bold font-sans tracking-tight ${
                    isDarkMode ? 'text-white' : 'text-zinc-900'
                  }`}>
                    {member.name}
                  </h3>

                  {/* Role in Signature Cherry Pink Theme */}
                  <span 
                    style={{ color: CHERRY_PINK }}
                    className="text-xs font-semibold mt-1 mb-2.5 block"
                  >
                    {member.role}
                  </span>

                  {/* Short Bio */}
                  <p className={`text-xs font-light leading-relaxed flex-grow mb-6 ${
                    isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
                  } line-clamp-3 min-h-[3rem]`}>
                    {member.bio}
                  </p>

                  {/* Social Media Links: Twitter/X, LinkedIn, Web (matching screenshot) */}
                  <div 
                    className="flex items-center space-x-3 pt-4 border-t border-white/5 w-full justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href={member.twitter || 'https://x.com'}
                      target="_blank"
                      rel="noreferrer"
                      className={`p-1.5 rounded-md transition-colors ${
                        isDarkMode 
                          ? 'text-zinc-400 hover:text-white hover:bg-white/5' 
                          : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                      }`}
                      aria-label={`${member.name} on X`}
                    >
                      <XIcon className="w-4 h-4" />
                    </a>
                    
                    <a
                      href={member.linkedin || 'https://linkedin.com'}
                      target="_blank"
                      rel="noreferrer"
                      className={`p-1.5 rounded-md transition-colors ${
                        isDarkMode 
                          ? 'text-zinc-400 hover:text-white hover:bg-white/5' 
                          : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                      }`}
                      aria-label={`${member.name} on LinkedIn`}
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>

                    <a
                      href={member.website || 'https://ineffable.store'}
                      target="_blank"
                      rel="noreferrer"
                      className={`p-1.5 rounded-md transition-colors ${
                        isDarkMode 
                          ? 'text-zinc-400 hover:text-white hover:bg-white/5' 
                          : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                      }`}
                      aria-label={`${member.name} website`}
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

        </div>

      </div>

      {/* ========================================================
          HUGE EXPANSIVE PROFILE MODAL WITH SMOOTH ANIMATION
      ======================================================== */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            
            {/* Smooth animated backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedMember(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer z-[100]"
            />

            {/* Huge Profile Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className={`relative w-full max-w-2xl overflow-hidden rounded-3xl shadow-2xl z-[101] border font-sans flex flex-col backdrop-blur-2xl my-auto ${
                isDarkMode
                  ? 'bg-zinc-950/95 text-zinc-100 border-white/10 shadow-black/90'
                  : 'bg-white/95 text-zinc-900 border-zinc-200 shadow-2xl'
              }`}
            >
              
              {/* Modal Top Mini Bar */}
              <div className={`px-4 py-2 border-b flex items-center justify-between shrink-0 select-none ${
                isDarkMode ? 'bg-zinc-900/60 border-white/10 text-zinc-400' : 'bg-zinc-100 border-zinc-200 text-zinc-600'
              }`}>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#FA5F88] animate-pulse" />
                  <span className="font-mono text-[9px] font-bold tracking-widest uppercase">
                    INEFFABLE // MEMBER IDENTITY CARD
                  </span>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Huge Banner Header */}
              <div className="relative h-44 sm:h-52 w-full overflow-hidden shrink-0 bg-zinc-900">
                <img
                  src={selectedMember.banner}
                  alt="Discord Banner"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover select-none pointer-events-none filter brightness-90 transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Glassy Tag Badge Overlay on Banner */}
                <div className="absolute bottom-3 left-4 flex items-center space-x-2 font-mono text-[10px] tracking-wider px-3 py-1 rounded-full border border-white/15 bg-black/60 backdrop-blur-md text-white shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-bold">@{selectedMember.discordTag}</span>
                </div>

                <div className="absolute top-3 right-4 font-mono text-[9px] tracking-widest px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-md border border-white/10 text-zinc-300">
                  {selectedMember.since}
                </div>
              </div>

              {/* Overlapping Avatar & Badges Section */}
              <div className={`relative px-6 pb-2 shrink-0 ${isDarkMode ? 'bg-zinc-950/90' : 'bg-white/90'}`}>
                
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-3">
                  
                  {/* Avatar with glowing ring */}
                  <div className="relative">
                    <img
                      src={selectedMember.avatar}
                      alt={selectedMember.name}
                      referrerPolicy="no-referrer"
                      className={`w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover ring-4 shadow-2xl ${
                        isDarkMode ? 'ring-zinc-950 bg-zinc-900' : 'ring-white bg-zinc-100'
                      }`}
                    />
                    <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-3 border-zinc-950 rounded-full" />
                  </div>

                  {/* Discord Staff & Achievement Badges */}
                  <div className="flex items-center space-x-2 pt-2">
                    {selectedMember.badges.includes('staff') && (
                      <div className="p-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 flex items-center space-x-1.5" title="Ineffable Staff">
                        <Shield className="w-4 h-4" />
                        <span className="text-[10px] font-mono font-bold hidden sm:inline">STAFF</span>
                      </div>
                    )}
                    {selectedMember.badges.includes('developer') && (
                      <div className="p-2 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-400 flex items-center space-x-1.5" title="Core Developer">
                        <Code className="w-4 h-4" />
                        <span className="text-[10px] font-mono font-bold hidden sm:inline">DEVELOPER</span>
                      </div>
                    )}
                    {selectedMember.badges.includes('booster') && (
                      <div className="p-2 rounded-xl border border-pink-500/30 bg-pink-500/10 text-pink-400 flex items-center space-x-1.5" title="Server Booster">
                        <Flame className="w-4 h-4" />
                        <span className="text-[10px] font-mono font-bold hidden sm:inline">BOOSTER</span>
                      </div>
                    )}
                    {selectedMember.badges.includes('supporter') && (
                      <div className="p-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 flex items-center space-x-1.5" title="Tier Supporter">
                        <Award className="w-4 h-4" />
                        <span className="text-[10px] font-mono font-bold hidden sm:inline">SUPPORTER</span>
                      </div>
                    )}
                  </div>

                </div>

                {/* Name & Role */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <h2 className={`text-2xl sm:text-3xl font-bold font-sans tracking-tight ${
                      isDarkMode ? 'text-white' : 'text-zinc-900'
                    }`}>
                      {selectedMember.name}
                    </h2>
                    <span 
                      style={{ backgroundColor: 'rgba(250, 95, 136, 0.15)', color: CHERRY_PINK, borderColor: 'rgba(250, 95, 136, 0.3)' }}
                      className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase border"
                    >
                      {selectedMember.role}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-zinc-400">
                    @{selectedMember.discordTag}
                  </p>
                </div>

              </div>

              {/* Body Content */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[40vh]">
                
                {/* About Me / Bio */}
                <div className="space-y-2">
                  <h4 className="font-mono text-[10px] font-bold tracking-widest uppercase text-zinc-400">
                    ABOUT ME
                  </h4>
                  <p className={`text-sm leading-relaxed font-light ${
                    isDarkMode ? 'text-zinc-300' : 'text-zinc-700'
                  }`}>
                    {selectedMember.bio}
                  </p>
                </div>

                {/* Role Sector details */}
                <div className={`p-4 rounded-2xl border ${
                  isDarkMode ? 'bg-zinc-900/40 border-white/5' : 'bg-zinc-50 border-zinc-200'
                } space-y-3`}>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">OFFICIAL SECTOR:</span>
                    <span style={{ color: CHERRY_PINK }} className="font-bold uppercase tracking-wider">
                      {selectedMember.category.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">COMMUNITY TENURE:</span>
                    <span className="text-zinc-200 font-semibold">
                      {selectedMember.since}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">STATUS:</span>
                    <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Active in Community</span>
                    </span>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleCopyDiscord(selectedMember.discordTag)}
                    className={`py-3 px-4 rounded-xl border text-xs font-mono font-bold tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                      copiedId
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : isDarkMode
                          ? 'bg-zinc-900 border-white/10 text-white hover:bg-zinc-800'
                          : 'bg-zinc-100 border-zinc-200 text-zinc-900 hover:bg-zinc-200'
                    }`}
                  >
                    {copiedId ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>COPIED USERNAME!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>COPY DISCORD TAG</span>
                      </>
                    )}
                  </button>

                  <a
                    href="https://discord.gg/inefontop"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ backgroundColor: CHERRY_PINK }}
                    className="py-3 px-4 rounded-xl text-xs font-mono font-bold tracking-wider text-white transition-all hover:brightness-110 flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-[#FA5F88]/20"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>CONNECT ON DISCORD</span>
                    <ExternalLink className="w-3 h-3 ml-1 opacity-75" />
                  </a>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

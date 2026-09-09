import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AtmosphereConfig } from '../types';
import { getThemeStyles } from '../lib/theme';
import akarshAvatar from '../../sivyassets/akarsh.jpg';
import akarshBanner from '../../sivyassets/akarshbanner.jpg';
import lavanyaAvatar from '../../sivyassets/lavanya.webp';
import lavanyaBanner from '../../sivyassets/lavanya_banner.webp';
import nancyAvatar from '../../sivyassets/nancy.png';
import aaravAvatar from '../../sivyassets/aarav.jpg';
import ArchieAvatar from '../../sivyassets/harshil.png';
import RunnerAvatar from '../../sivyassets/RUNNER.jpg';
import Ritvikavatar from '../../sivyassets/ritivik.png';
import rajshreeAvatar from '../../sivyassets/rajshree.png';
import srvbanner from '../../sivyassets/srvbanner.png';
import abhiAvatar from '../../sivyassets/abhiavatar.png';
import emptybanner from '../../sivyassets/emptybanner.png';
import kiwi from '../../sivyassets/kiwi.png';
import kiwibanner from '../../sivyassets/kiwibanner.jpg';
import viiv from '../../sivyassets/viiv.webp';
import viivbanner from '../../sivyassets/viivbanner.jpg';
import aris from '../../sivyassets/aris.jpg';
import aloopuri from '../../sivyassets/aloopuri.jpg';
import anuj from '../../sivyassets/anuj.jpg';
import kavish from '../../sivyassets/kaz.jpg';
import poppy from '../../sivyassets/poppy.jpg';
import vixen from '../../sivyassets/vixen.jpg';

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

const CATEGORY_COLORS: Record<TeamMemberProfile['category'], string> = {
  founder: '#D97706',
  cofounder: '#581C87',
  owner: '#E11D48',
  coowner: '#1D4ED8',
  executive: '#EA580C',
};

/** Convert a hex color (#RRGGBB) to an rgba() string for translucent backgrounds/borders */
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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
  website?: string;
  instagram?: string;
  github?: string;
  email?: string;
}

// Custom X icon (Twitter)
const XIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
// instagram
const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm-.19 2A3.56 3.56 0 0 0 4 7.56v8.88A3.56 3.56 0 0 0 7.56 20h8.88A3.56 3.56 0 0 0 20 16.44V7.56A3.56 3.56 0 0 0 16.44 4H7.56Zm9.94 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 6.75A5.25 5.25 0 1 1 6.75 12 5.25 5.25 0 0 1 12 6.75Zm0 2A3.25 3.25 0 1 0 15.25 12 3.25 3.25 0 0 0 12 8.75Z" />
  </svg>
);
// github
const GitHubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.477 2 2 6.589 2 12.253c0 4.53 2.865 8.37 6.839 9.726.5.095.683-.223.683-.496 0-.245-.009-1.058-.014-1.92-2.782.62-3.369-1.224-3.369-1.224-.455-1.184-1.11-1.5-1.11-1.5-.908-.639.069-.626.069-.626 1.004.072 1.532 1.058 1.532 1.058.892 1.566 2.341 1.114 2.91.852.091-.666.349-1.114.635-1.37-2.221-.26-4.556-1.14-4.556-5.072 0-1.12.39-2.035 1.03-2.753-.104-.26-.447-1.31.098-2.73 0 0 .84-.276 2.75 1.052A9.32 9.32 0 0 1 12 6.88c.85.004 1.705.118 2.503.347 1.91-1.328 2.748-1.052 2.748-1.052.547 1.42.203 2.47.1 2.73.64.718 1.028 1.633 1.028 2.753 0 3.942-2.339 4.809-4.566 5.064.359.32.678.949.678 1.912 0 1.381-.012 2.494-.012 2.834 0 .276.18.596.688.495C19.138 20.62 22 16.781 22 12.253 22 6.589 17.523 2 12 2Z" />
  </svg>
);
//gmail
const GmailIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5H16V9.5l-4 3-4-3V21H5.5A2.5 2.5 0 0 1 3 18.5v-13ZM5 6.1v.9l7 5.25L19 7v-.9L12 11.35 5 6.1Z" />
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
    banner: akarshBanner,
    discordTag: 'akarsh.arya',
    discordId: '121287965938483200',
    badges: ['staff', 'developer', 'booster', 'supporter'],
    bio: 'A 24 yr old Student, entrepreneur, gamer, athlete, medical enthusiast, anatomy aficionado, visionary.',
    since: '2020',
    twitter: ' https://x.com/8bitAkarsH69',
    instagram: ' https://www.instagram.com/8bitakarsh69 ',
    website: 'https://linktr.ee/8bitAkarsH69',
  },

  // ================= CO FOUNDER =================
  {
    id: 'harshil',
    name: 'Harshil Joshi',
    role: 'Co founder',
    category: 'cofounder',
    avatar: ArchieAvatar,
    banner: emptybanner,
    discordTag: 'Harshil_joshi',
    badges: ['staff', 'developer'],
    bio: 'Co-founder driving strategic planning, operations, and ecosystem expansion.',
    since: 'EST. 2020 // CO-FOUNDING',
    twitter: 'https://x.com',
    instagram: 'https://www.instagram.com/harshil._2105/',
    website: 'https://ineffable.store'
  },
  {
    id: 'abhi',
    name: 'Abhi',
    role: 'Co founder',
    category: 'cofounder',
    avatar: abhiAvatar,
    banner: emptybanner,
    discordTag: 'abhi_quantum',
    badges: ['staff', 'developer'],
    bio: 'Co-founder managing technical infrastructure, bot development, and systems.',
    since: 'EST. 2021 // CORE DEV',
    twitter: 'https://x.com',
    instagram: 'https://instagram.com',
    website: 'https://ineffable.store'
  },
  {
    id: 'rajarshi',
    name: 'Rajarshi Mukherjee',
    role: 'Co founder',
    category: 'cofounder',
    avatar: rajshreeAvatar,
    banner: emptybanner,
    discordTag: 'rajarshi_mukherjee',
    badges: ['staff', 'supporter'],
    bio: 'Co-founder leading brand, events and musical team.',
    since: 'EST. 2021 // STRATEGY',
    twitter: 'https://x.com',
    instagram: 'https://www.instagram.com/ikoshi_senpaii/',
    website: 'https://ineffable.store'
  },
  {
    id: 'aarav',
    name: 'Aarav',
    role: 'Co founder',
    category: 'cofounder',
    avatar: aaravAvatar,
    banner: emptybanner,
    discordTag: 'aarav',
    badges: ['staff', 'developer'],
    bio: 'Co-owner leading guild collaborations and community engagement.',
    since: 'EST. 2021 // OPERATIONS',
    twitter: 'https://x.com',
    instagram: 'https://www.instagram.com/z9h6zx/',
    website: 'https://ineffable.store'
  },

  // ================= OWNER =================
  {
    id: 'kavyansh',
    name: 'kavyansh',
    role: 'Owner',
    category: 'owner',
    avatar: RunnerAvatar,
    banner: emptybanner,
    discordTag: 'kavyanshshakya',
    discordId: '241214041187123201',
    badges: ['staff', 'developer', 'booster'],
    bio: 'Owner & lead web engineer building full-stack applications and cloud services.',
    since: ' 2020 // LEAD DEV',
    twitter: 'https://x.com',
    instagram: 'https://www.instagram.com/whos.kavyansh/',
    website: 'https://ineffable.store'
  },
  {
    id: 'Kookie',
    name: 'kookie',
    role: 'Owner',
    category: 'owner',
    avatar: vixen,
    banner: emptybanner,
    discordTag: 'vixen_cyber',
    badges: ['staff', 'booster'],
    bio: 'Owner overseeing server culture, security policies, and community events.',
    since: 'EST. 2022 // EXECUTIVE',
    twitter: 'https://x.com',
    instagram: 'https://www.instagram.com/mnisuze/',
    website: 'https://ineffable.store'
  },
  {
    id: 'kiwi',
    name: 'Kiwi',
    role: 'Owner',
    category: 'owner',
    avatar: kiwi,
    banner: emptybanner,
    discordTag: 'kiwi_slice',
    badges: ['staff', 'booster'],
    bio: 'Owner supervising event planning, member coordination, and custom perks.',
    since: 'EST. 2022 // DIRECTOR',
    twitter: 'https://x.com',
    instagram: 'https://www.instagram.com/kiwiiriiee/',
    website: 'https://ineffable.store'
  },
  {
    id: 'poppy',
    name: 'Poppy',
    role: 'Owner',
    category: 'owner',
    avatar: poppy,
    banner: emptybanner,
    discordTag: 'poppy',
    badges: ['staff', 'supporter'],
    bio: 'Owner providing hospitality, member onboarding, and special gaming sessions.',
    since: 'EST. 2022 // COMMUNITY',
    twitter: 'https://x.com',
    instagram: 'https://www.instagram.com/khushalmhatre3/',
    website: 'https://ineffable.store'
  },

  // ================= CO OWNER =================
  {
    id: 'nancy',
    name: 'Nancy',
    role: 'Co owner',
    category: 'coowner',
    avatar: nancyAvatar,
    banner: emptybanner,
    discordTag: 'aw.nvm',
    badges: ['staff', 'booster'],
    bio: 'Co-owner and community supervisor ensuring safe, engaging environments.',
    since: 'EST. 2022 // CO-OWNER',
    twitter: 'https://x.com',
    instagram: 'https://instagram.com',
    website: 'https://ineffable.store'
  },
  {
    id: 'aris',
    name: 'Aris',
    role: 'Co owner',
    category: 'coowner',
    avatar: aris,
    banner: emptybanner,
    discordTag: 'aris_couture',
    badges: ['staff', 'supporter'],
    bio: 'Co-owner maintaining server activities, tournament coordination, and roles.',
    since: 'EST. 2022 // OPERATIONS',
    twitter: 'https://x.com',
    instagram: 'https://www.instagram.com/nashe.me.hu.yaar/',
    website: 'https://ineffable.store'
  },
  {
    id: 'viiv',
    name: 'Viiv',
    role: 'Co owner',
    category: 'coowner',
    avatar: viiv,
    banner: emptybanner,
    discordTag: 'viiiv_3',
    badges: ['staff', 'supporter', 'booster'],
    bio: 'Executive monitoring server stability, community channels, and tournaments.',
    since: 'EST. 2022 // MEDIA LEAD',
    twitter: 'https://x.com',
    instagram: 'https://www.instagram.com/viiivstatic/',
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
    instagram: 'https://instagram.com',
    website: 'https://ineffable.store'
  },
  {
    id: 'arpita',
    name: 'Aloo Puri',
    role: 'Co owner',
    category: 'coowner',
    avatar: aloopuri,
    banner: emptybanner,
    discordTag: 'aloo_puri',
    badges: ['staff', 'supporter'],
    bio: 'Co-owner coordinator directing creative artworks, event execution, and spotlights.',
    since: 'EST. 2023 // EVENTS',
    twitter: 'https://x.com',
    instagram: 'https://www.instagram.com/velvetmeowz/',
    website: 'https://ineffable.store'
  },
  {
    id: 'machi',
    name: 'Machi',
    role: 'Co owner',
    category: 'coowner',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
    banner: emptybanner,
    discordTag: 'machi',
    badges: ['staff', 'booster'],
    bio: 'Co-owner leading with software development with arch reverse engeineering',
    since: 'EST. 2023 // GUILD OPS',
    twitter: 'https://x.com',
    instagram: 'https://instagram.com',
    website: 'https://ineffable.store'
  },

  // ================= EXECUTIVE =================
  {
    id: 'kiara',
    name: 'Kiara',
    role: 'Executive',
    category: 'executive',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
    banner: emptybanner,
    discordTag: 'kiara',
    badges: ['staff', 'supporter'],
    bio: 'excecutive organizing internal games, interactive sessions, and voice lounges.',
    since: 'EST. 2023 // CREATIVE',
    twitter: 'https://x.com',
    instagram: 'https://www.instagram.com/kiara_romeve_098',
    website: 'https://ineffable.store'
  },
  {
    id: 'anuj',
    name: 'Anuj',
    role: 'Executive',
    category: 'executive',
    avatar: anuj,
    banner: emptybanner,
    discordTag: 'wayne',
    badges: ['staff', 'developer'],
    bio: 'Executive handling chat integrations and media bots.',
    since: 'EST. 2023 // STREAM OPS',
    twitter: 'https://x.com',
    instagram: 'https://www.instagram.com/donniedarko89278/',
    website: 'https://ineffable.store'
  },
  {
    id: 'kavish',
    name: 'kavish',
    role: 'Executive',
    category: 'executive',
    avatar: kavish,
    banner: emptybanner,
    discordTag: 'kaz',
    badges: ['staff', 'supporter'],
    bio: 'Executive overseeing creative promotions, design assets, and voice channels.',
    since: 'EST. 2023 // PROMOTIONS',
    twitter: 'https://x.com',
    instagram: 'https://instagram.com',
    website: 'https://ineffable.store'
  },
  {
    id: 'ritwik',
    name: 'Ritwik',
    role: 'Executive',
    category: 'executive',
    avatar: Ritvikavatar,
    banner: emptybanner,
    discordTag: 'ritwik',
    badges: ['staff', 'booster'],
    bio: 'Executive overseeing media channels, announcements, and Nitro perks.',
    since: 'EST. 2023 // TOURNAMENTS',
    twitter: 'https://x.com',
    instagram: 'https://instagram.com',
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
          <h1 className={`text-4xl md:text-6xl font-sans tracking-tight font-extrabold ${isDarkMode ? 'text-white' : 'text-zinc-900'
            }`}>
            About the company
          </h1>
          <p className={`text-sm md:text-base font-light ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
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
            <div className={`relative aspect-[4/3] sm:aspect-square w-full rounded-2xl overflow-hidden border shadow-2xl ${isDarkMode ? 'border-white/10 shadow-black/40' : 'border-zinc-200 shadow-xl'
              }`}>
              <img
                src={srvbanner}
                alt="srvbanner"
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

          {/* Right: Copy block */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4">
              <span
                style={{ color: CHERRY_PINK }}
                className="font-mono text-xs md:text-sm font-semibold tracking-wide block"
              >
                Community-first culture
              </span>
              <h2 className={`text-3xl md:text-5xl font-sans tracking-tight font-extrabold leading-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'
                }`}>
                A place to create, compete, and belong.
              </h2>
              <p className={`text-base md:text-lg leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                INEF brings together creators, gamers, and builders through shared events, digital experiences, and a culture designed around support, creativity, and momentum.
              </p>
            </div>
          </div>

        </div>

        {/* ========================================================
            SECTION 3: BRAND / LOGOS SOCIAL PROOF BAR
            "From startups to the world's largest companies."
        ======================================================== */}


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
            <h2 className={`text-3xl md:text-5xl font-sans tracking-tight font-extrabold ${isDarkMode ? 'text-white' : 'text-zinc-900'
              }`}>
              Meet our team
            </h2>
            <p className={`text-sm md:text-base font-light leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
              } max-w-2xl mx-auto`}>
              Our philosophy is simple—hire a team of diverse, passionate people and foster a culture that empowers you to do your best work.
            </p>

            {/* Action Buttons: About us & Open positions (opens Google Form link) */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={scrollToTop}
                className={`px-5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all cursor-pointer border ${isDarkMode
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
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer border ${isActive
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
                  className={`p-6 sm:p-7 rounded-2xl border flex flex-col items-center text-center transition-all duration-300 group cursor-pointer ${isDarkMode
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
                      className={`w-20 h-20 rounded-full object-cover ring-2 transition-transform duration-300 group-hover:scale-105 shadow-md ${isDarkMode ? 'ring-white/10' : 'ring-zinc-200'
                        }`}
                    />
                    {/* Active pulse status */}
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
                  </div>

                  {/* Name */}
                  <h3 className={`text-base font-bold font-sans tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'
                    }`}>
                    {member.name}
                  </h3>

                  {/* Role colored by member category */}
                  <span
                    style={{ color: CATEGORY_COLORS[member.category] }}
                    className="text-xs font-semibold mt-1 mb-2.5 block"
                  >
                    {member.role}
                  </span>

                  {/* Short Bio */}
                  <p className={`text-xs font-light leading-relaxed flex-grow mb-6 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
                    } line-clamp-3 min-h-[3rem]`}>
                    {member.bio}
                  </p>

                  {/* Social Media Links */}
                  <div
                    className="flex items-center space-x-3 pt-4 border-t border-white/5 w-full justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href={member.twitter || 'https://x.com'}
                      target="_blank"
                      rel="noreferrer"
                      className={`p-1.5 rounded-md transition-colors ${isDarkMode
                        ? 'text-zinc-400 hover:text-white hover:bg-white/5'
                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                        }`}
                      aria-label={`${member.name} on X`}
                    >
                      <XIcon className="w-4 h-4" />
                    </a>

                    {member.instagram && (
                      <a
                        href={member.instagram.trim()}
                        target="_blank"
                        rel="noreferrer"
                        className={`p-1.5 rounded-md transition-colors ${isDarkMode
                          ? 'text-zinc-400 hover:text-white hover:bg-white/5'
                          : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                          }`}
                        aria-label={`${member.name} on Instagram`}
                      >
                        <InstagramIcon className="w-4 h-4" />
                      </a>
                    )}

                    {member.github && (
                      <a
                        href={member.github.trim()}
                        target="_blank"
                        rel="noreferrer"
                        className={`p-1.5 rounded-md transition-colors ${isDarkMode
                          ? 'text-zinc-400 hover:text-white hover:bg-white/5'
                          : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                          }`}
                        aria-label={`${member.name} on GitHub`}
                      >
                        <GitHubIcon className="w-4 h-4" />
                      </a>
                    )}

                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className={`p-1.5 rounded-md transition-colors ${isDarkMode
                          ? 'text-zinc-400 hover:text-white hover:bg-white/5'
                          : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                          }`}
                        aria-label={`Email ${member.name}`}
                      >
                        <GmailIcon className="w-4 h-4" />
                      </a>
                    )}
                    <a
                      href={member.website || 'https://inef/store'}
                      target="_blank"
                      rel="noreferrer"
                      className={`p-1.5 rounded-md transition-colors ${isDarkMode
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
              className={`relative w-full max-w-2xl overflow-hidden rounded-3xl shadow-2xl z-[101] border font-sans flex flex-col backdrop-blur-2xl my-auto ${isDarkMode
                ? 'bg-zinc-950/95 text-zinc-100 border-white/10 shadow-black/90'
                : 'bg-white/95 text-zinc-900 border-zinc-200 shadow-2xl'
                }`}
            >

              {/* Modal Top Mini Bar */}
              <div className={`px-4 py-2 border-b flex items-center justify-between shrink-0 select-none ${isDarkMode ? 'bg-zinc-900/60 border-white/10 text-zinc-400' : 'bg-zinc-100 border-zinc-200 text-zinc-600'
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
                      className={`w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover ring-4 shadow-2xl ${isDarkMode ? 'ring-zinc-950 bg-zinc-900' : 'ring-white bg-zinc-100'
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
                    <h2 className={`text-2xl sm:text-3xl font-bold font-sans tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'
                      }`}>
                      {selectedMember.name}
                    </h2>
                    <span
                      style={{
                        backgroundColor: hexToRgba(CATEGORY_COLORS[selectedMember.category], 0.15),
                        color: CATEGORY_COLORS[selectedMember.category],
                        borderColor: hexToRgba(CATEGORY_COLORS[selectedMember.category], 0.3),
                      }}
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
                  <p className={`text-sm leading-relaxed font-light ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'
                    }`}>
                    {selectedMember.bio}
                  </p>
                </div>

                {/* Role Sector details */}
                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900/40 border-white/5' : 'bg-zinc-50 border-zinc-200'
                  } space-y-3`}>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">OFFICIAL SECTOR:</span>
                    <span style={{ color: CATEGORY_COLORS[selectedMember.category] }} className="font-bold uppercase tracking-wider">
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
                    className={`py-3 px-4 rounded-xl border text-xs font-mono font-bold tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer ${copiedId
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

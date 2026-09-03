import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId, AtmosphereConfig } from '../types';
import { getThemeStyles } from '../lib/theme';
import {
  Users,
  Shield,
  Crown,
  Code,
  Sparkles,
  Calendar,
  X,
  ExternalLink,
  MessageSquare,
  Award,
  Heart,
  UserCheck,
  Flame,
  User,
  Music,
  Tv,
  Settings,
  RefreshCw
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
  status: string;
  onlineStatus: 'online' | 'idle' | 'dnd' | 'offline';
  joinedDate: string;
  aboutMe: {
    name: string;
    age: string;
    status: string;
    specialty?: string;
  };
  badges: ('staff' | 'booster' | 'developer' | 'supporter')[];
  description: string;
}

const MEMBERS_DATA: MemberProfile[] = [
  {
    id: 'akarsh',
    name: 'Akarsh Arya',
    discordTag: 'akarsh.arya',
    discordId: '121287965938483200',
    role: 'Founder',
    category: 'founder',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    status: '👑 weaving the infinite lattice...',
    onlineStatus: 'online',
    joinedDate: 'JULY 14, 2020',
    aboutMe: {
      name: 'Akarsh Arya',
      age: 'twenty-one',
      status: 'pioneering',
      specialty: 'System Director'
    },
    badges: ['staff', 'booster', 'supporter'],
    description: 'Supreme founder and architect of the Ineffable. Directs global branding, long-term server infrastructure, and strategic digital drops.'
  },
  {
    id: 'harshil',
    name: 'Harshil Joshi',
    discordTag: 'Harshil_joshi',
    role: 'Co founder',
    category: 'cofounder',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop',
    status: '🚀 launching high-velocity clusters',
    onlineStatus: 'online',
    joinedDate: 'AUGUST 12, 2020',
    aboutMe: {
      name: 'Harshil',
      age: 'twenty-one',
      status: 'deploying',
      specialty: 'Network Pipeline'
    },
    badges: ['staff', 'developer'],
    description: 'Pioneers real-time system performance and backend optimization. Keeps our pipeline running at extreme scale without latency.'
  },
  {
    id: 'abhi',
    name: 'Abhi',
    discordTag: 'abhi_quantum',
    role: 'Co founder',
    category: 'cofounder',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    status: '⚡ overclocking the logic core',
    onlineStatus: 'idle',
    joinedDate: 'NOVEMBER 01, 2020',
    aboutMe: {
      name: 'abhi',
      age: 'twenty-one',
      status: 'calibrating',
      specialty: 'Quantum Computing'
    },
    badges: ['staff', 'developer'],
    description: 'Oversees system integration, custom developer toolkits, and dynamic runtime setups to keep our framework resilient and fast.'
  },
  {
    id: 'ankeet',
    name: 'Ankeet',
    discordTag: 'ankeet_primal',
    role: 'Owner',
    category: 'owner',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
    status: '🛡️ guarding the hierarchy',
    onlineStatus: 'online',
    joinedDate: 'JANUARY 15, 2021',
    aboutMe: {
      name: 'ankeet',
      age: 'twenty-three',
      status: 'moderating',
      specialty: 'Platform Owner'
    },
    badges: ['staff', 'booster'],
    description: 'Primary platform owner. Handles global operations, sets community guidelines, and drives community expansion initiatives.'
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
    status: '⚡ commanding the logic gateway',
    onlineStatus: 'dnd',
    joinedDate: 'OCTOBER 21, 2020',
    aboutMe: {
      name: 'kavyansh',
      age: 'twenty',
      status: 'hyper-focused',
      specialty: 'Core Logistics'
    },
    badges: ['staff', 'developer', 'booster'],
    description: 'Commanding officer and system co-owner. Orchestrates database performance, server environments, and keeps operations running flawlessly.'
  },
  {
    id: 'rajarshi',
    name: 'Rajarshi Mukherjee',
    discordTag: 'rajarshi_mukherjee',
    role: 'Co founder',
    category: 'cofounder',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=800&auto=format&fit=crop',
    status: '🔮 dreaming in binary',
    onlineStatus: 'online',
    joinedDate: 'FEBRUARY 11, 2021',
    aboutMe: {
      name: 'rajarshi',
      age: 'twenty-two',
      status: 'analyzing',
      specialty: 'Operations Lead'
    },
    badges: ['staff', 'supporter'],
    description: 'Platform operations owner. Directs resource allocation, maintains legal compliance, and designs system integrations.'
  },
  {
    id: 'vixen',
    name: 'Vixen',
    discordTag: 'vixen_cyber',
    role: 'Owner',
    category: 'owner',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    status: '🦊 quiet in the shadows...',
    onlineStatus: 'idle',
    joinedDate: 'MARCH 01, 2021',
    aboutMe: {
      name: 'vixen',
      age: 'twenty-one',
      status: 'lurking',
      specialty: 'Security'
    },
    badges: ['staff', 'booster'],
    description: 'Directs network operations and security configurations. Monitors gateway logs and protects system integrity from malicious intrusions.'
  },
  {
    id: 'kiwi',
    name: 'Kiwi',
    discordTag: 'kiwi_slice',
    role: 'Owner',
    category: 'owner',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=800&auto=format&fit=crop',
    status: '🥝 fresh perspective, always.',
    onlineStatus: 'online',
    joinedDate: 'MAY 12, 2021',
    aboutMe: {
      name: 'kiwi',
      age: 'twenty',
      status: 'vibe-checking',
      specialty: 'Community Owner'
    },
    badges: ['staff', 'booster'],
    description: 'Co-manages community events and branding. Drives engagement strategies to foster a dynamic and vibrant community culture.'
  },
  {
    id: 'noobie',
    name: 'Noobie',
    discordTag: 'noobie_dev',
    role: 'Co owner',
    category: 'coowner',
    avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    status: '🎮 pro speedrunner masquerading as beginner',
    onlineStatus: 'online',
    joinedDate: 'JULY 15, 2021',
    aboutMe: {
      name: 'noobie',
      age: 'twenty-one',
      status: 'gaming',
      specialty: 'Tournament Host'
    },
    badges: ['staff', 'developer'],
    description: 'Coordinates server partnerships and custom esports tournaments. Expert in building low-latency community gaming leagues.'
  },
  {
    id: 'aris',
    name: 'Aris',
    discordTag: 'aris_couture',
    role: 'Co owner',
    category: 'coowner',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
    status: '📏 drafting clean wireframes',
    onlineStatus: 'idle',
    joinedDate: 'OCTOBER 01, 2021',
    aboutMe: {
      name: 'aris',
      age: 'twenty',
      status: 'drafting',
      specialty: 'User Experience'
    },
    badges: ['staff', 'supporter'],
    description: 'Shapes high-level community layouts. Ensures clean UX boundaries and manages visual assets for physical-digital drops.'
  },
  {
    id: 'khushal',
    name: 'Khushal Mhatre',
    discordTag: 'khushal_mhatre',
    role: 'Executive',
    category: 'executive',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop',
    status: '✨ spreading joy & positive waves',
    onlineStatus: 'online',
    joinedDate: 'DECEMBER 05, 2021',
    aboutMe: {
      name: 'khushal',
      age: 'twenty-one',
      status: 'smiling',
      specialty: 'Outreach Manager'
    },
    badges: ['staff', 'booster'],
    description: 'Directs public relations, manages community welfare campaigns, and designs digital onboarding materials.'
  },
  {
    id: 'viiiv',
    name: 'Viiv',
    discordTag: 'viiiv_3',
    role: 'Co owner',
    category: 'coowner',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
    status: '🌟 balancing network polarity',
    onlineStatus: 'online',
    joinedDate: 'JULY 15, 2022',
    aboutMe: {
      name: 'viiiv',
      age: 'twenty',
      status: 'co-owning',
      specialty: 'Community Oversight & Co-Owner'
    },
    badges: ['staff', 'supporter', 'booster'],
    description: 'Co-owner and network stabilizer. Directs community welfare, manages verification gateways, and maintains balance across all.'
  },
  {
    id: 'aarav',
    name: 'Aarav',
    discordTag: 'aarav',
    role: 'Co founder',
    category: 'cofounder',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    status: 'building the next connection',
    onlineStatus: 'online',
    joinedDate: 'AUGUST 01, 2022',
    aboutMe: { name: 'Aarav', age: 'twenty-one', status: 'building', specialty: 'Community Systems' },
    badges: ['staff', 'developer'],
    description: 'Supports the co-founder team across community systems and digital operations.'
  },
  {
    id: 'poppy',
    name: 'Poppy',
    discordTag: 'poppy',
    role: 'Owner',
    category: 'owner',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=800&auto=format&fit=crop',
    status: 'keeping the network in bloom',
    onlineStatus: 'online',
    joinedDate: 'SEPTEMBER 01, 2022',
    aboutMe: { name: 'Poppy', age: 'twenty-one', status: 'curating', specialty: 'Community Direction' },
    badges: ['staff', 'supporter'],
    description: 'Guides community direction and keeps the wider network connected.'
  },
  {
    id: 'aloo-puri',
    name: 'Aloo Puri',
    discordTag: 'aloo_puri',
    role: 'Co owner',
    category: 'coowner',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop',
    status: 'keeping the community lively',
    onlineStatus: 'online',
    joinedDate: 'OCTOBER 01, 2022',
    aboutMe: { name: 'Aloo Puri', age: 'twenty', status: 'co-owning', specialty: 'Community Operations' },
    badges: ['staff', 'supporter'],
    description: 'Helps maintain community operations and the day-to-day server experience.'
  },
  {
    id: 'machi',
    name: 'Machi',
    discordTag: 'machi',
    role: 'Co owner',
    category: 'coowner',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=800&auto=format&fit=crop',
    status: 'steady hands on the controls',
    onlineStatus: 'idle',
    joinedDate: 'NOVEMBER 01, 2022',
    aboutMe: { name: 'Machi', age: 'twenty-one', status: 'co-owning', specialty: 'Server Coordination' },
    badges: ['staff', 'booster'],
    description: 'Coordinates server activity and supports the co-owner team.'
  },
  {
    id: 'kiara',
    name: 'Kiara',
    discordTag: 'kiara',
    role: 'Executive',
    category: 'executive',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
    status: 'shaping the next chapter',
    onlineStatus: 'online',
    joinedDate: 'DECEMBER 01, 2022',
    aboutMe: { name: 'Kiara', age: 'twenty-one', status: 'creating', specialty: 'Creative Direction' },
    badges: ['staff', 'supporter'],
    description: 'Leads creative coordination and helps shape the community experience.'
  },
  {
    id: 'wayne',
    name: 'Wayne',
    discordTag: 'wayne',
    role: 'Executive',
    category: 'executive',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    status: 'moving operations forward',
    onlineStatus: 'online',
    joinedDate: 'JANUARY 01, 2023',
    aboutMe: { name: 'Wayne', age: 'twenty-two', status: 'coordinating', specialty: 'Operations' },
    badges: ['staff', 'developer'],
    description: 'Coordinates executive operations and keeps ongoing initiatives moving.'
  },
  {
    id: 'kaz',
    name: 'Kaz',
    discordTag: 'kaz',
    role: 'Executive',
    category: 'executive',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
    status: 'tuning the signal',
    onlineStatus: 'idle',
    joinedDate: 'FEBRUARY 01, 2023',
    aboutMe: { name: 'Kaz', age: 'twenty', status: 'tuning', specialty: 'Digital Strategy' },
    badges: ['staff', 'supporter'],
    description: 'Supports digital strategy and executive coordination across the community.'
  },
  {
    id: 'ritwik',
    name: 'Ritwik',
    discordTag: 'ritwik',
    role: 'Executive',
    category: 'executive',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800&auto=format&fit=crop',
    status: 'connecting every moving part',
    onlineStatus: 'online',
    joinedDate: 'MARCH 01, 2023',
    aboutMe: { name: 'Ritwik', age: 'twenty-one', status: 'connecting', specialty: 'Event Coordination' },
    badges: ['staff', 'booster'],
    description: 'Helps coordinate events and keeps executive initiatives connected.'
  }
];

export const AboutView: React.FC<AboutViewProps> = ({ activeAtmosphere, isDarkMode }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'founder' | 'co-founder' | 'owner' | 'co-owner' | 'techlead' | 'executive' | 'admin'>('all');
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<MemberProfile | null>(null);

  // Lanyard Live Discord States
  const [lanyardData, setLanyardData] = useState<any>(null);
  const [isLanyardLoading, setIsLanyardLoading] = useState(false);
  const [isLanyardError, setIsLanyardError] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'servers' | 'friends'>('profile');
  const [customDiscordId, setCustomDiscordId] = useState<string>('');
  const [isSyncingId, setIsSyncingId] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string>('');
  const [spotifyProgress, setSpotifyProgress] = useState({ elapsed: 0, duration: 0, percentage: 0 });
  const [simulatedTimeOffset, setSimulatedTimeOffset] = useState<number>(0);

  // Helper formatters
  const formatTime = (ms: number) => {
    if (isNaN(ms) || ms < 0) return '0:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const formatElapsedTime = (startMs: number) => {
    const diff = Date.now() - startMs;
    const totalMinutes = Math.floor(diff / 60000);
    if (totalMinutes < 60) return `${totalMinutes}m`;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Resolve Discord Avatar URLs accurately
  const getDiscordAvatarUrl = (user: any, fallbackUrl: string) => {
    if (!user) return fallbackUrl;
    if (user.avatar) {
      const isAnimated = user.avatar.startsWith('a_');
      const ext = isAnimated ? 'gif' : 'png';
      return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=256`;
    }
    // Handle modern Discord username/id resolution
    const defaultIndex = user.discriminator === '0' || !user.discriminator
      ? Number(BigInt(user.id) >> 22n) % 6
      : Number(user.discriminator) % 5;
    return `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
  };

  // Resolve Game asset URLs
  const getGameImageUrl = (appId: string, imageId: string) => {
    if (!imageId) return '';
    if (imageId.startsWith('mp:external/')) {
      return 'https://' + imageId.replace(/^mp:external\//, '');
    }
    return `https://cdn.discordapp.com/app-assets/${appId}/${imageId}.png`;
  };

  // Live fetching
  const fetchLanyardData = async (id: string) => {
    if (!id) {
      setLanyardData(null);
      return;
    }
    setIsLanyardLoading(true);
    setIsLanyardError(false);
    try {
      const response = await fetch(`https://api.lanyard.rest/v1/users/${id}`);
      const json = await response.json();
      if (json.success && json.data) {
        setLanyardData(json.data);
      } else {
        setIsLanyardError(true);
        setLanyardData(null);
      }
    } catch (err) {
      setIsLanyardError(true);
      setLanyardData(null);
    } finally {
      setIsLanyardLoading(false);
    }
  };

  // Sync profile to custom ID
  const handleSyncCustomId = async (id: string) => {
    if (!id.trim()) {
      setSyncFeedback('Please enter a valid Discord User ID');
      return;
    }
    setIsSyncingId(true);
    setSyncFeedback('Syncing live gateway...');
    try {
      const response = await fetch(`https://api.lanyard.rest/v1/users/${id}`);
      const json = await response.json();
      if (json.success && json.data) {
        setLanyardData(json.data);
        setSyncFeedback('Connected successfully!');
        // Update local selectedMember's ID temporarily so we can track it
        if (selectedMember) {
          selectedMember.discordId = id;
          // also write it into the main MEMBERS_DATA list
          const match = MEMBERS_DATA.find(m => m.id === selectedMember.id);
          if (match) match.discordId = id;
        }
      } else {
        setSyncFeedback('ID not found or Lanyard server inactive for this user.');
      }
    } catch (err) {
      setSyncFeedback('Gateway bridge failed. Check your internet connection.');
    } finally {
      setIsSyncingId(false);
    }
  };

  // Fetch live Discord data when selectedMember is updated
  React.useEffect(() => {
    if (selectedMember) {
      setActiveTab('profile');
      setCustomDiscordId(selectedMember.discordId || '');
      setSyncFeedback('');
      setSimulatedTimeOffset(Date.now());
      if (selectedMember.discordId) {
        fetchLanyardData(selectedMember.discordId);
      } else {
        setLanyardData(null);
      }
    } else {
      setLanyardData(null);
    }
  }, [selectedMember]);

  // Live polling every 5 seconds to keep activities and status real-time
  React.useEffect(() => {
    let refreshInterval: NodeJS.Timeout;
    if (selectedMember && selectedMember.discordId) {
      refreshInterval = setInterval(() => {
        // Only pull in background if not actively typing custom ID
        if (!isSyncingId) {
          fetchLanyardData(selectedMember.discordId!);
        }
      }, 5000);
    }
    return () => clearInterval(refreshInterval);
  }, [selectedMember, isSyncingId]);

  // Handle Spotify tick & progression (both real & simulated)
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    const hasRealSpotify = lanyardData?.listening_to_spotify && lanyardData?.spotify;

    const updateProgress = () => {
      if (hasRealSpotify) {
        const now = Date.now();
        const start = lanyardData.spotify.timestamps.start;
        const end = lanyardData.spotify.timestamps.end;
        const duration = end - start;
        const elapsed = Math.max(0, Math.min(duration, now - start));
        const percentage = duration > 0 ? (elapsed / duration) * 100 : 0;
        setSpotifyProgress({ elapsed, duration, percentage });
      } else if (selectedMember) {
        // Simulated Spotify progression
        const totalDuration = selectedMember.category === 'founder' ? 214000
          : selectedMember.category === 'cofounder' ? 180000
            : selectedMember.category === 'techlead' ? 245000
              : 195000;
        const elapsedSinceOpen = Date.now() - simulatedTimeOffset;
        const elapsed = elapsedSinceOpen % totalDuration;
        const percentage = (elapsed / totalDuration) * 100;
        setSpotifyProgress({ elapsed, duration: totalDuration, percentage });
      }
    };

    updateProgress();
    interval = setInterval(updateProgress, 1000);

    return () => clearInterval(interval);
  }, [lanyardData, selectedMember, simulatedTimeOffset]);

  // Simulated Spotify info helper
  const getSimulatedSpotify = (member: MemberProfile) => {
    switch (member.category) {
      case 'founder':
        return {
          song: "Convergence Gateway",
          artist: "Ineffable Beats",
          album: "Lattice Overdrive",
          album_art_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=150&auto=format&fit=crop",
          track_id: ""
        };
      case 'cofounder':
        return {
          song: "Speedrunning Packets",
          artist: "Kavyansh (runner)",
          album: "Zero Latency EP",
          album_art_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=150&auto=format&fit=crop",
          track_id: ""
        };
      case 'techlead':
        return {
          song: "Petal Drift in C Minor",
          artist: "Ineffable Synthesizer",
          album: "Canvas Engine Blueprints",
          album_art_url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=150&auto=format&fit=crop",
          track_id: ""
        };
      default:
        return {
          song: "Cyber Tea Lounge",
          artist: "Yuki & Sora Tanaka",
          album: "Neon Threads & Matcha",
          album_art_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=150&auto=format&fit=crop",
          track_id: ""
        };
    }
  };

  // Mock server lists for Mutual Servers tab
  const MUTUAL_SERVERS = [
    { id: '1', name: 'Ineffable Hub 🌐', members: '14,204', icon: 'IH', bgColor: 'bg-indigo-600', inviteUrl: 'https://discord.gg/ineffable' },
    { id: '2', name: 'Developer Sanctuary 💻', members: '8,409', icon: 'DS', bgColor: 'bg-emerald-600', inviteUrl: 'https://discord.gg/ineffable' },
    { id: '3', name: 'Cyber Couture Atelier 🪡', members: '3,212', icon: 'CC', bgColor: 'bg-pink-600', inviteUrl: 'https://discord.gg/ineffable' },
    { id: '4', name: 'Quantum Esports 🎮', members: '5,022', icon: 'QE', bgColor: 'bg-orange-600', inviteUrl: 'https://discord.gg/ineffable' },
    { id: '5', name: 'Lanyard Gateway 🔌', members: '18,504', icon: 'LY', bgColor: 'bg-sky-600', inviteUrl: 'https://discord.gg/ineffable' },
  ];

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

  // Get online status dot class
  const getOnlineDotClass = (status: MemberProfile['onlineStatus']) => {
    switch (status) {
      case 'online': return 'bg-[#23a55a]';
      case 'idle': return 'bg-[#f0b232]';
      case 'dnd': return 'bg-[#f23f43]';
      case 'offline': default: return 'bg-[#80848e]';
    }
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
                            {/* Online status indicator */}
                            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${isDarkMode ? 'border-zinc-950' : 'border-white'} ${getOnlineDotClass(member.onlineStatus)}`} />
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

            {/* Glassy Theme-Adaptive Discord Popout Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`relative w-full max-w-[350px] max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl z-[101] border font-sans flex flex-col backdrop-blur-2xl transition-all duration-300 ${
                isDarkMode
                  ? 'bg-zinc-950/90 text-zinc-100 border-zinc-800/80 shadow-black/80'
                  : 'bg-white/95 text-zinc-900 border-zinc-200/90 shadow-2xl'
              }`}
            >
              {/* LIVE DISCORD GATEWAY CONNECTION HEADER BAR */}
              <div className={`px-3.5 py-2 border-b flex items-center justify-between shrink-0 select-none backdrop-blur-md ${
                isDarkMode ? 'bg-zinc-900/80 border-zinc-800/80 text-zinc-400' : 'bg-zinc-100/90 border-zinc-200/80 text-zinc-600'
              }`}>
                <div className="flex items-center space-x-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${isLanyardLoading ? 'bg-amber-400 animate-pulse' :
                    isLanyardError ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'
                    }`} />
                  <span className="font-mono text-[8px] font-black tracking-widest uppercase">
                    {isLanyardLoading ? 'GATEWAY // LINKING...' :
                      isLanyardError ? 'OFFLINE // SIMULATED MODE' : 'GATEWAY // LIVE CONNECTED'}
                  </span>
                </div>
                <button
                  onClick={() => selectedMember.discordId && fetchLanyardData(selectedMember.discordId)}
                  className={`p-1 rounded transition-colors cursor-pointer ${
                    isDarkMode ? 'hover:text-white hover:bg-zinc-800' : 'hover:text-zinc-900 hover:bg-zinc-200'
                  }`}
                  title="Force Reload Gateway"
                >
                  <RefreshCw className={`w-2.5 h-2.5 ${isLanyardLoading ? 'animate-spin' : ''}`} />
                </button>
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
                  <span className={`w-1.5 h-1.5 rounded-full ${lanyardData ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-500 animate-pulse'
                    }`} />
                  <span className="font-extrabold">
                    {lanyardData?.discord_user ? lanyardData.discord_user.username : selectedMember.discordTag}
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
                      src={lanyardData?.discord_user ? getDiscordAvatarUrl(lanyardData.discord_user, selectedMember.avatar) : selectedMember.avatar}
                      alt="Avatar"
                      referrerPolicy="no-referrer"
                      className={`w-[80px] h-[80px] rounded-full ring-[6px] object-cover ${
                        isDarkMode ? 'ring-zinc-950 bg-zinc-900' : 'ring-white bg-zinc-100'
                      }`}
                    />
                    {/* Status Dot with ring */}
                    <span className={`absolute bottom-0 right-1 w-4.5 h-4.5 rounded-full ring-[4px] ${
                      isDarkMode ? 'ring-zinc-950' : 'ring-white'
                    } ${getOnlineDotClass(
                      lanyardData ? lanyardData.discord_status : selectedMember.onlineStatus
                    )}`} />
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

              {/* AUTHENTIC TABBED NAVIGATION */}
              <div className={`flex border-b px-4 shrink-0 gap-3 ${
                isDarkMode ? 'bg-zinc-950/80 border-zinc-800/60' : 'bg-white/80 border-zinc-200/80'
              }`}>
                {[
                  { id: 'profile', label: 'User Profile' },
                  { id: 'servers', label: 'Mutual Servers' },
                  { id: 'friends', label: `Mutual Friends` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-2 pt-1 text-[11px] font-bold px-1 border-b-2 transition-all duration-150 cursor-pointer ${activeTab === tab.id
                      ? `${themeStyles.accentText} border-current font-extrabold`
                      : `${isDarkMode ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-900'} border-transparent`
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* DISCORD INNER CONTAINER PANEL */}
              <div className={`flex-1 overflow-y-auto scrollbar-none p-4 pt-3 pb-3 flex flex-col space-y-4 ${
                isDarkMode ? 'bg-zinc-950/60' : 'bg-zinc-50/60'
              }`}>

                {/* 1. USER PROFILE TAB */}
                {activeTab === 'profile' && (
                  <>
                    {/* Names block */}
                    <div className={`p-4 rounded-xl border space-y-2 shadow-xs shrink-0 transition-colors ${
                      isDarkMode ? 'bg-zinc-900/60 border-zinc-800/60' : 'bg-white/90 border-zinc-200/80'
                    }`}>
                      <div>
                        <h2 className={`text-lg font-bold tracking-wide font-sans flex items-center gap-1.5 ${
                          isDarkMode ? 'text-white' : 'text-zinc-900'
                        }`}>
                          {lanyardData?.discord_user ? (lanyardData.discord_user.global_name || lanyardData.discord_user.username) : selectedMember.name}
                        </h2>
                        <p className={`text-[11px] font-medium font-mono mt-0.5 ${
                          isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                        }`}>
                          @{lanyardData?.discord_user ? lanyardData.discord_user.username : selectedMember.discordTag}
                        </p>
                      </div>

                      {/* CUSTOM STATUS */}
                      {(() => {
                        const customStatusActivity = lanyardData?.activities?.find((act: any) => act.type === 4);
                        const statusText = customStatusActivity
                          ? `${customStatusActivity.emoji ? customStatusActivity.emoji.name + ' ' : ''}${customStatusActivity.state || ''}`
                          : selectedMember.status;

                        return statusText ? (
                          <div className={`border rounded-lg p-2.5 flex items-center space-x-2 text-[11px] leading-relaxed font-light ${
                            isDarkMode ? 'bg-black/30 border-zinc-800/60 text-zinc-200' : 'bg-zinc-100/80 border-zinc-200 text-zinc-800'
                          }`}>
                            <span className="italic">{statusText}</span>
                          </div>
                        ) : null;
                      })()}
                    </div>

                    {/* DYNAMIC ACTIVITY & SPOTIFY PANEL */}
                    {(() => {
                      const isSpotifyActive = lanyardData ? lanyardData.listening_to_spotify : true;
                      const spotifyData = lanyardData?.spotify || getSimulatedSpotify(selectedMember);

                      // Find any active game (type 0)
                      const activeGame = lanyardData?.activities?.find((act: any) => act.type === 0);

                      return (
                        <div className="space-y-4">
                          {/* 1. SPOTIFY ACTIVITY PLAYER */}
                          {isSpotifyActive && spotifyData && (
                            <div className={`p-4 rounded-xl border space-y-3.5 shadow-xs transition-colors ${
                              isDarkMode ? 'bg-zinc-900/60 border-zinc-800/60' : 'bg-white/90 border-zinc-200/80'
                            }`}>
                              <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-extrabold tracking-wider text-emerald-500 uppercase font-mono flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                  Listening to Spotify
                                </h4>
                                <img
                                  src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
                                  alt="Spotify Logo"
                                  className="w-4 h-4 opacity-80"
                                />
                              </div>

                              <div className="flex items-center space-x-3.5">
                                <div className="relative shrink-0">
                                  <img
                                    src={spotifyData.album_art_url}
                                    alt="Album Art"
                                    className="w-16 h-16 rounded-md object-cover border border-zinc-500/20 shadow-md animate-[spin_20s_linear_infinite]"
                                  />
                                  <div className={`absolute -bottom-1 -right-1 p-0.5 rounded-full border ${
                                    isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
                                  }`}>
                                    <div className="bg-emerald-500 p-0.5 rounded-full text-white">
                                      <Music className="w-2.5 h-2.5" />
                                    </div>
                                  </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                  <a
                                    href={spotifyData.track_id ? `https://open.spotify.com/track/${spotifyData.track_id}` : "https://open.spotify.com"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`text-xs font-bold font-sans truncate block hover:underline transition-colors ${
                                      isDarkMode ? 'text-white hover:text-emerald-400' : 'text-zinc-900 hover:text-emerald-600'
                                    }`}
                                  >
                                    {spotifyData.song}
                                  </a>
                                  <p className={`text-[11px] truncate mt-0.5 font-medium ${
                                    isDarkMode ? 'text-zinc-300' : 'text-zinc-700'
                                  }`}>
                                    by {spotifyData.artist}
                                  </p>
                                  <p className={`text-[9px] truncate mt-0.5 italic font-light ${
                                    isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                                  }`}>
                                    on {spotifyData.album || 'Spotify'}
                                  </p>
                                </div>
                              </div>

                              {/* Progress bar */}
                              <div className="space-y-1">
                                <div className={`relative w-full h-1 rounded-full overflow-hidden ${
                                  isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'
                                }`}>
                                  <div
                                    className="absolute left-0 top-0 h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-linear"
                                    style={{ width: `${spotifyProgress.percentage}%` }}
                                  />
                                </div>
                                <div className={`flex justify-between text-[9px] font-mono font-bold select-none ${
                                  isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                                }`}>
                                  <span>{formatTime(spotifyProgress.elapsed)}</span>
                                  <span>{formatTime(spotifyProgress.duration)}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 2. GAME RICH PRESENCE (IF PLAYING) */}
                          {activeGame && (
                            <div className={`p-4 rounded-xl border space-y-3 shadow-xs ${
                              isDarkMode ? 'bg-zinc-900/60 border-zinc-800/60' : 'bg-white/90 border-zinc-200/80'
                            }`}>
                              <h4 className={`text-[10px] font-extrabold tracking-wider uppercase font-mono ${
                                isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                              }`}>
                                PLAYING A GAME
                              </h4>
                              <div className="flex space-x-3.5">
                                {activeGame.assets?.large_image ? (
                                  <div className="relative shrink-0">
                                    <img
                                      src={getGameImageUrl(activeGame.application_id, activeGame.assets.large_image)}
                                      alt="Game Asset"
                                      className="w-14 h-14 rounded-lg object-cover border border-zinc-500/20 shadow-inner"
                                    />
                                    {activeGame.assets.small_image && (
                                      <img
                                        src={getGameImageUrl(activeGame.application_id, activeGame.assets.small_image)}
                                        alt="Small Game Asset"
                                        className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-[3px] object-cover ${
                                          isDarkMode ? 'border-zinc-900' : 'border-white'
                                        }`}
                                      />
                                    )}
                                  </div>
                                ) : (
                                  <div className={`w-14 h-14 rounded-lg flex items-center justify-center shrink-0 border ${
                                    isDarkMode ? 'bg-zinc-800/80 text-white/40 border-zinc-700' : 'bg-zinc-100 text-zinc-400 border-zinc-200'
                                  }`}>
                                    <Tv className="w-6 h-6" />
                                  </div>
                                )}

                                <div className="flex-1 min-w-0 space-y-0.5">
                                  <h5 className={`text-xs font-bold font-sans truncate ${
                                    isDarkMode ? 'text-white' : 'text-zinc-900'
                                  }`}>
                                    {activeGame.name}
                                  </h5>
                                  {activeGame.details && (
                                    <p className={`text-[11px] truncate font-medium ${
                                      isDarkMode ? 'text-zinc-300' : 'text-zinc-700'
                                    }`}>
                                      {activeGame.details}
                                    </p>
                                  )}
                                  {activeGame.state && (
                                    <p className={`text-[11px] truncate font-light ${
                                      isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                                    }`}>
                                      {activeGame.state}
                                    </p>
                                  )}
                                  {activeGame.timestamps?.start && (
                                    <p className={`text-[10px] font-mono font-medium mt-1 ${
                                      isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                                    }`}>
                                      elapsed: {formatElapsedTime(activeGame.timestamps.start)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* GENERAL DISCORD BIO / DETAILS */}
                    <div className={`p-4 rounded-xl border space-y-4 shadow-xs ${
                      isDarkMode ? 'bg-zinc-900/60 border-zinc-800/60' : 'bg-white/90 border-zinc-200/80'
                    }`}>
                      <div className="space-y-2">
                        <h4 className={`text-[10px] font-extrabold tracking-wider uppercase font-mono ${
                          isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                        }`}>
                          ABOUT US
                        </h4>

                        <div className={`border rounded-lg p-3.5 font-mono text-[10px] space-y-2.5 shadow-inner ${
                          isDarkMode ? 'bg-black/40 border-zinc-800/80 text-zinc-200' : 'bg-zinc-100/80 border-zinc-200/80 text-zinc-800'
                        }`}>
                          <p className={`text-center select-none tracking-widest font-extrabold ${
                            isDarkMode ? 'text-zinc-600' : 'text-zinc-400'
                          }`}>
                            ╭ ── · ✦ · ── ╮
                          </p>
                          <div className="space-y-1.5 pl-3">
                            <p className="flex items-center space-x-2">
                              <span className="text-pink-400 font-bold">★</span>
                              <span className={`italic font-semibold ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Name</span>
                              <span className="text-zinc-400">:</span>
                              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{selectedMember.aboutMe.name}</span>
                            </p>
                            <p className="flex items-center space-x-2">
                              <span className="text-pink-400 font-bold">✦</span>
                              <span className={`italic font-semibold ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Age</span>
                              <span className="text-zinc-400">:</span>
                              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{selectedMember.aboutMe.age}</span>
                            </p>
                            <p className="flex items-center space-x-2">
                              <span className="text-pink-400 font-bold">✧</span>
                              <span className={`italic font-semibold ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Status</span>
                              <span className="text-zinc-400">:</span>
                              <span className="text-emerald-500 font-medium">{selectedMember.aboutMe.status}</span>
                            </p>
                            {selectedMember.aboutMe.specialty && (
                              <p className="flex items-center space-x-2">
                                <span className="text-pink-400 font-bold">⬩</span>
                                <span className={`italic font-semibold ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Special</span>
                                <span className="text-zinc-400">:</span>
                                <span className="text-indigo-400 font-medium">{selectedMember.aboutMe.specialty}</span>
                              </p>
                            )}
                          </div>
                          <p className={`text-center select-none tracking-widest font-extrabold ${
                            isDarkMode ? 'text-zinc-600' : 'text-zinc-400'
                          }`}>
                            ╰ ── · ✦ · ── ╯
                          </p>

                          <p className={`font-sans text-[11px] leading-relaxed pt-2.5 border-t ${
                            isDarkMode ? 'border-zinc-800/60 text-zinc-300' : 'border-zinc-200 text-zinc-600'
                          }`}>
                            {selectedMember.description}
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
                          <span className={`text-[10px] font-sans px-2.5 py-1 rounded-md font-semibold flex items-center space-x-1.5 border ${
                            isDarkMode ? 'bg-zinc-800/80 text-zinc-200 border-zinc-700/60' : 'bg-zinc-100 text-zinc-800 border-zinc-300'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${getOnlineDotClass(
                              lanyardData ? lanyardData.discord_status : selectedMember.onlineStatus
                            )}`} />
                            <span className="uppercase">
                              {selectedMember.category === 'cofounder' ? 'co founder' : selectedMember.category === 'coowner' ? 'co owner' : selectedMember.category === 'techlead' ? 'tech lead' : selectedMember.category}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* MEMBER SINCE */}
                      <div className="space-y-1.5">
                        <h4 className={`text-[10px] font-extrabold tracking-wider uppercase font-mono ${
                          isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                        }`}>
                          MEMBER SINCE
                        </h4>
                        <div className={`flex items-center space-x-2 text-[11px] font-semibold pl-1 ${
                          isDarkMode ? 'text-zinc-200' : 'text-zinc-800'
                        }`}>
                          <Calendar className={`w-3.5 h-3.5 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                          <span>{selectedMember.joinedDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* SYNC CUSTOM DISCORD ID PANEL */}
                    <div className={`p-4 rounded-xl border space-y-2.5 shadow-xs ${
                      isDarkMode ? 'bg-zinc-900/60 border-zinc-800/60' : 'bg-white/90 border-zinc-200/80'
                    }`}>
                      <h4 className={`text-[10px] font-extrabold tracking-wider uppercase font-mono flex items-center gap-1 ${
                        isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
                      }`}>
                        <Settings className="w-3 h-3" />
                        SYNC YOUR REAL DISCORD
                      </h4>
                      <p className={`text-[10px] leading-relaxed font-sans ${
                        isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
                      }`}>
                        Are you on Lanyard? Enter your Discord snowflake ID to sync your live status, game, and Spotify with this card!
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter Discord User ID..."
                          value={customDiscordId}
                          onChange={(e) => setCustomDiscordId(e.target.value)}
                          className={`text-xs px-2.5 py-2 rounded-lg border font-mono transition-colors flex-1 ${
                            isDarkMode
                              ? 'bg-black/40 text-white placeholder-zinc-500 border-zinc-800 focus:outline-none focus:border-indigo-500'
                              : 'bg-zinc-100 text-zinc-900 placeholder-zinc-400 border-zinc-300 focus:outline-none focus:border-indigo-500'
                          }`}
                        />
                        <button
                          onClick={() => handleSyncCustomId(customDiscordId)}
                          disabled={isSyncingId}
                          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-600 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-all cursor-pointer shrink-0 shadow-md"
                        >
                          {isSyncingId ? 'Syncing...' : 'Link'}
                        </button>
                      </div>
                      {syncFeedback && (
                        <p className={`text-[9px] font-mono ${syncFeedback.includes('successfully') || syncFeedback.includes('connected') ? 'text-emerald-400' : 'text-amber-500'
                          } mt-1 font-semibold`}>
                          {syncFeedback}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* 2. MUTUAL SERVERS TAB */}
                {activeTab === 'servers' && (
                  <div className={`p-4 rounded-xl border space-y-4 shadow-xs flex-1 flex flex-col justify-between max-h-[360px] overflow-y-auto ${
                    isDarkMode ? 'bg-zinc-900/60 border-zinc-800/60' : 'bg-white/90 border-zinc-200/80'
                  }`}>
                    <div className="space-y-3.5">
                      <h4 className={`text-[10px] font-extrabold tracking-wider uppercase font-mono ${
                        isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                      }`}>
                        MUTUAL SERVERS ({MUTUAL_SERVERS.length})
                      </h4>
                      <div className="space-y-3">
                        {MUTUAL_SERVERS.map(server => (
                          <div key={server.id} className={`flex items-center justify-between group/server p-2 rounded-lg transition-colors ${
                            isDarkMode ? 'hover:bg-zinc-800/60' : 'hover:bg-zinc-100'
                          }`}>
                            <div className="flex items-center space-x-3.5">
                              <div className={`w-9 h-9 rounded-full ${server.bgColor} flex items-center justify-center text-white font-mono text-xs font-black shadow-md border border-zinc-500/20 relative group-hover/server:scale-105 transition-transform duration-200 select-none`}>
                                {server.icon}
                                <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border-2 ${
                                  isDarkMode ? 'border-zinc-900' : 'border-white'
                                }`} />
                              </div>
                              <div>
                                <h5 className={`text-xs font-bold transition-colors ${
                                  isDarkMode ? 'text-white group-hover/server:text-indigo-400' : 'text-zinc-900 group-hover/server:text-indigo-600'
                                }`}>
                                  {server.name}
                                </h5>
                                <p className={`text-[9px] font-mono mt-0.5 font-bold ${
                                  isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                                }`}>
                                  {server.members} members
                                </p>
                              </div>
                            </div>
                            <a
                              href={server.inviteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-[9px] font-sans font-bold px-3 py-1.5 rounded-md transition-all duration-150 shadow-xs ${
                                isDarkMode ? 'bg-zinc-800 hover:bg-indigo-600 hover:text-white text-zinc-200' : 'bg-zinc-200 hover:bg-indigo-600 hover:text-white text-zinc-800'
                              }`}
                            >
                              JOIN
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. MUTUAL FRIENDS TAB */}
                {activeTab === 'friends' && (
                  <div className={`p-4 rounded-xl border space-y-4 shadow-xs flex-1 flex flex-col justify-between max-h-[360px] overflow-y-auto ${
                    isDarkMode ? 'bg-zinc-900/60 border-zinc-800/60' : 'bg-white/90 border-zinc-200/80'
                  }`}>
                    <div className="space-y-3.5">
                      <h4 className={`text-[10px] font-extrabold tracking-wider uppercase font-mono ${
                        isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                      }`}>
                        MUTUAL FRIENDS ({MEMBERS_DATA.filter(m => m.id !== selectedMember.id).length})
                      </h4>
                      <div className="grid grid-cols-1 gap-2.5">
                        {MEMBERS_DATA
                          .filter(friend => friend.id !== selectedMember.id)
                          .map(friend => (
                            <button
                              key={friend.id}
                              onClick={() => {
                                setSelectedMember(friend);
                              }}
                              className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all duration-200 text-left group/friend cursor-pointer shadow-xs ${
                                isDarkMode
                                  ? 'bg-zinc-950/40 hover:bg-zinc-900 border-zinc-800/60 hover:border-indigo-500/40'
                                  : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 hover:border-indigo-500/40'
                              }`}
                            >
                              <div className="flex items-center space-x-3.5 min-w-0">
                                <div className="relative shrink-0">
                                  <img
                                    src={friend.avatar}
                                    alt={friend.name}
                                    className="w-8 h-8 rounded-full object-cover border border-zinc-500/20"
                                  />
                                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 ${
                                    isDarkMode ? 'border-zinc-950' : 'border-white'
                                  } ${getOnlineDotClass(friend.onlineStatus)}`} />
                                </div>
                                <div className="min-w-0">
                                  <h5 className={`text-xs font-bold transition-colors truncate ${
                                    isDarkMode ? 'text-white group-hover/friend:text-indigo-400' : 'text-zinc-900 group-hover/friend:text-indigo-600'
                                  }`}>
                                    {friend.name}
                                  </h5>
                                  <p className={`text-[9px] font-mono truncate mt-0.5 ${
                                    isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                                  }`}>
                                    @{friend.discordTag}
                                  </p>
                                </div>
                              </div>
                              <span className="text-[8px] font-mono text-zinc-500 uppercase font-black tracking-widest opacity-0 group-hover/friend:opacity-100 transition-opacity duration-150">
                                LINK // VIEW
                              </span>
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

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
                  <span className="font-bold">Message @{lanyardData?.discord_user ? lanyardData.discord_user.username : selectedMember.discordTag}</span>
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

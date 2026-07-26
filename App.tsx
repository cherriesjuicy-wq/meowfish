import { AdminPanel } from './components/AdminPanel';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Facebook, Sparkles, Heart, Coins, ArrowRight, Search, Sparkle, RefreshCw, Key, AlertTriangle, Check, ShieldAlert, Settings, X } from 'lucide-react';

import BackgroundDoodles from './components/BackgroundDoodles';
import CursorTrail from './components/CursorTrail';
import BgmWidget from './components/BgmWidget';
import ProductCard from './components/ProductCard';
import CuteModal from './components/CuteModal';
import { PRODUCTS } from './products';
import { Product, BugReport } from './types';

interface FloatingDecoration {
  id: number;
  char: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface GiftBurst {
  id: number;
  char: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const ADMIN_PASSWORD = "tiemcakho2026";

export default function App() {
  const theme = 'light';

  useEffect(() => {
    try {
      document.body.classList.remove('mua-bien-dong');
      localStorage.removeItem('tiem_ca_kho_theme');
    } catch (e) {
      console.error(e);
    }
  }, []);

  const [view, setView] = useState<'home' | 'shop'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('tất cả cá khô');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isChiming, setIsChiming] = useState(false);
  const [goldCoins, setGoldCoins] = useState<number>(20); // start with 20 golden fish coins
  const [characterLink, setCharacterLink] = useState(() => {
    try {
      return localStorage.getItem('char_ai_link') || 'https://aistudio.google.com';
    } catch {
      return 'https://aistudio.google.com';
    }
  });

  const [isLinkActive, setIsLinkActive] = useState(() => {
    try {
      const saved = localStorage.getItem('char_ai_active');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Floating decorations for the home screen
  const [floaters, setFloaters] = useState<FloatingDecoration[]>([]);
  
  // Hearts and fish bursts
  const [bursts, setBursts] = useState<GiftBurst[]>([]);
  const burstId = useRef(0);

  // Track dynamic gift counts per product
  const [giftCounts, setGiftCounts] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('tiem_ca_kho_votes_v2');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Track if user has voted for each card today
  const [votedCards, setVotedCards] = useState<Record<string, boolean>>(() => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const saved = localStorage.getItem(`voted_cards_${todayStr}`);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Active modal details
  const [modalType, setModalType] = useState<'plot' | 'ai' | 'report' | null>(null);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  // States for Góp Ý Tưởng (Lò sấy phép thuật)
  const [kilnCotCa, setKilnCotCa] = useState('');
  const [kilnGiaVi, setKilnGiaVi] = useState('');
  const [kilnNhietDo, setKilnNhietDo] = useState('');
  const [isDrying, setIsDrying] = useState(false);
  const [smokes, setSmokes] = useState<{ id: number; delay: number; x: number }[]>([]);
  const [showGhibliNotification, setShowGhibliNotification] = useState(false);
  const smokeIdCounter = useRef(0);

  // States for "Máy Gacha Chọn Chồng Thần Kỳ"
  const [isGachaSpinning, setIsGachaSpinning] = useState(false);
  const [isKnobSpinning, setIsKnobSpinning] = useState(false);
  const [gachaFallenBall, setGachaFallenBall] = useState<string | null>(null);
  const [gachaFallenColor, setGachaFallenColor] = useState('#ffb6c1');
  const [gachaBurst, setGachaBurst] = useState(false);
  const [showGachaModal, setShowGachaModal] = useState(false);
  const [gachaResult, setGachaResult] = useState<{ id: string; rarity: string; description: string; image?: string; tags?: string[] } | null>(null);

  const GACHA_HUSBANDS = PRODUCTS.map((p) => ({
    id: p.id,
    rarity: p.name,
    description: p.description,
    image: p.image,
    tags: p.tags,
  }));


  const handleSpinGacha = () => {
    if (isGachaSpinning || isKnobSpinning) return;

    // Play winding/clicking sound
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav");
    audio.volume = 0.3;
    audio.play().catch(() => {});

    setIsKnobSpinning(true);
    setIsGachaSpinning(true);
    setGachaFallenBall(null);
    setGachaBurst(false);

    // Tỷ lệ bốc trúng Cá May Mắn 🐠 là khoảng 25%
    const isLuckyFish = Math.random() < 0.25;

    // After 1.2s of shaking, knob spin and ball bounce stop, ball drops
    setTimeout(() => {
      setIsKnobSpinning(false);
      setIsGachaSpinning(false);

      // Choose a random color for the fallen ball from our sweet pastel palette
      const sweetColors = ['#FFCEE3', '#FF85BB', '#FFD8DF', '#FFF6E3', '#BDE3C3'];
      const randomColor = sweetColors[Math.floor(Math.random() * sweetColors.length)];
      setGachaFallenColor(randomColor);
      setGachaFallenBall(isLuckyFish ? '🐠' : '🐟');
    }, 1200);

    // After ball drops to bottom tray (2.0s total, so 0.8s after drop starts), burst effects & trigger modal
    setTimeout(() => {
      setGachaBurst(true);
      // Play chime/ding sound
      const ping = new Audio("https://assets.mixkit.co/active_storage/sfx/1435/1435-84.wav");
      ping.volume = 0.3;
      ping.play().catch(() => {});

      if (isLuckyFish) {
        setGachaResult({
          id: 'lucky_fish',
          rarity: 'Cá May Mắn 🐠✨',
          description: 'Oa! Bạn đã bốc trúng Cá May Mắn 🐠✨! Bạn được tặng thêm 1 lượt quay hoàn toàn miễn phí!'
        });
      } else {
        const randomHusband = GACHA_HUSBANDS[Math.floor(Math.random() * GACHA_HUSBANDS.length)];
        setGachaResult(randomHusband);
      }

      // Open popup Modal after another brief visual delay for the spark
      setTimeout(() => {
        setShowGachaModal(true);
      }, 800);

    }, 2000);
  };


  // Helper to calculate total votes (base votes + localStorage clicks)
  const getVotes = (pId: string) => {
    const baseVotes: Record<string, number> = {
      '1': 48,  // Cá Chỉ Vàng Hướng Nội
      '2': 85,  // Cá Chỉ Vàng Thần Tượng
      '3': 32,  // Cá Mối Một Nắng Suy Tư
      '4': 76,  // Khô Mực Học Thêm Một Nắng
      '5': 54,  // Cá Đù Một Nắng Đẹp Trai
      '6': 69,  // Cá Đuối Hai Nắng Thảnh Thơi
      '7': 41,  // Cá Thu Hai Nắng Nghiêm Túc
      '8': 59,  // Cá Lóc Đồng Cùng Ao Tri Kỷ
      '9': 28,  // Cá Rô Phi Cùng Ao Cãi Cọ
      '10': 92, // Cá Hồi Khô Quý Tộc
      '11': 88, // Cá Tuyết Khô Ngậm Kẹo
      '12': 50, // Cá Trích Khô Sốt Cà Nhí Nhảnh
    };
    return (baseVotes[pId] || 15) + (giftCounts[pId] || 0);
  };

  const handleDryIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kilnCotCa.trim() || !kilnGiaVi.trim() || !kilnNhietDo.trim()) {
      alert("Bác ơi, vui lòng điền đầy đủ cả 3 nhãn để lò sấy phép thuật hoạt động nhé! 🪵🔥");
      return;
    }

    // Activate drying lid-close animation
    setIsDrying(true);

    // Trigger dense pixel smoke animation!
    const newSmokes = Array.from({ length: 15 }, (_, idx) => ({
      id: smokeIdCounter.current++,
      delay: idx * 0.12,
      x: (Math.random() * 30) - 15, // offset -15px to 15px
    }));
    setSmokes(newSmokes);

    // Show custom notification after oven sấy cá (2.2 seconds)
    setTimeout(() => {
      setShowGhibliNotification(true);
      setIsDrying(false);
      // Reset fields
      setKilnCotCa('');
      setKilnGiaVi('');
      setKilnNhietDo('');
    }, 2200);

    // Clear smokes after 4s
    setTimeout(() => {
      setSmokes([]);
    }, 4000);
  };

  // Admin Dashboard State & Password Protection
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [reportsArray, setReportsArray] = useState<BugReport[]>(() => {
    try {
      const saved = localStorage.getItem('tiem_ca_kho_reports');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Return sample reports on first load for a highly polished testing experience
    return [
      {
        id: 'r1',
        characterName: 'Nguyễn Hải Đăng',
        errorTypes: ['Nhân vật bị nói lệch tính cách (OOC)'],
        timestamp: new Date().toLocaleString('vi-VN'),
      },
      {
        id: 'r2',
        characterName: 'Trần Minh Sơn',
        errorTypes: ['Trở nên vô tri/Mất trí nhớ', 'Lỗi nội dung/NSFW'],
        timestamp: new Date().toLocaleString('vi-VN'),
      },
    ];
  });

  // Shortcut key listener: Alt + A or Ctrl + Shift + A scrolls to the admin footer section
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        const element = document.getElementById('admin-footer-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          const inputEl = document.getElementById('admin-password-input');
          if (inputEl) {
            (inputEl as HTMLInputElement).focus();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddReport = (characterName: string, errorTypes: string[], details?: string) => {
    const newReport: BugReport = {
      id: Math.random().toString(36).substring(2, 9),
      characterName,
      errorTypes,
      timestamp: new Date().toLocaleString('vi-VN'),
      details,
    };
    setReportsArray((prev) => {
      const updated = [newReport, ...prev];
      localStorage.setItem('tiem_ca_kho_reports', JSON.stringify(updated));
      return updated;
    });
  };

  const handleMarkAsFixed = (characterName: string) => {
    setReportsArray((prev) => {
      const updated = prev.filter((r) => r.characterName !== characterName);
      localStorage.setItem('tiem_ca_kho_reports', JSON.stringify(updated));
      return updated;
    });
    alert(`Đã xử lý xong và xóa toàn bộ báo cáo lỗi của nhân vật: ${characterName}! 🎉`);
  };

  const handleVerifyPassword = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (adminPasswordInput === ADMIN_PASSWORD) {
      setIsAdminUnlocked(true);
      setPasswordError('');
    } else {
      setPasswordError('Sai mật mã rồi bà chủ ơi!');
    }
  };

  // Group reports by character name
  const getReportStats = () => {
    const stats: Record<string, { ooc: number; nsfw: number; amnesia: number; other: number; lastUpdated: string }> = {};
    
    reportsArray.forEach((report) => {
      if (!stats[report.characterName]) {
        stats[report.characterName] = { ooc: 0, nsfw: 0, amnesia: 0, other: 0, lastUpdated: report.timestamp };
      }
      report.errorTypes.forEach((type) => {
        if (type.includes('OOC')) {
          stats[report.characterName].ooc += 1;
        } else if (type.includes('NSFW')) {
          stats[report.characterName].nsfw += 1;
        } else if (type.includes('vô tri') || type.includes('trí nhớ')) {
          stats[report.characterName].amnesia += 1;
        } else if (type.includes('Khác')) {
          stats[report.characterName].other += 1;
        }
      });
    });
    
    return Object.entries(stats).map(([characterName, data]) => ({
      characterName,
      ...data,
    }));
  };

  // Initialize background floating items for home screen
  useEffect(() => {
    const chars = ['🌸', '✨', '💖', '⭐', '🎈', '🍭', '🌸', '✨', '💖'];
    const items = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      char: chars[Math.floor(Math.random() * chars.length)],
      // position them near the central glass board
      x: 30 + Math.random() * 40, // 30% to 70%
      y: 20 + Math.random() * 60, // 20% to 80%
      size: Math.random() * 15 + 15, // 15px to 30px
      duration: Math.random() * 4 + 4, // 4s to 8s
      delay: Math.random() * -4,
    }));
    setFloaters(items);
  }, []);

  // Update bursts position loop
  useEffect(() => {
    if (bursts.length === 0) return;
    const interval = setInterval(() => {
      setBursts((prev) =>
        prev
          .map((b) => ({
            ...b,
            x: b.x + b.vx,
            y: b.y + b.vy,
            vy: b.vy + 0.3, // small gravity
          }))
          .filter((b) => b.y < window.innerHeight && b.y > -50 && b.x > -50 && b.x < window.innerWidth)
      );
    }, 20);
    return () => clearInterval(interval);
  }, [bursts]);

  // Sound and transition logic
  const handleEnterShop = () => {
    if (isChiming) return;
    setIsChiming(true);
    
    // Play sweet wind chime sound
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav");
    audio.volume = 0.4;
    audio.play().catch((err) => {
      console.log("Audio block/error on click:", err);
    });

    // Wait exactly 0.6 seconds before switching page view
    setTimeout(() => {
      setView('shop');
      setIsChiming(false);
    }, 600);
  };

  // Trigger heart and fish bursts
  const handleGiftFish = (product: Product, rect: DOMRect) => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (votedCards[product.id]) {
      alert(`Bác ơi, mỗi ngày bác chỉ tặng cá được 1 lần cho bé ${product.name} thôi ạ! Ngày mai hãy tiếp tục ghé thăm và tặng thêm cá cho bé nha! 💖`);
      return;
    }

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Sweet hearts and fish particles floating upwards!
    const emojiOptions = ['💖', '🐟', '💝', '🌸', '💓', '✨', '🐠'];
    const newBursts: GiftBurst[] = Array.from({ length: 15 }, () => {
      const char = emojiOptions[Math.floor(Math.random() * emojiOptions.length)];
      // Direction biased upwards (-Math.PI / 2 is straight up)
      const angle = -Math.PI / 2 + (Math.random() * 1.0 - 0.5); // spread -30deg to +30deg
      const speed = Math.random() * 5 + 3.5;
      return {
        id: burstId.current++,
        char,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // upward force
      };
    });

    setBursts((prev) => [...prev, ...newBursts]);
    
    // Save new gift counts
    setGiftCounts((prev) => {
      const updated = {
        ...prev,
        [product.id]: (prev[product.id] || 0) + 1,
      };
      localStorage.setItem('tiem_ca_kho_votes_v2', JSON.stringify(updated));
      return updated;
    });

    // Mark as voted today
    const updatedVoted = {
      ...votedCards,
      [product.id]: true,
    };
    setVotedCards(updatedVoted);
    localStorage.setItem(`voted_cards_${todayStr}`, JSON.stringify(updatedVoted));
  };

  // Filter products by category & search
  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory =
      selectedCategory === 'tất cả cá khô' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[var(--bg-page-from)] via-[var(--bg-page-via)] to-[var(--bg-page-to)] select-none pb-12 transition-all duration-1000" style={{ color: 'var(--text-main)' }}>


      {/* Background Music floating widget (only visible on main shop view) */}
      {view === 'shop' && <BgmWidget />}

      {/* Background doodles */}
      <BackgroundDoodles />

      {/* Glittering particles trails */}
      <CursorTrail />

      {/* Burst particles */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {bursts.map((b) => (
          <span
            key={b.id}
            className="absolute text-2xl filter drop-shadow-[0_2px_5px_rgba(255,105,180,0.5)] font-sans select-none"
            style={{
              left: b.x,
              top: b.y,
            }}
          >
            {b.char}
          </span>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {view === 'home' ? (
          /* ==================== PAGE 1: HOME/NAVIGATION ==================== */
          <motion.div
            key="home-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10"
          >
            {/* Floaters Decoration */}
            {floaters.map((f) => (
              <motion.span
                key={f.id}
                className="absolute text-lg select-none pointer-events-none"
                style={{
                  left: `${f.x}%`,
                  top: `${f.y}%`,
                  fontSize: `${f.size}px`,
                }}
                animate={{
                  y: [0, -25, 25, 0],
                  x: [0, 15, -15, 0],
                  scale: [1, 1.2, 0.8, 1],
                  opacity: [0.3, 0.7, 0.4, 0.3],
                }}
                transition={{
                  duration: f.duration,
                  delay: f.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {f.char}
              </motion.span>
            ))}

            {/* Giant Glassmorphic Board */}
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="glass-panel rounded-[40px] p-8 md:p-12 max-w-lg w-full text-center relative halo-neon border-pink-200/50 shadow-2xl overflow-hidden"
            >
              {/* Backglow decor inside panel */}
              <div className="absolute -top-12 -left-12 w-40 h-40 bg-pink-300/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-orange-300/20 rounded-full blur-3xl pointer-events-none" />

              {/* Top Kaomoji */}
              <div className="font-itim text-pink-400 text-sm md:text-base tracking-[0.2em] mb-2 md:mb-3 animate-pulse">
                ⋆｡˚ 𓆝⋆｡˚
              </div>

              {/* Title TIỆM CÁ KHÔ */}
              <h1 
                className="bubble-text-home leading-none font-extrabold tracking-wider select-none my-4"
                style={{ fontFamily: 'Itim, cursive', fontSize: '60px' }}
              >
                TIỆM CÁ KHÔ
              </h1>

              {/* Subtitle */}
              <p className="font-itim text-pink-500/80 text-base md:text-lg mb-8 tracking-wide max-w-xs mx-auto">
                Cửa hàng cá khô mọng nước & dễ thương nhất hệ mặt trời 🐟✨
              </p>

              {/* Main Button "Vào lựa cá khô" */}
              <div className="relative inline-block w-full max-w-xs mb-8">
                <motion.button
                  id="enter-shop-btn"
                  onClick={handleEnterShop}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full font-black uppercase text-white bg-gradient-to-r from-orange-400 via-pink-400 to-orange-400 rounded-full py-4 px-6 tracking-wider shadow-lg hover:shadow-orange-300/60 active:scale-95 cursor-pointer relative overflow-hidden transition-shadow duration-300 group"
                  style={{
                    boxShadow: '0 8px 30px rgba(255, 105, 180, 0.4)',
                    fontFamily: '"Patrick Hand", cursive',
                    fontSize: '22px'
                  }}
                >
                  <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  🐟 Vào lựa cá khô 🐟
                </motion.button>
              </div>

              {/* Facebook secondary candy button */}
              <div className="flex justify-center">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  id="facebook-btn"
                  className="font-patrick text-base font-semibold lowercase bg-white/75 hover:bg-[#ffe4e1] text-[#7c5e55] hover:text-pink-600 rounded-full py-2 px-6 shadow-sm border border-pink-100 transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95 shadow-pink-100"
                >
                  <Facebook size={16} className="fill-[#7c5e55] stroke-none hover:fill-pink-500" />
                  facebook của tiệm
                </a>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* ==================== PAGE 2: MAIN SHOP PAGE ==================== */
          <motion.div
            key="shop-page"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 80 }}
            className="max-w-7xl mx-auto px-4 pt-8 pb-20 relative z-10"
          >
            {/* Header Area */}
            <div 
              className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 mt-2"
              style={{ paddingTop: '0px' }}
            >
              {/* Logo / Shop Title */}
              <div 
                className="text-center md:text-left cursor-pointer group flex flex-col"
              >
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <div className="flex flex-col w-fit items-stretch">
                    <div 
                      onClick={() => setView('home')}
                      className="font-itim text-pink-400 select-none text-center md:text-left group-hover:animate-pulse flex justify-between w-full"
                      style={{ fontSize: '25px', lineHeight: '1.2' }}
                    >
                      <span>𓇼</span>
                      <span>⋆.˚</span>
                      <span>𓆝</span>
                      <span>⋆.˚</span>
                      <span>𓇼</span>
                    </div>
                    <h1 
                      onClick={() => setView('home')}
                      className="bubble-text-shop text-4xl md:text-5xl font-extrabold select-none leading-none tracking-wide group-hover:scale-102 transition-transform duration-300"
                      style={{ fontSize: '70px' }}
                    >
                      TIỆM CÁ KHÔ
                    </h1>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value="@meomecakho"
                    onClick={(e) => {
                      (e.target as HTMLInputElement).select();
                      navigator.clipboard.writeText("@meomecakho");
                    }}
                    title="Bấm để copy tên"
                    className="rounded-full flex items-center justify-center shadow-sm font-sans font-black select-all cursor-pointer bg-transparent border-[5px] border-pink-300 text-pink-500 shrink-0 text-center focus:outline-none transition-all duration-300 hover:scale-105 active:scale-95"
                    style={{
                      paddingTop: '-4px',
                      paddingLeft: '1px',
                      paddingBottom: '3px',
                      fontSize: '11px',
                      marginTop: '37px',
                      marginLeft: '6px',
                      width: '111.993px',
                      height: '34.9977px'
                    }}
                  />
                </div>
              </div>

              {/* Search Bar Control */}
              <div className="flex flex-wrap justify-center items-center gap-3">
                {/* Search Bar */}
                <div className="relative max-w-xs w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="tìm cá khô dễ thương..."
                    className="w-full p-2.5 pl-9 rounded-full bg-white/60 focus:bg-white border border-pink-200/50 text-xs font-quicksand focus:outline-none focus:ring-2 focus:ring-pink-300 text-[#7c5e55] placeholder-pink-300/80 transition-all duration-300"
                    style={{ marginTop: '30px', paddingLeft: '39px', width: '206.638px', height: '40.4541px', borderWidth: '0.733945px', borderColor: '#fa67a9' }}
                  />
                  <Search 
                    size={14} 
                    className="absolute left-3.5 top-3 text-pink-400" 
                    style={{ marginTop: '30px', paddingLeft: '1px' }}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-[10px] bg-pink-100 text-pink-500 rounded-full px-1.5 py-0.5"
                    >
                      xóa
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Giant Glassmorphic Main Container */}
            <div className="glass-panel rounded-[40px] p-6 md:p-8 shadow-2xl border-white/50 min-h-[60vh] flex flex-col gap-6 relative halo-neon">
              {/* Categories list */}
              <div className="flex flex-wrap justify-center items-center gap-2 pb-4 border-b border-white/20">
                {[
                  'tất cả cá khô',
                  'khô chỉ vàng quốc dân',
                  'khô một nắng',
                  'khô hai nắng',
                  'khô cùng ao',
                  'khô nhập khẩu',
                ].map((cat, idx) => {
                  const isSelected = selectedCategory === cat;
                  const buttonStyle: React.CSSProperties = {
                    fontFamily: "'Patrick Hand SC', sans-serif",
                    fontSize: '20px',
                    fontWeight: 'bold',
                    ...(!isSelected ? { color: '#e987b7' } : {})
                  };

                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`font-patrick text-sm lowercase rounded-full p-2 px-5 transition-all duration-300 hover:scale-105 active:scale-95 ${
                        selectedCategory === cat
                          ? 'bg-gradient-to-r from-pink-400 to-orange-400 text-white font-bold shadow-md shadow-pink-200'
                          : 'bg-white/50 hover:bg-white/80 text-[#7c5e55] border border-pink-100/40'
                      }`}
                      style={buttonStyle}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* No Products Found State */}
              {filteredProducts.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-12 gap-3">
                  <span className="text-5xl animate-bounce">🌊</span>
                  <h3 className="font-fraunces font-extrabold text-[#5c3e35] text-xl">
                    Huhu, không tìm thấy em cá khô nào...
                  </h3>
                  <p className="font-quicksand text-xs text-[#8c6d62] max-w-xs leading-relaxed">
                    Có vẻ như các em ấy đã bơi đi trốn tìm rồi, bác thử tìm từ khóa khác hoặc chuyển sang category khác xem sao nhé!
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('tất cả cá khô');
                      setSearchQuery('');
                    }}
                    className="font-lexend text-xs rounded-full p-2.5 px-5 bg-pink-400 hover:bg-pink-500 text-white font-semibold transition-all duration-200 mt-2 flex items-center gap-1.5"
                  >
                    <RefreshCw size={12} />
                    xem tất cả cá khô
                  </button>
                </div>
              ) : (
                /* Products Grid */
                <div className="flex flex-col gap-6 w-full flex-grow">
                  {filteredProducts.map((p) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                      className="w-full"
                    >
                      <ProductCard
                        product={p}
                        giftCount={giftCounts[p.id] || 0}
                        hasVotedToday={!!votedCards[p.id]}
                        onReadPlot={(prod) => {
                          setModalProduct(prod);
                          setModalType('plot');
                        }}
                        onAiStudio={(prod) => {
                          setModalProduct(prod);
                          setModalType('ai');
                        }}
                        onReportError={(prod) => {
                          setModalProduct(prod);
                          setModalType('report');
                        }}
                        onGiftFish={handleGiftFish}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Special Sections Grid: Leaderboard & Magic Kiln */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-12 w-full z-10">
              
              {/* SECTION A: Kệ Cá Khô Bị Mèo Thó (Leaderboard) */}
              <div 
                className="rounded-[36px] p-6 shadow-xl relative overflow-hidden flex flex-col justify-start border-4"
                style={{ borderColor: '#ff84ba', backgroundColor: '#fff5f8' }}
              >
                {/* Decorative Japanese cherry blossoms in corner */}
                <div className="absolute -top-3 -left-3 text-pink-300 text-xl pointer-events-none opacity-40">🎣</div>
                <div className="absolute -bottom-3 -right-3 text-pink-300 text-xl pointer-events-none opacity-40">🎣</div>
                <div className="absolute top-2 right-12 text-pink-200 text-sm pointer-events-none opacity-30 animate-pulse">✨</div>

                {/* Board sign header */}
                <div className="flex items-center justify-between border-b-2 border-pink-100 pb-2 mb-3">
                  <div>
                    <h2 className="font-fraunces font-black text-2xl text-[#d84b6b] flex items-center gap-2">
                      Kệ Cá Khô Mèo Thó 🎣🐾
                    </h2>
                    <p className="text-[11px] font-bold mt-0.5 uppercase tracking-wider" style={{ color: '#d6336b' }}>
                      TOP 5 nhân vật được sủng ái & tặng cá nhiều nhất!
                    </p>
                  </div>
                </div>

                {/* Calculate top 5 products dynamically */}
                {(() => {
                  const topProducts = [...PRODUCTS]
                    .map(p => ({ ...p, totalVotes: getVotes(p.id) }))
                    .sort((a, b) => b.totalVotes - a.totalVotes)
                    .slice(0, 5);

                  return (
                    <div className="space-y-2.5 flex flex-col justify-start">
                      {topProducts.map((product, idx) => {
                        const rank = idx + 1;
                        const isTop1 = rank === 1;
                        const isTop2 = rank === 2;
                        const isTop3 = rank === 3;

                        // Peach background styling based on rank
                        let rowBg = "bg-white/70 hover:bg-pink-50/50";
                        let borderStyle = "border-2 border-pink-100";
                        let rankBadge = "";

                        if (isTop1) {
                          rowBg = "bg-[#FE9EC7] hover:bg-[#ffe3ea]";
                          borderStyle = "border-2 border-[#ff8fa7] shadow-inner relative";
                          rankBadge = "🥇";
                        } else if (isTop2) {
                          rowBg = "bg-[#fff6f4] hover:bg-[#ffece8]";
                          borderStyle = "border-2 border-[#ffb19f]/60";
                          rankBadge = "🥈";
                        } else if (isTop3) {
                          rowBg = "bg-[#fffbf0] hover:bg-[#fff7da]";
                          borderStyle = "border-2 border-[#f3d99e]/60";
                          rankBadge = "🥉";
                        } else {
                          rankBadge = `💮 ${rank}`;
                        }

                        let customStyle: React.CSSProperties = {};
                        if (isTop1) {
                          customStyle = { backgroundColor: '#FFCEE3', borderColor: '#ff8fc8' };
                        } else if (isTop2) {
                          customStyle = { backgroundColor: '#fcd8e6', borderColor: '#ff73b9' };
                        } else if (isTop3) {
                          customStyle = { backgroundColor: '#ffe8f4', borderColor: '#f39eb9' };
                        } else if (rank === 4) {
                          customStyle = { borderWidth: '2.40367px', borderColor: '#ff8fc8' };
                        } else if (rank === 5) {
                          customStyle = { borderWidth: '2.20183px', borderColor: '#ff8fc8' };
                        }

                        return (
                          <div
                            key={product.id}
                            className={`flex items-center justify-between p-3 rounded-2xl ${rowBg} ${borderStyle} select-none`}
                            style={customStyle}
                          >
                            {/* Left part: Rank, Avatar & Name */}
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Rank number or medal */}
                              <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-white/90 border border-pink-200/50 shadow-sm">
                                <span className="font-fraunces font-black text-sm text-[#ff4f73] text-center">
                                  {rankBadge}
                                </span>
                              </div>

                              {/* Name & Title */}
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className="font-itim font-bold text-sm md:text-base text-[#5c3e35] truncate"
                                    style={
                                      isTop1
                                        ? {
                                            color: '#92003A',
                                            fontFamily: "'Yeseva One', serif",
                                            fontWeight: 'bold',
                                            fontSize: '17px',
                                            fontStyle: 'normal',
                                            borderWidth: '0px',
                                            borderRadius: '0px',
                                          }
                                        : {
                                            color: '#92003A',
                                            fontFamily: "'Yeseva One', serif",
                                          }
                                    }
                                  >
                                    {product.name}
                                  </span>
                                  {isTop1 && (
                                    <span className="shrink-0 bg-[#ffe8ec] border border-[#ff4f73] text-[#ff4f73] text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full leading-none font-sans flex items-center gap-0.5 select-none animate-pulse">
                                      best-seller ✨
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-[#ff6d8d] font-bold truncate">
                                  {product.status}
                                </p>
                              </div>
                            </div>

                            {/* Right part: Votes only */}
                            <div className="flex items-center gap-2 shrink-0">
                              <div className="text-right">
                                <div className="text-xs md:text-sm font-black text-[#d84b6b] flex items-center justify-end gap-1 bg-pink-50/70 border border-pink-100/50 px-2.5 py-1 rounded-full">
                                  <span>{product.totalVotes}</span>
                                  <span className="text-xs">🐟 đã tặng</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* Bottom peach footer banner */}
                <div className="mt-4 h-6 bg-[#fff0f3] border-t border-pink-200/50 rounded-xl flex items-center justify-center">
                  <span className="text-[9px] text-[#ff6d8d] font-bold font-mono tracking-wider uppercase">
                    🎣 ⋆｡˚ PHONG CÁCH HỒNG ĐÀO NHẬT BẢN ⋆｡˚ 🎣
                  </span>
                </div>
              </div>

              {/* SECTION B: Lò Sấy Phép Thuật (Ideas Drying Kiln) */}
              <div className="bg-[#FFF5F8] border-4 border-[#FF84BA] rounded-[36px] p-6 shadow-xl relative overflow-hidden flex flex-col">

                {/* Hanging paper lanterns & decorations */}
                <div className="flex items-center justify-between border-b-2 border-pink-100 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div>
                      <h2 className="font-fraunces font-black text-2xl flex items-center gap-2" style={{ color: '#d6336c' }}>
                        Lò Sấy Phép Thuật 🪵🔥
                      </h2>
                      <p className="text-[11px] text-[#D6336C]/80 font-bold mt-0.5">
                        Nơi sấy khô và đúc kết những ý tưởng cá khô tuyệt diệu!
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-3xl animate-pulse">🪄</span>
                  </div>
                </div>

                {/* Main Oven Representation with Clean Kawaii & Glassmorphism style */}
                <div 
                  className="rounded-[30px] p-6 shadow-xl relative z-10 flex-grow flex flex-col overflow-hidden border-2 border-[#FF84BA]/30"
                  style={{
                    background: 'rgba(255, 255, 255, 0.65)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)'
                  }}
                >
                  
                  {/* Stove Chimney with traditional roof tiles */}
                  <div className="absolute -top-7 left-12 w-10 h-7 bg-[#FF4081] rounded-t-lg border-x-4 border-t-4 border-[#FFF5F8] flex justify-center">
                    <div className="absolute -top-2 w-12 h-1.5 bg-[#D6336C] rounded-full" /> {/* curved chimney roof */}
                    {/* Render active smoke puffs floating upwards using motion.div */}
                    {smokes.map((smk) => (
                      <motion.div
                        key={smk.id}
                        initial={{ y: 0, x: smk.x, opacity: 0.9, scale: 0.5, rotate: 0 }}
                        animate={{ 
                          y: -120, 
                          x: smk.x * 2.5, 
                          opacity: 0, 
                          scale: 1.6, 
                          rotate: [0, 45, 90, 180] 
                        }}
                        transition={{ duration: 2.0, delay: smk.delay, ease: "easeOut" }}
                        className="absolute -top-6 w-4 h-4 bg-gray-200 border-2 border-gray-400/50 shadow-[2px_2px_0_0_rgba(0,0,0,0.15)] pointer-events-none"
                      />
                    ))}
                  </div>

                  <form onSubmit={handleDryIdea} className="space-y-5 relative z-20 flex-grow flex flex-col justify-between">
                    
                    {/* Stacked Fields Block */}
                    <div className="flex flex-col gap-4 flex-grow">
                      {/* Input 1: Cốt Cá */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#D6336C] flex flex-col gap-0.5 leading-snug">
                          <span className="font-black flex items-center gap-1" style={{ fontFamily: "'Patrick Hand SC', sans-serif", fontSize: '20px' }}>🐟 chọn "cốt cá"</span>
                          <span className="text-pink-600/70 text-[10px] font-normal leading-normal">
                            (Char này thuộc chủng tộc gì, ngoại hình ra sao?)
                          </span>
                        </label>
                        <input
                          type="text"
                          value={kilnCotCa}
                          onChange={(e) => setKilnCotCa(e.target.value)}
                          placeholder="Ví dụ: Cá ngừ mắt to, vảy lấp lánh như kim sa..."
                          className="w-full px-5 py-3 rounded-[25px] border border-[#FF84BA]/40 bg-white text-[#D6336C] font-sans text-xs font-bold focus:outline-none focus:border-[#FF4081] focus:ring-4 focus:ring-[#FF84BA]/20 placeholder-pink-300/80 transition-all shadow-sm"
                        />
                      </div>

                      {/* Input 2: Gia Vị */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#D6336C] flex flex-col gap-0.5 leading-snug">
                          <span className="font-black flex items-center gap-1" style={{ fontFamily: "'Patrick Hand SC', sans-serif", fontSize: '20px' }}>🧂 gia vị đi kèm</span>
                          <span className="text-pink-600/70 text-[10px] font-normal leading-normal">
                            (Tsundere thì cay nồng như ớt, ấm áp thì ngọt ngào như mật ong, hay một cốt truyện buồn nức nở thì mặn chát như muối biển?)
                          </span>
                        </label>
                        <input
                          type="text"
                          value={kilnGiaVi}
                          onChange={(e) => setKilnGiaVi(e.target.value)}
                          placeholder="Ví dụ: Tsundere cay nồng ấm áp ngọt ngào..."
                          className="w-full px-5 py-3 rounded-[25px] border border-[#FF84BA]/40 bg-white text-[#D6336C] font-sans text-xs font-bold focus:outline-none focus:border-[#FF4081] focus:ring-4 focus:ring-[#FF84BA]/20 placeholder-pink-300/80 transition-all shadow-sm"
                        />
                      </div>

                      {/* Input 3: Nhiệt Độ Sấy */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#D6336C] flex flex-col gap-0.5 leading-snug">
                          <span className="font-black flex items-center gap-1" style={{ fontFamily: "'Patrick Hand SC', sans-serif", fontSize: '20px' }}>🔥 nhiệt độ sấy</span>
                          <span className="text-pink-600/70 text-[10px] font-normal leading-normal">
                            (Plot hoặc cốt truyện sơ lược)
                          </span>
                        </label>
                        <input
                          type="text"
                          value={kilnNhietDo}
                          onChange={(e) => setKilnNhietDo(e.target.value)}
                          placeholder="Ví dụ: Nhẹ nhàng, êm đềm như sóng biển vỗ bờ..."
                          className="w-full px-5 py-3 rounded-[25px] border border-[#FF84BA]/40 bg-white text-[#D6336C] font-sans text-xs font-bold focus:outline-none focus:border-[#FF4081] focus:ring-4 focus:ring-[#FF84BA]/20 placeholder-pink-300/80 transition-all shadow-sm"
                        />
                      </div>
                    </div>

                    {/* Jelly Submit Button "✨ SẤY CÁ KHÔ ✨" */}
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-[25px] bg-gradient-to-r from-[#F13E93] to-[#FF85BB] text-white font-black uppercase tracking-widest text-sm shadow-md hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 border border-white/40 cursor-pointer shimmer-button cute-glowing"
                      style={{ fontFamily: "'Mali', sans-serif", width: '412.727px', height: '53.4197px', marginBottom: '-4px', marginRight: '0px' }}
                    >
                      <span style={{ fontSize: '25px', fontFamily: "'Itim', sans-serif" }}>✨ SẤY CÁ KHÔ ✨</span>
                    </button>

                  </form>

                  {/* Nắp lò sấy đóng lại overlay */}
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: isDrying ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0 z-30 bg-gradient-to-b from-[#FFF5F8] to-[#FF84BA] rounded-[28px] border-4 border-[#FF4081] shadow-2xl flex flex-col items-center justify-center text-center origin-top pointer-events-none"
                  >
                    {/* Pink magic bubbles and sparkles inside the closed oven */}
                    <motion.div 
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                      className="flex flex-col items-center gap-3 p-4"
                    >
                      <span className="text-5xl animate-bounce">🌸💨✨</span>
                      <p className="font-mali text-[#D6336C] text-lg font-black tracking-widest uppercase">
                        ĐANG SẤY CÁ PHÉP THUẬT...
                      </p>
                      <div className="w-48 bg-white/60 h-3 rounded-full overflow-hidden border border-[#FF84BA]/30 p-0.5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: isDrying ? "100%" : 0 }}
                          transition={{ duration: 1.8, ease: "linear" }}
                          className="bg-gradient-to-r from-[#D6336C] to-[#FF4081] h-full rounded-full"
                        />
                      </div>
                      <p className="text-[10px] text-[#D6336C]/80 font-bold max-w-xs leading-normal">
                        Cá của bạn đang được sấy giòn rụm trong lò phép thuật kẹo ngọt!
                      </p>
                    </motion.div>
                  </motion.div>
                </div>
              </div>

            </div>

            {/* ==================== MÁY GACHA CHỌN CHỒNG THẦN KỲ (HIỂN THỊ TRỰC TIẾP) ==================== */}
            <div className="mt-12 w-full max-w-xl mx-auto z-10">
              <div 
                className="rounded-[36px] p-8 shadow-2xl relative overflow-hidden flex flex-col items-center border-4"
                style={{ borderColor: '#ff84ba', backgroundColor: '#fff5f8' }}
              >
                {/* Visual decorations scattered nicely in the background (never overlapping or clustering) */}
                <div className="absolute top-4 left-6 text-pink-300 text-2xl pointer-events-none opacity-40 select-none animate-pulse" style={{ animationDuration: '4s' }}>🔮</div>
                <div className="absolute bottom-6 right-6 text-pink-300 text-2xl pointer-events-none opacity-40 select-none animate-pulse" style={{ animationDuration: '4.5s' }}>💝</div>
                <div className="absolute top-8 right-8 text-yellow-400 text-xl pointer-events-none opacity-50 select-none animate-bounce" style={{ animationDuration: '3.2s' }}>⭐</div>
                <div className="absolute bottom-16 left-8 text-pink-400 text-lg pointer-events-none opacity-50 select-none animate-pulse" style={{ animationDuration: '2.8s' }}>💖</div>
                <div className="absolute top-1/2 -left-2 text-pink-300 text-2xl pointer-events-none opacity-30 select-none animate-bounce" style={{ animationDuration: '5s' }}>🌸</div>
                <div className="absolute top-1/3 -right-2 text-yellow-300 text-xl pointer-events-none opacity-30 select-none animate-pulse" style={{ animationDuration: '3.8s' }}>✨</div>
                <div className="absolute bottom-24 right-4 text-pink-300 text-lg pointer-events-none opacity-40 select-none animate-bounce" style={{ animationDuration: '4.2s' }}>💕</div>
                <div className="absolute top-20 left-10 text-yellow-400 text-base pointer-events-none opacity-40 select-none animate-pulse" style={{ animationDuration: '3.5s' }}>🌟</div>
                <div className="absolute top-1/4 left-3 text-pink-400 text-xl pointer-events-none opacity-40 animate-bounce select-none">✨</div>
                <div className="absolute bottom-32 right-8 text-yellow-400 text-lg pointer-events-none opacity-40 animate-pulse select-none">⭐</div>
                
                {/* Title */}
                <div className="text-center mb-6 px-6">
                  <h2 className="font-fraunces font-black text-2xl text-[#d84b6b] flex items-center justify-center gap-2">
                    Máy Gacha Chọn Chồng Thần Kỳ 🔮
                  </h2>
                  <p className="text-[11px] font-bold mt-1.5 uppercase tracking-wider text-[#d6336b] font-sans">
                    Xoay cá thần sầu, bốc ngay một anh chồng định mệnh siêu ngọt ngào!
                  </p>
                </div>

                {/* Gacha Machine Frame Wrapper */}
                <div className={`flex flex-col items-center relative ${isGachaSpinning ? 'animate-gacha-shake' : ''}`}>
                  
                  {/* Glossy transparent glass dome */}
                  <div className="w-64 h-64 rounded-full bg-white/25 backdrop-blur-md border-3 border-white/60 shadow-[0_10px_30px_rgba(255,182,193,0.3),inset_0_4px_12px_rgba(255,255,255,0.6)] relative overflow-hidden flex items-end justify-center z-20">
                    
                    {/* Glossy white glare arc for 3D look */}
                    <div className="absolute top-3 left-8 w-40 h-14 bg-white/25 rounded-full rotate-[-25deg] blur-[1px] pointer-events-none" />
                    <div className="absolute top-6 left-6 w-5 h-5 bg-white/45 rounded-full blur-[0.5px] pointer-events-none" />

                    {/* Cute capsule balls resting overlapping at the bottom of the dome - filled minimum 1/2 of volume */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[
                        // Row 1 (bottom most)
                        { left: "20px", bottom: "8px", rotate: "-15deg", color: "#FFCEE3", isLucky: false, bounceClass: "animate-ball-bounce-1" },
                        { left: "52px", bottom: "4px", rotate: "8deg", color: "#FF85BB", isLucky: false, bounceClass: "animate-ball-bounce-2" },
                        { left: "84px", bottom: "2px", rotate: "-12deg", color: "#FFD8DF", isLucky: true, bounceClass: "animate-ball-bounce-3" }, // Lucky Fish
                        { left: "116px", bottom: "2px", rotate: "15deg", color: "#FFF6E3", isLucky: false, bounceClass: "animate-ball-bounce-4" },
                        { left: "148px", bottom: "4px", rotate: "-5deg", color: "#BDE3C3", isLucky: false, bounceClass: "animate-ball-bounce-1" },
                        { left: "180px", bottom: "8px", rotate: "25deg", color: "#FFCEE3", isLucky: false, bounceClass: "animate-ball-bounce-2" },
                        { left: "212px", bottom: "16px", rotate: "-20deg", color: "#FF85BB", isLucky: false, bounceClass: "animate-ball-bounce-3" },

                        // Row 2
                        { left: "36px", bottom: "34px", rotate: "-28deg", color: "#FFD8DF", isLucky: false, bounceClass: "animate-ball-bounce-4" },
                        { left: "68px", bottom: "30px", rotate: "12deg", color: "#FFF6E3", isLucky: false, bounceClass: "animate-ball-bounce-1" },
                        { left: "100px", bottom: "28px", rotate: "-18deg", color: "#BDE3C3", isLucky: false, bounceClass: "animate-ball-bounce-2" },
                        { left: "132px", bottom: "28px", rotate: "5deg", color: "#FFCEE3", isLucky: false, bounceClass: "animate-ball-bounce-3" },
                        { left: "164px", bottom: "32px", rotate: "-15deg", color: "#FF85BB", isLucky: true, bounceClass: "animate-ball-bounce-4" }, // Lucky Fish
                        { left: "196px", bottom: "38px", rotate: "18deg", color: "#FFD8DF", isLucky: false, bounceClass: "animate-ball-bounce-1" },

                        // Row 3
                        { left: "22px", bottom: "60px", rotate: "-5deg", color: "#FFF6E3", isLucky: false, bounceClass: "animate-ball-bounce-2" },
                        { left: "54px", bottom: "56px", rotate: "22deg", color: "#BDE3C3", isLucky: false, bounceClass: "animate-ball-bounce-3" },
                        { left: "86px", bottom: "52px", rotate: "-10deg", color: "#FFCEE3", isLucky: false, bounceClass: "animate-ball-bounce-4" },
                        { left: "118px", bottom: "50px", rotate: "15deg", color: "#FF85BB", isLucky: false, bounceClass: "animate-ball-bounce-1" },
                        { left: "150px", bottom: "54px", rotate: "-25deg", color: "#FFD8DF", isLucky: false, bounceClass: "animate-ball-bounce-2" },
                        { left: "182px", bottom: "60px", rotate: "8deg", color: "#FFF6E3", isLucky: false, bounceClass: "animate-ball-bounce-3" },
                        { left: "214px", bottom: "66px", rotate: "-15deg", color: "#BDE3C3", isLucky: false, bounceClass: "animate-ball-bounce-4" },

                        // Row 4 (almost reaching 1/2 height ~ 128px)
                        { left: "38px", bottom: "82px", rotate: "18deg", color: "#FFCEE3", isLucky: false, bounceClass: "animate-ball-bounce-1" },
                        { left: "70px", bottom: "78px", rotate: "-12deg", color: "#FF85BB", isLucky: true, bounceClass: "animate-ball-bounce-2" }, // Lucky Fish
                        { left: "102px", bottom: "74px", rotate: "5deg", color: "#FFD8DF", isLucky: false, bounceClass: "animate-ball-bounce-3" },
                        { left: "134px", bottom: "76px", rotate: "-22deg", color: "#FFF6E3", isLucky: false, bounceClass: "animate-ball-bounce-4" },
                        { left: "166px", bottom: "82px", rotate: "15deg", color: "#BDE3C3", isLucky: false, bounceClass: "animate-ball-bounce-1" },
                        { left: "198px", bottom: "90px", rotate: "-8deg", color: "#FFCEE3", isLucky: false, bounceClass: "animate-ball-bounce-2" },

                        // Row 5 (stacked peak)
                        { left: "54px", bottom: "104px", rotate: "30deg", color: "#FF85BB", isLucky: false, bounceClass: "animate-ball-bounce-3" },
                        { left: "86px", bottom: "98px", rotate: "-15deg", color: "#FFD8DF", isLucky: false, bounceClass: "animate-ball-bounce-4" },
                        { left: "118px", bottom: "96px", rotate: "8deg", color: "#FFF6E3", isLucky: false, bounceClass: "animate-ball-bounce-1" },
                        { left: "150px", bottom: "102px", rotate: "-18deg", color: "#BDE3C3", isLucky: false, bounceClass: "animate-ball-bounce-2" },
                        { left: "182px", bottom: "110px", rotate: "22deg", color: "#FFCEE3", isLucky: false, bounceClass: "animate-ball-bounce-3" }
                      ].map((ball, index) => (
                        <div
                          key={index}
                          className={`absolute w-[38px] h-[38px] rounded-full border border-white/60 shadow-[0_4px_6px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.6)] ${isGachaSpinning ? ball.bounceClass : ''}`}
                          style={{
                            left: ball.left,
                            bottom: ball.bottom,
                            transform: `rotate(${ball.rotate})`,
                            background: `linear-gradient(to bottom, rgba(255, 255, 255, 0.25) 50%, ${ball.color} 50%)`,
                            transition: isGachaSpinning ? 'none' : 'transform 0.4s ease-out, bottom 0.4s ease-out, left 0.4s ease-out',
                          }}
                        >
                          {/* The fish icon in the top half (Lucky -> 🐠, Regular -> 🐟) */}
                          <div className="absolute top-0 left-0 right-0 h-1/2 flex items-center justify-center text-[11px] leading-none select-none">
                            {ball.isLucky ? '🐠' : '🐟'}
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Machine Body Pedestal in Clean Kawaii 2-column layout with glowing gradient */}
                  <div 
                    className="w-64 sm:w-72 border-4 border-white rounded-b-[48px] rounded-t-2xl py-5 px-4 relative -mt-4 flex flex-row items-center justify-between z-10"
                    style={{
                      background: 'linear-gradient(135deg, #FF3E9B 0%, #FFCEE3 100%)',
                      boxShadow: '0 0 25px rgba(255, 62, 155, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.4)'
                    }}
                  >
                    
                    {/* Left Side - Fish turning knob */}
                    <div className="flex flex-col items-center justify-center w-1/2 relative border-r border-white/25 pr-2">
                      <div className="text-[9px] font-black text-white bg-pink-700/80 px-2 py-0.5 rounded-full border border-white/30 mb-2 font-sans tracking-wide">
                        VẶN NƠ
                      </div>
                      
                      <div 
                        onClick={handleSpinGacha}
                        className="group relative cursor-grab active:cursor-grabbing transition-transform duration-200 hover:scale-110 active:scale-95"
                      >
                        {/* Glow halo behind */}
                        <div className="absolute -inset-1.5 bg-pink-300 rounded-full blur-sm opacity-60 group-hover:opacity-100 transition-opacity animate-pulse" />
                        
                        {/* Rotating Knob Element */}
                        <div 
                          className={`w-16 h-16 rounded-full bg-gradient-to-br from-[#ffd0de] to-[#ff9cb8] border-4 border-white shadow-lg flex items-center justify-center relative ${isKnobSpinning ? 'animate-spin-knob' : ''}`}
                        >
                          {/* Milk-white Tuna plate inside */}
                          <div className="w-10 h-10 rounded-full bg-white/90 shadow-inner flex items-center justify-center text-2xl select-none font-bold text-[#d6336c]">
                            🐟
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] font-black text-white/95 mt-2 font-itim text-center">
                        Tìm định mệnh
                      </div>
                    </div>

                    {/* Right Side - Prize Chute (Ô rơi bóng) */}
                    <div className="flex flex-col items-center justify-center w-1/2 relative pl-2">
                      <div className="text-[9px] font-black text-white bg-pink-700/80 px-2 py-0.5 rounded-full border border-white/30 mb-2 font-sans tracking-wide">
                        Khay nhận chồng 🌸
                      </div>

                      {/* Dark Deep Chute Hole */}
                      <div className="w-24 h-16 bg-pink-950/80 rounded-[24px] border-t-4 border-pink-900/60 relative overflow-hidden flex items-center justify-center shadow-[inset_0_4px_8px_rgba(0,0,0,0.6)]">
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

                        {/* Fallen ball element in chute */}
                        {gachaFallenBall && (
                          <div className="absolute z-20">
                            <motion.div
                              initial={{ x: -35, y: -80, scale: 0.5, rotate: 0, opacity: 0 }}
                              animate={{ x: 0, y: 0, scale: 1, rotate: 360, opacity: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 140,
                                damping: 10,
                                delay: 0.1
                              }}
                              className={`w-[38px] h-[38px] rounded-full border border-white/80 flex items-center justify-center text-xl shadow-md relative ${gachaBurst ? 'cute-glowing' : ''}`}
                              style={{
                                background: `linear-gradient(to bottom, rgba(255, 255, 255, 0.25) 50%, ${gachaFallenColor} 50%)`
                              }}
                            >
                              {/* Upper half fish icon */}
                              <div className="absolute top-0 left-0 right-0 h-1/2 flex items-center justify-center text-[11px] leading-none select-none">
                                {gachaFallenBall}
                              </div>
                            </motion.div>
                          </div>
                        )}

                        {/* Sparkles of burst */}
                        {gachaBurst && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                            <motion.div
                              initial={{ scale: 0.2, opacity: 1 }}
                              animate={{ scale: 1.8, opacity: 0 }}
                              transition={{ duration: 0.6 }}
                              className="absolute text-xl flex gap-1 justify-center items-center font-sans select-none"
                            >
                              <span>✨</span>
                              <span>🌟</span>
                              <span>💖</span>
                            </motion.div>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-[10px] font-black text-white/95 mt-2 font-itim text-center">
                        Nhận cầu duyên
                      </div>
                    </div>

                  </div>

                </div>

                {/* Sparkling details around machine */}
                <div className="absolute top-1/2 left-8 text-pink-400 text-sm animate-bounce opacity-45">✨</div>
                <div className="absolute top-1/3 right-8 text-pink-400 text-sm animate-pulse opacity-45">🌟</div>
                <div className="absolute bottom-12 left-16 text-pink-400 text-sm animate-pulse opacity-45">💖</div>

              </div>
            </div>



            {/* Back to Home Button at bottom of main view */}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setView('home')}
                className="font-patrick text-base bg-white/70 hover:bg-[#ffe4e1] border border-pink-200/50 text-[#7c5e55] hover:text-pink-600 rounded-full py-2 px-6 shadow-sm flex items-center gap-1.5 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                🐟 quay về trang chủ tiệm
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cute Modals (Plot, AI, Error reporting) */}
      <CuteModal
        type={modalType}
        product={modalProduct}
        onClose={() => {
          setModalType(null);
          setModalProduct(null);
        }}
        onReward={(amount) => {
          setGoldCoins((prev) => prev + amount);
        }}
        onAddReport={handleAddReport}
      />

      {/* Pop-up Chồng Quốc Dân Gacha Result Modal */}
      <AnimatePresence>
        {showGachaModal && gachaResult && (
          <div 
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowGachaModal(false);
                if (gachaResult.id === 'lucky_fish') {
                  setGoldCoins((prev) => prev + 5);
                }
              }
            }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4 cursor-pointer"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="bg-white/90 border-4 border-pink-200/80 rounded-[25px] p-8 max-w-sm w-full shadow-2xl relative text-center flex flex-col items-center overflow-hidden cursor-default"
              style={{
                background: gachaResult.id === 'lucky_fish' 
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(224, 242, 254, 0.95) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 240, 245, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Cute sparkles background decoration inside modal */}
              <div className="absolute top-2 left-2 text-pink-300 text-lg opacity-40">✨</div>
              <div className="absolute top-2 right-2 text-pink-300 text-lg opacity-40">✨</div>
              <div className="absolute -bottom-6 -left-6 text-7xl opacity-10 pointer-events-none">🌸</div>
              <div className="absolute -bottom-6 -right-6 text-7xl opacity-10 pointer-events-none">🌸</div>

              {/* Header Badge */}
              <span className="text-4xl mb-3 animate-bounce">
                {gachaResult.id === 'lucky_fish' ? '🐠✨🎁' : '💖👑🤵'}
              </span>
              <h4 className="text-xs uppercase tracking-widest text-pink-500 font-extrabold mb-1">
                {gachaResult.id === 'lucky_fish' ? 'ƯU ĐÃI NGỌT NGÀO' : 'Kết Quả Định Mệnh Của Bạn'}
              </h4>
              <div className="w-16 h-0.5 bg-gradient-to-r from-pink-300 to-orange-300 rounded-full mb-4" />

              {/* Rarity Title (Font Playball with gradient pink-orange) */}
              <h3 
                className="font-playball text-3xl font-bold bg-gradient-to-r from-pink-500 via-[#ff4081] to-orange-400 bg-clip-text text-transparent mb-2 leading-relaxed"
                style={{ filter: 'drop-shadow(0 1px 1px rgba(255,182,193,0.3))' }}
              >
                {gachaResult.rarity}
              </h3>

              {/* Tags if available */}
              {gachaResult.tags && gachaResult.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1 mb-3">
                  {gachaResult.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="text-[10px] font-lexend bg-pink-50 text-pink-600 px-2 py-0.5 rounded-full border border-pink-100 uppercase font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Husband/Fish Avatar placeholder card */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-pink-100 to-orange-50 border-2 border-pink-200 shadow-inner flex items-center justify-center text-5xl mb-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <motion.span 
                  animate={{ scale: [1, 1.1, 1] }} 
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {gachaResult.image ? gachaResult.image : (gachaResult.id === 'lucky_fish' ? '🐠' : '🤵')}
                </motion.span>
                
                {/* Sparkle badge on top corner */}
                <div className="absolute -top-1 -right-1 bg-pink-400 text-white rounded-full p-0.5 text-[8px] border border-white">✨</div>
              </div>

              {/* Description (Font Quicksand, warm brown) */}
              <p className="font-quicksand text-sm text-[#7c5e55] font-semibold leading-relaxed mb-4 px-3 max-h-24 overflow-y-auto">
                "{gachaResult.description}"
              </p>

              {/* Action buttons (Xem cốt truyện & Quay tiếp) */}
              {gachaResult.id !== 'lucky_fish' && PRODUCTS.some(p => p.id === gachaResult.id) && (
                <button
                  onClick={() => {
                    const prod = PRODUCTS.find(p => p.id === gachaResult.id);
                    if (prod) {
                      setModalProduct(prod);
                      setModalType('plot');
                      setShowGachaModal(false);
                    }
                  }}
                  className="w-full py-2.5 mb-2 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 text-white font-bold uppercase tracking-wider text-xs shadow-xs hover:scale-103 active:scale-97 transition-all duration-300 flex items-center justify-center gap-2 border border-white/40 cursor-pointer"
                  style={{ fontFamily: "'Mali', sans-serif" }}
                >
                  📖 Đọc Ngay Cốt Truyện 📖
                </button>
              )}

              {/* Jelly ribbon-tie closing button "Quay tiếp" */}
              <button
                onClick={() => {
                  setShowGachaModal(false);
                  if (gachaResult.id === 'lucky_fish') {
                    // Tặng 5 xu vàng tương đương với lượt quay mới hoàn toàn miễn phí
                    setGoldCoins((prev) => prev + 5);
                  }
                }}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#ff84ba] via-pink-400 to-[#ff84ba] text-white font-black uppercase tracking-wider text-xs shadow-md hover:scale-103 active:scale-97 transition-all duration-300 flex items-center justify-center gap-2 border border-white/40 cursor-pointer relative shimmer-button"
                style={{ fontFamily: "'Mali', sans-serif" }}
              >
                {gachaResult.id === 'lucky_fish' ? (
                  <span>🎁 Nhận Lượt Quay Miễn Phí 🎁</span>
                ) : (
                  <span>🎀 Quay Tiếp 🎀</span>
                )}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>





      {/* Ghibli style popup for Lò sấy phép thuật */}
      <AnimatePresence>
        {showGhibliNotification && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#fcf8f2] border-4 border-[#8b5a2b] rounded-[32px] p-6 max-w-md w-full shadow-2xl relative font-quicksand text-[#5c3e35]"
            >
              {/* Cute leaf ornament */}
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-3xl animate-bounce">
                🌱
              </div>
              <button
                onClick={() => setShowGhibliNotification(false)}
                className="absolute top-4 right-4 text-[#8b5a2b] hover:text-red-500 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="text-center mt-2 flex flex-col items-center">
                <span className="text-5xl mb-3 animate-pulse">💨✨</span>
                <h3 className="font-fraunces font-black text-2xl text-[#8b5a2b] mb-2">
                  Lò Sấy Phép Thuật Bùng Cháy!
                </h3>
                <div className="w-24 h-1 bg-[#8b5a2b]/20 rounded-full mb-4" />
                
                <p className="text-sm font-semibold leading-relaxed mb-6 px-2">
                  Cá của bạn đã được cho vào lò sấy. Cảm ơn bạn đã sử dụng dịch vụ lò sấy phép thuật! 🍂🐟
                </p>

                <div className="bg-[#f0e6d2] p-4 rounded-2xl w-full text-left border-2 border-dashed border-[#8b5a2b]/30 mb-6">
                  <p className="text-xs font-bold text-[#8b5a2b] mb-1">Mẻ cá sấy vừa ra lò:</p>
                  <p className="text-xs text-[#7c5e55] font-semibold"><span className="text-[#c2185b]">Cốt Cá:</span> Đã nạp thành công!</p>
                  <p className="text-xs text-[#7c5e55] font-semibold"><span className="text-[#c2185b]">Gia Vị:</span> Thơm lừng bản sắc!</p>
                  <p className="text-xs text-[#7c5e55] font-semibold"><span className="text-[#c2185b]">Nhiệt Độ:</span> Sấy chuẩn Nhật cổ!</p>
                </div>

                <p className="text-xs text-[#8c6d62] italic mb-6">
                  "Bà chủ Tiệm Cá Khô đã nhận được công thức và sẽ sớm hô biến ra một bạn cá khô siêu cấp dễ thương mới nha!" 🌟
                </p>

                <button
                  onClick={() => setShowGhibliNotification(false)}
                  className="px-6 py-2.5 rounded-full bg-[#8b5a2b] hover:bg-[#704620] text-[#fcf8f2] font-bold text-sm shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check size={16} /> Nhận Mẻ Cá Khô
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Panel Footer Section */}
      {view === 'shop' && (
        <footer
          id="admin-footer-section"
          className="w-full bg-[#fdf3f0] border-t-2 border-pink-200/80 text-[#7c5e55] font-quicksand py-10 px-6 mt-16 relative z-30"
        >
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            {/* Header */}
            <div className="text-center">
              <h2 className="font-fraunces font-black text-xl text-[#5c3e35] flex items-center justify-center gap-2">
                <Settings size={20} className="animate-spin text-pink-400" style={{ animationDuration: '8s' }} />
                Bảng Điều Khiển Chủ Tiệm (Admin Panel) 🗝️
              </h2>
              <p className="text-xs text-[#8c6d62] font-semibold mt-1">
                Thống kê lỗi nhân vật & Quản lý chất lượng prompt cá khô
              </p>
            </div>

            {/* Password Protection Area */}
            {!isAdminUnlocked && (
              <motion.div 
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white/60 p-6 rounded-3xl border border-pink-100 shadow-sm max-w-md mx-auto w-full text-center"
              >
                <p className="text-xs font-semibold mb-3 text-[#7c5e55]">
                  Vui lòng nhập mật mã của Chủ Tiệm để truy cập bảng dữ liệu thống kê lỗi:
                </p>
                <form onSubmit={handleVerifyPassword} className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    id="admin-password-input"
                    type="password"
                    value={adminPasswordInput}
                    onChange={(e) => {
                      setAdminPasswordInput(e.target.value);
                      setPasswordError('');
                    }}
                    placeholder="Nhập mật mã Chủ Tiệm..."
                    className="flex-grow p-3 px-5 text-xs rounded-full bg-white border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-[#7c5e55] placeholder-pink-300/80 shadow-inner text-center sm:text-left"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-pink-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 text-white font-bold text-xs py-3 px-6 rounded-full transition-all duration-300 hover:scale-103 active:scale-97 shadow-md cursor-pointer"
                  >
                    Xác nhận 🌸
                  </button>
                </form>
                {passwordError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-rose-500 text-xs font-bold mt-2.5 flex items-center justify-center gap-1"
                  >
                    <AlertTriangle size={12} /> {passwordError}
                  </motion.p>
                )}
              </motion.div>
            )}
            {isAdminUnlocked && (
              <AdminPanel 
               characterLink={characterLink}
               setCharacterLink={setCharacterLink}
               isLinkActive={isLinkActive}
               setIsLinkActive={setIsLinkActive}
               />
             )}
            
            

            {/* Admin Dashboard Content - display: none by default, block when unlocked */}
            <div
              id="admin-dashboard-content"
              style={{ display: isAdminUnlocked ? 'block' : 'none' }}
            >
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={isAdminUnlocked ? { opacity: 1, y: 0 } : {}}
                className="flex flex-col gap-6"
              >
                {/* Unlock success banner */}
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-3.5 px-5 rounded-2xl text-xs font-medium flex items-center justify-between shadow-xs">
                  <span className="flex items-center gap-2">
                    <Check size={14} className="stroke-[3]" />
                    Đã mở khóa thành công! Chào mừng bà chủ quay lại chăm sóc tiệm ạ! 💕
                  </span>
                  <button
                    onClick={() => {
                      if (!isLinkActive) {
                        alert('🔒 Chức năng link GG AI Studio hiện đang tạm khóa miêu~!');
                        return;
                      }
                      if (!characterLink) {
                        alert('⚠️ Chưa cài đặt đường link trong Admin Panel!');
                        return;
                      }
                      window.open(characterLink, '_blank');
                    }}
                    style={{
                      opacity: isLinkActive ? 1 : 0.6,
                      cursor: isLinkActive ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {isLinkActive ? '✨ Mở Link AI Studio' : '🔒 Link AI Studio (Đã khóa)'}
                  </button>

                 {/* Stats Cards */}
                 <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                   <div className="bg-rose-50/70 border border-rose-100 p-4 rounded-2xl text-center">
                     <span className="block text-[10px] font-bold text-[#8c6d62] uppercase tracking-wider">Lệch tính cách (OOC)</span>
                     <span className="font-fraunces text-2xl font-black text-rose-600 block mt-1">
                       {reportsArray.reduce((acc, r) => acc + r.errorTypes.filter(t => t.includes('OOC')).length, 0)}
                     </span>
                     <span className="text-[9px] text-[#8c6d62] font-semibold">lượt OOC</span>
                   </div>
                   
                   <div className="bg-orange-50/70 border border-orange-100 p-4 rounded-2xl text-center">
                     <span className="block text-[10px] font-bold text-[#8c6d62] uppercase tracking-wider">Lỗi nội dung (NSFW)</span>
                     <span className="font-fraunces text-2xl font-black text-orange-600 block mt-1">
                       {reportsArray.reduce((acc, r) => acc + r.errorTypes.filter(t => t.includes('NSFW')).length, 0)}
                     </span>
                     <span className="text-[9px] text-[#8c6d62] font-semibold">lượt lỗi</span>
                   </div>

                   <div className="bg-purple-50/70 border border-purple-100 p-4 rounded-2xl text-center">
                     <span className="block text-[10px] font-bold text-[#8c6d62] uppercase tracking-wider">Trở nên vô tri (Mất trí)</span>
                     <span className="font-fraunces text-2xl font-black text-purple-600 block mt-1">
                       {reportsArray.reduce((acc, r) => acc + r.errorTypes.filter(t => t.includes('vô tri') || t.includes('trí nhớ')).length, 0)}
                     </span>
                     <span className="text-[9px] text-[#8c6d62] font-semibold">lượt vô tri</span>
                   </div>

                   <div className="bg-blue-50/70 border border-blue-100 p-4 rounded-2xl text-center">
                     <span className="block text-[10px] font-bold text-[#8c6d62] uppercase tracking-wider">Báo cáo Khác</span>
                     <span className="font-fraunces text-2xl font-black text-blue-600 block mt-1">
                       {reportsArray.reduce((acc, r) => acc + r.errorTypes.filter(t => t.includes('Khác')).length, 0)}
                     </span>
                     <span className="text-[9px] text-[#8c6d62] font-semibold">lượt khác</span>
                   </div>
                 </div>

                {/* Reports Table as explicitly requested */}
                <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
                  <div className="p-4 px-5 border-b border-pink-50 flex justify-between items-center bg-pink-50/40">
                    <h3 className="font-fraunces font-bold text-sm text-[#5c3e35] flex items-center gap-1.5">
                      <ShieldAlert size={15} className="text-pink-500 animate-pulse" />
                      Báo Cáo Lỗi Gom Nhóm ({getReportStats().length} nhân vật)
                    </h3>
                  </div>

                  {getReportStats().length === 0 ? (
                    <div className="text-center py-10 flex flex-col items-center gap-2">
                      <span className="text-3xl">🎉</span>
                      <h4 className="font-bold text-[#5c3e35] text-sm">Tuyệt vời! Không có báo lỗi nào chưa sửa!</h4>
                      <p className="text-xs text-[#8c6d62]">Các em bé cá khô đều đang hoạt động mượt mà dễ thương.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left font-quicksand text-xs border-collapse">
                        <thead>
                          <tr className="bg-pink-50/30 text-[#7c5e55]/80 font-bold border-b border-pink-100">
                            <th className="py-3 px-4 font-bold">Tên nhân vật</th>
                            <th className="py-3 px-4 font-bold text-center">Lệch OOC</th>
                            <th className="py-3 px-4 font-bold text-center">Lỗi nội dung</th>
                            <th className="py-3 px-4 font-bold text-center">Mất trí nhớ</th>
                            <th className="py-3 px-4 font-bold text-center">Khác</th>
                            <th className="py-3 px-4 font-bold text-center">Tổng lượt báo</th>
                            <th className="py-3 px-4 font-bold text-center">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-pink-50">
                          {getReportStats().map((stat, idx) => {
                            const totalReports = stat.ooc + stat.nsfw + stat.amnesia + stat.other;
                            return (
                              <tr key={idx} className="hover:bg-pink-50/30 transition-all duration-200">
                                <td className="py-3.5 px-4 font-bold text-[#5c3e35] text-sm">
                                  <div>{stat.characterName}</div>
                                  {reportsArray.some(r => r.characterName === stat.characterName && r.details) && (
                                    <div className="mt-1.5 text-[10px] font-normal text-blue-700 font-sans flex flex-col gap-1 pl-2 border-l-2 border-blue-400">
                                      <span className="font-bold text-[9px] uppercase tracking-wider text-blue-500 block">Ý kiến chi tiết (Khác):</span>
                                      {reportsArray
                                        .filter(r => r.characterName === stat.characterName && r.details)
                                        .map((r, rIdx) => (
                                          <div key={rIdx} className="bg-blue-50/50 p-1 px-1.5 rounded border border-blue-100/40 mt-0.5 text-left">
                                            • "{r.details}" <span className="text-[8px] text-[#c4b1aa] ml-1 font-mono">({r.timestamp})</span>
                                          </div>
                                        ))}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  {stat.ooc > 0 ? (
                                    <span className="bg-rose-50 text-rose-600 border border-rose-100 font-sans text-[10px] font-black px-2 py-0.5 rounded-full">
                                      {stat.ooc} lượt
                                    </span>
                                  ) : (
                                    <span className="text-[#c4b1aa]">-</span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  {stat.nsfw > 0 ? (
                                    <span className="bg-orange-50 text-orange-600 border border-orange-100 font-sans text-[10px] font-black px-2 py-0.5 rounded-full">
                                      {stat.nsfw} lượt
                                    </span>
                                  ) : (
                                    <span className="text-[#c4b1aa]">-</span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  {stat.amnesia > 0 ? (
                                    <span className="bg-purple-50 text-purple-600 border border-purple-100 font-sans text-[10px] font-black px-2 py-0.5 rounded-full">
                                      {stat.amnesia} lượt
                                    </span>
                                  ) : (
                                    <span className="text-[#c4b1aa]">-</span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  {stat.other > 0 ? (
                                    <span className="bg-blue-50 text-blue-600 border border-blue-100 font-sans text-[10px] font-black px-2 py-0.5 rounded-full">
                                      {stat.other} lượt
                                    </span>
                                  ) : (
                                    <span className="text-[#c4b1aa]">-</span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 text-center font-bold text-[#5c3e35]">
                                  {totalReports}
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  <button
                                    onClick={() => handleMarkAsFixed(stat.characterName)}
                                    className="mx-auto bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100 font-bold text-[11px] rounded-full py-1 px-3 transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                                  >
                                    <Check size={11} className="stroke-[3]" />
                                    Đã sửa
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Raw detailed activity logs */}
                {reportsArray.length > 0 && (
                  <div className="bg-white/60 p-4 rounded-2xl border border-pink-100 shadow-inner">
                    <h4 className="font-bold text-[10px] text-[#8c6d62] uppercase tracking-wider mb-2">Lịch sử chi tiết</h4>
                    <div className="max-h-36 overflow-y-auto flex flex-col gap-1.5 pr-2">
                      {reportsArray.map((rep) => (
                        <div key={rep.id} className="text-[11px] text-[#8c6d62] border-b border-pink-50/50 pb-1.5 flex flex-col gap-1">
                          <div className="flex justify-between items-center">
                            <span>
                              <strong>{rep.characterName}</strong>: <span className="bg-pink-100/50 px-1.5 py-0.5 rounded text-[10px] text-pink-700">{rep.errorTypes.join(', ')}</span>
                            </span>
                            <span className="text-[9px] font-mono text-[#c4b1aa]">{rep.timestamp}</span>
                          </div>
                          {rep.details && (
                            <div className="bg-blue-50/60 p-1.5 rounded-lg border border-blue-100 text-[10px] text-blue-900 font-sans ml-4 mt-0.5 text-left">
                              <strong>Lỗi khác:</strong> "{rep.details}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions Footer */}
                <div className="flex justify-between items-center pt-2 text-xs">
                  <span className="text-[#8c6d62] text-[10px] font-medium">Tổ hợp phím ẩn: <kbd className="bg-white border p-0.5 px-1.5 rounded text-[9px] font-mono font-bold">Alt + A</kbd></span>
                  <button
                    onClick={() => {
                      if (confirm('Bác có chắc chắn muốn xóa sạch toàn bộ lịch sử báo lỗi này không ạ?')) {
                        setReportsArray([]);
                        localStorage.setItem('tiem_ca_kho_reports', JSON.stringify([]));
                      }
                    }}
                    className="font-medium text-rose-500 hover:text-rose-700 bg-white hover:bg-rose-50 border border-rose-100/50 rounded-full py-1 px-4 transition-all cursor-pointer"
                  >
                    Xóa tất cả báo cáo
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

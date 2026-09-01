import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Plus, StickyNote, X } from 'lucide-react';
import { SavedPlan } from '../types';

export interface JourneyPlace {
  id: string;
  name: string;
  city?: string;
  category?: string;
  description: string;
  isFavorite: boolean;
  discoveredDate?: string;
  travelledDate?: string;
  photo?: string;
}

export interface CollageItem {
  id: string;
  type: 'photo' | 'sticker' | 'badge' | 'note';
  title?: string;
  content?: string;
  imageSrc?: string;
  stickerKey?: string;
  customSvgSrc?: string;
  discoveredDate?: string;
  travelledDate?: string;
  width?: number;
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
}

// Single standalone cultural elements
export const SINGLE_ELEMENTS = [
  { id: 'elem-bridge', name: 'Bridge (桥)', src: '/assets/elements/bridge-1.svg', category: 'Architecture' },
  { id: 'elem-building', name: 'House (水乡居)', src: '/assets/elements/building-1.svg', category: 'Architecture' },
  { id: 'elem-mountain', name: 'Mountain (远山)', src: '/assets/elements/mountain-1.svg', category: 'Nature' },
  { id: 'elem-lake', name: 'Lake Wave (水波)', src: '/assets/elements/lake-1.svg', category: 'Nature' },
  { id: 'elem-tea', name: 'Tea Leaf (茶叶)', src: '/assets/elements/tea-1.svg', category: 'Culture' },
  { id: 'elem-rice', name: 'Rice Bowl (米饭)', src: '/assets/elements/rice.svg', category: 'Food' },
  { id: 'elem-food', name: 'Food Plate (时鲜)', src: '/assets/elements/food.svg', category: 'Food' }
];

// Composite motifs
export const COMPOSITE_MOTIFS = [
  { key: 'water-village', title: 'Water Village', src: 'assets/water village.svg', category: 'Composition' },
  { key: 'tea-tasting', title: 'Tea Tasting', src: 'assets/tea tasting.svg', category: 'Composition' },
  { key: 'canal', title: 'Canal Bridges', src: 'assets/canal.svg', category: 'Composition' },
  { key: 'mountain-village', title: 'Mountain Village', src: 'assets/mountain village.svg', category: 'Composition' },
  { key: 'tea-picking', title: 'Tea Picking', src: 'assets/tea picking.svg', category: 'Composition' },
  { key: 'local-farm-food', title: 'Local Farm Food', src: 'assets/local farm food.svg', category: 'Composition' },
  { key: 'seafood', title: 'Coastal Seafood', src: 'assets/seafood.svg', category: 'Composition' },
  { key: 'nature', title: 'Lakes & Waters', src: 'assets/nature.svg', category: 'Composition' }
];

// Exactly matching the Explore Water Village theme places list (Minghe, West Lake, Wuzhen, Nanxun)
const WATER_VILLAGE_PLACES: JourneyPlace[] = [
  {
    id: 'minghe',
    name: 'Minghe Ancient Town',
    city: 'Guanhaiwei, Cixi',
    description: 'Minghe Ancient Town is the oldest market town in Cixi and one of the birthplaces of China’s traditional medicine industry. It was founded during the Kaiyuan period of the Tang Dynasty.',
    photo: 'assets/village-photo.png',
    isFavorite: true,
    discoveredDate: '07/21/2026',
    travelledDate: '08/08/2026'
  },
  {
    id: 'west-lake',
    name: 'West Lake',
    city: 'Hangzhou, Zhejiang',
    description: 'West Lake is one of China’s most famous lakes, renowned for its willow shores, causeways, and pagoda reflections.',
    photo: 'assets/village-photo.png',
    isFavorite: false,
    discoveredDate: '07/15/2026'
  },
  {
    id: 'wuzhen',
    name: 'Wuzhen Water Town',
    city: 'Tongxiang, Zhejiang',
    description: 'Walk the water lanes and discover wood carvings, stone arches and evening reflections across historic canals.',
    photo: 'assets/village-photo.png',
    isFavorite: true,
    discoveredDate: '07/20/2026',
    travelledDate: '08/02/2026'
  },
  {
    id: 'nanxun',
    name: 'Nanxun Ancient Town',
    city: 'Huzhou, Zhejiang',
    description: 'A tranquil historic water town featuring private gardens, waterways, and Western-Chinese fusion silk merchant villas.',
    photo: 'assets/village-photo.png',
    isFavorite: true,
    discoveredDate: '07/25/2026'
  }
];

const INITIAL_COLLAGE_ITEMS: CollageItem[] = [
  // 1. Polaroid Photo Cutout (top center-left)
  {
    id: 'photo-water-town',
    type: 'photo',
    title: '',
    imageSrc: './assets/images/No exact combination match found.png',
    x: 60,
    y: 15,
    rotation: -4,
    zIndex: 10
  },
  // 2. Sticker 1: Water Village
  {
    id: 'sticker-water-village',
    type: 'sticker',
    stickerKey: 'water-village',
    customSvgSrc: 'assets/water village.svg',
    title: 'Water Village',
    discoveredDate: '07/21/2026',
    travelledDate: '08/08/2026',
    x: 35,
    y: 235,
    rotation: 1,
    zIndex: 15
  },
  // 3. Sticker 2: Tea Picking
  {
    id: 'sticker-tea-picking',
    type: 'sticker',
    stickerKey: 'tea-picking',
    customSvgSrc: 'assets/tea picking.svg',
    title: 'Tea Picking',
    discoveredDate: '07/19/2026',
    travelledDate: '08/04/2026',
    x: 410,
    y: 220,
    rotation: -2,
    zIndex: 12
  },
  // 4. Sticker 3: Rice
  {
    id: 'sticker-rice',
    type: 'sticker',
    stickerKey: 'rice',
    customSvgSrc: 'assets/rice.svg',
    title: 'Rice',
    discoveredDate: '07/21/2026',
    travelledDate: '08/08/2026',
    width: 101,
    x: 50,
    y: 430,
    rotation: 2,
    zIndex: 14
  }
];

interface MyJourneyPageProps {
  onNavigateHome: () => void;
  onNavigateExplore?: () => void;
  onOpenSearch: () => void;
  savedPlans?: SavedPlan[];
  activePlanId?: string | null;
  onSelectPlan?: (planId: string) => void;
}

export const MyJourneyPage: React.FC<MyJourneyPageProps> = ({
  onNavigateHome,
  onNavigateExplore,
  onOpenSearch,
  savedPlans = [],
  activePlanId = null
}) => {
  // If savedPlans has an active plan or saved plans, adapt from that plan; otherwise use default Explore Water Village places
  const activePlan = savedPlans.find((p) => p.id === activePlanId) || (savedPlans.length > 0 ? savedPlans[0] : null);

  const initialPlacesList = React.useMemo(() => {
    if (activePlan && activePlan.places && activePlan.places.length > 0) {
      return activePlan.places.map((p) => ({
        id: p.id,
        name: p.name,
        city: p.city,
        description: p.text,
        photo: p.photo || 'assets/village-photo.png',
        isFavorite: p.isFavorite ?? true,
        discoveredDate: activePlan.createdAt || '07/21/2026',
        travelledDate: '08/08/2026'
      }));
    }
    return WATER_VILLAGE_PLACES;
  }, [activePlan]);

  const [places, setPlaces] = useState<JourneyPlace[]>(initialPlacesList);
  const [expandedPlaceId, setExpandedPlaceId] = useState<string | null>(null);
  const [collageItems, setCollageItems] = useState<CollageItem[]>(INITIAL_COLLAGE_ITEMS);

  // Floating info card state (only appears upon clicking an icon/sticker)
  const [activeBadge, setActiveBadge] = useState<{
    id: string;
    title: string;
    discoveredDate?: string;
    travelledDate?: string;
    x: number;
    y: number;
    zIndex: number;
  } | null>(null);

  // Modals
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [customJourneyTitle, setCustomJourneyTitle] = useState('');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Sync places when initialPlacesList updates
  React.useEffect(() => {
    setPlaces(initialPlacesList);
  }, [initialPlacesList]);

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaces((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          const newItem: CollageItem = {
            id: `photo-custom-${Date.now()}`,
            type: 'photo',
            title: file.name.replace(/\.[^/.]+$/, ''),
            imageSrc: result,
            x: 180 + Math.random() * 60,
            y: 120 + Math.random() * 80,
            rotation: (Math.random() - 0.5) * 8,
            zIndex: collageItems.length + 25
          };
          setCollageItems((prev) => [...prev, newItem]);
        }
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = '';
  };

  const handleAddCustomNote = () => {
    if (!newNoteTitle.trim()) return;
    const newItem: CollageItem = {
      id: `note-${Date.now()}`,
      type: 'note',
      title: newNoteTitle.trim(),
      content: newNoteText.trim(),
      x: 160 + Math.random() * 80,
      y: 260 + Math.random() * 100,
      rotation: (Math.random() - 0.5) * 6,
      zIndex: collageItems.length + 25
    };
    setCollageItems((prev) => [...prev, newItem]);
    setNewNoteTitle('');
    setNewNoteText('');
    setShowAddNoteModal(false);
  };

  const handleExploreMoreCombination = () => {
    const randomSticker = COMPOSITE_MOTIFS[Math.floor(Math.random() * COMPOSITE_MOTIFS.length)];
    const newItem: CollageItem = {
      id: `sticker-${randomSticker.key}-${Date.now()}`,
      type: 'sticker',
      stickerKey: randomSticker.key,
      customSvgSrc: randomSticker.src,
      title: randomSticker.title,
      discoveredDate: '07/21/2026',
      travelledDate: '08/08/2026',
      x: 140 + Math.random() * 160,
      y: 200 + Math.random() * 160,
      rotation: (Math.random() - 0.5) * 12,
      zIndex: collageItems.length + 25
    };
    setCollageItems((prev) => [...prev, newItem]);
  };

  // Sticker click handler: reveals the floating info badge popup only if not dragged
  const handleStickerClick = (item: CollageItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDraggingRef.current) {
      return;
    }
    if (activeBadge && activeBadge.id === item.id) {
      setActiveBadge(null);
    } else {
      setActiveBadge({
        id: item.id,
        title: item.title || 'Bridges',
        discoveredDate: item.discoveredDate || '07/21/2026',
        travelledDate: item.travelledDate || '08/08/2026',
        x: Math.min(Math.max(item.x + 80, 40), 440),
        y: Math.min(Math.max(item.y + 30, 40), 500),
        zIndex: 90
      });
    }
  };

  const currentThemeTitle = customJourneyTitle || (activePlan ? activePlan.title : 'Water Towns');
  const themeSvg = activePlan?.themeSvg || '/assets/water village.svg';

  return (
    <div className="min-h-screen pt-[96px] pb-16 px-[4.5vw] max-w-[1440px] mx-auto select-none">
      <style>{`
        .journey-thin-scrollbar::-webkit-scrollbar {
          width: 3.5px;
        }
        .journey-thin-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .journey-thin-scrollbar::-webkit-scrollbar-thumb {
          background: #ded7cc;
          border-radius: 4px;
        }
        .journey-thin-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c5bdb0;
        }
      `}</style>

      {/* Header Bar: "My Journey" title + "Get more discovery..." */}
      <div className="flex flex-row items-baseline justify-between mb-8 max-md:flex-col max-md:gap-2">
        <h1 className="font-kaisei text-[48px] max-md:text-[34px] font-normal tracking-[-0.02em] text-[#3c444a] m-0">
          My Journey
        </h1>
        <button
          onClick={onOpenSearch}
          className="font-jura text-[15px] text-[#8e959b] hover:text-[#505960] font-normal tracking-wide bg-transparent border-0 cursor-pointer p-0"
        >
          Get more discovery...
        </button>
      </div>

      {/* Main 2-Column Split: Left Travel Plan + Right Free-Form Collage Canvas */}
      <div className="grid grid-cols-[460px_1fr] max-lg:grid-cols-1 gap-8 items-end">
        {/* ================= LEFT COLUMN: Travel Plan List ================= */}
        <div className="bg-white rounded-[14px] border border-[#ebe5dc] p-6 pb-5 flex flex-col h-[780px] max-lg:h-auto shadow-[0_2px_12px_rgba(60,68,74,0.02)]">
          {/* Top Header: Jiangnan Building + Bridge Icon, Title + section included & edit */}
          <div className="flex items-center gap-3 mb-5 px-1 pt-1">
            <div className="relative w-[70px] h-[54px] flex-shrink-0 flex items-center justify-center">
              <img
                src={themeSvg}
                alt={currentThemeTitle}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="font-kaisei text-[32px] font-normal text-[#3c444a] m-0 tracking-[-0.01em] leading-tight">
                {currentThemeTitle}
              </h2>
              {/* 1. xxx section included (grey text, no interaction) + 2. light brown edit with underline and no bubble */}
              <div className="flex items-center gap-2 mt-1">
                <span className="font-jura text-[13px] text-[#9aa1a6] font-normal">
                  {places.length} section included
                </span>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="font-jura text-[13px] text-[#b48570] hover:text-[#9e6f5c] underline underline-offset-2 bg-transparent border-0 p-0 cursor-pointer transition-colors"
                >
                  edit
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Destination List with Collapsible Details - exactly 4 explore places */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-3.5 journey-thin-scrollbar">
            {places.map((place) => {
              const isExpanded = expandedPlaceId === place.id;
              return (
                <div
                  key={place.id}
                  onClick={() => setExpandedPlaceId(isExpanded ? null : place.id)}
                  className={`rounded-[10px] p-4 border transition-all duration-200 cursor-pointer bg-white ${
                    isExpanded
                      ? 'border-[#ded7cc] shadow-xs'
                      : 'border-[#ede8e1] hover:border-[#ded7cc]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-kaisei text-[22px] font-normal text-[#3c444a] m-0 leading-snug">
                        {place.name}
                      </h3>
                      {!isExpanded ? (
                        <p className="font-jura text-[13.5px] text-[#8e959a] mt-1 m-0 truncate">
                          {place.description}
                        </p>
                      ) : (
                        <div className="mt-2 space-y-2">
                          {place.city && (
                            <span className="inline-block font-jura text-[12.5px] text-[#9fa5aa]">
                              {place.city}
                            </span>
                          )}
                          <p className="font-jura text-[13.5px] text-[#6d757d] m-0 leading-relaxed">
                            {place.description}
                          </p>
                          {place.photo && (
                            <div className="mt-2.5 rounded-lg overflow-hidden border border-[#eee9e2]">
                              <img
                                src={encodeURI(place.photo)}
                                alt={place.name}
                                className="w-full h-36 object-cover block"
                                onError={(e) => {
                                  const target = e.currentTarget as HTMLImageElement;
                                  if (!target.src.includes('village-photo.png')) {
                                    target.src = '../assets/images/water%20village1.jpg';
                                  }
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Favorite Heart Toggle */}
                    <button
                      onClick={(e) => handleToggleFavorite(place.id, e)}
                      className="p-1 text-[#bbb9b1] hover:text-[#b48570] transition-colors bg-transparent border-0 cursor-pointer flex-shrink-0"
                      title={place.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart
                        className={`w-[22px] h-[22px] transition-colors ${
                          place.isFavorite
                            ? 'fill-[#c2a79e] text-[#c2a79e]'
                            : 'text-[#d0c9bf] stroke-[1.6]'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: Free-Form Collage Photo Wall ================= */}
        {/* Align bottom with left column, height adjusted with top interaction buttons */}
        <div className="flex flex-col h-[780px] max-lg:h-auto justify-end">
          {/* Top Interactive Action Buttons: Photo, Notes, Explore More */}
          <div className="flex items-center gap-2.5 mb-3 px-1 flex-wrap">
            {/* + add photo */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] font-jura text-[12.5px] font-semibold text-[#505960] bg-white border border-[#ded8ce] hover:border-[#b48570] hover:text-[#3c444a] shadow-[0_2px_8px_rgba(60,68,74,0.03)] cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-[#b48570]" />
              <span>add photo</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />

            {/* + add notes */}
            <button
              onClick={() => setShowAddNoteModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] font-jura text-[12.5px] font-semibold text-[#505960] bg-white border border-[#ded8ce] hover:border-[#b48570] hover:text-[#3c444a] shadow-[0_2px_8px_rgba(60,68,74,0.03)] cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-[#b48570]" />
              <span>add notes</span>
            </button>

            {/* Explore button: no icon, directly navigates to Explore page */}
            <button
              onClick={onNavigateExplore}
              className="inline-flex items-center px-4 py-1.5 rounded-[8px] font-jura text-[12.5px] font-semibold text-[#b48570] bg-white border border-[#e4d7cc] hover:border-[#b48570] hover:bg-[#faf7f3] shadow-[0_2px_8px_rgba(60,68,74,0.03)] cursor-pointer transition-all"
            >
              <span>explore more combination</span>
            </button>
          </div>

          {/* Grid Canvas Canvas Stage: Bound within container */}
          <div 
            onClick={() => setActiveBadge(null)}
            className="relative bg-transparent h-[720px] max-lg:h-[640px] overflow-hidden rounded-[14px]"
          >
            {/* Authentic Hand-Drawn Notebook Sketchbook Grid Background with 40% Opacity */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40 bg-repeat bg-center"
              style={{
                backgroundImage: 'url(./grid.svg)',
                backgroundSize: '850px 850px'
              }}
            />

            {/* Interactive Free-form Collage Canvas Stage with Drag Boundary Constraint */}
            <div ref={canvasContainerRef} className="relative w-full h-full overflow-hidden">
              {collageItems.map((item) => {
                if (item.type === 'photo') {
                  return (
                    <motion.div
                      key={item.id}
                      drag
                      dragMomentum={false}
                      dragConstraints={canvasContainerRef}
                      dragElastic={0.05}
                      initial={{ x: item.x, y: item.y, rotate: item.rotation }}
                      whileHover={{ scale: 1.02 }}
                      whileDrag={{ scale: 1.04, zIndex: 100, cursor: 'grabbing' }}
                      className="absolute cursor-grab select-none p-3.5 pb-4 bg-white rounded-[4px] shadow-[0_8px_24px_rgba(40,45,50,0.12)] border border-[#ded8ce] max-w-[340px]"
                      style={{ zIndex: item.zIndex }}
                    >
                      {/* Polaroid Cutout photo */}
                      <div className="relative overflow-hidden rounded-[2px] bg-[#f0ebe3]">
                        <img
                          src={item.imageSrc}
                          alt={item.title || 'Travel Photo'}
                          className="w-[300px] h-[200px] object-cover block pointer-events-none filter contrast-[1.02] saturate-[1.03]"
                        />
                      </div>
                    </motion.div>
                  );
                }

                if (item.type === 'sticker') {
                  return (
                    <motion.div
                      key={item.id}
                      drag
                      dragMomentum={false}
                      dragConstraints={canvasContainerRef}
                      dragElastic={0.05}
                      onDragStart={() => {
                        isDraggingRef.current = true;
                      }}
                      onDragEnd={() => {
                        setTimeout(() => {
                          isDraggingRef.current = false;
                        }, 80);
                      }}
                      initial={{ x: item.x, y: item.y, rotate: item.rotation }}
                      whileHover={{ scale: 1.05 }}
                      whileDrag={{ scale: 1.08, zIndex: 100, cursor: 'grabbing' }}
                      onClick={(e) => handleStickerClick(item, e)}
                      className="absolute cursor-grab select-none p-1.5 group"
                      style={{ zIndex: item.zIndex }}
                      title="Click icon to toggle info floating card"
                    >
                      {item.customSvgSrc ? (
                        <div
                          className="relative flex items-center justify-center transition-transform group-hover:scale-105"
                          style={{
                            width: item.width ? `${item.width}px` : undefined,
                            minWidth: item.width ? undefined : '70px',
                            minHeight: item.width ? undefined : '65px',
                            maxWidth: item.width ? undefined : '200px',
                            maxHeight: item.width ? undefined : '175px'
                          }}
                        >
                          <img
                            src={item.customSvgSrc}
                            alt={item.title || 'Sticker'}
                            className="w-full h-full object-contain pointer-events-none filter drop-shadow-[0_4px_10px_rgba(60,68,74,0.12)]"
                          />
                        </div>
                      ) : null}
                    </motion.div>
                  );
                }

                if (item.type === 'note') {
                  return (
                    <motion.div
                      key={item.id}
                      drag
                      dragMomentum={false}
                      dragConstraints={canvasContainerRef}
                      dragElastic={0.05}
                      initial={{ x: item.x, y: item.y, rotate: item.rotation }}
                      whileHover={{ scale: 1.03 }}
                      whileDrag={{ scale: 1.06, zIndex: 100, cursor: 'grabbing' }}
                      className="absolute cursor-grab select-none bg-[#fffdfa] rounded-[10px] p-4 border border-[#ebdcc8] shadow-[0_6px_20px_rgba(180,133,112,0.12)] max-w-[230px]"
                      style={{ zIndex: item.zIndex }}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <StickyNote className="w-3.5 h-3.5 text-[#b48570]" />
                        <h5 className="font-kaisei text-[16px] font-medium text-[#3c444a] m-0">
                          {item.title}
                        </h5>
                      </div>
                      {item.content && (
                        <p className="font-jura text-[12.5px] text-[#6d757d] m-0 leading-relaxed">
                          {item.content}
                        </p>
                      )}
                    </motion.div>
                  );
                }

                return null;
              })}

              {/* Dynamic Floating Info Card: Only appears when an icon/sticker is clicked */}
              <AnimatePresence>
                {activeBadge && (
                  <motion.div
                    key="active-floating-badge"
                    drag
                    dragMomentum={false}
                    dragConstraints={canvasContainerRef}
                    dragElastic={0.05}
                    initial={{ opacity: 0, scale: 0.9, x: activeBadge.x, y: activeBadge.y }}
                    animate={{ opacity: 1, scale: 1, x: activeBadge.x, y: activeBadge.y }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.18 }}
                    whileHover={{ scale: 1.02 }}
                    whileDrag={{ scale: 1.04, zIndex: 110, cursor: 'grabbing' }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute cursor-grab select-none bg-white rounded-[14px] p-5 pt-4 pb-4 border border-[#ebe5dc] shadow-[0_8px_24px_rgba(60,68,74,0.12)] min-w-[240px]"
                    style={{ zIndex: activeBadge.zIndex }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-kaisei text-[24px] font-normal text-[#3c444a] m-0">
                        {activeBadge.title}
                      </h4>
                      <button
                        onClick={() => setActiveBadge(null)}
                        className="p-1 text-[#aaa] hover:text-[#505960] bg-transparent border-0 cursor-pointer"
                        title="Close"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="font-jura text-[13px] text-[#788086] space-y-0.5">
                      <div>Discovered: {activeBadge.discoveredDate || '07/21/2026'}</div>
                      <div>Travelled: {activeBadge.travelledDate || '08/08/2026'}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Edit Journey Title */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[18px] p-6 max-w-md w-full border border-[#e4dfd6] shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-kaisei text-xl text-[#3c444a] m-0">
                Edit Journey Title
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 text-[#9aa1a6] hover:text-[#3c444a] bg-transparent border-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block font-jura text-xs font-semibold text-[#505960]">
                Journey Name
              </label>
              <input
                type="text"
                defaultValue={currentThemeTitle}
                onChange={(e) => setCustomJourneyTitle(e.target.value)}
                placeholder="e.g. Water Towns of Zhejiang"
                className="w-full px-3.5 py-2 font-jura text-sm rounded-lg border border-[#ded8ce] focus:outline-hidden focus:border-[#5b8a99]"
              />
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 font-jura text-xs font-semibold text-[#788086] hover:text-[#3c444a] bg-transparent border-0 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="px-5 py-2 bg-[#5b8a99] hover:bg-[#4a7380] text-white font-jura text-xs font-semibold rounded-md cursor-pointer transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Custom Memory Note */}
      {showAddNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[18px] p-6 max-w-md w-full border border-[#e4dfd6] shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-kaisei text-xl text-[#3c444a] m-0">
                Add Travel Memory Note
              </h3>
              <button
                onClick={() => setShowAddNoteModal(false)}
                className="p-1 text-[#9aa1a6] hover:text-[#3c444a] bg-transparent border-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block font-jura text-xs font-semibold text-[#505960] mb-1">
                  Title or Destination
                </label>
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="e.g. Dawn over Su Causeway"
                  className="w-full px-3.5 py-2 font-jura text-sm rounded-lg border border-[#ded8ce] focus:outline-hidden focus:border-[#b48570]"
                />
              </div>

              <div>
                <label className="block font-jura text-xs font-semibold text-[#505960] mb-1">
                  Thoughts / Memories
                </label>
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="e.g. Sipped fresh Longjing tea under the misty pavilion..."
                  rows={3}
                  className="w-full px-3.5 py-2 font-jura text-sm rounded-lg border border-[#ded8ce] focus:outline-hidden focus:border-[#b48570]"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={() => setShowAddNoteModal(false)}
                className="px-4 py-2 font-jura text-xs font-semibold text-[#788086] hover:text-[#3c444a] bg-transparent border-0 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomNote}
                className="px-5 py-2 bg-[#b48570] hover:bg-[#9e6f5c] text-white font-jura text-xs font-semibold rounded-md cursor-pointer transition-colors"
              >
                Add to Collage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

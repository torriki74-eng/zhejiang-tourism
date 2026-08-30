import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Heart, Plus, RotateCcw, Image as ImageIcon, StickyNote, Sparkles, X, Check } from 'lucide-react';

export interface JourneyPlace {
  id: string;
  name: string;
  category: 'Water Towns' | 'Tea Mountains' | 'Lakes & Waters' | 'Historic Bridges';
  description: string;
  isFavorite: boolean;
  discoveredDate?: string;
  travelledDate?: string;
}

export interface CollageItem {
  id: string;
  type: 'photo' | 'sticker' | 'badge' | 'note';
  title?: string;
  imageSrc?: string;
  stickerKey?: string;
  customSvgSrc?: string;
  content?: string;
  discoveredDate?: string;
  travelledDate?: string;
  x: number; // percentage or px
  y: number;
  rotation: number;
  scale?: number;
  zIndex: number;
}

const INITIAL_PLACES: JourneyPlace[] = [
  {
    id: 'minghe',
    name: 'Minghe Ancient Town',
    category: 'Water Towns',
    description: 'Minghe Ancient Town is the oldest market town in Cixi, known for its tranquil riverside lanes, traditional medicine halls, and stone arch bridges.',
    isFavorite: true,
    discoveredDate: '07/21/2026',
    travelledDate: '08/08/2026'
  },
  {
    id: 'west-lake',
    name: 'West Lake',
    category: 'Water Towns',
    description: "West Lake is one of China's most famous lakes, surrounded by pagoda hills, willow trees, and poetic Song dynasty stone bridges.",
    isFavorite: false,
    discoveredDate: '07/15/2026'
  },
  {
    id: 'wuzhen',
    name: 'Wuzhen',
    category: 'Water Towns',
    description: 'A famous water town in southern China, known for its crisscrossing canals, ancient workshops, and stone arch crossings.',
    isFavorite: true,
    discoveredDate: '07/20/2026',
    travelledDate: '08/02/2026'
  },
  {
    id: 'xitang',
    name: 'Xitang',
    category: 'Water Towns',
    description: 'A historic water town with over a thousand years of history, famous for covered corridors and night canal reflections.',
    isFavorite: true,
    discoveredDate: '07/22/2026',
    travelledDate: '08/05/2026'
  },
  {
    id: 'nanxun',
    name: 'Nanxun',
    category: 'Water Towns',
    description: 'Nanxun Ancient Town is renowned for its grand gardens blending traditional Chinese and Western neoclassical architecture.',
    isFavorite: false,
    discoveredDate: '07/25/2026'
  },
  {
    id: 'anchang',
    name: 'Anchang Ancient Town',
    category: 'Water Towns',
    description: 'A thousand-year-old riverfront town preserving authentic Shaoxing sausagemaking, sugar pulling, and black-awning wooden boats.',
    isFavorite: true,
    discoveredDate: '07/28/2026'
  },
  {
    id: 'gongchen',
    name: 'Gongchen Bridge',
    category: 'Historic Bridges',
    description: 'The iconic southern terminus of the Beijing-Hangzhou Grand Canal, carrying centuries of barge voyages.',
    isFavorite: true,
    discoveredDate: '08/01/2026'
  }
];

const INITIAL_COLLAGE_ITEMS: CollageItem[] = [
  // 1. Polaroid Photo Cutout (top center-left)
  {
    id: 'photo-water-town',
    type: 'photo',
    title: 'Minghe Water Town',
    imageSrc: 'assets/elements/4ESjJLjgso1WvpV.jpg',
    x: 180,
    y: 35,
    rotation: -4,
    zIndex: 10
  },
  // 2. Sticker 1 (Water Village / Building + Bridge)
  {
    id: 'sticker-water-village',
    type: 'sticker',
    stickerKey: 'water-village',
    customSvgSrc: 'assets/water village.svg',
    title: 'Water Village',
    x: 155,
    y: 275,
    rotation: 1,
    zIndex: 15
  },
  // 3. Sticker 2 (Tea Tasting / Tea + Rice)
  {
    id: 'sticker-tea-tasting',
    type: 'sticker',
    stickerKey: 'tea-tasting',
    customSvgSrc: 'assets/tea tasting.svg',
    title: 'Tea Tasting',
    x: 480,
    y: 280,
    rotation: -2,
    zIndex: 12
  },
  // 4. Sticker 3 (Canal & Bridge)
  {
    id: 'sticker-canal',
    type: 'sticker',
    stickerKey: 'canal',
    customSvgSrc: 'assets/canal.svg',
    title: 'Canal Bridges',
    x: 170,
    y: 450,
    rotation: 2,
    zIndex: 14
  }
];

interface MyJourneyPageProps {
  onNavigateHome: () => void;
  onOpenSearch: () => void;
}

export const MyJourneyPage: React.FC<MyJourneyPageProps> = ({
  onNavigateHome,
  onOpenSearch
}) => {
  const [places, setPlaces] = useState<JourneyPlace[]>(INITIAL_PLACES);
  const [activeCategory, setActiveCategory] = useState<string>('Water Towns');
  const [collageItems, setCollageItems] = useState<CollageItem[]>(INITIAL_COLLAGE_ITEMS);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('minghe');
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [showToast, setShowToast] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2500);
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaces((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleResetCollage = () => {
    setCollageItems(INITIAL_COLLAGE_ITEMS);
    setSelectedBadgeId(null);
    triggerToast('Collage board restored to original layout');
  };

  const handlePinPlaceToCollage = (place: JourneyPlace) => {
    const newId = `badge-${place.id}-${Date.now()}`;
    const newItem: CollageItem = {
      id: newId,
      type: 'badge',
      title: place.name.split(' ')[0],
      discoveredDate: place.discoveredDate || '08/2026',
      travelledDate: place.travelledDate || 'Planned',
      x: 220 + Math.random() * 80,
      y: 200 + Math.random() * 120,
      rotation: (Math.random() - 0.5) * 8,
      zIndex: collageItems.length + 20
    };
    setCollageItems((prev) => [...prev, newItem]);
    setSelectedBadgeId(newId);
    triggerToast(`Pinned "${place.name}" badge to collage!`);
  };

  const handleAddCustomNote = () => {
    if (!newNoteTitle.trim()) return;
    const newItem: CollageItem = {
      id: `note-${Date.now()}`,
      type: 'note',
      title: newNoteTitle.trim(),
      content: newNoteText.trim(),
      x: 250,
      y: 250,
      rotation: (Math.random() - 0.5) * 6,
      zIndex: collageItems.length + 20
    };
    setCollageItems((prev) => [...prev, newItem]);
    setNewNoteTitle('');
    setNewNoteText('');
    setShowAddNoteModal(false);
    triggerToast('Added memory note to collage!');
  };

  const AVAILABLE_STICKERS = [
    { key: 'water-village', title: 'Water Village', src: 'assets/water village.svg' },
    { key: 'tea-tasting', title: 'Tea Tasting', src: 'assets/tea tasting.svg' },
    { key: 'canal', title: 'Canal', src: 'assets/canal.svg' },
    { key: 'bridge-building', title: 'Bridge & Pavilion', src: 'assets/bridge-building.svg' },
    { key: 'mountain-village', title: 'Mountain Village', src: 'assets/mountain village.svg' },
    { key: 'tea-picking', title: 'Tea Picking', src: 'assets/tea picking.svg' },
    { key: 'market', title: 'Market', src: 'assets/market.svg' },
    { key: 'local-farm-food', title: 'Local Food', src: 'assets/local farm food.svg' }
  ];

  const handleAddRandomSticker = (chosenKey?: string) => {
    const stickerDef = chosenKey 
      ? AVAILABLE_STICKERS.find(s => s.key === chosenKey) || AVAILABLE_STICKERS[0]
      : AVAILABLE_STICKERS[Math.floor(Math.random() * AVAILABLE_STICKERS.length)];

    const newItem: CollageItem = {
      id: `sticker-${stickerDef.key}-${Date.now()}`,
      type: 'sticker',
      stickerKey: stickerDef.key,
      customSvgSrc: stickerDef.src,
      title: stickerDef.title,
      x: 200 + Math.random() * 120,
      y: 180 + Math.random() * 140,
      rotation: (Math.random() - 0.5) * 12,
      zIndex: collageItems.length + 20
    };
    setCollageItems((prev) => [...prev, newItem]);
    triggerToast(`Added ${stickerDef.title} sticker!`);
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
            x: 220,
            y: 180,
            rotation: (Math.random() - 0.5) * 6,
            zIndex: collageItems.length + 20
          };
          setCollageItems((prev) => [...prev, newItem]);
          triggerToast('Uploaded photo to collage board!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredPlaces = places.filter(
    (p) => activeCategory === 'All' || p.category === activeCategory
  );

  return (
    <div className="min-h-screen pt-[96px] pb-16 px-[4.5vw] max-w-[1440px] mx-auto select-none">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-8 z-50 bg-[#3c444a] text-white font-jura text-sm px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 transition-all">
          <Check className="w-4 h-4 text-[#92aa83]" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Header Bar: "My Journey" title */}
      <div className="flex flex-row items-baseline justify-between mb-7 max-md:flex-col max-md:gap-2">
        <h1 className="font-kaisei text-[46px] max-md:text-[34px] font-normal tracking-[-0.02em] text-[#3c444a] m-0">
          My Journey
        </h1>
      </div>

      {/* Main 2-Column Split: Left Travel Plan + Right Free-Form Collage Canvas */}
      <div className="grid grid-cols-[400px_1fr] max-lg:grid-cols-1 gap-7 items-start">
        {/* ================= LEFT COLUMN: Travel Plan List ================= */}
        <div className="bg-white/95 rounded-[22px] border border-[#e8e4dc] shadow-[0_4px_24px_rgba(60,68,74,0.04)] p-6 flex flex-col h-[760px] max-lg:h-auto backdrop-blur-xs">
          {/* Category Top Banner with Composite Cultural Icon */}
          <div className="flex items-center gap-4 pb-5 border-b border-[#f0ece5] mb-4">
            {/* Hand-crafted composite House + Bridge icon */}
            <div className="relative w-[72px] h-[58px] flex-shrink-0 flex items-center justify-center">
              <img
                src="assets/elements/building-1.svg"
                alt="House"
                className="w-[42px] h-[38px] object-contain absolute top-0 left-[16px] z-10 opacity-90"
              />
              <img
                src="assets/elements/bridge-1.svg"
                alt="Bridge"
                className="w-[58px] h-[32px] object-contain absolute bottom-0 left-0 z-0 opacity-80"
              />
            </div>

            <div className="flex-1">
              <h2 className="font-kaisei text-[26px] font-normal text-[#3c444a] m-0 leading-tight">
                {activeCategory}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-jura text-xs text-[#9aa1a6] font-semibold">
                  {filteredPlaces.length} Saved Destinations
                </span>
                <span className="text-[#bbb9b1] text-xs">·</span>
                <button
                  onClick={() =>
                    setActiveCategory((prev) =>
                      prev === 'Water Towns' ? 'All' : 'Water Towns'
                    )
                  }
                  className="font-jura text-[11.5px] text-[#b48570] hover:underline bg-transparent border-0 p-0 cursor-pointer"
                >
                  {activeCategory === 'All' ? 'View Water Towns' : 'View All'}
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Destination List */}
          <div className="flex-1 overflow-y-auto pr-1.5 space-y-3.5 custom-scrollbar">
            {filteredPlaces.map((place) => {
              const isSelected = selectedPlaceId === place.id;
              return (
                <div
                  key={place.id}
                  onClick={() => {
                    setSelectedPlaceId(place.id);
                    // Also check if there is a corresponding badge or item on the collage to focus
                    const matchingBadge = collageItems.find(item => item.type === 'badge' && item.title?.toLowerCase() === place.name.split(' ')[0].toLowerCase());
                    if (matchingBadge) {
                      setSelectedBadgeId(matchingBadge.id);
                    }
                  }}
                  className={`group relative rounded-[14px] p-4 border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#fcfaf7] border-[#b48570]/50 shadow-xs'
                      : 'bg-white border-[#ece8e1] hover:border-[#cfc9bf] hover:bg-[#faf8f5]/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <h3 className="font-kaisei text-[17.5px] font-normal text-[#3c444a] m-0 group-hover:text-[#2d3439] transition-colors">
                          {place.name}
                        </h3>
                      </div>
                      <p className="font-jura text-[13px] text-[#788086] mt-1 m-0 leading-[1.42] line-clamp-2">
                        {place.description}
                      </p>
                    </div>

                    {/* Favorite Heart Button */}
                    <button
                      onClick={(e) => handleToggleFavorite(place.id, e)}
                      title={place.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      className="p-1 rounded-full text-[#bbb9b1] hover:text-[#b48570] hover:scale-110 transition-transform bg-transparent border-0 cursor-pointer flex-shrink-0"
                    >
                      <Heart
                        className={`w-5 h-5 transition-colors ${
                          place.isFavorite
                            ? 'fill-[#b48570] text-[#b48570]'
                            : 'text-[#bbb9b1] stroke-[1.8]'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Quick Action Button on Hover */}
                  <div className="mt-2.5 pt-2 border-t border-[#f2eee8] flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="font-jura text-[11px] text-[#9aa1a6]">
                      {place.discoveredDate ? `Discovered: ${place.discoveredDate}` : 'Zhejiang Heritage'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePinPlaceToCollage(place);
                      }}
                      className="font-jura text-[11.5px] font-semibold text-[#b48570] hover:text-[#9e6f5c] flex items-center gap-1 bg-transparent border-0 cursor-pointer p-0"
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                      <span>Pin to Collage</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Card Footer Actions */}
          <div className="pt-4 mt-2 border-t border-[#f0ece5] flex items-center justify-between">
            <button
              onClick={() => setShowAddNoteModal(true)}
              className="font-jura text-[13px] font-semibold text-[#505960] hover:text-[#3c444a] flex items-center gap-1.5 bg-transparent border-0 cursor-pointer p-0"
            >
              <Plus className="w-4 h-4 text-[#b48570]" />
              <span>Add Custom Memory Note</span>
            </button>
            <button
              onClick={onNavigateHome}
              className="font-jura text-[12.5px] text-[#9aa1a6] hover:text-[#505960] bg-transparent border-0 cursor-pointer p-0"
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: Free-Form Collage Photo Wall ================= */}
        {/* White background removed from photo wall canvas */}
        <div className="relative rounded-[22px] border border-[#e4dfd6]/80 bg-transparent h-[760px] max-lg:h-[680px] overflow-hidden shadow-[0_4px_24px_rgba(60,68,74,0.02)] flex flex-col">
          {/* Authentic Hand-Drawn Notebook Sketchbook Grid Background using grid.svg without white backdrop */}
          <div
            className="absolute inset-0 pointer-events-none opacity-45 bg-repeat bg-center"
            style={{
              backgroundImage: 'url(/grid.svg)',
              backgroundSize: '850px 850px'
            }}
          />

          {/* Top Collage Toolbar */}
          <div className="relative z-30 px-5 py-3.5 border-b border-[#ece7de]/60 bg-white/40 backdrop-blur-xs flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-jura font-semibold text-[13px] text-[#505960] tracking-wide">
                COLLAGE BOARD
              </span>
              <span className="text-[#bbb9b1] text-xs">·</span>
              <span className="font-jura text-xs text-[#9aa1a6]">
                Freely drag, click elements to reveal details
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Add Sticker Quick Buttons */}
              <button
                onClick={() => handleAddRandomSticker('water-village')}
                className="font-jura text-[12px] font-semibold text-[#505960] hover:text-[#3c444a] bg-white/60 hover:bg-white/90 border border-[#ded8ce] px-2.5 py-1 rounded-[4px] cursor-pointer transition-colors shadow-2xs"
                title="Add Water Village Sticker"
              >
                + Village
              </button>
              <button
                onClick={() => handleAddRandomSticker('tea-tasting')}
                className="font-jura text-[12px] font-semibold text-[#505960] hover:text-[#3c444a] bg-white/60 hover:bg-white/90 border border-[#ded8ce] px-2.5 py-1 rounded-[4px] cursor-pointer transition-colors shadow-2xs"
                title="Add Tea Tasting Sticker"
              >
                + Tea
              </button>
              <button
                onClick={() => handleAddRandomSticker('canal')}
                className="font-jura text-[12px] font-semibold text-[#505960] hover:text-[#3c444a] bg-white/60 hover:bg-white/90 border border-[#ded8ce] px-2.5 py-1 rounded-[4px] cursor-pointer transition-colors shadow-2xs"
                title="Add Canal Bridges Sticker"
              >
                + Canal
              </button>
              <button
                onClick={() => handleAddRandomSticker()}
                className="font-jura text-[12px] font-semibold text-[#b48570] hover:text-[#9e6f5c] bg-white/60 hover:bg-white/90 border border-[#ded8ce] px-2.5 py-1 rounded-[4px] cursor-pointer transition-colors shadow-2xs"
                title="Add Random SVG Combination"
              >
                + Random
              </button>

              {/* Upload Custom Photo */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="font-jura text-[12px] font-semibold text-[#505960] hover:text-[#3c444a] bg-white/60 hover:bg-white/90 border border-[#ded8ce] px-2.5 py-1 rounded-[4px] cursor-pointer transition-colors flex items-center gap-1 shadow-2xs"
                title="Upload Photo to Board"
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#72a7d6]" />
                <span>+ Photo</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />

              {/* Reset Layout */}
              <button
                onClick={handleResetCollage}
                className="font-jura text-[12px] font-semibold text-[#8b9196] hover:text-[#3c444a] bg-white/60 hover:bg-white/90 border border-[#ded8ce] p-1.5 rounded-[4px] cursor-pointer transition-colors shadow-2xs"
                title="Reset layout to default"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Free-form Collage Canvas Stage */}
          <div 
            onClick={() => setSelectedBadgeId(null)}
            className="relative flex-1 w-full h-full overflow-hidden"
          >
            {collageItems.map((item) => {
              if (item.type === 'photo') {
                return (
                  <motion.div
                    key={item.id}
                    drag
                    dragMomentum={false}
                    initial={{ x: item.x, y: item.y, rotate: item.rotation }}
                    whileHover={{ scale: 1.02, zIndex: 60 }}
                    whileDrag={{ scale: 1.05, zIndex: 100, cursor: 'grabbing' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBadgeId(item.id);
                    }}
                    className={`absolute cursor-grab select-none p-3 bg-white/95 rounded-[4px] shadow-[0_10px_28px_rgba(40,45,50,0.14)] border max-w-[340px] transition-colors ${
                      selectedBadgeId === item.id ? 'border-[#b48570] ring-2 ring-[#b48570]/30' : 'border-[#e0dad0]'
                    }`}
                    style={{ zIndex: selectedBadgeId === item.id ? 80 : item.zIndex }}
                  >
                    {/* Polaroid Cutout photo */}
                    <div className="relative overflow-hidden rounded-[2px] bg-[#f0ebe3]">
                      <img
                        src={item.imageSrc}
                        alt={item.title || 'Travel Photo'}
                        className="w-[300px] h-[200px] object-cover block pointer-events-none filter contrast-[1.02] saturate-[1.03]"
                      />
                      {/* Subtle tape on corner */}
                      <div className="absolute -top-2 left-6 w-12 h-5 bg-[#eae5dc]/80 backdrop-blur-xs rotate-[-8deg] border border-[#d8d2c6]/60 shadow-2xs pointer-events-none" />
                    </div>
                    {item.title && (
                      <div className="font-kaisei text-xs text-[#505960] text-center pt-2 font-medium tracking-wide">
                        {item.title}
                      </div>
                    )}
                  </motion.div>
                );
              }

              if (item.type === 'sticker') {
                return (
                  <motion.div
                    key={item.id}
                    drag
                    dragMomentum={false}
                    initial={{ x: item.x, y: item.y, rotate: item.rotation }}
                    whileHover={{ scale: 1.06, zIndex: 60 }}
                    whileDrag={{ scale: 1.1, zIndex: 100, cursor: 'grabbing' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Clicking an interactive sticker toggles/reveals its frame/badge
                      setSelectedBadgeId(selectedBadgeId === item.id ? null : item.id);
                    }}
                    className={`absolute cursor-grab select-none p-1.5 rounded-xl transition-all duration-200 ${
                      selectedBadgeId === item.id 
                        ? 'border-2 border-dashed border-[#b48570] bg-white/70 shadow-lg' 
                        : 'border border-transparent'
                    }`}
                    style={{ zIndex: selectedBadgeId === item.id ? 80 : item.zIndex }}
                  >
                    {/* Render Custom Composite SVG if provided */}
                    {item.customSvgSrc ? (
                      <div className="relative w-[180px] h-[160px] flex items-center justify-center p-2">
                        <img
                          src={item.customSvgSrc}
                          alt={item.title || 'Sticker'}
                          className="w-full h-full object-contain pointer-events-none filter drop-shadow-[0_6px_14px_rgba(60,68,74,0.15)]"
                        />
                      </div>
                    ) : item.stickerKey === 'water-village' || item.stickerKey === 'building-bridge' ? (
                      <div className="relative w-[190px] h-[160px] flex items-center justify-center">
                        <img
                          src="assets/elements/building-1.svg"
                          alt="Jiangnan House"
                          className="w-[110px] h-[105px] object-contain absolute top-0 left-[40px] z-10 pointer-events-none"
                        />
                        <img
                          src="assets/elements/bridge-1.svg"
                          alt="Arch Bridge"
                          className="w-[155px] h-[85px] object-contain absolute bottom-0 left-[18px] z-0 pointer-events-none"
                        />
                      </div>
                    ) : item.stickerKey === 'tea-tasting' || item.stickerKey === 'mountain-food' ? (
                      <div className="relative w-[180px] h-[190px] flex items-center justify-center">
                        <img
                          src="assets/elements/mountain-1.svg"
                          alt="Green Mountain"
                          className="w-[150px] h-[170px] object-contain absolute top-0 left-[20px] z-0 pointer-events-none"
                        />
                        <img
                          src="assets/elements/rice.svg"
                          alt="Warm Rice Bowl"
                          className="w-[95px] h-[95px] object-contain absolute bottom-[12px] right-[10px] z-10 pointer-events-none"
                        />
                      </div>
                    ) : (
                      <div className="relative w-[210px] h-[150px] flex items-center justify-center">
                        <img
                          src="assets/elements/bridge-1.svg"
                          alt="Arch Bridge"
                          className="w-[170px] h-[95px] object-contain absolute top-0 left-[20px] z-10 pointer-events-none"
                        />
                        <img
                          src="assets/elements/lake-1.svg"
                          alt="Blue Wave"
                          className="w-[175px] h-[90px] object-contain absolute bottom-0 left-[18px] z-0 pointer-events-none"
                        />
                      </div>
                    )}

                    {/* Appears upon click only */}
                    {selectedBadgeId === item.id && (
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xs border border-[#e5e0d6] px-3.5 py-1.5 rounded-lg shadow-[0_6px_20px_rgba(60,68,74,0.16)] flex items-center gap-2 whitespace-nowrap z-50 animate-in fade-in zoom-in-95 duration-150">
                        <span className="font-kaisei text-xs text-[#3c444a] font-medium">
                          {item.title || 'Bridge & Waterway'}
                        </span>
                        <span className="text-[#bbb9b1] text-xs">·</span>
                        <span className="font-jura text-[11px] text-[#b48570] font-semibold">
                          07/21/2026
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              }

              if (item.type === 'badge') {
                const isSelected = selectedBadgeId === item.id;
                // Bridges frame and badge popup: only shows the full card box / frame when clicked!
                return (
                  <motion.div
                    key={item.id}
                    drag
                    dragMomentum={false}
                    initial={{ x: item.x, y: item.y, rotate: item.rotation }}
                    whileHover={{ scale: 1.03, zIndex: 60 }}
                    whileDrag={{ scale: 1.06, zIndex: 100, cursor: 'grabbing' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBadgeId(isSelected ? null : item.id);
                    }}
                    className={`absolute cursor-grab select-none transition-all duration-200 ${
                      isSelected
                        ? 'bg-white rounded-[18px] p-5 pt-4 pb-4 border-2 border-[#b48570] shadow-[0_12px_32px_rgba(60,68,74,0.18)] min-w-[210px]'
                        : 'bg-white/70 hover:bg-white/90 rounded-[14px] px-3.5 py-2 border border-[#ded8ce] shadow-xs'
                    }`}
                    style={{ zIndex: isSelected ? 80 : item.zIndex }}
                  >
                    {isSelected ? (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-kaisei text-[22px] font-normal text-[#3c444a] m-0">
                            {item.title}
                          </h4>
                          <Heart className="w-4 h-4 text-[#b48570] fill-[#b48570] stroke-[1.8]" />
                        </div>
                        <div className="font-jura text-[12px] text-[#788086] space-y-0.5">
                          <div>Discovered: {item.discoveredDate || '07/21/2026'}</div>
                          <div>Travelled: {item.travelledDate || '08/08/2026'}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-kaisei text-sm text-[#3c444a]">
                          {item.title}
                        </span>
                        <span className="font-jura text-[11px] text-[#9aa1a6]">
                          (Click for details)
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              }

              if (item.type === 'note') {
                return (
                  <motion.div
                    key={item.id}
                    drag
                    dragMomentum={false}
                    initial={{ x: item.x, y: item.y, rotate: item.rotation }}
                    whileHover={{ scale: 1.03, zIndex: 60 }}
                    whileDrag={{ scale: 1.06, zIndex: 100, cursor: 'grabbing' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBadgeId(item.id);
                    }}
                    className="absolute cursor-grab select-none bg-[#fffcf5] rounded-[10px] p-4 border border-[#ebdcc8] shadow-[0_6px_20px_rgba(180,133,112,0.15)] max-w-[220px]"
                    style={{ zIndex: selectedBadgeId === item.id ? 80 : item.zIndex }}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <StickyNote className="w-3.5 h-3.5 text-[#b48570]" />
                      <h5 className="font-kaisei text-[15px] font-medium text-[#3c444a] m-0">
                        {item.title}
                      </h5>
                    </div>
                    {item.content && (
                      <p className="font-jura text-[12px] text-[#6d757d] m-0 leading-relaxed">
                        {item.content}
                      </p>
                    )}
                  </motion.div>
                );
              }

              return null;
            })}
          </div>
        </div>
      </div>

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

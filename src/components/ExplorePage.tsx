import React, { useState, useRef, useEffect } from 'react';

export interface ExplorePlace {
  name: string;
  city: string;
  text: string;
  pin: 'p1' | 'p2' | 'p3';
}

export interface ExploreTheme {
  id: string;
  name: string;
  elements: string[];
  strictMatch?: (set: Set<string>) => boolean;
  comboSvg: string;
  desc: string;
  highlightPlace: string;
  places: ExplorePlace[];
  isUnmatched?: boolean;
}

export const COMBO_THEMES: ExploreTheme[] = [
  {
    id: 'water-village',
    name: 'Water Village',
    elements: ['bridge', 'building', 'lake'],
    strictMatch: (set) => set.has('bridge') && set.has('building') && set.has('lake'),
    comboSvg: 'assets/water village.svg',
    desc: 'Water towns are one of the defining landscapes of Jiangnan, where waterways, bridges, traditional houses, and everyday life are closely connected. Walk along quiet canals, cross stone bridges, and experience the slower rhythm of life shaped by water.',
    highlightPlace: 'Minghe Ancient Town',
    places: [
      { name: 'Wuzhen', city: 'Tongxiang, Zhejiang', text: 'Walk the water lanes and discover wood carvings, stone arches and evening reflections.', pin: 'p2' },
      { name: 'Nanxun', city: 'Huzhou, Zhejiang', text: 'A historic town of waterways, private gardens and silk merchant houses.', pin: 'p3' },
      { name: 'Xitang', city: 'Jiashan, Zhejiang', text: 'Famous for miles of sheltered riverside corridors and lantern-lit bridges.', pin: 'p1' }
    ]
  },
  {
    id: 'tea-tasting',
    name: 'Tea Tasting',
    elements: ['tea', 'rice'],
    strictMatch: (set) => set.size === 2 && set.has('tea') && set.has('rice'),
    comboSvg: 'assets/tea tasting.svg',
    desc: 'Tea culture in Zhejiang blends centuries of artisan roasted Dragon Well (Longjing) leaves with exquisite seasonal dim sum and tea-infused delicacies. An immersion into Jiangnan tranquility.',
    highlightPlace: 'Meijiawu Tea Village',
    places: [
      { name: 'Meijiawu', city: 'Hangzhou, Zhejiang', text: 'Terraced tea hills where you can brew fresh Longjing and savor tea delicacies.', pin: 'p1' },
      { name: 'Longjing Village', city: 'Hangzhou, Zhejiang', text: 'The birthplace of West Lake Longjing tea surrounded by bamboo and springs.', pin: 'p2' },
      { name: 'Jingshan Temple Tea Trail', city: 'Yuhang, Zhejiang', text: 'Ancient Zen tea ceremony traditions nestled in lush misty hills.', pin: 'p3' }
    ]
  },
  {
    id: 'tea-picking',
    name: 'Tea Picking in Hills',
    elements: ['tea', 'mountain'],
    strictMatch: (set) => set.size === 2 && set.has('tea') && set.has('mountain'),
    comboSvg: 'assets/tea picking.svg',
    desc: 'Follow the gentle paths up rolling mist-shrouded green hills, basket in hand, picking the tender springtime tea shoots alongside local harvesters.',
    highlightPlace: 'Songyang Tea Garden',
    places: [
      { name: 'Songyang Tea Hills', city: 'Lishui, Zhejiang', text: 'Rolling terraced plantation known as the secret garden of ancient Jiangnan.', pin: 'p2' },
      { name: 'Meijiawu', city: 'Hangzhou, Zhejiang', text: 'Historic green slopes offering hands-on spring tea harvest experiences.', pin: 'p1' },
      { name: 'Moganshan Mountain Tea', city: 'Huzhou, Zhejiang', text: 'High-elevation bamboo slopes with crisp air and boutique tea retreats.', pin: 'p3' }
    ]
  },
  {
    id: 'canal-bridges',
    name: 'Canal & Stone Bridges',
    elements: ['bridge', 'lake'],
    strictMatch: (set) => set.size === 2 && set.has('bridge') && set.has('lake'),
    comboSvg: 'assets/canal.svg',
    desc: 'Arched stone bridges gracefully span mirror-like waterways, carrying travelers over ancient canals that have nourished Jiangnan merchant trade for over a thousand years.',
    highlightPlace: 'Shaoxing Ancient Canal',
    places: [
      { name: 'Bazi Bridge Canal', city: 'Shaoxing, Zhejiang', text: 'One of the oldest stone flyover bridge systems in ancient Chinese history.', pin: 'p1' },
      { name: 'Grand Canal Gongchen', city: 'Hangzhou, Zhejiang', text: 'The northern terminus of the Grand Canal lined with museums and teahouses.', pin: 'p2' },
      { name: 'Anchang Water Town', city: 'Keqiao, Zhejiang', text: 'Bustling waterways flanked by handcrafted sausage and rice wine workshops.', pin: 'p3' }
    ]
  },
  {
    id: 'mountain-village',
    name: 'Mountain Village & Dwellings',
    elements: ['mountain', 'building'],
    strictMatch: (set) => set.size === 2 && set.has('mountain') && set.has('building'),
    comboSvg: 'assets/mountain village.svg',
    desc: 'Traditional rammed-earth and timber houses tucked gracefully between mountain ridgelines and misty bamboo valleys, offering quiet sanctuary from modern city rush.',
    highlightPlace: 'Songyang Ancient Villages',
    places: [
      { name: 'Chenjiapu Village', city: 'Songyang, Zhejiang', text: 'Cliffside cliff settlement with bookstores and sun-drying agricultural plazas.', pin: 'p3' },
      { name: 'Moganshan Village', city: 'Deqing, Zhejiang', text: 'Lush bamboo slopes sheltering tranquil boutique eco-villas and craft cafes.', pin: 'p1' },
      { name: 'Tiantai Mountain Valley', city: 'Taizhou, Zhejiang', text: 'Deep spiritual hills surrounded by cascading waterfalls and cedar trees.', pin: 'p2' }
    ]
  },
  {
    id: 'local-farm-food',
    name: 'Local Farm & Harvest Food',
    elements: ['rice', 'building'],
    strictMatch: (set) => set.size === 2 && set.has('rice') && set.has('building'),
    comboSvg: 'assets/local farm food.svg',
    desc: 'Farmhouse kitchens serving seasonal bamboo shoots, clay-pot braised chicken, and freshly picked river vegetables prepared with rustic Jiangnan hearth techniques.',
    highlightPlace: 'Lin’an Mountain Homesteads',
    places: [
      { name: 'Lin’an Tianmu Hearth', city: 'Hangzhou, Zhejiang', text: 'Savory cured ham, wild mountain ferns and stone-ground tofu.', pin: 'p1' },
      { name: 'Suichang Earth Kitchen', city: 'Lishui, Zhejiang', text: 'Clay-pot stews and golden crisp sweet rice cakes over firewood stoves.', pin: 'p3' },
      { name: 'Anji Bamboo Delights', city: 'Huzhou, Zhejiang', text: 'Tender springtime bamboo delicacies cooked in fresh bamboo tubes.', pin: 'p2' }
    ]
  },
  {
    id: 'seafood-harbor',
    name: 'Coastal Seafood & Water',
    elements: ['rice', 'lake'],
    strictMatch: (set) => set.size === 2 && set.has('rice') && set.has('lake'),
    comboSvg: 'assets/seafood.svg',
    desc: 'From fresh Zhoushan ribbonfish and swimming blue crabs to steamed yellow croaker, taste the rich bounty brought directly from the East China Sea.',
    highlightPlace: 'Zhoushan Fishing Harbor',
    places: [
      { name: 'Shenjiamen Port', city: 'Zhoushan, Zhejiang', text: 'The largest seafood night market harbor in Asia facing the ocean.', pin: 'p1' },
      { name: 'Shipu Fishing Town', city: 'Xiangshan, Zhejiang', text: 'Cobblestone seafood streets overlooking bustling fishing fleets.', pin: 'p2' },
      { name: 'Shengsi Islands', city: 'Zhoushan, Zhejiang', text: 'Mussel farm archipelago bathed in azure blue waves and sea breezes.', pin: 'p3' }
    ]
  },
  {
    id: 'nature-retreat',
    name: 'Lakes & Mountains Retreat',
    elements: ['mountain', 'lake'],
    strictMatch: (set) => set.size === 2 && set.has('mountain') && set.has('lake'),
    comboSvg: 'assets/nature.svg',
    desc: 'Where emerald peaks reflect across crystal water surfaces, inspiring poets like Su Dongpo and Bai Juyi to compose eternal Jiangnan landscape verses.',
    highlightPlace: 'Qiandao Lake & Hills',
    places: [
      { name: 'Qiandao Lake', city: 'Chun’an, Zhejiang', text: 'Over a thousand emerald islands scattered across sparkling blue waters.', pin: 'p1' },
      { name: 'Xianju Shenxianju', city: 'Taizhou, Zhejiang', text: 'Soaring cliff pinnacles rising above misty cloud forests and suspension bridges.', pin: 'p3' },
      { name: 'Yandang Mountain Lakes', city: 'Wenzhou, Zhejiang', text: 'Spectacular volcanic peaks, hanging temples and crystal mountain pools.', pin: 'p2' }
    ]
  },
  {
    id: 'historic-architecture',
    name: 'Historic Mansions & Bridges',
    elements: ['bridge', 'building'],
    strictMatch: (set) => set.size === 2 && set.has('bridge') && set.has('building'),
    comboSvg: 'assets/village.svg',
    desc: 'Intricately carved wooden pavilions, stone river wharfs, and graceful step bridges representing the pinnacle of Ming and Qing dynasty Jiangnan architectural craftsmanship.',
    highlightPlace: 'Nanxun Grand Residences',
    places: [
      { name: 'Nanxun Jiaye Garden', city: 'Huzhou, Zhejiang', text: 'Harmonious blend of traditional courtyard mansions and Western-style villas.', pin: 'p3' },
      { name: 'Wuzhen West Gate', city: 'Jiaxing, Zhejiang', text: 'Preserved water town residences with wood carvings and stone docks.', pin: 'p1' },
      { name: 'Shaoxing Lu Xun Native Place', city: 'Shaoxing, Zhejiang', text: 'Traditional black-tiled Jiangnan manor houses beside stone waterways.', pin: 'p2' }
    ]
  }
];

export const SINGLE_ELEMENT_THEMES: Record<string, ExploreTheme> = {
  lake: {
    id: 'element-lake',
    name: 'West Lake & Waters',
    elements: ['lake'],
    comboSvg: 'assets/lake.svg',
    desc: 'Centuries of poetic Jiangnan waterscapes, willow-lined embankments, and tranquil lotus lagoons that inspired legendary verse and timeless romance.',
    highlightPlace: 'West Lake (Hangzhou)',
    places: [
      { name: 'West Lake Ruan Gong Dun', city: 'Hangzhou, Zhejiang', text: 'Gentle ripples, willow shores, and evening reflections of the Three Pools Mirroring the Moon.', pin: 'p1' },
      { name: 'East Lake (Donghu)', city: 'Shaoxing, Zhejiang', text: 'Sheer quarried cliff walls rising directly out of tranquil emerald waters.', pin: 'p2' },
      { name: 'Nanhu Lake', city: 'Jiaxing, Zhejiang', text: 'Historic misty island pavilion surrounded by serene Jiangnan lotus waterways.', pin: 'p3' }
    ]
  },
  bridge: {
    id: 'element-bridge',
    name: 'Ancient Stone Bridges',
    elements: ['bridge'],
    comboSvg: 'assets/bridge.svg',
    desc: 'Arched moon bridges and stone trestles that have connected riverfront communities across Zhejiang waterways for centuries, carrying deep architectural memories.',
    highlightPlace: 'Bazi Bridge (Shaoxing)',
    places: [
      { name: 'Bazi Ancient Flyover Bridge', city: 'Shaoxing, Zhejiang', text: 'One of the earliest preserved urban bridge hubs dating back to the Song Dynasty.', pin: 'p1' },
      { name: 'Gongchen Bridge', city: 'Hangzhou, Zhejiang', text: 'The towering landmark triple-arch stone bridge marking the southern end of the Grand Canal.', pin: 'p2' },
      { name: 'Taishun Covered Bridges', city: 'Wenzhou, Zhejiang', text: 'Masterpieces of ancient mortise-and-tenon wooden arch bridges spanning mountain streams.', pin: 'p3' }
    ]
  },
  tea: {
    id: 'element-tea',
    name: 'Longjing Tea Heritage',
    elements: ['tea'],
    comboSvg: 'assets/tea.svg',
    desc: 'The aroma of hand-roasted flat green Dragon Well tea leaves and Zen tea ceremonies nurtured by morning mountain mists and ancient springs.',
    highlightPlace: 'Dragon Well (Longjing)',
    places: [
      { name: 'Longjing Village & Springs', city: 'Hangzhou, Zhejiang', text: 'The sacred heartland of Dragon Well tea culture surrounded by green terraced hills.', pin: 'p1' },
      { name: 'Jingshan Zen Tea Plantation', city: 'Yuhang, Zhejiang', text: 'The birthplace of classic Song Dynasty tea-whisking ceremonies.', pin: 'p2' },
      { name: 'Songyang Historic Tea Market', city: 'Lishui, Zhejiang', text: 'One of the largest green tea trading centers nestled amidst idyllic southern Zhejiang hills.', pin: 'p3' }
    ]
  },
  rice: {
    id: 'element-rice',
    name: 'Jiangnan Harvest & Food',
    elements: ['rice'],
    comboSvg: 'assets/rice.svg',
    desc: 'The fertile water country’s bountiful agricultural soul—from golden autumn paddy fields and sweet glutinous rice cakes to fragrant Shaoxing yellow rice wine.',
    highlightPlace: 'Yunhe Terraces',
    places: [
      { name: 'Yunhe Rice Terraces', city: 'Lishui, Zhejiang', text: 'Spectacular thousand-year-old terraced paddy fields sculpted across mist-kissed hills.', pin: 'p3' },
      { name: 'Shaoxing Rice Wine Heritage Museum', city: 'Shaoxing, Zhejiang', text: 'Centuries-old brewing workshops producing fragrant amber rice wine.', pin: 'p2' },
      { name: 'Jiashan Paddy Heritage Park', city: 'Jiaxing, Zhejiang', text: 'Vast agricultural heartland renowned for high-yield sweet water rice and harvest culture.', pin: 'p1' }
    ]
  },
  mountain: {
    id: 'element-mountain',
    name: 'Zhejiang Mountains & Peaks',
    elements: ['mountain'],
    comboSvg: 'assets/mountain.svg',
    desc: 'Rugged granitic peaks, sea-of-clouds canyons, and verdant bamboo-forested slopes that define Zhejiang’s dramatic inland landscapes.',
    highlightPlace: 'Yandang Mountain',
    places: [
      { name: 'Yandang Mountain Peaks', city: 'Wenzhou, Zhejiang', text: 'Spectacular coastal volcanic pinnacles famous for hanging temples and sheer cliffs.', pin: 'p2' },
      { name: 'Moganshan Bamboo Mountain', city: 'Huzhou, Zhejiang', text: 'Misty bamboo ridges renowned since the early 1900s as a tranquil mountain sanctuary.', pin: 'p1' },
      { name: 'Tiantai Mountain Canyons', city: 'Taizhou, Zhejiang', text: 'Spiritual mountain ridges with cascading waterfalls and ancient stone bridges.', pin: 'p3' }
    ]
  },
  building: {
    id: 'element-building',
    name: 'Jiangnan Traditional Architecture',
    elements: ['building'],
    comboSvg: 'assets/building.svg',
    desc: 'Horse-head firewall courtyards, grey slate roofs, delicate wooden lattice screens, and riverfront pavilions showcasing refined Jiangnan vernacular building art.',
    highlightPlace: 'Nanxun Ancient Residences',
    places: [
      { name: 'Nanxun Zhang Shiming Mansion', city: 'Huzhou, Zhejiang', text: 'Exquisite merchant compound marrying traditional wood carvings with French glasswork.', pin: 'p3' },
      { name: 'Shaoxing Lu Xun Native Place', city: 'Shaoxing, Zhejiang', text: 'Classic water town residential courtyard featuring stone courtyards and study pavilions.', pin: 'p2' },
      { name: 'Wuzhen Ancient Water Pavilion Residences', city: 'Jiaxing, Zhejiang', text: 'Pillared water-side stilt residences constructed right over the flowing waterways.', pin: 'p1' }
    ]
  }
};

export const UNMATCHED_THEME: ExploreTheme = {
  id: 'unmatched-fallback',
  name: 'No exact combination match found',
  isUnmatched: true,
  elements: [],
  comboSvg: 'assets/explore-grid.svg',
  desc: 'We couldn’t find an exact cultural match for this specific combination of elements. But here is a wonderful Jiangnan destination we recommend for you to explore, or you can try a different combination of elements.',
  highlightPlace: 'Hangzhou West Lake Cultural Landscape',
  places: [
    { name: 'West Lake Landscape', city: 'Hangzhou, Zhejiang', text: 'A UNESCO World Heritage cultural landscape blending lakes, hills, pagodas, and tea gardens.', pin: 'p1' },
    { name: 'Shaoxing Ancient City', city: 'Shaoxing, Zhejiang', text: 'An enchanting network of water lanes, calligraphy gardens, and stone bridges.', pin: 'p2' },
    { name: 'Songyang Ancient Villages', city: 'Lishui, Zhejiang', text: 'Picturesque mountain settlements preserving centuries of living rural tradition.', pin: 'p3' }
  ]
};

interface PieceItem {
  id: string;
  type: string;
  label: string;
  src: string;
  className: string;
  left?: number;
  top?: number;
  isMoved?: boolean;
  spawned?: boolean;
}

const INITIAL_PIECES: PieceItem[] = [
  { id: 'lake-1', type: 'lake', label: 'Water', src: 'assets/elements/lake.svg', className: 'lake' },
  { id: 'bridge-1', type: 'bridge', label: 'Bridge', src: 'assets/elements/bridge.svg', className: 'bridge' },
  { id: 'tea-1', type: 'tea', label: 'Tea', src: 'assets/elements/tea.svg', className: 'tea' },
  { id: 'rice-1', type: 'rice', label: 'Rice', src: 'assets/elements/rice.svg', className: 'rice' },
  { id: 'mountain-1', type: 'mountain', label: 'Mountain', src: 'assets/elements/mountain.svg', className: 'mountain' },
  { id: 'building-1', type: 'building', label: 'Architecture', src: 'assets/elements/building.svg', className: 'building' },
];

export const ExplorePage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'compose' | 'searching' | 'reveal' | 'detail'>('compose');
  const [pieces, setPieces] = useState<PieceItem[]>(INITIAL_PIECES);
  const [placedItems, setPlacedItems] = useState<{ src: string; alt: string; leftPercent: number; topPercent: number; width: number; height: number }[]>([]);
  const [currentTheme, setCurrentTheme] = useState<ExploreTheme>(COMBO_THEMES[0]);
  const [activePin, setActivePin] = useState<'p1' | 'p2' | 'p3'>('p1');
  const [isPhotoIn, setIsPhotoIn] = useState(false);
  const [isRevealCopyShow, setIsRevealCopyShow] = useState(false);

  const playgroundRef = useRef<HTMLDivElement>(null);
  const gridZoneRef = useRef<HTMLDivElement>(null);
  const dragInfoRef = useRef<{
    id: string;
    dx: number;
    dy: number;
    element: HTMLElement | null;
  } | null>(null);

  const isOverGrid = (el: HTMLElement) => {
    if (!gridZoneRef.current) return false;
    const gridRect = gridZoneRef.current.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return (
      centerX >= gridRect.left &&
      centerX <= gridRect.right &&
      centerY >= gridRect.top &&
      centerY <= gridRect.bottom
    );
  };

  const handleReset = () => {
    setPieces(INITIAL_PIECES);
    setPlacedItems([]);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>, pieceId: string) => {
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const r = el.getBoundingClientRect();
    dragInfoRef.current = {
      id: pieceId,
      dx: e.clientX - r.left,
      dy: e.clientY - r.top,
      element: el,
    };
    el.classList.add('dragging');
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragInfoRef.current || !playgroundRef.current) return;
    const { id, dx, dy, element } = dragInfoRef.current;
    if (!element) return;

    const r = playgroundRef.current.getBoundingClientRect();
    const minTop = 10;
    const maxTop = r.height - element.offsetHeight - 10;
    const minLeft = 10;
    const maxLeft = r.width - element.offsetWidth - 10;

    const leftPx = Math.max(minLeft, Math.min(maxLeft, e.clientX - r.left - dx));
    const topPx = Math.max(minTop, Math.min(maxTop, e.clientY - r.top - dy));

    setPieces((prev) =>
      prev.map((p) => (p.id === id ? { ...p, left: leftPx, top: topPx, isMoved: true } : p))
    );
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragInfoRef.current) {
      const { id, element } = dragInfoRef.current;
      if (element) {
        element.classList.remove('dragging');
        try {
          element.releasePointerCapture(e.pointerId);
        } catch {
          // ignore
        }

        if (isOverGrid(element)) {
          // Check if we should spawn another copy
          setPieces((prev) => {
            const currentPiece = prev.find((p) => p.id === id);
            if (currentPiece && !currentPiece.spawned) {
              const markedCurrent = { ...currentPiece, spawned: true };
              const newPiece: PieceItem = {
                id: `${currentPiece.type}-${Date.now()}`,
                type: currentPiece.type,
                label: currentPiece.label,
                src: currentPiece.src,
                className: `${currentPiece.type} spawned`,
              };
              return [...prev.map((p) => (p.id === id ? markedCurrent : p)), newPiece];
            }
            return prev;
          });
        }
      }
      dragInfoRef.current = null;
    }
  };

  const detectComposition = () => {
    if (!playgroundRef.current || !gridZoneRef.current) return null;
    const allPieceElements = playgroundRef.current.querySelectorAll('.piece');
    const activeTypes = new Set<string>();

    allPieceElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      if (isOverGrid(htmlEl)) {
        const type = htmlEl.getAttribute('data-piece');
        if (type) activeTypes.add(type);
      }
    });

    if (activeTypes.size === 0) return null;

    if (activeTypes.size === 1) {
      const singleKey = Array.from(activeTypes)[0];
      return SINGLE_ELEMENT_THEMES[singleKey] || UNMATCHED_THEME;
    }

    if (activeTypes.size === 3 && activeTypes.has('lake') && activeTypes.has('bridge') && activeTypes.has('building')) {
      return COMBO_THEMES.find((t) => t.id === 'water-village') || UNMATCHED_THEME;
    }

    if (activeTypes.size === 2) {
      for (const theme of COMBO_THEMES) {
        if (theme.strictMatch && theme.strictMatch(activeTypes)) {
          return theme;
        }
      }
    }

    return UNMATCHED_THEME;
  };

  const preserveUserLayout = () => {
    if (!playgroundRef.current) return;
    const areaRect = playgroundRef.current.getBoundingClientRect();
    const allPieceElements = playgroundRef.current.querySelectorAll('.piece');
    const items: { src: string; alt: string; leftPercent: number; topPercent: number; width: number; height: number }[] = [];

    allPieceElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      if (isOverGrid(htmlEl)) {
        const pRect = htmlEl.getBoundingClientRect();
        const leftPercent = ((pRect.left - areaRect.left) / areaRect.width) * 100;
        const topPercent = ((pRect.top - areaRect.top) / areaRect.height) * 100;
        const img = htmlEl.querySelector('img');
        if (img) {
          items.push({
            src: img.getAttribute('src') || '',
            alt: img.getAttribute('alt') || '',
            leftPercent,
            topPercent,
            width: htmlEl.offsetWidth,
            height: htmlEl.offsetHeight,
          });
        }
      }
    });

    setPlacedItems(items);

    const theme = detectComposition() || UNMATCHED_THEME;
    setCurrentTheme(theme);
    if (theme.places && theme.places.length > 0) {
      setActivePin(theme.places[0].pin);
    }
  };

  const handleConfirm = () => {
    preserveUserLayout();
    setCurrentView('searching');
    window.scrollTo({ top: 0, behavior: 'instant' });

    setTimeout(() => {
      setCurrentView('reveal');
      setIsPhotoIn(false);
      setIsRevealCopyShow(false);
      window.scrollTo({ top: 0, behavior: 'instant' });

      setTimeout(() => setIsPhotoIn(true), 400);
      setTimeout(() => setIsRevealCopyShow(true), 1800);
    }, 2400);
  };

  const navigateToDetail = () => {
    if (currentTheme.isUnmatched) return;
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="explore-container">
      {/* Exact Original CSS from GitHub */}
      <style>{`
        .explore-container {
          --paper: #faf8f1;
          --ink: #596167;
          --pink: #d6beb4;
          --lake: #72a7d6;
          --mountain: #749d94;
          --leaf: #92aa83;
          color: var(--ink);
          font-family: Jura, Arial, sans-serif;
          min-height: calc(100vh - 72px);
          position: relative;
        }
        .explore-container * {
          box-sizing: border-box;
        }
        .view {
          display: none;
          min-height: calc(100vh - 72px);
          position: relative;
          overflow: hidden;
        }
        .view.active {
          display: block;
        }
        .intro {
          text-align: center;
          padding: 140px 20px 48px;
          pointer-events: none;
        }
        .intro h1, .intro p {
          pointer-events: auto;
        }
        .intro h1 {
          font: 400 64px/.98 'Kaisei Decol', serif;
          letter-spacing: -.06em;
          margin: 0 0 35px;
          color: var(--ink);
        }
        .intro p {
          font-size: 18px;
          line-height: 1.5;
          margin: 0;
          color: var(--ink);
        }
        .playground {
          height: 600px;
          position: relative;
          margin: auto;
          max-width: 1400px;
        }
        .grid-zone {
          position: absolute;
          width: min(72vw, 980px);
          height: 430px;
          left: 50%;
          top: 65px;
          transform: translateX(-50%);
          background: url('assets/explore-grid.svg') center/100% 100% no-repeat;
          pointer-events: none;
        }
        .piece {
          position: absolute;
          border: 0;
          background: transparent;
          padding: 0;
          cursor: grab;
          touch-action: none;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
        }
        .piece:active {
          cursor: grabbing;
        }
        .piece img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          pointer-events: none;
          display: block;
        }
        .piece.dragging {
          z-index: 30;
          filter: drop-shadow(4px 8px 8px rgba(40,40,40,.28));
        }
        .piece.spawned {
          animation: pop-in .35s ease both;
        }
        @keyframes pop-in {
          from { opacity: 0; transform: scale(.45) rotate(-12deg); }
          to { opacity: 1; transform: scale(1) rotate(0); }
        }
        .lake { width: 230px; height: 150px; left: 20px; top: 15px; }
        .bridge { width: 260px; height: 130px; left: 30px; top: 185px; }
        .tea { width: 170px; height: 170px; left: 35px; bottom: 15px; }
        .rice { width: 210px; height: 210px; right: 35px; bottom: 10px; }
        .mountain { width: 260px; height: 260px; right: 20px; top: 10px; }
        .building { width: 220px; height: 220px; right: 35px; top: 260px; }

        .reset-btn {
          position: absolute;
          top: 24px;
          right: calc(50% - min(36vw, 490px) + 8px);
          z-index: 25;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(89, 97, 103, 0.25);
          border-radius: 20px;
          font: 400 13px Jura, sans-serif;
          color: var(--ink);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(89, 97, 103, 0.08);
          transition: background .2s, color .2s, transform .2s, border-color .2s;
        }
        .reset-btn:hover {
          background: #ffffff;
          border-color: var(--pink);
          color: var(--pink);
          transform: translateY(-1px);
        }
        .reset-btn:active {
          transform: translateY(0);
        }
        .reset-btn svg {
          width: 14px;
          height: 14px;
          stroke: currentColor;
        }
        .tips {
          text-align: center;
          font-size: 14px;
          line-height: 1.45;
          opacity: .45;
          margin-top: -30px;
          pointer-events: none;
        }
        .primary {
          display: block;
          position: relative;
          z-index: 25;
          border: 0;
          background: var(--pink);
          color: var(--ink);
          font: 400 23px 'Kaisei Decol', serif;
          padding: 10px 34px;
          margin: 42px auto 65px;
          cursor: pointer;
          border-radius: 4px;
          transition: background .2s, color .2s;
        }
        .primary:hover {
          background: #b88978;
          color: white;
          transform: translateY(-1px);
        }
        .view.searching.active {
          display: block !important;
          text-align: center;
        }
        .search-stage {
          height: 600px;
          position: relative;
          margin: 40px auto 0;
          max-width: 1400px;
        }
        .search-board {
          position: absolute;
          width: min(72vw, 980px);
          height: 430px;
          left: 50%;
          top: 65px;
          transform: translateX(-50%);
          background: url('assets/explore-grid.svg') center/100% 100% no-repeat;
          opacity: .85;
        }
        .search-elements {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .search-item {
          position: absolute;
          object-fit: contain;
          transition: transform .6s ease;
          animation: pulse-glow 2.5s infinite ease-in-out;
        }
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 0 rgba(114,167,214,0)); }
          50% { filter: drop-shadow(0 0 10px rgba(114,167,214,.4)); }
        }
        .search-copy {
          position: relative;
          z-index: 10;
          margin-top: 10px;
        }
        .search-copy h2 {
          font: 400 56px 'Kaisei Decol', serif;
          margin: 0 0 10px;
          color: var(--ink);
        }
        .dots span {
          opacity: 0;
          animation: dots 1.5s infinite;
        }
        .dots span:nth-child(2) { animation-delay: .25s; }
        .dots span:nth-child(3) { animation-delay: .5s; }
        @keyframes dots {
          0%, 100% { opacity: 0; }
          45% { opacity: 1; }
        }
        .reveal {
          padding: 40px 0 95px;
          text-align: center;
        }
        .transition-stage {
          height: 600px;
          position: relative;
          overflow: hidden;
          background: var(--paper);
          cursor: pointer;
          max-width: 1400px;
          margin: 0 auto;
          border-radius: 12px;
        }
        .photo-stage {
          position: absolute;
          inset: 0;
          background: url('assets/village-photo.png') center/cover no-repeat;
          opacity: 0;
          transition: opacity 1.5s cubic-bezier(.4, 0, .2, 1);
        }
        .transition-stage.photo-in .photo-stage {
          opacity: 1;
        }
        .photo-stage:after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(250, 248, 241, .15);
        }
        .kept-composition {
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
          transition: opacity .8s ease;
        }
        .kept-composition .placed-item {
          position: absolute;
          object-fit: contain;
          display: block;
        }
        .reveal-copy {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity .8s ease, transform .8s ease;
          margin-top: 25px;
        }
        .reveal-copy.show {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal h2 {
          font: 400 64px 'Kaisei Decol', serif;
          margin: 25px 0 16px;
          color: #111;
          cursor: pointer;
        }
        .reveal p {
          max-width: 810px;
          margin: 0 auto;
          font-size: 16px;
          line-height: 1.5;
          opacity: .68;
        }
        .place-actions {
          margin-top: 26px;
        }
        .place-name {
          font: 400 22px 'Kaisei Decol', serif;
          color: #222;
          margin-bottom: 8px;
        }
        .place-actions-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .reveal-back-btn {
          display: inline-block;
          margin-top: 14px;
          padding: 6px 22px;
          border: 1px solid rgba(89, 97, 103, 0.3);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.75);
          color: var(--ink);
          font: 500 13px Jura, sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }
        .reveal-back-btn:hover {
          background: #ffffff;
          border-color: var(--pink);
          color: var(--pink);
          transform: translateY(-1px);
        }
        .reveal.unmatched-view .transition-stage,
        .reveal.unmatched-view h2,
        .reveal.unmatched-view .place-name {
          cursor: default !important;
          pointer-events: none;
        }
        .reveal.unmatched-view .reveal-back-btn {
          pointer-events: auto !important;
        }
        .next {
          font: 600 14px Jura;
          color: var(--ink);
          margin: 0 7px;
          cursor: pointer;
        }
        .detail {
          padding: 20px 0 90px;
        }
        .feature {
          height: 605px;
          position: relative;
          background: linear-gradient(rgba(250,248,241,.65),rgba(250,248,241,.8)), url('assets/village-photo.png') center/cover;
        }
        .feature-combo {
          position: absolute;
          width: 390px;
          height: 390px;
          object-fit: contain;
          left: 7%;
          top: 50%;
          transform: translateY(-50%);
        }
        .feature-copy {
          position: absolute;
          left: 51%;
          top: 150px;
          max-width: 410px;
        }
        .feature-copy h1 {
          font: 400 58px 'Kaisei Decol', serif;
          margin: 0 0 15px;
          color: var(--ink);
        }
        .feature-copy p {
          color: #242424;
          font-size: 15px;
          line-height: 1.45;
        }
        .places {
          max-width: 1140px;
          margin: 60px auto 0;
          display: grid;
          grid-template-columns: 410px 1fr;
          gap: 60px;
          align-items: flex-start;
        }
        .place-panel {
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(89, 97, 103, 0.2);
          border-radius: 20px;
          padding: 24px 20px 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
        }
        .place-item-card {
          background: #ffffff;
          border: 1px solid rgba(89, 97, 103, 0.16);
          border-radius: 12px;
          padding: 16px 18px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .place-item-card:hover {
          border-color: rgba(89, 97, 103, 0.35);
          transform: translateY(-1px);
        }
        .place-item-card.active {
          border-color: rgba(107, 162, 215, 0.4);
          background: #fafaf8;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
        }
        .place-item-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .place-item-header h2 {
          font: 400 23px 'Kaisei Decol', serif;
          margin: 0;
          color: var(--ink);
        }
        .place-item-toggle {
          font-size: 20px;
          font-weight: 300;
          color: #7b848c;
          transition: transform 0.2s;
        }
        .place-item-city {
          font-size: 13px;
          color: #8c9399;
          font-family: Jura, sans-serif;
          margin: 4px 0 0;
        }
        .place-item-body {
          display: none;
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }
        .place-item-card.active .place-item-body {
          display: block;
        }
        .place-item-desc {
          font-size: 13.5px;
          line-height: 1.5;
          color: #333333;
          margin: 0 0 14px;
        }
        .place-item-photo {
          width: 100%;
          height: 190px;
          object-fit: cover;
          border-radius: 8px;
          display: block;
        }
        .generate-route-btn {
          width: 100%;
          margin-top: 14px;
          background: #c3ada4;
          border: 0;
          border-radius: 8px;
          color: #ffffff;
          font: 500 15px Jura, sans-serif;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 14px 20px;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .generate-route-btn:hover {
          background: #b59b91;
          box-shadow: 0 4px 12px rgba(181, 155, 145, 0.35);
          transform: translateY(-1px);
        }
        .generate-route-btn:active {
          transform: translateY(0);
        }
        .map-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 10px;
        }
        .map-wrap > img {
          display: block;
          width: 100%;
          max-height: 560px;
          object-fit: contain;
        }
        .pin {
          position: absolute;
          width: 32px;
          height: 32px;
          padding: 0;
          border: 0;
          cursor: pointer;
          background: transparent;
          transform: translate(-50%, -50%);
          transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.25s ease;
          z-index: 5;
        }
        .pin::before {
          content: '';
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 7px;
          transform: rotate(45deg);
          background: #8e8381;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.16);
          transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .pin:hover {
          transform: translate(-50%, -50%) scale(1.12);
        }
        .pin.active {
          z-index: 10;
          transform: translate(-50%, -50%) scale(1.22);
        }
        .pin.active::before {
          background: #6ba2d7;
          border-radius: 9px;
          box-shadow: 0 6px 18px rgba(107, 162, 215, 0.55);
        }
        .p1 { left: 78%; top: 32%; }
        .p2 { left: 45%; top: 51%; }
        .p3 { left: 63%; top: 71%; }
        .more {
          text-align: center;
          margin-top: 130px;
        }
        .more h2 {
          font: 400 44px 'Kaisei Decol', serif;
          color: var(--ink);
        }
        .more p {
          color: var(--ink);
        }
        .back {
          border: 0;
          background: var(--pink);
          font: 400 24px 'Kaisei Decol', serif;
          color: var(--ink);
          padding: 8px 48px;
          cursor: pointer;
          border-radius: 4px;
        }
        @media (max-width: 750px) {
          .intro { padding-top: 90px; }
          .intro h1 { font-size: 42px; }
          .playground { height: 550px; }
          .grid-zone { width: 88vw; height: 360px; top: 95px; }
          .piece { width: 120px !important; height: 120px !important; }
          .lake { width: 150px !important; height: 100px !important; }
          .mountain { width: 160px !important; height: 160px !important; }
          .building { width: 145px !important; height: 145px !important; }
          .tips { padding: 0 20px; }
          .search-copy h2 { font-size: 44px; }
          .photo-stage { height: 370px; }
          .feature { height: 480px; }
          .feature-combo { width: 220px; height: 220px; left: 8%; top: 40px; }
          .feature-copy { left: 42%; top: 205px; right: 8%; }
          .feature-copy h1 { font-size: 42px; }
          .places { grid-template-columns: 1fr; gap: 35px; margin: 70px 8%; }
          .map-wrap { order: -1; }
        }
      `}</style>

      {/* 1. Compose Screen */}
      <section className={`view ${currentView === 'compose' ? 'active' : ''}`} id="compose">
        <div className="intro">
          <h1>
            Explore Zhejiang
            <br />
            with your interests.
          </h1>
          <p>
            Zhejiang has lots of unique cultures and
            <br />
            experiences. Pick what you are interested in and put them
            <br />
            together. See what you find!
          </p>
        </div>

        <div
          className="playground"
          id="playground"
          ref={playgroundRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <div className="grid-zone" id="gridZone" ref={gridZoneRef}></div>

          <button className="reset-btn" id="resetBtn" title="Reset all elements" onClick={handleReset}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Reset
          </button>

          {pieces.map((piece) => {
            const hasCustomPos = piece.isMoved && piece.left !== undefined && piece.top !== undefined;
            return (
              <button
                key={piece.id}
                className={`piece ${piece.className}`}
                data-piece={piece.type}
                onPointerDown={(e) => handlePointerDown(e, piece.id)}
                style={{
                  left: hasCustomPos ? `${piece.left}px` : undefined,
                  top: hasCustomPos ? `${piece.top}px` : undefined,
                  right: hasCustomPos ? 'auto' : undefined,
                  bottom: hasCustomPos ? 'auto' : undefined,
                }}
              >
                <img src={piece.src} alt={piece.label} />
              </button>
            );
          })}
        </div>

        <p className="tips">
          Pick what you are interested in and drag them together!
          <br />
          AI will discover places and cultures that reflect your choices.
        </p>

        <button className="primary" id="confirm" onClick={handleConfirm}>
          CONFIRM
        </button>
      </section>

      {/* 2. Searching Screen */}
      <section className={`view searching ${currentView === 'searching' ? 'active' : ''}`} id="searching">
        <div className="search-stage">
          <div className="search-board"></div>
          <div className="search-elements" id="searchElements">
            {placedItems.map((item, idx) => (
              <img
                key={idx}
                src={item.src}
                alt={item.alt}
                className="search-item"
                style={{
                  left: `${item.leftPercent}%`,
                  top: `${item.topPercent}%`,
                  width: `${item.width}px`,
                  height: `${item.height}px`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="search-copy">
          <h2>
            Searching
            <span className="dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </h2>
          <p id="searchSubText">AI will discover places and cultures that reflect your choices</p>
        </div>

        <button className="primary" id="cancel" onClick={() => setCurrentView('compose')}>
          CANCEL
        </button>
      </section>

      {/* 3. Reveal Screen */}
      <section
        className={`view reveal ${currentView === 'reveal' ? 'active' : ''} ${
          currentTheme.isUnmatched ? 'unmatched-view' : ''
        }`}
        id="reveal"
      >
        <div
          className={`transition-stage ${isPhotoIn ? 'photo-in' : ''}`}
          id="transitionStage"
          onClick={navigateToDetail}
        >
          <div className="photo-stage" id="revealPhotoStage"></div>
          <div className="kept-composition" id="keptComposition">
            {placedItems.map((item, idx) => (
              <img
                key={idx}
                src={item.src}
                alt={item.alt}
                className="placed-item"
                style={{
                  left: `${item.leftPercent}%`,
                  top: `${item.topPercent}%`,
                  width: `${item.width}px`,
                  height: `${item.height}px`,
                }}
              />
            ))}
          </div>
        </div>

        <div className={`reveal-copy ${isRevealCopyShow ? 'show' : ''}`} id="revealCopy">
          <h2 id="revealTitle" onClick={navigateToDetail}>
            {currentTheme.name}
          </h2>
          <p id="revealDesc">{currentTheme.desc}</p>
          <div className="place-actions" id="placeActions">
            {!currentTheme.isUnmatched ? (
              <>
                <div className="place-name" id="revealHighlightPlace" onClick={navigateToDetail}>
                  {currentTheme.highlightPlace}
                </div>
                <div className="place-actions-links" id="revealActionLinks">
                  <span className="next" id="revealViewPlace" onClick={navigateToDetail}>
                    View the Place
                  </span>
                  <span>|</span>
                  <span className="next" id="revealViewCity" onClick={navigateToDetail}>
                    View the City
                  </span>
                </div>
              </>
            ) : (
              <button
                className="reveal-back-btn"
                id="revealBackBtn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPhotoIn(false);
                  setIsRevealCopyShow(false);
                  setCurrentView('compose');
                }}
              >
                back
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 4. Detail Screen */}
      <section className={`view detail ${currentView === 'detail' ? 'active' : ''}`} id="detail">
        <div className="feature" id="detailFeature">
          <img
            className="feature-combo"
            id="detailFeatureCombo"
            src={currentTheme.comboSvg}
            alt="Cultural symbol"
          />
          <div className="feature-copy">
            <h1 id="detailTitle">{currentTheme.name}</h1>
            <p id="detailDesc">{currentTheme.desc}</p>
          </div>
        </div>

        <div className="places">
          <div className="place-panel">
            <div className="place-cards-container" id="placeCardsContainer">
              {currentTheme.places.map((p) => {
                const isActive = activePin === p.pin;
                return (
                  <div
                    key={p.name}
                    className={`place-item-card ${isActive ? 'active' : ''}`}
                    data-pin={p.pin}
                    onClick={() => setActivePin(p.pin)}
                  >
                    <div className="place-item-header">
                      <div>
                        <h2>{p.name}</h2>
                        <div className="place-item-city">{p.city}</div>
                      </div>
                      <span className="place-item-toggle">{isActive ? '—' : '+'}</span>
                    </div>
                    <div className="place-item-body">
                      <p className="place-item-desc">{p.text}</p>
                      <img className="place-item-photo" src="assets/village-photo.png" alt={p.name} />
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="generate-route-btn" id="generateRouteBtn">
              Generate the Route
            </button>
          </div>

          <div className="map-wrap">
            <img src="assets/zhejiang mapp.svg" alt="Map of Zhejiang" />
            <button
              className={`pin p1 ${activePin === 'p1' ? 'active' : ''}`}
              data-pin="p1"
              aria-label="Location 1"
              onClick={() => setActivePin('p1')}
            ></button>
            <button
              className={`pin p2 ${activePin === 'p2' ? 'active' : ''}`}
              data-pin="p2"
              aria-label="Location 2"
              onClick={() => setActivePin('p2')}
            ></button>
            <button
              className={`pin p3 ${activePin === 'p3' ? 'active' : ''}`}
              data-pin="p3"
              aria-label="Location 3"
              onClick={() => setActivePin('p3')}
            ></button>
          </div>
        </div>

        <div className="more">
          <h2>want to add more?</h2>
          <p>Explore other combinations and more unique cultural sites.</p>
          <button
            className="back"
            id="back"
            onClick={() => {
              setIsPhotoIn(false);
              setIsRevealCopyShow(false);
              setCurrentView('compose');
            }}
          >
            back
          </button>
        </div>
      </section>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { RouteQrModal } from './RouteQrModal';
import { SavedPlan, SavedPlace } from '../types';
import { Heart, QrCode, Compass, Sparkles, MapPin, Check, ArrowRight, RotateCcw } from 'lucide-react';

export interface ExplorePlace {
  name: string;
  city: string;
  text: string;
  pin: 'p1' | 'p2' | 'p3' | 'p4';
  coords?: { left: string; top: string };
  photo?: string;
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
  color?: string;
  colorLight?: string;
  colorBorder?: string;
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
    color: '#5b8a99',
    colorLight: 'rgba(91, 138, 153, 0.07)',
    colorBorder: 'rgba(91, 138, 153, 0.38)',
    places: [
      { name: 'Minghe Ancient Town', city: 'Guanhaiwei, Cixi', text: 'Minghe Ancient Town is the oldest market town in Cixi and one of the birthplaces of China’s traditional medicine industry. It was founded during the Kaiyuan period of the Tang Dynasty.', pin: 'p1', coords: { left: '72%', top: '39%' }, photo: './assets/images/water village1.jpg' },
      { name: 'West Lake', city: 'Hangzhou, Zhejiang', text: 'West Lake is one of China’s most famous lakes, renowned for its willow shores, causeways, and pagoda reflections.', pin: 'p2', coords: { left: '48%', top: '38%' }, photo: './assets/images/water village2.jpg' },
      { name: 'Wuzhen Water Town', city: 'Tongxiang, Zhejiang', text: 'Walk the water lanes and discover wood carvings, stone arches and evening reflections across historic canals.', pin: 'p3', coords: { left: '56%', top: '28%' }, photo: './assets/images/water village3.jpg' },
      { name: 'Nanxun Ancient Town', city: 'Huzhou, Zhejiang', text: 'A tranquil historic water town featuring private gardens, waterways, and Western-Chinese fusion silk merchant villas.', pin: 'p4', coords: { left: '48%', top: '22%' }, photo: './assets/images/water village4.jpg' }
    ]
  },
  {
    id: 'tea-tasting',
    name: 'Tea Tasting',
    elements: ['building', 'tea'],
    strictMatch: (set) => set.size === 2 && set.has('building') && set.has('tea'),
    comboSvg: 'assets/tea tasting.svg',
    desc: 'Tea culture in Zhejiang blends centuries of artisan roasted Dragon Well (Longjing) leaves with exquisite seasonal dim sum and tea-infused delicacies. An immersion into Jiangnan tranquility.',
    highlightPlace: 'Meijiawu Tea Village',
    color: '#5e8b68',
    colorLight: 'rgba(94, 139, 104, 0.07)',
    colorBorder: 'rgba(94, 139, 104, 0.38)',
    places: [
      { name: 'Meijiawu Tea Village', city: 'Hangzhou, Zhejiang', text: 'Terraced tea hills where you can brew fresh Longjing and savor authentic tea delicacies.', pin: 'p1', coords: { left: '46%', top: '40%' }, photo: './assets/images/tea picking in hills1.jpg' },
      { name: 'Longjing Village', city: 'Hangzhou, Zhejiang', text: 'The birthplace of West Lake Longjing tea surrounded by fresh mountain springs and bamboo trails.', pin: 'p2', coords: { left: '50%', top: '38%' }, photo: './assets/images/tea picking in hills2.jpg' },
      { name: 'Jingshan Temple Trail', city: 'Yuhang, Zhejiang', text: 'Ancient Zen tea ceremony traditions nestled in lush misty hills with traditional tea-whisking.', pin: 'p3', coords: { left: '42%', top: '33%' }, photo: './assets/images/tea picking in hills3.jpg' },
      { name: 'Songyang Tea Plantation', city: 'Lishui, Zhejiang', text: 'Rolling terraced plantation known as the tranquil secret garden of ancient Jiangnan.', pin: 'p4', coords: { left: '38%', top: '74%' }, photo: './assets/images/tea picking in hills4.jpg' }
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
    color: '#4e8055',
    colorLight: 'rgba(78, 128, 85, 0.07)',
    colorBorder: 'rgba(78, 128, 85, 0.38)',
    places: [
      { name: 'Songyang Tea Hills', city: 'Lishui, Zhejiang', text: 'Rolling terraced plantation known as the secret garden of ancient Jiangnan with scenic ridges.', pin: 'p1', coords: { left: '38%', top: '74%' }, photo: './assets/images/tea picking in hills1.jpg' },
      { name: 'Meijiawu Green Terraces', city: 'Hangzhou, Zhejiang', text: 'Historic green slopes offering hands-on spring tea harvest experiences in the hills.', pin: 'p2', coords: { left: '47%', top: '39%' }, photo: './assets/images/tea picking in hills2.jpg' },
      { name: 'Moganshan Mountain Tea', city: 'Huzhou, Zhejiang', text: 'High-elevation bamboo slopes with crisp air and boutique tea retreats in the mountains.', pin: 'p3', coords: { left: '44%', top: '26%' }, photo: './assets/images/tea picking in hills3.jpg' },
      { name: 'Pan’an Ecological Hills', city: 'Jinhua, Zhejiang', text: 'Lush alpine tea gardens shrouded in morning clouds and crisp organic mountain air.', pin: 'p4', coords: { left: '54%', top: '56%' }, photo: './assets/images/tea picking in hills4.jpg' }
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
    color: '#4a7888',
    colorLight: 'rgba(74, 120, 136, 0.07)',
    colorBorder: 'rgba(74, 120, 136, 0.38)',
    places: [
      { name: 'Bazi Bridge Canal', city: 'Shaoxing, Zhejiang', text: 'One of the oldest stone flyover bridge systems in ancient Chinese history.', pin: 'p1', coords: { left: '56%', top: '44%' }, photo: './assets/images/Canal and Stone Bridges1.jpg' },
      { name: 'Grand Canal Gongchen', city: 'Hangzhou, Zhejiang', text: 'The northern terminus of the Grand Canal lined with museums and tea houses.', pin: 'p2', coords: { left: '47%', top: '34%' }, photo: './assets/images/Canal and Stone Bridges2.jpg' },
      { name: 'Anchang Water Town', city: 'Keqiao, Zhejiang', text: 'Bustling waterways flanked by handcrafted sausage and rice wine workshops.', pin: 'p3', coords: { left: '53%', top: '42%' }, photo: './assets/images/Canal and Stone Bridges3.jpg' },
      { name: 'Taishun Covered Bridges', city: 'Wenzhou, Zhejiang', text: 'Ancient mortise-and-tenon wooden arch bridges spanning mountain streams with master craft.', pin: 'p4', coords: { left: '52%', top: '86%' }, photo: './assets/images/Canal and Stone Bridges4.jpg' }
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
    color: '#996e4a',
    colorLight: 'rgba(153, 110, 74, 0.07)',
    colorBorder: 'rgba(153, 110, 74, 0.38)',
    places: [
      { name: 'Chenjiapu Village', city: 'Songyang, Zhejiang', text: 'Cliffside cliff settlement with bookstores and sun-drying agricultural plazas.', pin: 'p1', coords: { left: '35%', top: '76%' }, photo: './assets/images/Mountain Village and Dwellings1.jpg' },
      { name: 'Moganshan Village', city: 'Deqing, Zhejiang', text: 'Lush bamboo slopes sheltering tranquil boutique eco-villas and craft cafes.', pin: 'p2', coords: { left: '43%', top: '27%' }, photo: './assets/images/Mountain Village and Dwellings2.jpg' },
      { name: 'Tiantai Mountain Valley', city: 'Taizhou, Zhejiang', text: 'Deep spiritual hills surrounded by cascading waterfalls and cedar trees.', pin: 'p3', coords: { left: '68%', top: '60%' }, photo: './assets/images/Mountain Village and Dwellings3.png' },
      { name: 'Xianju Gaoshan Village', city: 'Taizhou, Zhejiang', text: 'Pristine stone hamlet perched above the clouds with panoramic mountain views.', pin: 'p4', coords: { left: '62%', top: '68%' }, photo: './assets/images/Mountain Village and Dwellings4.png' }
    ]
  },
  {
    id: 'local-farm-food',
    name: 'Local Farm & Harvest Food',
    elements: ['rice', 'mountain'],
    strictMatch: (set) => set.size === 2 && set.has('rice') && set.has('mountain'),
    comboSvg: 'assets/local farm food.svg',
    desc: 'Farmhouse kitchens serving seasonal bamboo shoots, clay-pot braised chicken, and freshly picked river vegetables prepared with rustic Jiangnan hearth techniques.',
    highlightPlace: 'Lin’an Mountain Homesteads',
    color: '#b3733b',
    colorLight: 'rgba(179, 115, 59, 0.07)',
    colorBorder: 'rgba(179, 115, 59, 0.38)',
    places: [
      { name: 'Lin’an Tianmu Hearth', city: 'Hangzhou, Zhejiang', text: 'Savory cured ham, wild mountain ferns and stone-ground tofu over firewood stoves.', pin: 'p1', coords: { left: '34%', top: '38%' }, photo: './assets/images/Local Farm and Harvest Food1.png' },
      { name: 'Suichang Earth Kitchen', city: 'Lishui, Zhejiang', text: 'Clay-pot stews and golden crisp sweet rice cakes over firewood stoves.', pin: 'p2', coords: { left: '32%', top: '72%' }, photo: './assets/images/Local Farm and Harvest Food2.jpg' },
      { name: 'Anji Bamboo Delights', city: 'Huzhou, Zhejiang', text: 'Tender springtime bamboo delicacies cooked in fresh bamboo tubes.', pin: 'p3', coords: { left: '38%', top: '25%' }, photo: './assets/images/Local Farm and Harvest Food3.jpg' },
      { name: 'Kaihua Hearth Kitchen', city: 'Quzhou, Zhejiang', text: 'Stream fish and mountain mushroom hot pots slow-cooked with hearthwood flavor.', pin: 'p4', coords: { left: '22%', top: '62%' }, photo: './assets/images/Local Farm and Harvest Food4.png' }
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
    color: '#3b7a9e',
    colorLight: 'rgba(59, 122, 158, 0.07)',
    colorBorder: 'rgba(59, 122, 158, 0.38)',
    places: [
      { name: 'Shenjiamen Port', city: 'Zhoushan, Zhejiang', text: 'The largest seafood night market harbor in Asia facing the ocean.', pin: 'p1', coords: { left: '85%', top: '42%' }, photo: './assets/images/Coastal Seafood1.jpg' },
      { name: 'Shipu Fishing Town', city: 'Xiangshan, Zhejiang', text: 'Cobblestone seafood streets overlooking bustling fishing fleets.', pin: 'p2', coords: { left: '79%', top: '56%' }, photo: './assets/images/Coastal Seafood2.jpg' },
      { name: 'Shengsi Islands', city: 'Zhoushan, Zhejiang', text: 'Mussel farm archipelago bathed in azure blue waves and sea breezes.', pin: 'p3', coords: { left: '88%', top: '26%' }, photo: './assets/images/Coastal Seafood3.jpg' },
      { name: 'Dongtou Island Harbor', city: 'Wenzhou, Zhejiang', text: 'Colorful coastal fishing village with fresh ocean harvest and island seafood stalls.', pin: 'p4', coords: { left: '72%', top: '82%' }, photo: './assets/images/Coastal Seafood4.jpeg' }
    ]
  },
  {
    id: 'nature-retreat',
    name: 'Nature Sceneries',
    elements: ['mountain', 'lake'],
    strictMatch: (set) => set.size === 2 && set.has('mountain') && set.has('lake'),
    comboSvg: 'assets/nature.svg',
    desc: 'Where emerald peaks reflect across crystal water surfaces, inspiring poets like Su Dongpo and Bai Juyi to compose eternal Jiangnan landscape verses.',
    highlightPlace: 'Qiandao Lake & Hills',
    color: '#458578',
    colorLight: 'rgba(69, 133, 120, 0.07)',
    colorBorder: 'rgba(69, 133, 120, 0.38)',
    places: [
      { name: 'Qiandao Lake', city: 'Chun’an, Zhejiang', text: 'Over a thousand emerald islands scattered across sparkling blue waters.', pin: 'p1', coords: { left: '26%', top: '48%' }, photo: './assets/images/Nature Sceneries1.jpg' },
      { name: 'Xianju Shenxianju', city: 'Taizhou, Zhejiang', text: 'Soaring cliff pinnacles rising above misty cloud forests and suspension bridges.', pin: 'p2', coords: { left: '62%', top: '66%' }, photo: './assets/images/Nature Sceneries2.jpg' },
      { name: 'Yandang Mountain Lakes', city: 'Wenzhou, Zhejiang', text: 'Spectacular volcanic peaks, hanging temples and crystal mountain pools.', pin: 'p3', coords: { left: '68%', top: '78%' }, photo: './assets/images/Nature Sceneries3.jpg' },
      { name: 'Nanxi River Valley', city: 'Wenzhou, Zhejiang', text: 'Pristine emerald river winding between ancient cobblestone villages and sheer gorges.', pin: 'p4', coords: { left: '58%', top: '78%' }, photo: './assets/images/Nature Sceneries4.jpg' }
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
    color: '#7a6678',
    colorLight: 'rgba(122, 102, 120, 0.07)',
    colorBorder: 'rgba(122, 102, 120, 0.38)',
    places: [
      { name: 'Nanxun Jiaye Garden', city: 'Huzhou, Zhejiang', text: 'Harmonious blend of traditional courtyard mansions and Western-style villas.', pin: 'p1', coords: { left: '49%', top: '22%' }, photo: './assets/images/water village4.jpg' },
      { name: 'Wuzhen West Gate', city: 'Jiaxing, Zhejiang', text: 'Preserved water town residences with wood carvings and stone docks.', pin: 'p2', coords: { left: '57%', top: '29%' }, photo: './assets/images/water village3.jpg' },
      { name: 'Shaoxing Lu Xun Native Place', city: 'Shaoxing, Zhejiang', text: 'Traditional black-tiled Jiangnan manor houses beside stone waterways.', pin: 'p3', coords: { left: '56%', top: '45%' }, photo: './assets/images/Canal and Stone Bridges1.jpg' },
      { name: 'Ningbo Tianyi Pavilion', city: 'Ningbo, Zhejiang', text: 'China’s oldest existing private library with classical rockeries and tranquil ponds.', pin: 'p4', coords: { left: '74%', top: '43%' }, photo: './assets/images/Mountain Village and Dwellings1.jpg' }
    ]
  }
];

export const SINGLE_ELEMENT_THEMES: Record<string, ExploreTheme> = {
  lake: {
    id: 'element-lake',
    name: 'Lakes & Water',
    elements: ['lake'],
    comboSvg: 'assets/lake.svg',
    desc: 'Centuries of poetic Jiangnan waterscapes, willow-lined embankments, and tranquil lotus lagoons that inspired legendary verse and timeless romance.',
    highlightPlace: 'West Lake (Hangzhou)',
    color: '#508298',
    colorLight: 'rgba(80, 130, 152, 0.07)',
    colorBorder: 'rgba(80, 130, 152, 0.38)',
    places: [
      { name: 'West Lake Ruan Gong Dun', city: 'Hangzhou, Zhejiang', text: 'Gentle ripples, willow shores, and evening reflections of the Three Pools Mirroring the Moon.', pin: 'p1', coords: { left: '48%', top: '38%' }, photo: './assets/images/Nature Sceneries1.jpg' },
      { name: 'East Lake (Donghu)', city: 'Shaoxing, Zhejiang', text: 'Sheer quarried cliff walls rising directly out of tranquil emerald waters.', pin: 'p2', coords: { left: '58%', top: '46%' }, photo: './assets/images/Nature Sceneries2.jpg' },
      { name: 'Nanhu Lake', city: 'Jiaxing, Zhejiang', text: 'Historic misty island pavilion surrounded by serene Jiangnan lotus waterways.', pin: 'p3', coords: { left: '62%', top: '28%' }, photo: './assets/images/Nature Sceneries3.jpg' },
      { name: 'Xianghu Lake', city: 'Xiaoshan, Zhejiang', text: 'Cradle of ancient Kuahuqiao canoe culture nestled beside rolling green hills.', pin: 'p4', coords: { left: '52%', top: '40%' }, photo: './assets/images/Nature Sceneries4.jpg' }
    ]
  },
  bridge: {
    id: 'element-bridge',
    name: 'Ancient Stone Bridges',
    elements: ['bridge'],
    comboSvg: 'assets/bridge.svg',
    desc: 'Arched moon bridges and stone trestles that have connected riverfront communities across Zhejiang waterways for centuries, carrying deep architectural memories.',
    highlightPlace: 'Bazi Bridge (Shaoxing)',
    color: '#607380',
    colorLight: 'rgba(96, 115, 128, 0.07)',
    colorBorder: 'rgba(96, 115, 128, 0.38)',
    places: [
      { name: 'Bazi Ancient Flyover Bridge', city: 'Shaoxing, Zhejiang', text: 'One of the earliest preserved urban bridge hubs dating back to the Song Dynasty.', pin: 'p1', coords: { left: '55%', top: '45%' }, photo: './assets/images/Canal and Stone Bridges1.jpg' },
      { name: 'Gongchen Bridge', city: 'Hangzhou, Zhejiang', text: 'The towering landmark triple-arch stone bridge marking the southern end of the Grand Canal.', pin: 'p2', coords: { left: '47%', top: '34%' }, photo: './assets/images/Canal and Stone Bridges2.jpg' },
      { name: 'Taishun Covered Bridges', city: 'Wenzhou, Zhejiang', text: 'Masterpieces of ancient mortise-and-tenon wooden arch bridges spanning mountain streams.', pin: 'p3', coords: { left: '52%', top: '86%' }, photo: './assets/images/Canal and Stone Bridges4.jpg' },
      { name: 'Wuzhen Tongji Bridge', city: 'Tongxiang, Zhejiang', text: 'Famous Bridge-in-Bridge twin water landmark where two canals intersect.', pin: 'p4', coords: { left: '57%', top: '29%' }, photo: './assets/images/Canal and Stone Bridges3.jpg' }
    ]
  },
  tea: {
    id: 'element-tea',
    name: 'Longjing Tea Heritage',
    elements: ['tea'],
    comboSvg: 'assets/tea.svg',
    desc: 'The aroma of hand-roasted flat green Dragon Well tea leaves and Zen tea ceremonies nurtured by morning mountain mists and ancient springs.',
    highlightPlace: 'Dragon Well (Longjing)',
    color: '#58855e',
    colorLight: 'rgba(88, 133, 94, 0.07)',
    colorBorder: 'rgba(88, 133, 94, 0.38)',
    places: [
      { name: 'Longjing Village & Springs', city: 'Hangzhou, Zhejiang', text: 'The sacred heartland of Dragon Well tea culture surrounded by green terraced hills.', pin: 'p1', coords: { left: '49%', top: '39%' }, photo: './assets/images/tea picking in hills2.jpg' },
      { name: 'Jingshan Zen Tea Plantation', city: 'Yuhang, Zhejiang', text: 'The birthplace of classic Song Dynasty tea-whisking ceremonies.', pin: 'p2', coords: { left: '42%', top: '33%' }, photo: './assets/images/tea picking in hills1.jpg' },
      { name: 'Songyang Historic Tea Market', city: 'Lishui, Zhejiang', text: 'One of the largest green tea trading centers nestled amidst idyllic southern Zhejiang hills.', pin: 'p3', coords: { left: '39%', top: '75%' }, photo: './assets/images/tea picking in hills3.jpg' },
      { name: 'Meijiawu Ancient Tea Trails', city: 'Hangzhou, Zhejiang', text: 'Lush village teahouses nestled along winding stone mountain paths.', pin: 'p4', coords: { left: '46%', top: '41%' }, photo: './assets/images/tea picking in hills4.jpg' }
    ]
  },
  rice: {
    id: 'element-rice',
    name: 'Jiangnan Harvest & Food',
    elements: ['rice'],
    comboSvg: 'assets/rice.svg',
    desc: 'The fertile water country’s bountiful agricultural soul—from golden autumn paddy fields and sweet glutinous rice cakes to fragrant Shaoxing yellow rice wine.',
    highlightPlace: 'Yunhe Terraces',
    color: '#af7742',
    colorLight: 'rgba(175, 119, 66, 0.07)',
    colorBorder: 'rgba(175, 119, 66, 0.38)',
    places: [
      { name: 'Yunhe Rice Terraces', city: 'Lishui, Zhejiang', text: 'Spectacular thousand-year-old terraced paddy fields sculpted across mist-kissed hills.', pin: 'p1', coords: { left: '36%', top: '80%' }, photo: './assets/images/Local Farm and Harvest Food1.png' },
      { name: 'Shaoxing Rice Wine Heritage Museum', city: 'Shaoxing, Zhejiang', text: 'Centuries-old brewing workshops producing fragrant amber rice wine.', pin: 'p2', coords: { left: '57%', top: '44%' }, photo: './assets/images/Local Farm and Harvest Food2.jpg' },
      { name: 'Jiashan Paddy Heritage Park', city: 'Jiaxing, Zhejiang', text: 'Vast agricultural heartland renowned for high-yield sweet water rice and harvest culture.', pin: 'p3', coords: { left: '66%', top: '25%' }, photo: './assets/images/Local Farm and Harvest Food3.jpg' },
      { name: 'Nanxun Rice Cake & Pastry Street', city: 'Huzhou, Zhejiang', text: 'Artisan rice cake makers steaming traditional Dingsheng sweet cakes.', pin: 'p4', coords: { left: '49%', top: '23%' }, photo: './assets/images/Local Farm and Harvest Food4.png' }
    ]
  },
  mountain: {
    id: 'element-mountain',
    name: 'Zhejiang Mountains & Peaks',
    elements: ['mountain'],
    comboSvg: 'assets/mountain.svg',
    desc: 'Rugged granitic peaks, sea-of-clouds canyons, and verdant bamboo-forested slopes that define Zhejiang’s dramatic inland landscapes.',
    highlightPlace: 'Yandang Mountain',
    color: '#507663',
    colorLight: 'rgba(80, 118, 99, 0.07)',
    colorBorder: 'rgba(80, 118, 99, 0.38)',
    places: [
      { name: 'Yandang Mountain Peaks', city: 'Wenzhou, Zhejiang', text: 'Spectacular coastal volcanic pinnacles famous for hanging temples and sheer cliffs.', pin: 'p1', coords: { left: '69%', top: '79%' }, photo: './assets/images/Mountain Village and Dwellings1.jpg' },
      { name: 'Moganshan Bamboo Mountain', city: 'Huzhou, Zhejiang', text: 'Misty bamboo ridges renowned since the early 1900s as a tranquil mountain sanctuary.', pin: 'p2', coords: { left: '44%', top: '27%' }, photo: './assets/images/Mountain Village and Dwellings2.jpg' },
      { name: 'Tiantai Mountain Canyons', city: 'Taizhou, Zhejiang', text: 'Spiritual mountain ridges with cascading waterfalls and ancient stone bridges.', pin: 'p3', coords: { left: '67%', top: '61%' }, photo: './assets/images/Mountain Village and Dwellings3.png' },
      { name: 'Xianju Shenxianju Cliffs', city: 'Taizhou, Zhejiang', text: 'Dramatic limestone needles rising like fairy towers through sea-of-clouds.', pin: 'p4', coords: { left: '61%', top: '67%' }, photo: './assets/images/Mountain Village and Dwellings4.png' }
    ]
  },
  building: {
    id: 'element-building',
    name: 'Jiangnan Traditional Architecture',
    elements: ['building'],
    comboSvg: 'assets/building.svg',
    desc: 'Horse-head firewall courtyards, grey slate roofs, delicate wooden lattice screens, and riverfront pavilions showcasing refined Jiangnan vernacular building art.',
    highlightPlace: 'Nanxun Ancient Residences',
    color: '#77636e',
    colorLight: 'rgba(119, 99, 110, 0.07)',
    colorBorder: 'rgba(119, 99, 110, 0.38)',
    places: [
      { name: 'Nanxun Zhang Shiming Mansion', city: 'Huzhou, Zhejiang', text: 'Exquisite merchant compound marrying traditional wood carvings with French glasswork.', pin: 'p1', coords: { left: '49%', top: '22%' }, photo: './assets/images/Mountain Village and Dwellings1.jpg' },
      { name: 'Shaoxing Lu Xun Native Place', city: 'Shaoxing, Zhejiang', text: 'Classic water town residential courtyard featuring stone courtyards and study pavilions.', pin: 'p2', coords: { left: '56%', top: '45%' }, photo: './assets/images/water village3.jpg' },
      { name: 'Wuzhen Ancient Water Pavilion Residences', city: 'Jiaxing, Zhejiang', text: 'Pillared water-side stilt residences constructed right over the flowing waterways.', pin: 'p3', coords: { left: '57%', top: '29%' }, photo: './assets/images/water village4.jpg' },
      { name: 'Ningbo Baoguo Temple', city: 'Ningbo, Zhejiang', text: 'Rare Northern Song Dynasty timber structure with elaborate dougong bracket architecture.', pin: 'p4', coords: { left: '73%', top: '40%' }, photo: './assets/images/Canal and Stone Bridges1.jpg' }
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
  color: '#6ba2d7',
  colorLight: 'rgba(107, 162, 215, 0.07)',
  colorBorder: 'rgba(107, 162, 215, 0.38)',
  places: [
    { name: 'West Lake Landscape', city: 'Hangzhou, Zhejiang', text: 'A UNESCO World Heritage cultural landscape blending lakes, hills, pagodas, and tea gardens.', pin: 'p1', coords: { left: '48%', top: '38%' }, photo: './assets/images/No exact combination match found.png' },
    { name: 'Shaoxing Ancient City', city: 'Shaoxing, Zhejiang', text: 'An enchanting network of water lanes, calligraphy gardens, and stone bridges.', pin: 'p2', coords: { left: '56%', top: '44%' }, photo: './assets/images/No exact combination match found.png' },
    { name: 'Songyang Ancient Villages', city: 'Lishui, Zhejiang', text: 'Picturesque mountain settlements preserving centuries of living rural tradition.', pin: 'p3', coords: { left: '36%', top: '75%' }, photo: './assets/images/No exact combination match found.png' },
    { name: 'Wuzhen Water Canal', city: 'Tongxiang, Zhejiang', text: 'Serene stone bridges and lantern-lit waterfront homes along historical waterways.', pin: 'p4', coords: { left: '56%', top: '28%' }, photo: './assets/images/No exact combination match found.png' }
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

function generateSmoothRoutePath(points: { x: number; y: number }[]): string {
  if (points.length <= 1) return '';
  if (points.length === 2) {
    const p1 = points[0];
    const p2 = points[1];
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;
    const offset = (p2.x - p1.x) > 0 ? -30 : 30;
    return `M ${p1.x} ${p1.y} Q ${mx + offset} ${my} ${p2.x} ${p2.y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const tension = 0.35;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return path;
}

export interface ExplorePageProps {
  onNavigateJourney?: () => void;
  onSavePlanToJourney?: (plan: SavedPlan) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  onNavigateJourney,
  onSavePlanToJourney
}) => {
  const [currentView, setCurrentView] = useState<'compose' | 'searching' | 'reveal' | 'detail'>('compose');
  const [pieces, setPieces] = useState<PieceItem[]>(INITIAL_PIECES);
  const [placedItems, setPlacedItems] = useState<{ src: string; alt: string; leftPercent: number; topPercent: number; width: number; height: number }[]>([]);
  const [currentTheme, setCurrentTheme] = useState<ExploreTheme>(COMBO_THEMES[0]);
  const [activePin, setActivePin] = useState<string>('p1');
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>(['p1']);
  const [isPhotoIn, setIsPhotoIn] = useState(false);
  const [isGlidingToDetail, setIsGlidingToDetail] = useState(false);
  const [isRevealCopyShow, setIsRevealCopyShow] = useState(false);

  // Route Generator State
  const [routeStage, setRouteStage] = useState<'idle' | 'generating' | 'saved'>('idle');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [routeFavorites, setRouteFavorites] = useState<Record<string, boolean>>({});

  const routeSavedHeaderRef = useRef<HTMLDivElement>(null);
  const routeSectionRef = useRef<HTMLDivElement>(null);

  const toggleSelectPlace = (pin: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPlaces((prev) =>
      prev.includes(pin) ? prev.filter((p) => p !== pin) : [...prev, pin]
    );
  };

  const handleGenerateRoute = () => {
    // Ensure at least 1 place is selected
    if (selectedPlaces.length === 0 && currentTheme.places.length > 0) {
      setSelectedPlaces(currentTheme.places.map((p) => p.pin));
    }
    setRouteStage('generating');

    // Smooth scroll to route section
    setTimeout(() => {
      routeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    // After solid line drawing animation completes (3.8s)
    setTimeout(() => {
      setRouteStage('saved');
      setTimeout(() => {
        routeSavedHeaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 250);
    }, 3800);
  };

  const handleViewInJourney = () => {
    const sortedPlaces = currentTheme.places
      .filter((p) => selectedPlaces.includes(p.pin))
      .sort((a, b) => {
        const topA = parseFloat((a.coords?.top || '50%').replace('%', ''));
        const topB = parseFloat((b.coords?.top || '50%').replace('%', ''));
        return topB - topA;
      });

    const finalPlaces = sortedPlaces.length > 0 ? sortedPlaces : currentTheme.places;

    const newPlan: SavedPlan = {
      id: `plan-${Date.now()}`,
      title: `${currentTheme.name} Route`,
      themeId: currentTheme.id,
      themeColor: currentTheme.color || '#5b8a99',
      themeSvg: currentTheme.comboSvg,
      description: currentTheme.desc,
      places: finalPlaces.map((p) => ({
        id: `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        name: p.name,
        city: p.city,
        text: p.text,
        pin: p.pin,
        coords: p.coords,
        photo: p.photo,
        isFavorite: routeFavorites[p.name] ?? true
      })),
      createdAt: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
    };

    onSavePlanToJourney?.(newPlan);
    onNavigateJourney?.();
  };

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
      setIsGlidingToDetail(false);
      setIsRevealCopyShow(false);
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Step 1: Softly reveal the stage background & preserve original placed layout
      setTimeout(() => setIsPhotoIn(true), 350);

      // Step 2: Reveal the description and place links while user elements remain in place
      setTimeout(() => setIsRevealCopyShow(true), 1200);
    }, 2400);
  };

  const navigateToDetail = () => {
    if (currentTheme.isUnmatched || isGlidingToDetail) return;
    
    // Start transition: animate elements gliding and converging towards detail position
    setIsGlidingToDetail(true);
    setIsRevealCopyShow(false);

    setTimeout(() => {
      setCurrentView('detail');
      setIsGlidingToDetail(false);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 650);
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
          width: 100%;
        }
        .transition-stage {
          height: 600px;
          position: relative;
          overflow: hidden;
          background: var(--paper);
          cursor: pointer;
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          border-radius: 0;
        }
        .photo-stage {
          position: absolute;
          inset: -15px;
          background: url('assets/village-photo.png') center/cover no-repeat;
          opacity: 0;
          filter: blur(3.5px) brightness(0.98);
          transform: scale(1.03);
          transition: opacity 1.5s cubic-bezier(.4, 0, .2, 1), filter 0.85s cubic-bezier(.4, 0, .2, 1), transform 0.85s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .transition-stage.photo-in .photo-stage {
          opacity: 1;
        }
        .photo-stage:after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(250, 248, 241, 0.02) 0%,
            rgba(250, 248, 241, 0.08) 45%,
            rgba(250, 248, 241, 0.42) 75%,
            rgba(250, 248, 241, 0.85) 92%,
            rgba(250, 248, 241, 1) 100%
          );
          pointer-events: none;
          transition: background 0.75s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.75s ease;
        }
        .reveal.gliding-to-detail .photo-stage:after {
          background: linear-gradient(
            to bottom,
            rgba(250, 248, 241, 0.65) 0%,
            rgba(250, 248, 241, 0.82) 100%
          );
        }
        .reveal.gliding-to-detail .photo-stage {
          filter: blur(2px) brightness(1.01);
          transform: scale(1.0);
        }
        .kept-composition {
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
        }
        .kept-composition .placed-item {
          position: absolute;
          object-fit: contain;
          display: block;
          transition: left 0.65s cubic-bezier(0.25, 1, 0.5, 1),
                      top 0.65s cubic-bezier(0.25, 1, 0.5, 1),
                      transform 0.65s cubic-bezier(0.25, 1, 0.5, 1),
                      opacity 0.55s ease;
          will-change: left, top, transform, opacity;
        }
        .reveal.gliding-to-detail .kept-composition .placed-item {
          left: 23% !important;
          top: 50% !important;
          transform: translate(-50%, -50%) scale(0.35) rotate(12deg) !important;
          opacity: 0 !important;
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
        .reveal.gliding-to-detail .reveal-copy {
          opacity: 0 !important;
          transform: translateY(18px) !important;
          transition: opacity 0.35s ease, transform 0.35s ease !important;
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
          margin-top: 18px;
          border: 0;
          background: var(--pink);
          color: var(--ink);
          font: 400 23px 'Kaisei Decol', serif;
          padding: 10px 34px;
          cursor: pointer;
          border-radius: 4px;
          transition: background .2s, color .2s, transform .2s;
        }
        .reveal-back-btn:hover {
          background: #b88978;
          color: white;
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
        .detail.active .feature-combo {
          animation: detailComboEntrance 0.75s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .detail.active .feature-copy {
          animation: detailCopyEntrance 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
        }
        .detail.active .places {
          animation: detailPlacesEntrance 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
        }
        @keyframes detailComboEntrance {
          0% {
            opacity: 0;
            transform: translateY(-50%) scale(0.72) rotate(-8deg);
            filter: blur(4px) drop-shadow(0 8px 16px rgba(0, 0, 0, 0.08));
          }
          100% {
            opacity: 1;
            transform: translateY(-50%) scale(1) rotate(0deg);
            filter: blur(0px) drop-shadow(0 14px 30px rgba(0, 0, 0, 0.12));
          }
        }
        @keyframes detailFeatureBg {
          0% {
            opacity: 0.85;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes detailCopyFadeUp {
          0% {
            opacity: 0;
            transform: translateY(18px);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        @keyframes detailComboIn {
          0% {
            opacity: 0;
            transform: translateY(-50%) scale(0.92);
          }
          100% {
            opacity: 1;
            transform: translateY(-50%) scale(1);
          }
        }
        @keyframes detailPlacesEntrance {
          0% {
            opacity: 0;
            transform: translateY(32px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .feature {
          height: 605px;
          position: relative;
          background: linear-gradient(rgba(250,248,241,.65),rgba(250,248,241,.8)), url('assets/village-photo.png') center/cover;
          animation: detailFeatureBg 0.8s cubic-bezier(0.25, 1, 0.5, 1) both;
        }
        .feature-combo {
          position: absolute;
          width: 310px;
          height: 310px;
          object-fit: contain;
          left: 15%;
          top: 50%;
          transform: translateY(-50%);
          animation: detailComboIn 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both;
        }
        .feature-copy {
          position: absolute;
          left: 50%;
          top: 185px;
          max-width: 480px;
        }
        .feature-copy h1 {
          font: 400 58px 'Kaisei Decol', serif;
          margin: 0 0 15px;
          color: var(--ink);
          animation: detailCopyFadeUp 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.18s both;
        }
        .feature-copy p {
          color: #242424;
          font-size: 15px;
          line-height: 1.45;
          animation: detailCopyFadeUp 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.38s both;
        }
        .places {
          max-width: 1140px;
          margin: 95px auto 0;
          display: grid;
          grid-template-columns: 420px 1fr;
          gap: 60px;
          align-items: flex-start;
        }
        .place-panel {
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(89, 97, 103, 0.16);
          border-radius: 12px;
          padding: 16px 14px 16px;
        }
        .place-cards-container {
          max-height: 480px;
          overflow-y: auto;
          scrollbar-gutter: stable;
          padding-right: 6px;
          scrollbar-width: thin;
          scrollbar-color: #d6cdc8 transparent;
          -webkit-overflow-scrolling: touch;
        }
        .place-cards-container::-webkit-scrollbar {
          width: 5px;
        }
        .place-cards-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .place-cards-container::-webkit-scrollbar-thumb {
          background: #d6cdc8;
          border-radius: 4px;
        }
        .place-cards-container::-webkit-scrollbar-thumb:hover {
          background: #bfaea8;
        }
        .place-item-card {
          background: #ffffff;
          border: 1px solid rgba(89, 97, 103, 0.14);
          border-radius: 8px;
          padding: 14px 16px;
          margin-bottom: 12px;
          box-sizing: border-box;
          width: 100%;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .place-item-card:hover {
          border-color: #d6beb4;
        }
        .place-item-card.selected {
          border-color: #d6beb4;
          background: #fdfaf8;
          box-shadow: none;
        }
        .place-item-card.active {
          border-color: rgba(214, 190, 180, 0.7);
          background: #fdfaf8;
          box-shadow: none;
        }
        .place-item-card.selected.active {
          border-color: #c2a79e;
          background: #faf4f1;
          box-shadow: none;
        }
        .place-item-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }
        .place-item-title-group {
          flex: 1;
          min-width: 0;
        }
        .place-item-header h2 {
          font: 400 24px 'Kaisei Decol', serif;
          margin: 0;
          color: var(--ink);
          line-height: 1.25;
        }
        .place-item-city {
          font-size: 13px;
          color: #8c9399;
          font-family: Jura, sans-serif;
          margin: 4px 0 0;
        }
        .place-item-snippet {
          font-size: 13px;
          color: #8c9399;
          font-family: Jura, sans-serif;
          margin: 4px 0 0;
          line-height: 1.4;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .place-item-add-btn {
          border: 0;
          background: transparent;
          color: var(--theme-color, #c2a79e);
          width: 28px;
          height: 28px;
          padding: 0;
          cursor: pointer;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, color 0.2s, filter 0.2s;
        }
        .place-item-add-btn:hover {
          transform: scale(1.2);
          filter: brightness(0.8);
        }
        .place-item-card.selected .place-item-add-btn {
          color: var(--theme-color, #b07e70);
        }
        .place-item-card.selected .place-item-add-btn:hover {
          filter: brightness(0.75);
          transform: scale(1.2);
        }
        .place-item-add-btn svg {
          display: block;
        }
        .place-item-body {
          display: none;
          margin-top: 14px;
          padding-top: 10px;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }
        .place-item-card.active .place-item-body {
          display: block;
        }
        .place-item-desc {
          font-size: 13.5px;
          line-height: 1.55;
          color: #333333;
          font-family: Jura, sans-serif;
          margin: 0 0 14px;
        }
        .place-item-photo {
          width: 100%;
          height: 185px;
          object-fit: cover;
          border-radius: 6px;
          display: block;
        }
        .generate-route-btn {
          width: 100%;
          margin-top: 14px;
          background: var(--pink, #d6beb4);
          border: 0;
          border-radius: 6px;
          color: var(--ink, #596167);
          font: 400 17px 'Kaisei Decol', serif;
          letter-spacing: 0.02em;
          padding: 11px 20px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, transform 0.2s;
          box-shadow: none;
        }
        .generate-route-btn:hover {
          background: #b88978;
          color: #ffffff;
          transform: translateY(-1px);
          box-shadow: none;
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
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translate(-50%, -50%);
          transition: left 0.6s cubic-bezier(0.2, 0.8, 0.2, 1),
                      top 0.6s cubic-bezier(0.2, 0.8, 0.2, 1),
                      transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
          z-index: 5;
        }
        .pin::before {
          content: '';
          display: block;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #8e8381;
          box-shadow: none;
          transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .pin.selected::before {
          width: 20px;
          height: 20px;
          border-radius: 5px;
          transform: rotate(45deg);
          background: var(--theme-color, #5b8a99);
        }
        .pin:hover {
          transform: translate(-50%, -50%) scale(1.15);
        }
        .pin:hover::before {
          background: var(--theme-color, #766b69);
        }
        .pin.selected:hover::before {
          background: var(--theme-color, #5b8a99);
        }
        .pin.active {
          z-index: 10;
          transform: translate(-50%, -50%) scale(1.22);
        }
        .pin.active::before {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          transform: rotate(45deg);
          background: var(--theme-color, #6ba2d7);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        }

        /* Route Generation & Saved View Styles */
        .route-stage-container {
          width: 100%;
          max-width: 820px;
          margin: 40px auto 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .route-map-wrapper {
          position: relative;
          width: 100%;
          max-width: 680px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }
        .route-map-wrapper img {
          width: 100%;
          height: auto;
          display: block;
          user-select: none;
          pointer-events: none;
        }
        .route-svg-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 12;
        }
        .route-solid-path {
          stroke-dasharray: 2600;
          stroke-dashoffset: 2600;
          animation: drawSolidRoute 3.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes drawSolidRoute {
          from {
            stroke-dashoffset: 2600;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .pin.route-numbered-pin {
          position: absolute;
          width: 36px;
          height: 36px;
          padding: 0;
          border: 0;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translate(-50%, -50%);
          z-index: 15;
          pointer-events: auto;
        }
        .pin.route-numbered-pin::before {
          content: '';
          display: block;
          width: 30px;
          height: 30px;
          border-radius: 9px;
          transform: rotate(45deg);
          background: var(--theme-color, #5b8a99);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
          transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .pin.route-numbered-pin .pin-num-text {
          position: absolute;
          font: 600 12.5px 'Jura', sans-serif;
          color: #ffffff;
          line-height: 1;
          z-index: 2;
          pointer-events: none;
        }
        .pin.route-numbered-pin:hover {
          transform: translate(-50%, -50%) scale(1.15);
        }
        .route-saved-headline {
          font: 400 clamp(42px, 5.2vw, 64px) 'Kaisei Decol', serif;
          color: var(--ink, #3c444a);
          text-align: center;
          margin: 18px 0 28px;
          letter-spacing: -0.01em;
        }
        .route-plan-outer-card {
          width: 100%;
          max-width: 580px;
          background: #ffffff;
          border: 1px solid #ebe5dc;
          border-radius: 14px;
          padding: 24px 22px 20px;
          margin-bottom: 32px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
        }
        .route-plan-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
          padding-left: 2px;
        }
        .route-plan-theme-icon {
          height: 48px;
          width: auto;
          object-fit: contain;
        }
        .route-plan-theme-title {
          font: 400 26px 'Kaisei Decol', serif;
          color: var(--ink, #3c444a);
          margin: 0;
          letter-spacing: -0.01em;
        }
        .route-plan-inner-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .route-plan-inner-card {
          background: #ffffff;
          border: 1px solid #ebe5dc;
          border-radius: 8px;
          padding: 13px 18px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.015);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .route-plan-inner-card:hover {
          border-color: #ded6cc;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
        }
        .route-plan-place-title {
          font: 400 21px 'Kaisei Decol', serif;
          color: var(--ink, #3c444a);
          margin: 0;
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .route-plan-place-city {
          font: 400 13.5px 'Jura', sans-serif;
          color: #9fa5aa;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .route-actions-group {
          width: 100%;
          max-width: 580px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          margin-bottom: 24px;
        }
        .route-action-btn-light {
          display: inline-block;
          width: 260px;
          border: 1px solid #dcd4c9;
          background: #fdfcfb;
          font: 400 15px 'Kaisei Decol', serif;
          color: var(--ink, #596167);
          padding: 7px 20px;
          cursor: pointer;
          border-radius: 4px;
          transition: background .2s, color .2s, border-color .2s, transform .2s;
          text-align: center;
          line-height: 1.4;
        }
        .route-action-btn-light:hover {
          background: #f4eee7;
          border-color: #baa996;
          transform: translateY(-1px);
        }
        .route-action-btn {
          display: inline-block;
          width: 260px;
          border: 0;
          background: var(--pink, #d6beb4);
          font: 400 15px 'Kaisei Decol', serif;
          color: var(--ink, #596167);
          padding: 7px 20px;
          cursor: pointer;
          border-radius: 4px;
          transition: background .2s, color .2s, transform .2s;
          text-align: center;
          line-height: 1.4;
        }
        .route-action-btn:hover {
          background: #b88978;
          color: #ffffff;
          transform: translateY(-1px);
        }

        .more {
          text-align: center;
          margin-top: 150px;
        }
        .more h2 {
          font: 400 44px 'Kaisei Decol', serif;
          color: var(--ink);
          margin-bottom: 12px;
        }
        .more p {
          color: var(--ink);
          margin-bottom: 36px;
        }
        .back {
          display: inline-block;
          margin-top: 10px;
          border: 0;
          background: var(--pink);
          font: 400 24px 'Kaisei Decol', serif;
          color: var(--ink);
          padding: 8px 48px;
          cursor: pointer;
          border-radius: 4px;
          transition: background .2s, color .2s, transform .2s;
        }
        .back:hover {
          background: #b88978;
          color: white;
          transform: translateY(-1px);
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
          isGlidingToDetail ? 'gliding-to-detail' : ''
        } ${currentTheme.isUnmatched ? 'unmatched-view' : ''}`}
        id="reveal"
      >
        <div
          className={`transition-stage ${isPhotoIn ? 'photo-in' : ''}`}
          id="transitionStage"
          onClick={navigateToDetail}
        >
          <div
            className="photo-stage"
            id="revealPhotoStage"
            style={{
              backgroundImage: currentTheme.places[0]?.photo ? `url('${encodeURI(currentTheme.places[0].photo)}')` : undefined
            }}
          ></div>
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
                className="primary reveal-back-btn"
                id="revealBackBtn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPhotoIn(false);
                  setIsGlidingToDetail(false);
                  setIsRevealCopyShow(false);
                  setCurrentView('compose');
                }}
              >
                BACK
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 4. Detail Screen */}
      <section
        className={`view detail ${currentView === 'detail' ? 'active' : ''}`}
        id="detail"
        style={{
          '--theme-color': currentTheme.color || '#5b8a99',
          '--theme-color-light': currentTheme.colorLight || 'rgba(91, 138, 153, 0.07)',
          '--theme-color-border': currentTheme.colorBorder || 'rgba(91, 138, 153, 0.38)'
        } as React.CSSProperties}
      >
        {routeStage === 'idle' && (
          <div
            className="feature"
            id="detailFeature"
            style={{
              backgroundImage: currentTheme.places[0]?.photo
                ? `linear-gradient(rgba(250,248,241,.65),rgba(250,248,241,.8)), url('${encodeURI(currentTheme.places[0].photo)}')`
                : undefined
            }}
          >
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
        )}

        {routeStage === 'idle' ? (
          <div className="places">
            <div className="place-panel">
              <div className="place-cards-container" id="placeCardsContainer">
                {currentTheme.places.map((p) => {
                  const isActive = activePin === p.pin;
                  const isSelected = selectedPlaces.includes(p.pin);
                  return (
                    <div
                      key={p.name}
                      className={`place-item-card ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
                      data-pin={p.pin}
                      onClick={() => setActivePin(isActive ? '' : p.pin)}
                    >
                      <div className="place-item-header">
                        <div className="place-item-title-group">
                          <h2>{p.name}</h2>
                          {isActive ? (
                            <div className="place-item-city">{p.city}</div>
                          ) : (
                            <div className="place-item-snippet">{p.text}</div>
                          )}
                        </div>
                        <button
                          type="button"
                          className="place-item-add-btn"
                          aria-label={isSelected ? `Remove ${p.name} from list` : `Add ${p.name} to list`}
                          onClick={(e) => toggleSelectPlace(p.pin, e)}
                          title={isSelected ? 'Remove from list' : 'Add to list'}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="22"
                            height="22"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="4" y1="12" x2="20" y2="12" />
                            {!isSelected && <line x1="12" y1="4" x2="12" y2="20" />}
                          </svg>
                        </button>
                      </div>
                      <div className="place-item-body">
                        <p className="place-item-desc">{p.text}</p>
                        <img
                          className="place-item-photo"
                          src={encodeURI(p.photo || 'assets/village-photo.png')}
                          alt={p.name}
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            if (!target.src.includes('water%20village1.jpg') && !target.src.includes('village-photo.png')) {
                              target.src = './assets/images/water%20village1.jpg';
                            } else {
                              target.src = 'assets/village-photo.png';
                            }
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                className="generate-route-btn"
                id="generateRouteBtn"
                onClick={handleGenerateRoute}
              >
                Generate the Route
              </button>
            </div>

            <div className="map-wrap">
              <img src="assets/zhejiang mapp.svg" alt="Map of Zhejiang" />
              {currentTheme.places.map((place, idx) => {
                const pinId = place.pin || (`p${idx + 1}`);
                const isSelected = selectedPlaces.includes(pinId as 'p1' | 'p2' | 'p3' | 'p4');
                const coords = place.coords || (
                  pinId === 'p1' ? { left: '48%', top: '38%' } :
                  pinId === 'p2' ? { left: '56%', top: '48%' } :
                  pinId === 'p3' ? { left: '60%', top: '65%' } :
                  { left: '42%', top: '74%' }
                );
                return (
                  <button
                    key={pinId}
                    className={`pin ${pinId} ${activePin === pinId ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
                    data-pin={pinId}
                    style={{ left: coords.left, top: coords.top }}
                    aria-label={place.name}
                    onClick={() => setActivePin(activePin === pinId ? '' : pinId)}
                  ></button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Route Generating & Plan Saved View */
          <div className="route-stage-container" ref={routeSectionRef}>
            {/* Centered Map with animated Route Line connecting points from bottom to top */}
            <div className="route-map-wrapper">
              <img src="assets/zhejiang mapp.svg" alt="Map of Zhejiang" />
              
              {/* Dynamic SVG Route Line Overlay (Thick solid line drawn continuously, bit by bit) */}
              {(() => {
                const filteredPlaces = currentTheme.places
                  .filter((p) => selectedPlaces.includes(p.pin))
                  .sort((a, b) => {
                    const topA = parseFloat((a.coords?.top || '50%').replace('%', ''));
                    const topB = parseFloat((b.coords?.top || '50%').replace('%', ''));
                    return topB - topA; // South to North (bottom to top)
                  });
                const activeList = filteredPlaces.length > 0 ? filteredPlaces : currentTheme.places;
                const points = activeList.map((p) => {
                  const leftNum = parseFloat((p.coords?.left || '50%').replace('%', ''));
                  const topNum = parseFloat((p.coords?.top || '50%').replace('%', ''));
                  return { x: leftNum * 10, y: topNum * 10 };
                });
                const pathData = generateSmoothRoutePath(points);

                return (
                  <svg className="route-svg-canvas" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                    {pathData && (
                      <path
                        d={pathData}
                        fill="none"
                        stroke="#dcd4c9"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={routeStage === 'generating' ? 'route-solid-path' : ''}
                      />
                    )}
                  </svg>
                );
              })()}

              {/* Selected Place Markers (Diamond squircle pin badge with sequence number) */}
              {currentTheme.places
                .filter((place) => selectedPlaces.includes(place.pin))
                .map((place, idx) => {
                  const pinId = place.pin || (`p${idx + 1}`);
                  const coords = place.coords || (
                    pinId === 'p1' ? { left: '48%', top: '38%' } :
                    pinId === 'p2' ? { left: '56%', top: '48%' } :
                    pinId === 'p3' ? { left: '60%', top: '65%' } :
                    { left: '42%', top: '74%' }
                  );
                  return (
                    <div
                      key={pinId}
                      className={`pin ${pinId} selected route-numbered-pin`}
                      style={{ left: coords.left, top: coords.top }}
                      title={place.name}
                    >
                      <span className="pin-num-text">{idx + 1}</span>
                    </div>
                  );
                })}
            </div>

            {/* Stage: Generating Status */}
            {routeStage === 'generating' && (
              <div className="my-8 flex flex-col items-center justify-center gap-2.5">
                <div className="text-[#596167] text-center">
                  <span className="font-jura text-[16px] font-medium tracking-wide">
                    Generating optimal cultural route across Zhejiang...
                  </span>
                </div>
                <div className="flex gap-1.5 justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b48570] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b48570] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b48570] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {/* Stage: Plan Saved Content */}
            {routeStage === 'saved' && (
              <div className="w-full flex flex-col items-center">
                <h1 ref={routeSavedHeaderRef} className="route-saved-headline">
                  Plan Saved
                </h1>

                {/* Selected Route Destinations: Outer Box with Theme Header and Inner Place Cards */}
                <div className="route-plan-outer-card">
                  {/* Top Theme Symbol and Culture Name Header */}
                  <div className="route-plan-header">
                    <img
                      src={currentTheme.comboSvg}
                      alt={currentTheme.name}
                      className="route-plan-theme-icon"
                    />
                    <h2 className="route-plan-theme-title">{currentTheme.name}</h2>
                  </div>

                  {/* Inner Destination Cards */}
                  <div className="route-plan-inner-list">
                    {currentTheme.places
                      .filter((p) => selectedPlaces.includes(p.pin))
                      .sort((a, b) => {
                        const topA = parseFloat((a.coords?.top || '50%').replace('%', ''));
                        const topB = parseFloat((b.coords?.top || '50%').replace('%', ''));
                        return topB - topA;
                      })
                      .map((place) => (
                        <div key={place.name} className="route-plan-inner-card">
                          <h3 className="route-plan-place-title">{place.name}</h3>
                          <p className="route-plan-place-city">{place.city || 'Zhejiang'}</p>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Bottom Two Action Buttons */}
                <div className="route-actions-group">
                  <button
                    type="button"
                    className="route-action-btn-light"
                    onClick={() => setIsQrModalOpen(true)}
                  >
                    Save via QR Code
                  </button>

                  <button
                    type="button"
                    className="route-action-btn"
                    onClick={handleViewInJourney}
                  >
                    View in My Journey
                  </button>
                </div>

                {/* Re-adjust link */}
                <div className="text-center mt-2 mb-6">
                  <button
                    type="button"
                    onClick={() => setRouteStage('idle')}
                    className="font-jura text-[13px] text-[#8a9299] hover:text-[#3c444a] underline bg-transparent border-0 cursor-pointer"
                  >
                    ← Modify Selected Destinations
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="more">
          <h2>want to add more?</h2>
          <p>Explore other combinations and more unique cultural sites.</p>
          <button
            className="back"
            id="back"
            onClick={() => {
              setIsPhotoIn(false);
              setIsGlidingToDetail(false);
              setIsRevealCopyShow(false);
              setRouteStage('idle');
              setCurrentView('compose');
            }}
          >
            back
          </button>
        </div>
      </section>

      {/* QR Code Modal */}
      {(() => {
        const sortedPlaces = currentTheme.places
          .filter((p) => selectedPlaces.includes(p.pin))
          .sort((a, b) => {
            const topA = parseFloat((a.coords?.top || '50%').replace('%', ''));
            const topB = parseFloat((b.coords?.top || '50%').replace('%', ''));
            return topB - topA;
          });
        const finalPlaces = sortedPlaces.length > 0 ? sortedPlaces : currentTheme.places;

        return (
          <RouteQrModal
            isOpen={isQrModalOpen}
            onClose={() => setIsQrModalOpen(false)}
            themeName={currentTheme.name}
            themeColor={currentTheme.color || '#5b8a99'}
            themeSvg={currentTheme.comboSvg}
            places={finalPlaces.map((p) => ({
              id: p.name,
              name: p.name,
              city: p.city,
              text: p.text,
              pin: p.pin,
              coords: p.coords,
              photo: p.photo,
              isFavorite: routeFavorites[p.name] ?? true
            }))}
          />
        );
      })()}
    </div>
  );
};

import { ElementData, ElementKey } from '../types';

export const ELEMENTS_DATA: Record<ElementKey, ElementData> = {
  tea: {
    key: 'tea',
    label: 'TEA CULTURE',
    chineseName: '茶道与龙井',
    tagline: 'From leaf to cup across misty green hillsides',
    description: 'Tea has shaped Zhejiang’s hillsides, rituals and daily rhythm for centuries. Follow its route from leaf to cup.',
    iconSrc: 'assets/elements/tea-1.svg',
    themeColor: '#6fa99e',
    regions: ['Hangzhou (Longjing)', 'Huzhou (Anji White Tea)', 'Jinhua (Wuyi Mountain)'],
    culturalHighlights: [
      'West Lake Longjing handcrafted pan-firing technique',
      'Lu Yu’s Classic of Tea (Cha Jing) heritage in Huzhou',
      'Ancient Song dynasty tea whisking & Zen aesthetics'
    ]
  },
  building: {
    key: 'building',
    label: 'JIANGNAN ARCHITECTURE',
    chineseName: '江南民居与飞檐',
    tagline: 'White walls, dark rooflines and quiet courtyards',
    description: 'White walls, dark rooflines and narrow lanes create a living architecture of water towns and villages.',
    iconSrc: 'assets/elements/building-1.svg',
    themeColor: '#586168',
    regions: ['Shaoxing Old City', 'Wuzhen Water Town', 'Nanxun Historic District'],
    culturalHighlights: [
      'Horse-head firewalls (Matouqiang) and flying eaves',
      'Carved wood lattices & rain-chain stone courtyards',
      'Canalside residences built directly upon stone water steps'
    ]
  },
  mountain: {
    key: 'mountain',
    label: 'MOUNTAIN',
    chineseName: '青峦叠嶂与竹海',
    tagline: 'Misty ridgelines and serene forest sanctuaries',
    description: 'Misty ridgelines and forest paths make Zhejiang’s mountains a place for movement, reflection and discovery.',
    iconSrc: './assets/elements/mountain-1.svg',
    themeColor: '#749d94',
    regions: ['Moganshan (Deqing)', 'Yandang Mountains (Wenzhou)', 'Tiantai Mountain (Taizhou)'],
    culturalHighlights: [
      'Endless emerald bamboo oceans and historic mountain villas',
      'Yandangshan volcanic rhyolite crags and cascading waterfalls',
      'Cradle of Tiantai Buddhist philosophy and Daoist sanctuaries'
    ]
  },
  lake: {
    key: 'lake',
    label: 'WATER',
    chineseName: '湖波荡漾与水乡',
    tagline: 'Rippling lakes, canal networks and tranquil tides',
    description: 'Lakes, rivers and the coast carry stories, trade and everyday life across the landscape.',
    iconSrc: 'assets/elements/lake-1.svg',
    themeColor: '#72a7d6',
    regions: ['West Lake (Hangzhou)', 'Qiandao Lake (Thousand Islands)', 'East China Sea Archipelago (Zhoushan)'],
    culturalHighlights: [
      'Su Causeway and Three Pools Mirroring the Moon at dawn',
      '1,078 forested islands floating over pristine turquoise waters',
      'Grand Canal southern terminal & ancient barge wharves'
    ]
  },
  bridge: {
    key: 'bridge',
    label: 'ARCH BRIDGE',
    chineseName: '石桥流水与乌篷',
    tagline: 'Centuries of crossings carved in weathered granite',
    description: 'Stone bridges cross Zhejiang’s waterways, connecting neighbourhoods, markets and generations.',
    iconSrc: 'assets/elements/bridge-1.svg',
    themeColor: '#858b8f',
    regions: ['Shaoxing (800+ Ancient Bridges)', 'Tongxiang (Wuzhen Bridges)', 'Hangzhou (Gongchen Bridge)'],
    culturalHighlights: [
      'Moon arch stone bridges creating full reflections on water',
      'Black-awning boats (Wupengchuan) gliding beneath keystones',
      'Historic Song and Ming dynasty granite stonework'
    ]
  },
  food: {
    key: 'food',
    label: 'RICE FOOD CULTURE',
    chineseName: '江南稻作与珍馐',
    tagline: 'Fresh river delicacies, fragrant rice and seasoned wine',
    description: 'Rice anchors a local food culture of seasonal ingredients, shared tables and regional flavours.',
    iconSrc: 'assets/elements/rice.svg',
    themeColor: '#b48570',
    regions: ['Jiaxing (Zongzi Culture)', 'Shaoxing (Yellow Rice Wine)', 'Hangzhou (Song Dynasty Cuisine)'],
    culturalHighlights: [
      'Hand-wrapped savory and sweet Jiaxing rice dumplings',
      'Aged Shaoxing Huadiao wine fermented in winter frost',
      'Longjing tea-infused river shrimp and Dongpo pork'
    ]
  }
};

export const STORY_SENTENCES = [
  { text: 'Zhejiang is a land where mountains meet the sea,', color: '#72a7d6' },
  { text: 'and where centuries of cultural heritage coexist with modern innovation.', color: '#749d94' },
  { text: 'From misty water towns and dramatic coastal islands', color: '#92aa83' },
  { text: 'to intangible cultural traditions, historic streets, and vibrant digital cities,', color: '#6fa99e' },
  { text: 'Zhejiang offers a diverse landscape shaped by both history and progress.', color: '#acaead' },
  { text: 'Whether it is your first visit or a return to explore further,', color: '#586168' },
  { text: 'every journey reveals a new perspective, inviting travellers to experience', color: '#b48570' },
  { text: 'the region through its culture, nature, and everyday life.', color: '#72a7d6' }
];

export const DESTINATIONS = [
  {
    name: 'Hangzhou (杭州)',
    tag: 'Culture & Lakes',
    desc: 'The poetic capital famous for West Lake, Longjing tea plantations, and the ancient Grand Canal.',
    highlights: ['West Lake', 'Lingyin Temple', 'Longjing Tea Village', 'Liangzhu Heritage Site']
  },
  {
    name: 'Wuzhen & Water Towns (乌镇/西塘)',
    tag: 'Jiangnan Architecture',
    desc: 'Ancient canal towns where wooden residences flank waterways navigated by wooden rowboats.',
    highlights: ['Wuzhen West Gate', 'Ancient Stone Bridges', 'Indigo Dyeing Workshops', 'Night Canal Lights']
  },
  {
    name: 'Moganshan (莫干山)',
    tag: 'Mountains & Retreats',
    desc: 'Lush bamboo forests and historic mountain estates offering tranquility and cool summer breezes.',
    highlights: ['Bamboo Forest Trails', 'Sword Pond Waterfall', 'Historic Stone Villas', 'Tea Farm Cafes']
  },
  {
    name: 'Shaoxing (绍兴)',
    tag: 'Heritage & Bridges',
    desc: 'A city of scholars, canals, black-awning boats, and the historic birthplace of yellow wine.',
    highlights: ['Bazi Bridge', 'Lu Xun Native Place', 'Anchang Water Town', 'Shaoxing Wine Museum']
  },
  {
    name: 'Zhoushan & Putuoshan (舟山群岛)',
    tag: 'Islands & Coast',
    desc: 'An archipelago of thousands of islands featuring sea-facing Buddhist monasteries and coastal cliffs.',
    highlights: ['Putuoshan Sacred Isle', 'Dongji Islands', 'Golden Sand Beaches', 'Seafood Markets']
  },
  {
    name: 'Qiandao Lake (千岛湖)',
    tag: 'Water & Nature',
    desc: 'Over a thousand emerald islands scattered across crystal-clear blue waters.',
    highlights: ['Island Hopping Cruises', 'Lakeside Cycling Trail', 'Underwater Ancient City', 'Fish Head Feast']
  }
];

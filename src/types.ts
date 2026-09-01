export type ElementKey = 'tea' | 'building' | 'mountain' | 'lake' | 'bridge' | 'food';

export interface ElementData {
  key: ElementKey;
  label: string;
  chineseName: string;
  tagline: string;
  description: string;
  iconSrc: string;
  themeColor: string;
  regions: string[];
  culturalHighlights: string[];
}

export interface DraggableItem {
  id: ElementKey;
  title: string;
  iconSrc: string;
  initX: number; // percentage or px
  initY: number;
  width: number;
  height: number;
  zIndex: number;
}

export interface SavedPlace {
  id: string;
  name: string;
  city: string;
  text: string;
  pin?: string;
  coords?: { left: string; top: string };
  photo?: string;
  isFavorite?: boolean;
}

export interface SavedPlan {
  id: string;
  title: string;
  themeId?: string;
  themeColor?: string;
  themeSvg?: string;
  description?: string;
  places: SavedPlace[];
  createdAt: string;
}

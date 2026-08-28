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

export type QualityLevel = 'low' | 'medium' | 'high';

export type CameraViewMode = 'exploration' | 'pageant' | 'riverside' | 'temple' | 'cemetery';

export interface KrathongData {
  id: string;
  name: string;
  nameTh: string;
  category: string;
  description: string;
  petalCount: number;
  layers: number;
  baseColor: string;
  petalColor: string;
  accentColor: string;
  candleColor: string;
  sparkleColor: string;
  hasLotusCenter: boolean;
  hasMarigoldRing: boolean;
  isGolden: boolean;
}

export interface FortuneCardData {
  id: number;
  romanNumeral: string;
  nameEn: string;
  nameTh: string;
  category: 'Love' | 'Career' | 'Wealth' | 'Destiny' | 'Wisdom' | 'Protection' | 'Serenity';
  symbolIcon: string;
  keywords: string[];
  meaning: string;
  blessing: string;
  accentColor: string;
}

export interface Contestant {
  id: number;
  name: string;
  province: string;
  title: string;
  skinTone: string;
  hairColor: string;
  hairStyle: 'long-wavy' | 'high-ponytail' | 'sleek-bun' | 'voluminous-curls' | 'short-bob' | 'braided-updo';
  swimsuitColor: string;
  swimsuitAccent: string;
  heightScale: number;
  bodyCurve: number;
  energyLevel: number;
  signaturePose: string;
}

export interface ActiveKrathong {
  id: string;
  typeId: string;
  x: number;
  y: number;
  z: number;
  speed: number;
  swayOffset: number;
  rotation: number;
  rotSpeed: number;
  spawnTime: number;
  candleFlicker: number;
  wishText?: string;
}

export interface NPCData {
  id: number;
  zone: 'market' | 'temple' | 'pageant' | 'riverside';
  x: number;
  z: number;
  targetX: number;
  targetZ: number;
  speed: number;
  state: 'walking' | 'idle' | 'praying' | 'cheering' | 'eating';
  gender: 'female' | 'male';
  shirtColor: string;
  pantsColor: string;
  hairColor: string;
  scale: number;
  idleTimer: number;
}


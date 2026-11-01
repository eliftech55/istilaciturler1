/**
 * Karadeniz'in Koruyucuları – ZETA
 * Oyun Veri Tipleri ve Modelleri
 */

export type GameState = 
  | 'INTRO_STORY' 
  | 'TUTORIAL_QUIZ' 
  | 'HOW_TO_PLAY'
  | 'LEVEL_BRIEFING'
  | 'PLAYING' 
  | 'PAUSED' 
  | 'LEVEL_CLEARED' 
  | 'GAME_OVER' 
  | 'VICTORY';

export interface InvasiveSpeciesInfo {
  id: string;
  scientificName: string;
  commonName: string;
  description: string;
  origin: string; // Nasıl geldi? (Örn: Pasifik / Japon Denizi, balast suları)
  ecologicalImpact: string; // Karadeniz'e zararı (Örn: Yerel midyeleri ve hamsi yumurtalarını yer)
  count: number;
  startingPower: number;
  captureThreshold: number;
  powerLimit: number;
  contactDamage: number;
  color: string;
  accentColor: string;
  speed: number;
  size: number;
  habitat: 'bottom' | 'midwater' | 'surface' | 'free';
}

export interface LevelConfig {
  levelNumber: number;
  name: string;
  subtitle: string;
  species: InvasiveSpeciesInfo;
  seaweedCount: number;
  bonusCount: number;
  targetCount: number;
  introMessage: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  vx: number;
  vy: number;
}

export interface Entity extends Position, Velocity {
  id: string;
  size: number;
  active: boolean;
}

export interface PlayerEntity extends Entity {
  power: number;
  maxPower: number;
  facingRight: boolean;
  isInvulnerable: boolean;
  invulnerableTimer: number;
  isBoosting: boolean;
  thrusterAngle: number;
  eyeState: 'happy' | 'focused' | 'alert' | 'danger';
}

export interface InvasiveEntity extends Entity {
  speciesId: string;
  power: number;
  isFleeing: boolean;
  pulsePhase: number;
  captured: boolean;
  captureProgress: number;
  targetAngle: number;
  originalCountIndex: number;
}

export interface SeaweedEntity extends Position {
  id: string;
  size: number;
  active: boolean;
  height: number;
  swayOffset: number;
  powerValue: number;
  scoreValue: number;
  hasSpore: boolean;
}

export interface BonusEntity extends Entity {
  id: string;
  name: string;
  scoreValue: number;
  swimPhase: number;
}

export interface NetProjectile extends Entity {
  radius: number;
  maxRadius: number;
  lifespan: number;
  maxLifespan: number;
  expanded: boolean;
}

export interface ParticleEffect extends Position, Velocity {
  id: string;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  type: 'bubble' | 'sparkle' | 'netRing' | 'shockwave' | 'text';
  text?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

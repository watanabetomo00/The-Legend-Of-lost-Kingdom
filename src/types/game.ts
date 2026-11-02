export type BiomeType = 'kingdom' | 'wilderness' | 'mountains' | 'infernal' | 'shadow';

export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythical';

export type ItemType = 'weapon' | 'shield' | 'helmet' | 'armor' | 'boots' | 'ring' | 'potion' | 'material';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  description: string;
  levelReq: number;
  attack?: number;
  defense?: number;
  critRate?: number;
  bonusHp?: number;
  bonusMana?: number;
  healAmount?: number;
  manaAmount?: number;
  value: number;
  icon: string;
  color: string;
}

export interface Equipment {
  weapon: Item | null;
  shield: Item | null;
  helmet: Item | null;
  armor: Item | null;
  boots: Item | null;
  ring: Item | null;
}

export interface PlayerStats {
  level: number;
  xp: number;
  xpToNext: number;
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  mana: number;
  maxMana: number;
  strength: number;
  defense: number;
  agility: number;
  arcane: number;
  critRate: number;
  gold: number;
  statPoints: number;
  skillPoints: number;
}

export type SkillBranch = 'warrior' | 'assassin' | 'mage';

export interface SkillNode {
  id: string;
  name: string;
  branch: SkillBranch;
  description: string;
  cost: number;
  unlocked: boolean;
  reqSkillId?: string;
  icon: string;
  passiveBonus?: {
    strength?: number;
    defense?: number;
    critRate?: number;
    maxHp?: number;
    maxMana?: number;
  };
}

export type EnemyType = 
  | 'goblin' 
  | 'skeleton' 
  | 'spider' 
  | 'zombie' 
  | 'troll' 
  | 'frost_giant' 
  | 'ice_dragon' 
  | 'fire_demon' 
  | 'magma_beast' 
  | 'shadow_knight' 
  | 'boss_gortok' 
  | 'boss_arachna' 
  | 'boss_ymir' 
  | 'boss_ignis' 
  | 'boss_malakar';

export interface EnemyData {
  id: string;
  name: string;
  type: EnemyType;
  biome: BiomeType;
  isBoss: boolean;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  xpReward: number;
  goldReward: number;
  drops: Item[];
  scale?: number;
  attackRange: number;
  detectionRange: number;
  attackCooldown: number;
}

export interface LevelInfo {
  levelNumber: number;
  title: string;
  regionName: string;
  biome: BiomeType;
  description: string;
  objective: string;
  recommendedLevel: number;
  bossName?: string;
  enemiesCount: number;
  isBossLevel: boolean;
  unlocked: boolean;
  completed: boolean;
}

export type CameraMode = 'tpp' | 'fpp';

export type GameState = 'title' | 'prologue' | 'playing' | 'paused' | 'victory' | 'gameover' | 'ending';

export interface Quest {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  rewardXp: number;
  rewardGold: number;
  rewardItem?: Item;
}

export interface SavedGameData {
  playerStats: PlayerStats;
  equipment: Equipment;
  inventory: Item[];
  unlockedSkills: string[];
  currentLevel: number;
  unlockedLevels: number[];
  completedLevels: number[];
  selectedCamera: CameraMode;
  timestamp: number;
}

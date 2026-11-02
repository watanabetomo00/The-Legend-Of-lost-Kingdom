import { ALL_ITEMS_CATALOG, INITIAL_ITEMS, LEVELS, SKILL_TREE_NODES } from './constants';
import {
  EnemyData,
  EnemyType,
  Equipment,
  Item,
  LevelInfo,
  PlayerStats,
  SavedGameData,
  SkillNode
} from '../types/game';

export const INITIAL_PLAYER_STATS: PlayerStats = {
  level: 1,
  xp: 0,
  xpToNext: 100,
  hp: 350,
  maxHp: 350,
  stamina: 150,
  maxStamina: 150,
  mana: 120,
  maxMana: 120,
  strength: 15,
  defense: 10,
  agility: 12,
  arcane: 10,
  critRate: 8,
  gold: 100,
  statPoints: 0,
  skillPoints: 1
};

export const INITIAL_EQUIPMENT: Equipment = {
  weapon: INITIAL_ITEMS[0],
  shield: INITIAL_ITEMS[1],
  helmet: null,
  armor: INITIAL_ITEMS[2],
  boots: null,
  ring: null
};

export function getXpRequiredForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.22, level - 1));
}

export function calculateEffectiveStats(
  base: PlayerStats,
  equipment: Equipment,
  unlockedSkillIds: string[]
): {
  maxHp: number;
  maxMana: number;
  maxStamina: number;
  totalAttack: number;
  totalDefense: number;
  critRate: number;
} {
  let bonusHp = 0;
  let bonusMana = 0;
  let bonusAttack = 0;
  let bonusDefense = 0;
  let bonusCrit = 0;

  // Equipment bonuses
  const items = [
    equipment.weapon,
    equipment.shield,
    equipment.helmet,
    equipment.armor,
    equipment.boots,
    equipment.ring
  ];

  for (const item of items) {
    if (!item) continue;
    if (item.attack) bonusAttack += item.attack;
    if (item.defense) bonusDefense += item.defense;
    if (item.bonusHp) bonusHp += item.bonusHp;
    if (item.bonusMana) bonusMana += item.bonusMana;
    if (item.critRate) bonusCrit += item.critRate;
  }

  // Skill tree passives
  for (const skillId of unlockedSkillIds) {
    const node = SKILL_TREE_NODES.find(n => n.id === skillId);
    if (!node || !node.passiveBonus) continue;
    if (node.passiveBonus.maxHp) bonusHp += node.passiveBonus.maxHp;
    if (node.passiveBonus.maxMana) bonusMana += node.passiveBonus.maxMana;
    if (node.passiveBonus.defense) bonusDefense += node.passiveBonus.defense;
    if (node.passiveBonus.strength) bonusAttack += node.passiveBonus.strength;
    if (node.passiveBonus.critRate) bonusCrit += node.passiveBonus.critRate;
  }

  const maxHp = base.maxHp + bonusHp + base.strength * 5;
  const maxMana = base.maxMana + bonusMana + base.arcane * 6;
  const maxStamina = base.maxStamina + base.agility * 2;
  const totalAttack = Math.floor(base.strength * 2 + bonusAttack);
  const totalDefense = Math.floor(base.defense + bonusDefense);
  const critRate = Math.min(75, base.critRate + bonusCrit + Math.floor(base.agility * 0.4));

  return {
    maxHp,
    maxMana,
    maxStamina,
    totalAttack,
    totalDefense,
    critRate
  };
}

export function calculateDamage(
  attackPower: number,
  defensePower: number,
  options: {
    isCrit?: boolean;
    isBlocked?: boolean;
    isParried?: boolean;
    multiplier?: number;
  } = {}
): {
  damage: number;
  isCrit: boolean;
  isBlocked: boolean;
  isParried: boolean;
} {
  const { isCrit = false, isBlocked = false, isParried = false, multiplier = 1.0 } = options;

  if (isParried) {
    return { damage: 0, isCrit: false, isBlocked: false, isParried: true };
  }

  // Defense damage reduction curve: defense / (defense + 100)
  const mitigation = defensePower / (defensePower + 100);
  let baseDamage = attackPower * (1 - mitigation * 0.75);

  baseDamage *= multiplier;

  if (isCrit) {
    baseDamage *= 1.8;
  }

  if (isBlocked) {
    baseDamage *= 0.25; // 75% damage reduction on shield block
  }

  const finalDamage = Math.max(1, Math.round(baseDamage));

  return {
    damage: finalDamage,
    isCrit,
    isBlocked,
    isParried
  };
}

export function processPlayerGainXp(
  stats: PlayerStats,
  xpGained: number
): { stats: PlayerStats; leveledUp: boolean; levelsGained: number } {
  let newStats = { ...stats };
  newStats.xp += xpGained;
  let leveledUp = false;
  let levelsGained = 0;

  while (newStats.xp >= newStats.xpToNext && newStats.level < 50) {
    newStats.xp -= newStats.xpToNext;
    newStats.level += 1;
    newStats.xpToNext = getXpRequiredForLevel(newStats.level);
    newStats.statPoints += 3;
    newStats.skillPoints += 1;
    newStats.strength += 2;
    newStats.defense += 1;
    newStats.agility += 1;
    newStats.arcane += 1;
    newStats.maxHp += 25;
    newStats.hp = newStats.maxHp;
    newStats.maxMana += 15;
    newStats.mana = newStats.maxMana;
    newStats.stamina = newStats.maxStamina;
    leveledUp = true;
    levelsGained += 1;
  }

  return { stats: newStats, leveledUp, levelsGained };
}

export function rollLootDrop(level: number, isBoss: boolean): Item[] {
  const drops: Item[] = [];

  // Potion drops
  if (Math.random() < 0.6 || isBoss) {
    drops.push({
      id: `potion_drop_${Date.now()}_${Math.random()}`,
      name: level > 25 ? 'Greater Health Elixir' : 'Health Potion',
      type: 'potion',
      rarity: level > 25 ? 'rare' : 'common',
      description: `Restores ${level * 20 + 100} HP.`,
      levelReq: 1,
      healAmount: level * 20 + 100,
      value: 25 * level,
      icon: 'FlaskConical',
      color: '#ef4444'
    });
  }

  if (Math.random() < 0.4 || isBoss) {
    drops.push({
      id: `mana_drop_${Date.now()}_${Math.random()}`,
      name: 'Arcane Mana Flask',
      type: 'potion',
      rarity: 'common',
      description: `Restores ${level * 15 + 80} Mana.`,
      levelReq: 1,
      manaAmount: level * 15 + 80,
      value: 20 * level,
      icon: 'FlaskRound',
      color: '#3b82f6'
    });
  }

  // Equipment drops
  const equipChance = isBoss ? 1.0 : 0.25;
  if (Math.random() < equipChance) {
    const eligibleCatalog = ALL_ITEMS_CATALOG.filter(
      item => item.type !== 'potion' && item.levelReq <= Math.max(1, level + 2)
    );

    if (eligibleCatalog.length > 0) {
      const picked = eligibleCatalog[Math.floor(Math.random() * eligibleCatalog.length)];
      drops.push({
        ...picked,
        id: `${picked.id}_drop_${Date.now()}`
      });
    }
  }

  return drops;
}

export function generateEnemiesForLevel(levelInfo: LevelInfo): EnemyData[] {
  const enemies: EnemyData[] = [];
  const lvl = levelInfo.levelNumber;
  const count = levelInfo.isBossLevel ? 1 : levelInfo.enemiesCount;

  for (let i = 0; i < count; i++) {
    const isBoss = levelInfo.isBossLevel && i === 0;

    let type: EnemyType = 'goblin';
    let name = 'Goblin Scout';

    if (isBoss) {
      if (lvl === 10) {
        type = 'boss_gortok';
        name = 'Gortok the Ravager';
      } else if (lvl === 20) {
        type = 'boss_arachna';
        name = 'Queen Arachna';
      } else if (lvl === 30) {
        type = 'boss_ymir';
        name = 'Frost Colossus Ymir';
      } else if (lvl === 40) {
        type = 'boss_ignis';
        name = 'Pyrolord Ignis';
      } else if (lvl === 50) {
        type = 'boss_malakar';
        name = 'Demon King Malakar';
      }
    } else {
      switch (levelInfo.biome) {
        case 'kingdom':
          if (i % 2 === 0) {
            type = 'goblin';
            name = 'Goblin Warrior';
          } else {
            type = 'skeleton';
            name = 'Restless Skeleton';
          }
          break;
        case 'wilderness':
          if (i % 3 === 0) {
            type = 'spider';
            name = 'Venomous Crawler';
          } else if (i % 3 === 1) {
            type = 'zombie';
            name = 'Rotwood Zombie';
          } else {
            type = 'troll';
            name = 'Swamp Troll';
          }
          break;
        case 'mountains':
          if (i % 2 === 0) {
            type = 'frost_giant';
            name = 'Frost Warrior';
          } else {
            type = 'ice_dragon';
            name = 'Glacial Drake';
          }
          break;
        case 'infernal':
          if (i % 2 === 0) {
            type = 'fire_demon';
            name = 'Hellfire Fiend';
          } else {
            type = 'magma_beast';
            name = 'Magma Brute';
          }
          break;
        case 'shadow':
          type = 'shadow_knight';
          name = 'Abyssal Knight';
          break;
      }
    }

    const hpMultiplier = isBoss ? 6.0 : 1.0;
    const baseHp = Math.round((90 + lvl * 32) * hpMultiplier);
    const attack = Math.round(10 + lvl * 3.5 * (isBoss ? 1.6 : 1.0));
    const defense = Math.round(5 + lvl * 1.5 * (isBoss ? 1.4 : 1.0));
    const speed = isBoss ? 4.2 : 3.5 + Math.random() * 0.8;
    const xpReward = Math.round((25 + lvl * 18) * (isBoss ? 5.0 : 1.0));
    const goldReward = Math.round((15 + lvl * 12) * (isBoss ? 6.0 : 1.0));

    enemies.push({
      id: `enemy_${lvl}_${i}`,
      name,
      type,
      biome: levelInfo.biome,
      isBoss,
      level: lvl,
      hp: baseHp,
      maxHp: baseHp,
      attack,
      defense,
      speed,
      xpReward,
      goldReward,
      drops: rollLootDrop(lvl, isBoss),
      scale: isBoss ? (lvl === 50 ? 2.5 : 1.8) : (type === 'troll' || type === 'frost_giant' ? 1.4 : 1.0),
      attackRange: isBoss ? 4.0 : 2.4,
      detectionRange: 16.0,
      attackCooldown: isBoss ? 1.8 : 2.2
    });
  }

  return enemies;
}

const STORAGE_KEY = 'legend_of_the_lost_kingdom_save_v1';

export function saveGameToStorage(data: SavedGameData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Failed to save game:', e);
    return false;
  }
}

export function loadGameFromStorage(): SavedGameData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedGameData;
  } catch (e) {
    console.error('Failed to load game:', e);
    return null;
  }
}

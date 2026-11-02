import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEffectiveStats,
  calculateDamage,
  processPlayerGainXp,
  getXpRequiredForLevel,
  generateEnemiesForLevel,
  INITIAL_PLAYER_STATS,
  INITIAL_EQUIPMENT
} from './rules';
import { LEVELS } from './constants';

test('getXpRequiredForLevel increases monotonically', () => {
  const xp1 = getXpRequiredForLevel(1);
  const xp2 = getXpRequiredForLevel(2);
  const xp10 = getXpRequiredForLevel(10);
  assert.ok(xp1 > 0);
  assert.ok(xp2 > xp1, 'Level 2 requires more XP than Level 1');
  assert.ok(xp10 > xp2, 'Level 10 requires more XP than Level 2');
});

test('calculateEffectiveStats includes base stats, equipment, and skill passives', () => {
  const stats = calculateEffectiveStats(INITIAL_PLAYER_STATS, INITIAL_EQUIPMENT, ['w1']);
  // Initial stats base: HP 350 + w1 bonus 100 + strength*5 (15*5=75) + armor/shield hp (60+40=100) = 625
  assert.ok(stats.maxHp > INITIAL_PLAYER_STATS.maxHp);
  assert.ok(stats.totalAttack > 0);
  assert.ok(stats.totalDefense > 0);
});

test('calculateDamage handles normal, crit, block and parry', () => {
  const normal = calculateDamage(50, 10);
  assert.ok(normal.damage > 0);

  const crit = calculateDamage(50, 10, { isCrit: true });
  assert.ok(crit.damage > normal.damage, 'Crit should deal higher damage');

  const blocked = calculateDamage(50, 10, { isBlocked: true });
  assert.ok(blocked.damage < normal.damage, 'Blocked attack should deal reduced damage');

  const parried = calculateDamage(50, 10, { isParried: true });
  assert.equal(parried.damage, 0, 'Parried attack should deal 0 damage');
});

test('processPlayerGainXp levels up correctly and grants points', () => {
  const result = processPlayerGainXp(INITIAL_PLAYER_STATS, 250);
  assert.equal(result.leveledUp, true);
  assert.ok(result.stats.level >= 2);
  assert.ok(result.stats.statPoints > 0);
  assert.ok(result.stats.skillPoints > INITIAL_PLAYER_STATS.skillPoints);
});

test('generateEnemiesForLevel generates valid enemies for level 1 and level 50 boss', () => {
  const lvl1Enemies = generateEnemiesForLevel(LEVELS[0]);
  assert.ok(lvl1Enemies.length > 0);
  assert.equal(lvl1Enemies[0].isBoss, false);

  const lvl50Enemies = generateEnemiesForLevel(LEVELS[49]);
  assert.equal(lvl50Enemies.length, 1);
  assert.equal(lvl50Enemies[0].isBoss, true);
  assert.equal(lvl50Enemies[0].type, 'boss_malakar');
  assert.ok(lvl50Enemies[0].hp > 5000, 'Malakar should have massive boss HP');
});

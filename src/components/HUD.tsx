import React, { useEffect, useState } from 'react';
import {
  Camera,
  Compass,
  Crosshair,
  Flame,
  FlaskConical,
  FlaskRound,
  HelpCircle,
  MapPin,
  Maximize2,
  Menu,
  RotateCcw,
  Shield,
  ShieldAlert,
  Snowflake,
  Sparkles,
  Sword,
  Volume2,
  VolumeX,
  Wind,
  Zap
} from 'lucide-react';
import { CameraMode, EnemyData, LevelInfo, PlayerStats } from '../types/game';

interface HUDProps {
  stats: PlayerStats;
  currentLevel: LevelInfo;
  cameraMode: CameraMode;
  bossEnemy: EnemyData | null;
  onToggleCamera: () => void;
  onOpenInventory: () => void;
  onOpenSkillTree: () => void;
  onOpenWorldMap: () => void;
  onOpenPause: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
  onUseHealthPotion: () => void;
  onUseManaPotion: () => void;
  onCastSkill: (skillIndex: number) => void;
  onPerformAttack: () => void;
  onPerformHeavyAttack: () => void;
  onPerformDodge: () => void;
  onInteract: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  currentLevel,
  cameraMode,
  bossEnemy,
  onToggleCamera,
  onOpenInventory,
  onOpenSkillTree,
  onOpenWorldMap,
  onOpenPause,
  onToggleMute,
  isMuted,
  onUseHealthPotion,
  onUseManaPotion,
  onCastSkill,
  onPerformAttack,
  onPerformHeavyAttack,
  onPerformDodge,
  onInteract
}) => {
  const hpPercent = Math.max(0, Math.min(100, (stats.hp / stats.maxHp) * 100));
  const staminaPercent = Math.max(0, Math.min(100, (stats.stamina / stats.maxStamina) * 100));
  const manaPercent = Math.max(0, Math.min(100, (stats.mana / stats.maxMana) * 100));
  const xpPercent = Math.max(0, Math.min(100, (stats.xp / stats.xpToNext) * 100));

  const [delayedHp, setDelayedHp] = useState(hpPercent);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedHp(hpPercent);
    }, 400);
    return () => clearTimeout(timer);
  }, [hpPercent]);

  return (
    <div className="fixed inset-0 pointer-events-none select-none z-10 flex flex-col justify-between p-4 md:p-6 font-sans">
      {/* Top Header Row */}
      <div className="flex items-start justify-between w-full">
        {/* Top-Left: Player Stats & Vitality Bars */}
        <div className="flex flex-col gap-2 bg-slate-950/85 p-3 rounded-lg border border-amber-900/40 pointer-events-auto min-w-[280px] max-w-[340px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-black tracking-wider text-sm">KAEL</span>
              <span className="px-1.5 py-0.5 bg-amber-600/30 text-amber-300 font-mono text-xs rounded border border-amber-500/30">
                LVL {stats.level}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-200/80 font-mono">
              <span className="text-yellow-400 font-bold">{stats.gold}</span>
              <span className="text-[10px] text-yellow-600 uppercase">Gold</span>
            </div>
          </div>

          {/* Health Bar with delayed damage trail */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-mono tracking-tight text-red-300">
              <span className="font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span> HP
              </span>
              <span>{Math.round(stats.hp)} / {stats.maxHp}</span>
            </div>
            <div className="h-3.5 bg-red-950/80 rounded-sm overflow-hidden border border-red-900/60 relative">
              <div
                className="absolute inset-y-0 left-0 bg-red-400/50 transition-all duration-500 ease-out"
                style={{ width: `${delayedHp}%` }}
              />
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-700 to-red-500 transition-all duration-100 ease-out"
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>

          {/* Stamina Bar */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-mono tracking-tight text-emerald-300">
              <span className="font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> STM
              </span>
              <span>{Math.round(stats.stamina)} / {stats.maxStamina}</span>
            </div>
            <div className="h-2 bg-emerald-950/80 rounded-sm overflow-hidden border border-emerald-900/60 relative">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-100"
                style={{ width: `${staminaPercent}%` }}
              />
            </div>
          </div>

          {/* Mana Bar */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-mono tracking-tight text-cyan-300">
              <span className="font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block"></span> MP
              </span>
              <span>{Math.round(stats.mana)} / {stats.maxMana}</span>
            </div>
            <div className="h-2 bg-cyan-950/80 rounded-sm overflow-hidden border border-cyan-900/60 relative">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-100"
                style={{ width: `${manaPercent}%` }}
              />
            </div>
          </div>

          {/* XP Bar */}
          <div className="mt-1 flex flex-col gap-0.5">
            <div className="flex justify-between text-[10px] font-mono text-purple-300/80">
              <span>EXP</span>
              <span>{stats.xp} / {stats.xpToNext}</span>
            </div>
            <div className="h-1 bg-purple-950 rounded-sm overflow-hidden">
              <div className="h-full bg-purple-500 transition-all duration-200" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Top-Center: Quest / Mission Tracker & Boss Bar */}
        <div className="flex flex-col items-center gap-2 max-w-md w-full px-4">
          {/* Boss Bar if present */}
          {bossEnemy && bossEnemy.hp > 0 && (
            <div className="w-full bg-slate-950/90 border-2 border-red-600/70 p-2.5 rounded-lg flex flex-col gap-1 shadow-2xl pointer-events-auto">
              <div className="flex justify-between items-center text-xs font-black tracking-wide text-red-400">
                <span className="flex items-center gap-1.5 uppercase">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  {bossEnemy.name} (LVL {bossEnemy.level})
                </span>
                <span className="font-mono text-white">{bossEnemy.hp} / {bossEnemy.maxHp} HP</span>
              </div>
              <div className="h-3.5 bg-red-950/90 rounded border border-red-800/80 overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-red-700 via-red-500 to-amber-500 transition-all duration-100"
                  style={{ width: `${Math.max(0, (bossEnemy.hp / bossEnemy.maxHp) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Quest Banner */}
          <div className="bg-slate-950/80 border border-amber-600/40 px-4 py-2 rounded-lg text-center pointer-events-auto">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
              Level {currentLevel.levelNumber}: {currentLevel.title}
            </div>
            <div className="text-xs text-slate-200 font-medium">
              Objective: <span className="text-amber-200">{currentLevel.objective}</span>
            </div>
          </div>
        </div>

        {/* Top-Right: Mini-map & RPG Utilities */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          {/* Mini-map */}
          <div className="w-28 h-28 bg-slate-950/90 rounded-lg border border-amber-600/50 p-1 flex flex-col items-center justify-between relative overflow-hidden shadow-lg">
            <div className="text-[10px] text-amber-400 font-mono tracking-wider flex items-center justify-between w-full px-1">
              <span>{currentLevel.biome.toUpperCase()}</span>
              <span>L{currentLevel.levelNumber}/50</span>
            </div>
            {/* Simple radar display */}
            <div className="relative w-16 h-16 rounded-full border border-amber-500/30 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" title="Player" />
              <div className="absolute top-1 left-7 w-1.5 h-1.5 rounded-full bg-red-500" title="Enemy" />
              <div className="absolute bottom-2 right-4 w-1.5 h-1.5 rounded-full bg-yellow-400" title="Treasure" />
            </div>
            <div className="text-[9px] text-slate-400 font-mono">MAP [M]</div>
          </div>

          {/* Action Menu Shortcuts */}
          <div className="flex items-center gap-1.5 bg-slate-950/85 p-1.5 rounded-lg border border-slate-700">
            <button
              onClick={onToggleCamera}
              className={`p-2 rounded transition-colors flex items-center gap-1 text-xs font-bold ${
                cameraMode === 'fpp' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-cyan-300 hover:bg-slate-700'
              }`}
              title="Toggle First/Third Person Perspective (V)"
            >
              <Camera className="w-4 h-4" />
              <span>{cameraMode === 'fpp' ? 'FPP' : 'TPP'}</span>
            </button>
            <button
              onClick={onOpenWorldMap}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded transition-colors text-xs font-bold"
              title="World Map (M)"
            >
              <MapPin className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenInventory}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded transition-colors text-xs font-bold"
              title="Inventory (I / Tab)"
            >
              <Sword className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSkillTree}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded transition-colors text-xs font-bold"
              title="Skill Tree (K)"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleMute}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors text-xs font-bold"
              title="Mute / Unmute"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={onOpenPause}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors text-xs font-bold"
              title="Pause Menu (Esc / P)"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Center Reticle (for FPP aiming or target focus) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-2.5 h-2.5 rounded-full border border-amber-300/60 bg-white/20" />
      </div>

      {/* Bottom Control Dock: Skills, Potions & Combat Verbs */}
      <div className="flex flex-col items-center gap-2 w-full pointer-events-auto">
        <div className="flex items-center gap-2 bg-slate-950/90 border border-amber-600/40 p-2.5 rounded-xl shadow-2xl">
          {/* Quick Potions */}
          <div className="flex items-center gap-1.5 pr-2 border-r border-slate-700">
            <button
              onClick={onUseHealthPotion}
              className="flex flex-col items-center justify-center w-12 h-14 bg-red-950/70 hover:bg-red-900 border border-red-600/50 rounded-lg text-white group transition-transform active:scale-95"
              title="Health Potion (Press 5)"
            >
              <FlaskConical className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono text-red-200 mt-1">[5] HP</span>
            </button>
            <button
              onClick={onUseManaPotion}
              className="flex flex-col items-center justify-center w-12 h-14 bg-blue-950/70 hover:bg-blue-900 border border-blue-600/50 rounded-lg text-white group transition-transform active:scale-95"
              title="Mana Potion (Press 6)"
            >
              <FlaskRound className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono text-blue-200 mt-1">[6] MP</span>
            </button>
          </div>

          {/* Quick Spell Abilities 1-4 */}
          <div className="flex items-center gap-1.5 pr-2 border-r border-slate-700">
            <button
              onClick={() => onCastSkill(1)}
              className="flex flex-col items-center justify-center w-12 h-14 bg-orange-950/70 hover:bg-orange-900 border border-orange-500/50 rounded-lg text-white group transition-transform active:scale-95"
              title="Fireball (Press 1)"
            >
              <Flame className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono text-orange-200 mt-1">[1] Fire</span>
            </button>
            <button
              onClick={() => onCastSkill(2)}
              className="flex flex-col items-center justify-center w-12 h-14 bg-yellow-950/70 hover:bg-yellow-900 border border-yellow-500/50 rounded-lg text-white group transition-transform active:scale-95"
              title="Bow Shot (Press 2)"
            >
              <Crosshair className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono text-yellow-200 mt-1">[2] Bow</span>
            </button>
            <button
              onClick={() => onCastSkill(3)}
              className="flex flex-col items-center justify-center w-12 h-14 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/50 rounded-lg text-white group transition-transform active:scale-95"
              title="Frost Nova (Press 3)"
            >
              <Snowflake className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono text-cyan-200 mt-1">[3] Frost</span>
            </button>
            <button
              onClick={() => onCastSkill(4)}
              className="flex flex-col items-center justify-center w-12 h-14 bg-amber-950/70 hover:bg-amber-900 border border-amber-500/50 rounded-lg text-white group transition-transform active:scale-95"
              title="Lightning Strike (Press 4)"
            >
              <Zap className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono text-amber-200 mt-1">[4] Bolt</span>
            </button>
            <button
              onClick={() => onCastSkill(5)}
              className="flex flex-col items-center justify-center w-12 h-14 bg-purple-950/70 hover:bg-purple-900 border border-purple-500/50 rounded-lg text-white group transition-transform active:scale-95"
              title="Dragon Slash Ultimate (Press R)"
            >
              <Sparkles className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono text-purple-200 mt-1">[R] Ult</span>
            </button>
          </div>

          {/* Core Combat Buttons (for both keyboard visual prompt and mobile/click tapping) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onPerformAttack}
              className="px-3.5 h-14 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-lg flex flex-col items-center justify-center text-xs shadow-md transition-transform active:scale-95"
              title="Light Attack (Left Click / Space)"
            >
              <Sword className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-mono uppercase">Attack</span>
            </button>
            <button
              onClick={onPerformHeavyAttack}
              className="px-3.5 h-14 bg-amber-800 hover:bg-amber-700 text-amber-100 font-bold rounded-lg flex flex-col items-center justify-center text-xs shadow-md transition-transform active:scale-95"
              title="Heavy Attack (Hold / Key F)"
            >
              <Shield className="w-5 h-5 text-amber-300" />
              <span className="text-[10px] mt-1 font-mono uppercase">Heavy [F]</span>
            </button>
            <button
              onClick={onPerformDodge}
              className="px-3.5 h-14 bg-slate-800 hover:bg-slate-700 text-cyan-200 font-bold rounded-lg flex flex-col items-center justify-center text-xs transition-transform active:scale-95"
              title="Dodge Roll (Key C / Space)"
            >
              <Wind className="w-5 h-5 text-cyan-400" />
              <span className="text-[10px] mt-1 font-mono uppercase">Roll [C]</span>
            </button>
            <button
              onClick={onInteract}
              className="px-3.5 h-14 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-bold rounded-lg flex flex-col items-center justify-center text-xs transition-transform active:scale-95"
              title="Interact / Open Chest / Exit Portal (Key E)"
            >
              <MapPin className="w-5 h-5 text-emerald-300" />
              <span className="text-[10px] mt-1 font-mono uppercase">Loot [E]</span>
            </button>
          </div>
        </div>

        {/* Clean flat bottom control guide */}
        <div className="text-[11px] font-mono text-slate-400/90 tracking-wide mt-1 pb-1">
          WASD Move · Click/Attack · Q Block/Parry · C Roll · V Camera FPP/TPP · 1-5 Magic · E Loot · Tab Inventory
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  Flame,
  Lock,
  Mountain,
  Skull,
  Sparkles,
  TreePine,
  X,
  Zap
} from 'lucide-react';
import { BIOMES, LEVELS } from '../game/constants';
import { BiomeType, LevelInfo } from '../types/game';

interface WorldMapModalProps {
  currentLevelNumber: number;
  unlockedLevels: number[];
  completedLevels: number[];
  onSelectLevel: (levelNumber: number) => void;
  onClose: () => void;
}

export const WorldMapModal: React.FC<WorldMapModalProps> = ({
  currentLevelNumber,
  unlockedLevels,
  completedLevels,
  onSelectLevel,
  onClose
}) => {
  const [selectedBiome, setSelectedBiome] = useState<BiomeType>(() => {
    const cur = LEVELS.find(l => l.levelNumber === currentLevelNumber);
    return cur ? cur.biome : 'kingdom';
  });

  const [inspectedLevel, setInspectedLevel] = useState<LevelInfo>(() => {
    return LEVELS.find(l => l.levelNumber === currentLevelNumber) || LEVELS[0];
  });

  const biomesList: { id: BiomeType; name: string; levels: string; icon: React.ReactNode }[] = [
    { id: 'kingdom', name: 'Forgotten Kingdom', levels: 'Levels 1–10', icon: <TreePine className="w-4 h-4 text-emerald-400" /> },
    { id: 'wilderness', name: 'Cursed Wilderness', levels: 'Levels 11–20', icon: <Skull className="w-4 h-4 text-purple-400" /> },
    { id: 'mountains', name: 'Frozen Mountains', levels: 'Levels 21–30', icon: <Mountain className="w-4 h-4 text-cyan-400" /> },
    { id: 'infernal', name: 'Infernal Lands', levels: 'Levels 31–40', icon: <Flame className="w-4 h-4 text-orange-400" /> },
    { id: 'shadow', name: 'Shadow Realm', levels: 'Levels 41–50', icon: <Zap className="w-4 h-4 text-indigo-400" /> }
  ];

  const levelsInBiome = LEVELS.filter(l => l.biome === selectedBiome);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 select-none">
      <div className="w-full max-w-5xl bg-slate-950 border border-amber-600/50 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-amber-600/30">
          <div>
            <h2 className="text-lg font-black tracking-wider text-amber-400 uppercase">
              Realm of Eldoria — 50 Level Expedition
            </h2>
            <div className="text-xs text-slate-400 font-mono">
              Princess Aria is held in the Black Fortress at Level 50
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Biome Region Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-slate-800 bg-slate-950/90 p-2 gap-2">
          {biomesList.map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedBiome(b.id)}
              className={`p-2.5 rounded-lg border text-left transition-all flex flex-col gap-1 ${
                selectedBiome === b.id
                  ? 'bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                {b.icon}
                <span className="truncate">{b.name}</span>
              </div>
              <div className="text-[10px] font-mono text-amber-300/80">{b.levels}</div>
            </button>
          ))}
        </div>

        {/* Level List & Detail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 overflow-y-auto">
          {/* Level Grid (Levels 1-10 in selected biome) */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400/90 flex justify-between items-center">
              <span>{BIOMES[selectedBiome].name} Stages</span>
              <span className="text-[11px] font-mono text-slate-400">
                10 Stages / Region
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {levelsInBiome.map(lvl => {
                const isUnlocked = unlockedLevels.includes(lvl.levelNumber);
                const isCompleted = completedLevels.includes(lvl.levelNumber);
                const isCurrent = currentLevelNumber === lvl.levelNumber;
                const isInspected = inspectedLevel.levelNumber === lvl.levelNumber;

                return (
                  <button
                    key={lvl.levelNumber}
                    onClick={() => setInspectedLevel(lvl)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-between min-h-[90px] relative transition-all ${
                      isInspected
                        ? 'border-amber-400 bg-amber-950/50 shadow-md ring-1 ring-amber-400'
                        : isUnlocked
                        ? 'bg-slate-900 border-slate-700 hover:border-amber-500/60'
                        : 'bg-slate-950/60 border-slate-800/80 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-mono font-black text-amber-300">
                        #{lvl.levelNumber}
                      </span>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : !isUnlocked ? (
                        <Lock className="w-3.5 h-3.5 text-slate-600" />
                      ) : null}
                    </div>

                    <div className="text-center my-1">
                      {lvl.isBossLevel ? (
                        <div className="px-1.5 py-0.5 bg-red-950 text-red-300 font-bold text-[9px] rounded border border-red-800 uppercase">
                          BOSS
                        </div>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-200 line-clamp-1">
                          {lvl.title.split(' ')[0]}
                        </span>
                      )}
                    </div>

                    {isCurrent && (
                      <span className="text-[8px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                        CURRENT
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level Details & Launch CTA */}
          <div className="flex flex-col justify-between bg-slate-900/80 border border-slate-800 p-5 rounded-xl">
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-amber-950 text-amber-300 rounded border border-amber-800/50">
                    Level {inspectedLevel.levelNumber} of 50
                  </span>
                  {inspectedLevel.isBossLevel && (
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-red-950 text-red-300 rounded border border-red-800/50">
                      Major Boss Encounter
                    </span>
                  )}
                </div>
                <h3 className="text-base font-black text-white mt-2">{inspectedLevel.title}</h3>
                <div className="text-xs text-amber-400 font-medium">{inspectedLevel.regionName}</div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-amber-600/50 pl-2">
                "{inspectedLevel.description}"
              </p>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono flex flex-col gap-1.5 text-slate-300">
                <div>Objective: <span className="text-amber-300 font-bold">{inspectedLevel.objective}</span></div>
                <div>Recommended Power: <span className="text-emerald-400">Level {inspectedLevel.recommendedLevel}+</span></div>
                {inspectedLevel.bossName && (
                  <div>Boss: <span className="text-red-400 font-bold">{inspectedLevel.bossName}</span></div>
                )}
                <div>Status: {completedLevels.includes(inspectedLevel.levelNumber) ? (
                  <span className="text-emerald-400 font-bold">Cleared (Can Replay)</span>
                ) : unlockedLevels.includes(inspectedLevel.levelNumber) ? (
                  <span className="text-amber-400 font-bold">Unlocked</span>
                ) : (
                  <span className="text-slate-500">Locked</span>
                )}</div>
              </div>
            </div>

            <button
              disabled={!unlockedLevels.includes(inspectedLevel.levelNumber)}
              onClick={() => onSelectLevel(inspectedLevel.levelNumber)}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-black rounded-lg text-xs uppercase tracking-wider transition-colors shadow-lg mt-4 flex items-center justify-center gap-2"
            >
              <span>Embark to Level {inspectedLevel.levelNumber}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

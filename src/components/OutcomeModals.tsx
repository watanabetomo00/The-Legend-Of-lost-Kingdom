import React from 'react';
import { ChevronRight, RotateCcw, Skull, Sparkles, Trophy } from 'lucide-react';
import { Item, LevelInfo } from '../types/game';

interface StageClearModalProps {
  level: LevelInfo;
  goldEarned: number;
  xpEarned: number;
  lootCollected: Item[];
  onNextLevel: () => void;
  onOpenWorldMap: () => void;
}

export const StageClearModal: React.FC<StageClearModalProps> = ({
  level,
  goldEarned,
  xpEarned,
  lootCollected,
  onNextLevel,
  onOpenWorldMap
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 select-none">
      <div className="w-full max-w-md bg-slate-950 border-2 border-emerald-500/70 rounded-2xl overflow-hidden shadow-2xl p-6 text-center flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
          <Trophy className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-black">
            STAGE COMPLETED
          </span>
          <h2 className="text-2xl font-black text-white uppercase mt-1">
            Level {level.levelNumber}: {level.title}
          </h2>
        </div>

        {/* Rewards Summary */}
        <div className="w-full bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex justify-around font-mono text-xs">
          <div className="flex flex-col gap-1">
            <span className="text-slate-400">EXP GAINED</span>
            <span className="text-purple-400 font-bold text-sm">+{xpEarned}</span>
          </div>
          <div className="w-[1px] bg-slate-800" />
          <div className="flex flex-col gap-1">
            <span className="text-slate-400">GOLD LOOT</span>
            <span className="text-yellow-400 font-bold text-sm">+{goldEarned}</span>
          </div>
          <div className="w-[1px] bg-slate-800" />
          <div className="flex flex-col gap-1">
            <span className="text-slate-400">ITEMS FOUND</span>
            <span className="text-emerald-400 font-bold text-sm">{lootCollected.length}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full mt-2">
          <button
            data-start="true"
            onClick={onNextLevel}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <span>Proceed to Level {level.levelNumber + 1}</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenWorldMap}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs uppercase tracking-wider border border-slate-700 transition-all"
          >
            Open World Map
          </button>
        </div>
      </div>
    </div>
  );
};

interface GameOverModalProps {
  level: LevelInfo;
  onRetry: () => void;
  onOpenWorldMap: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  level,
  onRetry,
  onOpenWorldMap
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 select-none">
      <div className="w-full max-w-md bg-slate-950 border-2 border-red-600/70 rounded-2xl overflow-hidden shadow-2xl p-6 text-center flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-red-950 border border-red-600/50 flex items-center justify-center text-red-500">
          <Skull className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-mono tracking-widest text-red-400 uppercase font-black">
            YOU HAVE FALLEN
          </span>
          <h2 className="text-2xl font-black text-white uppercase mt-1">
            Defeated in Level {level.levelNumber}
          </h2>
          <p className="text-xs text-slate-400 mt-2 italic font-serif">
            "Princess Aria still waits for her champion... Stand and fight once more!"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full mt-2">
          <button
            data-start="true"
            onClick={onRetry}
            className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <button
            onClick={onOpenWorldMap}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs uppercase tracking-wider border border-slate-700 transition-all"
          >
            Select Another Level
          </button>
        </div>
      </div>
    </div>
  );
};

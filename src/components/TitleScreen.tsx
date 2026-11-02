import React, { useEffect } from 'react';
import { Camera, ChevronRight, Play, RotateCcw, Shield, Sparkles, Sword } from 'lucide-react';

interface TitleScreenProps {
  onStartGame: () => void;
  onContinueGame?: () => void;
  hasSaveGame: boolean;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onContinueGame,
  hasSaveGame
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        onStartGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartGame]);

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-between items-center p-8 select-none bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      {/* Top Banner / Lore Kicker */}
      <div className="flex items-center gap-2 pt-6">
        <span className="w-8 h-[1px] bg-amber-500/60" />
        <span className="text-xs font-mono tracking-widest text-amber-400 font-bold uppercase">
          An Epic 3D Fantasy Action RPG
        </span>
        <span className="w-8 h-[1px] bg-amber-500/60" />
      </div>

      {/* Hero Title & Crest */}
      <div className="flex flex-col items-center text-center max-w-2xl px-4">
        {/* Custom SVG Royal Emblem */}
        <div className="mb-6 relative">
          <svg className="w-24 h-24 text-amber-500" viewBox="0 0 100 100" fill="none" stroke="currentColor">
            <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" strokeWidth="2.5" stroke="#f59e0b" fill="#18181b" />
            <path d="M50,15 L50,85 M20,50 L80,50" strokeWidth="1.5" stroke="#d97706" />
            <circle cx="50" cy="50" r="18" strokeWidth="2" stroke="#fbbf24" fill="#27272a" />
            <path d="M42,50 L50,38 L58,50 L50,62 Z" fill="#f59e0b" />
          </svg>
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 uppercase font-serif drop-shadow-md">
          LEGEND OF THE LOST KINGDOM
        </h1>

        <p className="mt-4 text-sm md:text-base text-slate-300 font-medium max-w-lg leading-relaxed">
          Traverse 50 perilous levels across 5 fantasy biomes. Slay monsters, wield ancestral magic, defeat Demon King Malakar, and rescue Princess Aria!
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-[11px] font-mono text-amber-300/80">
          <span className="px-2.5 py-1 bg-amber-950/60 border border-amber-600/40 rounded-full flex items-center gap-1.5">
            <Sword className="w-3.5 h-3.5 text-amber-400" /> Real-time Combat & Combos
          </span>
          <span className="px-2.5 py-1 bg-cyan-950/60 border border-cyan-600/40 rounded-full flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-cyan-400" /> TPP & FPP Camera Modes
          </span>
          <span className="px-2.5 py-1 bg-purple-950/60 border border-purple-600/40 rounded-full flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> 50 Levels & 5 Biomes
          </span>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full max-w-xs">
          <button
            data-start="true"
            onClick={onStartGame}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-sm uppercase tracking-wider transition-all shadow-xl shadow-amber-950/50 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Embark on Quest</span>
          </button>

          {hasSaveGame && onContinueGame && (
            <button
              onClick={onContinueGame}
              className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-xl text-sm uppercase tracking-wider transition-all border border-slate-700 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Resume Save</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Control Hint */}
      <div className="text-[11px] font-mono text-slate-400 pb-4">
        Press [ENTER] or [SPACE] to Begin · WASD Move · Mouse Look & Attack · Q Block
      </div>
    </div>
  );
};

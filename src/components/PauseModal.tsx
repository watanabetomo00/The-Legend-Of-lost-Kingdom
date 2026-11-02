import React from 'react';
import { Play, RotateCcw, Save, Volume2, VolumeX, X } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestartLevel: () => void;
  onSaveGame: () => void;
  onReturnToTitle: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  saveMessage?: string;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestartLevel,
  onSaveGame,
  onReturnToTitle,
  isMuted,
  onToggleMute,
  saveMessage
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 select-none">
      <div className="w-full max-w-md bg-slate-950 border border-amber-600/50 rounded-2xl overflow-hidden shadow-2xl p-6 text-center flex flex-col gap-5">
        <div>
          <h2 className="text-xl font-black text-amber-400 uppercase tracking-widest">
            Game Paused
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Eldoria awaits your return, brave hero.
          </p>
        </div>

        {saveMessage && (
          <div className="p-2 bg-emerald-950/80 border border-emerald-500/50 rounded text-xs font-mono text-emerald-300">
            {saveMessage}
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onResume}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Resume Game (Esc)</span>
          </button>

          <button
            onClick={onSaveGame}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold rounded-xl text-xs uppercase tracking-wider border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Progress</span>
          </button>

          <button
            onClick={onToggleMute}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs uppercase tracking-wider border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>Audio: {isMuted ? 'Muted' : 'Enabled'}</span>
          </button>

          <button
            onClick={onRestartLevel}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs uppercase tracking-wider border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Current Level</span>
          </button>

          <button
            onClick={onReturnToTitle}
            className="w-full py-3 bg-red-950/40 hover:bg-red-900/60 text-red-300 font-bold rounded-xl text-xs uppercase tracking-wider border border-red-900/50 transition-all mt-2"
          >
            Return to Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

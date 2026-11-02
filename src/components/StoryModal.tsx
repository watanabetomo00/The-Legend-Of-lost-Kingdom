import React, { useState } from 'react';
import { ChevronRight, Crown, Flame, ShieldAlert, Sparkles, Sword } from 'lucide-react';

export interface StoryModalProps {
  mode: 'prologue' | 'boss_intro' | 'victory_ending';
  bossName?: string;
  onFinish: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ mode, bossName, onFinish }) => {
  const [stepIndex, setStepIndex] = useState(0);

  const prologueSlides = [
    {
      title: 'THE FALL OF ELDORIA',
      speaker: 'Chronicles of the Kingdom',
      text: 'For a thousand years, the Kingdom of Eldoria flourished under the protection of the sacred Dawnstone and the benevolent royal lineage.',
      icon: <Crown className="w-10 h-10 text-amber-400" />
    },
    {
      title: 'THE SHADOW INVASION',
      speaker: 'The Blood Moon Eclipse',
      text: 'Without warning, the sky tore open in violent crimson thunder. Demon King MALAKAR descended with an endless legion of horrors from the Shadow Realm.',
      icon: <Flame className="w-10 h-10 text-red-500" />
    },
    {
      title: 'THE PRINCESS ABDUCTED',
      speaker: 'The Castle Sacked',
      text: 'Malakar shattered the castle gates and captured PRINCESS ARIA in chains of dark void, dragging her deep into the Black Fortress at the pinnacle of Level 50!',
      icon: <ShieldAlert className="w-10 h-10 text-purple-400" />
    },
    {
      title: "KAEL'S SACRED VOW",
      speaker: 'Kael, Royal Guardian',
      text: '"By my life and my blade, I swear: I will fight through every monster, every wasteland, and every demon lord until Malakar is destroyed and Princess Aria is returned!"',
      icon: <Sword className="w-10 h-10 text-amber-300" />
    }
  ];

  const endingSlides = [
    {
      title: 'MALAKAR VANQUISHED',
      speaker: 'The Defeat of Darkness',
      text: 'With a final strike of radiant celestial fury, Kael shatters the demonic core of Malakar! The Demon King dissolves into vanishing ash and smoke.',
      icon: <Sparkles className="w-10 h-10 text-yellow-400" />
    },
    {
      title: 'PRINCESS ARIA LIBERATED',
      speaker: 'Princess Aria',
      text: '"Kael! You traveled through all fifty realms of darkness for me... The royal bloodline lives on because of your courage. Eldoria is saved!"',
      icon: <Crown className="w-10 h-10 text-amber-400" />
    },
    {
      title: 'GUARDIAN OF ELDORIA',
      speaker: 'The Rebirth of the Kingdom',
      text: 'Golden sunlight bathes the land once more. Kael is crowned the Supreme Guardian of Eldoria, his legend destined to echo through eternity!',
      icon: <Sword className="w-10 h-10 text-emerald-400" />
    }
  ];

  const slides = mode === 'victory_ending' ? endingSlides : prologueSlides;
  const currentSlide = slides[stepIndex];

  const handleNext = () => {
    if (stepIndex < slides.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 select-none">
      <div className="w-full max-w-2xl bg-slate-950 border-2 border-amber-600/70 rounded-2xl overflow-hidden shadow-2xl flex flex-col p-8 text-center items-center">
        {/* Animated Emblem */}
        <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-amber-500/50 flex items-center justify-center mb-6 shadow-xl">
          {currentSlide.icon}
        </div>

        {/* Story Title */}
        <div className="text-[11px] font-mono tracking-widest text-amber-500 uppercase font-black mb-1">
          {currentSlide.speaker}
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-amber-300 uppercase tracking-wider mb-6">
          {currentSlide.title}
        </h2>

        {/* Narrative Text */}
        <p className="text-base md:text-lg text-slate-200 leading-relaxed font-serif italic max-w-lg mb-8">
          "{currentSlide.text}"
        </p>

        {/* Slide Dots & Action Button */}
        <div className="flex items-center justify-between w-full pt-4 border-t border-slate-800">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === stepIndex ? 'w-6 bg-amber-400' : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg active:scale-95"
          >
            <span>{stepIndex === slides.length - 1 ? (mode === 'victory_ending' ? 'Return to Kingdom' : 'Begin Quest') : 'Continue'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

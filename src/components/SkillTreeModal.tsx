import React, { useState } from 'react';
import {
  CloudLightning,
  Flame,
  Ghost,
  RotateCw,
  Shield,
  Snowflake,
  Sparkles,
  Sword,
  Target,
  Wind,
  X,
  Zap
} from 'lucide-react';
import { SKILL_TREE_NODES } from '../game/constants';
import { SkillBranch, SkillNode } from '../types/game';

interface SkillTreeModalProps {
  skillPoints: number;
  unlockedSkills: string[];
  onUnlockSkill: (skillId: string) => void;
  onClose: () => void;
}

export const SkillTreeModal: React.FC<SkillTreeModalProps> = ({
  skillPoints,
  unlockedSkills,
  onUnlockSkill,
  onClose
}) => {
  const [selectedBranch, setSelectedBranch] = useState<SkillBranch>('warrior');
  const [activeNode, setActiveNode] = useState<SkillNode | null>(null);

  const getBranchNodes = (branch: SkillBranch) => {
    return SKILL_TREE_NODES.filter(n => n.branch === branch);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield': return <Shield className="w-6 h-6" />;
      case 'Sword': return <Sword className="w-6 h-6" />;
      case 'RotateCw': return <RotateCw className="w-6 h-6" />;
      case 'Flame': return <Flame className="w-6 h-6" />;
      case 'Wind': return <Wind className="w-6 h-6" />;
      case 'Target': return <Target className="w-6 h-6" />;
      case 'Ghost': return <Ghost className="w-6 h-6" />;
      case 'Zap': return <Zap className="w-6 h-6" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6" />;
      case 'Snowflake': return <Snowflake className="w-6 h-6" />;
      case 'CloudLightning': return <CloudLightning className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 select-none">
      <div className="w-full max-w-3xl bg-slate-950 border border-amber-600/50 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-amber-600/30">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h2 className="text-lg font-black tracking-wider text-amber-400 uppercase">
              Ancestral Skill Trees
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs font-mono px-3 py-1 bg-purple-950/80 border border-purple-500/40 rounded-full text-purple-200">
              Skill Points: <span className="font-bold text-yellow-400">{skillPoints}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Branch Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/90 px-6 pt-3 gap-3">
          <button
            onClick={() => setSelectedBranch('warrior')}
            className={`pb-3 px-4 text-xs font-black tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 ${
              selectedBranch === 'warrior'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sword className="w-4 h-4 text-red-500" />
            Warrior Path
          </button>
          <button
            onClick={() => setSelectedBranch('assassin')}
            className={`pb-3 px-4 text-xs font-black tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 ${
              selectedBranch === 'assassin'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-4 h-4 text-emerald-500" />
            Assassin Path
          </button>
          <button
            onClick={() => setSelectedBranch('mage')}
            className={`pb-3 px-4 text-xs font-black tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 ${
              selectedBranch === 'mage'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4 text-cyan-500" />
            Mage Path
          </button>
        </div>

        {/* Tree Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-y-auto">
          {/* Node Pathway */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Progression Nodes</h3>
            <div className="flex flex-col gap-3">
              {getBranchNodes(selectedBranch).map((node, idx) => {
                const isUnlocked = unlockedSkills.includes(node.id);
                const reqMet = !node.reqSkillId || unlockedSkills.includes(node.reqSkillId);
                const canUnlock = !isUnlocked && reqMet && skillPoints >= node.cost;

                return (
                  <div
                    key={node.id}
                    onClick={() => setActiveNode(node)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isUnlocked
                        ? 'bg-amber-950/30 border-amber-500/60 shadow-md'
                        : canUnlock
                        ? 'bg-slate-900 border-purple-500/50 hover:border-purple-400'
                        : 'bg-slate-950/50 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center border ${
                          isUnlocked
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-900 text-slate-400 border-slate-700'
                        }`}
                      >
                        {getIcon(node.icon)}
                      </div>
                      <div>
                        <div className="text-xs font-black text-white flex items-center gap-2">
                          <span>{node.name}</span>
                          {isUnlocked && (
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          {node.description}
                        </div>
                      </div>
                    </div>

                    {!isUnlocked && (
                      <span className="text-xs font-mono text-amber-300 font-bold">
                        {node.cost} SP
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Node Inspector & Unlock CTA */}
          <div className="flex flex-col justify-between bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
            {activeNode ? (
              <div className="flex flex-col gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-slate-800 text-amber-300 rounded">
                    Tier Ability
                  </span>
                  <h4 className="text-base font-black text-white mt-2">{activeNode.name}</h4>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-purple-500/50 pl-2">
                  "{activeNode.description}"
                </p>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono flex flex-col gap-1 text-slate-400">
                  <div>Cost: <span className="text-amber-400 font-bold">{activeNode.cost} Skill Points</span></div>
                  <div>Status: {unlockedSkills.includes(activeNode.id) ? (
                    <span className="text-emerald-400 font-bold">Unlocked & Mastered</span>
                  ) : (
                    <span className="text-slate-500">Locked</span>
                  )}</div>
                </div>

                {!unlockedSkills.includes(activeNode.id) && (
                  <button
                    disabled={
                      (activeNode.reqSkillId && !unlockedSkills.includes(activeNode.reqSkillId)) ||
                      skillPoints < activeNode.cost
                    }
                    onClick={() => onUnlockSkill(activeNode.id)}
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:pointer-events-none text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-colors shadow-lg mt-4"
                  >
                    Unlock Ability
                  </button>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-mono text-slate-500">
                Select an ability node to inspect and learn
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

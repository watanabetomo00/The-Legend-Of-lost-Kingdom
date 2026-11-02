import React, { useState } from 'react';
import {
  Flame,
  FlaskConical,
  FlaskRound,
  Gem,
  Plus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Shirt,
  Sparkles,
  Sword,
  X,
  Zap
} from 'lucide-react';
import { Equipment, Item, PlayerStats } from '../types/game';

interface InventoryModalProps {
  stats: PlayerStats;
  equipment: Equipment;
  inventory: Item[];
  onClose: () => void;
  onEquipItem: (item: Item) => void;
  onUnequipSlot: (slot: keyof Equipment) => void;
  onUseItem: (item: Item) => void;
  onAllocateStat: (stat: 'strength' | 'defense' | 'agility' | 'arcane') => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  stats,
  equipment,
  inventory,
  onClose,
  onEquipItem,
  onUnequipSlot,
  onUseItem,
  onAllocateStat
}) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(inventory[0] || null);

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'mythical':
        return 'text-yellow-400 bg-yellow-950/80 border-yellow-500/50';
      case 'legendary':
        return 'text-orange-400 bg-orange-950/80 border-orange-500/50';
      case 'epic':
        return 'text-purple-400 bg-purple-950/80 border-purple-500/50';
      case 'rare':
        return 'text-cyan-400 bg-cyan-950/80 border-cyan-500/50';
      default:
        return 'text-slate-300 bg-slate-900 border-slate-700';
    }
  };

  const renderSlot = (slot: keyof Equipment, label: string, icon: React.ReactNode) => {
    const item = equipment[slot];
    return (
      <div
        onClick={() => item && setSelectedItem(item)}
        className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
          item
            ? 'bg-slate-900/90 border-amber-600/40 hover:border-amber-400'
            : 'bg-slate-950/60 border-slate-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-slate-800/80 flex items-center justify-center border border-slate-700">
            {icon}
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{label}</div>
            <div className="text-xs font-semibold text-slate-200" style={{ color: item?.color || '#94a3b8' }}>
              {item ? item.name : 'Empty'}
            </div>
          </div>
        </div>
        {item && (
          <button
            onClick={e => {
              e.stopPropagation();
              onUnequipSlot(slot);
            }}
            className="text-[10px] font-mono px-2 py-1 bg-red-950/60 hover:bg-red-800 text-red-200 rounded border border-red-800/50"
          >
            Unequip
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 select-none">
      <div className="w-full max-w-4xl bg-slate-950 border border-amber-600/50 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-amber-600/30">
          <div className="flex items-center gap-3">
            <Sword className="w-6 h-6 text-amber-400" />
            <h2 className="text-lg font-black tracking-wider text-amber-400 uppercase">
              Character Equipment & Inventory
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm font-mono text-amber-200">
              Gold: <span className="font-bold text-yellow-400">{stats.gold}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 overflow-y-auto">
          {/* Column 1: Equipped Gear & Stat Allocation */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400/90">Equipped Gear</h3>
            <div className="flex flex-col gap-2">
              {renderSlot('weapon', 'Main Weapon', <Sword className="w-5 h-5 text-amber-400" />)}
              {renderSlot('shield', 'Offhand Shield', <Shield className="w-5 h-5 text-blue-400" />)}
              {renderSlot('armor', 'Body Armor', <Shirt className="w-5 h-5 text-emerald-400" />)}
              {renderSlot('ring', 'Royal Ring', <Gem className="w-5 h-5 text-purple-400" />)}
            </div>

            {/* Character Stats & Points */}
            <div className="mt-2 bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                <span>ATTRIBUTE STATS</span>
                {stats.statPoints > 0 && (
                  <span className="text-[11px] font-mono text-emerald-400 animate-pulse">
                    {stats.statPoints} Points Available!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-red-400">STR: {stats.strength}</span>
                  {stats.statPoints > 0 && (
                    <button
                      onClick={() => onAllocateStat('strength')}
                      className="p-0.5 bg-red-900 hover:bg-red-700 text-white rounded"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-blue-400">DEF: {stats.defense}</span>
                  {stats.statPoints > 0 && (
                    <button
                      onClick={() => onAllocateStat('defense')}
                      className="p-0.5 bg-blue-900 hover:bg-blue-700 text-white rounded"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-emerald-400">AGI: {stats.agility}</span>
                  {stats.statPoints > 0 && (
                    <button
                      onClick={() => onAllocateStat('agility')}
                      className="p-0.5 bg-emerald-900 hover:bg-emerald-700 text-white rounded"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-purple-400">ARC: {stats.arcane}</span>
                  {stats.statPoints > 0 && (
                    <button
                      onClick={() => onAllocateStat('arcane')}
                      className="p-0.5 bg-purple-900 hover:bg-purple-700 text-white rounded"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Inventory Grid */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400/90">
                Pouch & Storage ({inventory.length}/30)
              </h3>
            </div>

            <div className="grid grid-cols-4 gap-2 bg-slate-900/50 p-3 rounded-lg border border-slate-800 min-h-[320px] max-h-[360px] overflow-y-auto">
              {inventory.map(item => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`aspect-square rounded-lg p-1.5 flex flex-col items-center justify-center relative border transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-amber-950/40 ring-1 ring-amber-400'
                        : 'border-slate-800 bg-slate-950/70 hover:border-slate-600'
                    }`}
                  >
                    <div
                      className="w-2 h-2 rounded-full absolute top-1.5 right-1.5"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.type === 'weapon' && <Sword className="w-6 h-6 text-amber-400" />}
                    {item.type === 'shield' && <Shield className="w-6 h-6 text-blue-400" />}
                    {item.type === 'armor' && <Shirt className="w-6 h-6 text-emerald-400" />}
                    {item.type === 'potion' && <FlaskConical className="w-6 h-6 text-red-400" />}
                    {item.type === 'ring' && <Gem className="w-6 h-6 text-purple-400" />}
                    <span className="text-[9px] font-mono text-slate-300 mt-1 truncate max-w-full">
                      {item.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
              {/* Empty slot indicators */}
              {Array.from({ length: Math.max(0, 16 - inventory.length) }).map((_, i) => (
                <div
                  key={`empty_${i}`}
                  className="aspect-square rounded-lg border border-dashed border-slate-800/80 bg-slate-950/30"
                />
              ))}
            </div>
          </div>

          {/* Column 3: Item Inspector / Details */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400/90">Item Inspection</h3>
            {selectedItem ? (
              <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-lg flex flex-col justify-between h-full">
                <div className="flex flex-col gap-3">
                  <div>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getRarityBadge(selectedItem.rarity)}`}>
                      {selectedItem.rarity} {selectedItem.type}
                    </span>
                    <h4 className="text-base font-black text-white mt-1.5" style={{ color: selectedItem.color }}>
                      {selectedItem.name}
                    </h4>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-amber-600/50 pl-2">
                    "{selectedItem.description}"
                  </p>

                  <div className="bg-slate-950/80 p-3 rounded border border-slate-800 flex flex-col gap-1.5 font-mono text-xs">
                    {selectedItem.attack && (
                      <div className="text-red-400 font-bold flex justify-between">
                        <span>Physical Attack:</span>
                        <span>+{selectedItem.attack}</span>
                      </div>
                    )}
                    {selectedItem.defense && (
                      <div className="text-blue-400 font-bold flex justify-between">
                        <span>Armor Defense:</span>
                        <span>+{selectedItem.defense}</span>
                      </div>
                    )}
                    {selectedItem.critRate && (
                      <div className="text-amber-400 font-bold flex justify-between">
                        <span>Critical Chance:</span>
                        <span>+{selectedItem.critRate}%</span>
                      </div>
                    )}
                    {selectedItem.bonusHp && (
                      <div className="text-emerald-400 font-bold flex justify-between">
                        <span>Max Health:</span>
                        <span>+{selectedItem.bonusHp}</span>
                      </div>
                    )}
                    {selectedItem.healAmount && (
                      <div className="text-emerald-400 font-bold flex justify-between">
                        <span>Restores HP:</span>
                        <span>+{selectedItem.healAmount}</span>
                      </div>
                    )}
                    {selectedItem.manaAmount && (
                      <div className="text-cyan-400 font-bold flex justify-between">
                        <span>Restores MP:</span>
                        <span>+{selectedItem.manaAmount}</span>
                      </div>
                    )}
                    <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-800 flex justify-between">
                      <span>Vendor Value:</span>
                      <span>{selectedItem.value} Gold</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                  {selectedItem.type === 'potion' ? (
                    <button
                      onClick={() => onUseItem(selectedItem)}
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-colors shadow-lg"
                    >
                      Consume Potion
                    </button>
                  ) : (
                    <button
                      onClick={() => onEquipItem(selectedItem)}
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-lg text-xs uppercase tracking-wider transition-colors shadow-lg"
                    >
                      Equip Item
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-slate-800 rounded-lg text-slate-500 text-xs font-mono">
                Select an item to view stats
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

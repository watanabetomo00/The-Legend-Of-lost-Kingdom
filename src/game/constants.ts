import { BiomeType, Item, LevelInfo, SkillNode } from '../types/game';

export const BIOMES: Record<BiomeType, {
  name: string;
  themeColor: string;
  fogColor: number;
  skyColor: number;
  groundColor: number;
  description: string;
}> = {
  kingdom: {
    name: 'Forgotten Kingdom',
    themeColor: '#10b981',
    fogColor: 0x86efac,
    skyColor: 0x38bdf8,
    groundColor: 0x2d5a27,
    description: 'Lush green forests, crumbling stone castles, ancient village ruins, and roaming goblin hordes.'
  },
  wilderness: {
    name: 'Cursed Wilderness',
    themeColor: '#a855f7',
    fogColor: 0x2e1065,
    skyColor: 0x3b0764,
    groundColor: 0x1c1917,
    description: 'Murky poison bogs, dark damp caverns, venomous spiders, undead husks, and giant swamp trolls.'
  },
  mountains: {
    name: 'Frozen Mountains',
    themeColor: '#06b6d4',
    fogColor: 0xcffafe,
    skyColor: 0x7dd3fc,
    groundColor: 0xe0f2fe,
    description: 'Biting blizzards, treacherous icy crags, frost giants, and howling glacial wyrms.'
  },
  infernal: {
    name: 'Infernal Lands',
    themeColor: '#f97316',
    fogColor: 0x450a0a,
    skyColor: 0x7f1d1d,
    groundColor: 0x26120e,
    description: 'Molten magma rivers, raining fire embers, brimstone demons, and scorching volcanic fortresses.'
  },
  shadow: {
    name: 'Shadow Realm',
    themeColor: '#6366f1',
    fogColor: 0x09090b,
    skyColor: 0x18181b,
    groundColor: 0x0f172a,
    description: 'The dark dominion of Malakar. Obsidian spires, demon legions, and the dreaded Black Fortress.'
  }
};

export const LEVELS: LevelInfo[] = [
  // Levels 1-10: Forgotten Kingdom
  { levelNumber: 1, title: 'Whispering Woods', regionName: 'Forgotten Kingdom', biome: 'kingdom', description: 'Begin your quest to find Princess Aria. Clear the woods of scout goblins.', objective: 'Defeat 5 Goblin Scouts & Reach the Gate', recommendedLevel: 1, enemiesCount: 5, isBossLevel: false, unlocked: true, completed: false },
  { levelNumber: 2, title: 'Village of Elden', regionName: 'Forgotten Kingdom', biome: 'kingdom', description: 'The old village is overrun by goblin pillagers. Drive them back.', objective: 'Defeat 6 Goblins & Free the Elder', recommendedLevel: 2, enemiesCount: 6, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 3, title: 'Ruined Watchtower', regionName: 'Forgotten Kingdom', biome: 'kingdom', description: 'Skeleton warriors guard the ruined stone tower.', objective: 'Slay 7 Skeletons & Climb the Tower', recommendedLevel: 3, enemiesCount: 7, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 4, title: 'Old Watermill Pass', regionName: 'Forgotten Kingdom', biome: 'kingdom', description: 'Cross the broken wooden bridge past ambushing enemies.', objective: 'Defeat 8 Enemies & Secure the Bridge', recommendedLevel: 4, enemiesCount: 8, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 5, title: 'Sunken Crypts', regionName: 'Forgotten Kingdom', biome: 'kingdom', description: 'Ancient tomb underneath the kingdom holding old relics.', objective: 'Defeat 8 Skeletons & Recover Royal Seal', recommendedLevel: 5, enemiesCount: 8, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 6, title: 'Bandit Camp', regionName: 'Forgotten Kingdom', biome: 'kingdom', description: 'A fortified outpost blocking the main mountain road.', objective: 'Defeat 9 Outlaw Warriors', recommendedLevel: 6, enemiesCount: 9, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 7, title: 'Sanctuary of Light', regionName: 'Forgotten Kingdom', biome: 'kingdom', description: 'A desecrated shrine holding forgotten magical energies.', objective: 'Cleanse 3 Corrupted Monoliths', recommendedLevel: 7, enemiesCount: 9, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 8, title: 'Ancient Cemetery', regionName: 'Forgotten Kingdom', biome: 'kingdom', description: 'Foggy graveyard where resting knights have been awakened by dark magic.', objective: 'Defeat 10 Restless Guardians', recommendedLevel: 8, enemiesCount: 10, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 9, title: 'Royal Catacombs', regionName: 'Forgotten Kingdom', biome: 'kingdom', description: 'The inner subterranean halls beneath the ruined capital.', objective: 'Defeat 10 Elite Skeleton Soldiers', recommendedLevel: 9, enemiesCount: 10, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 10, title: 'Throne of Ruins', regionName: 'Forgotten Kingdom', biome: 'kingdom', description: 'Confront the ferocious Goblin Chieftain Gortok claiming the ancient throne!', objective: 'Defeat Boss: Gortok the Ravager', recommendedLevel: 10, bossName: 'Gortok the Ravager', enemiesCount: 8, isBossLevel: true, unlocked: false, completed: false },

  // Levels 11-20: Cursed Wilderness
  { levelNumber: 11, title: 'Rotwood Marshes', regionName: 'Cursed Wilderness', biome: 'wilderness', description: 'Deep, noxious swamps where the sun never shines.', objective: 'Defeat 8 Swamp Ghouls', recommendedLevel: 11, enemiesCount: 8, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 12, title: 'Serpent Bog', regionName: 'Cursed Wilderness', biome: 'wilderness', description: 'Treacherous mud pits infested with giant poisonous spiders.', objective: 'Defeat 9 Venom Spiders', recommendedLevel: 12, enemiesCount: 9, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 13, title: 'Cavern of Echoes', regionName: 'Cursed Wilderness', biome: 'wilderness', description: 'A cavern humming with necrotic chants.', objective: 'Slay 10 Cave Walkers', recommendedLevel: 13, enemiesCount: 10, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 14, title: 'Poison Mire', regionName: 'Cursed Wilderness', biome: 'wilderness', description: 'Acidic waters and shambling toxic zombies.', objective: 'Destroy 4 Toxic Pustules & 8 Zombies', recommendedLevel: 14, enemiesCount: 10, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 15, title: 'Wailing Fens', regionName: 'Cursed Wilderness', biome: 'wilderness', description: 'Mist-shrouded wetlands where lost souls weep.', objective: 'Defeat 11 Cursed Spirits', recommendedLevel: 15, enemiesCount: 11, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 16, title: 'Troll Hollow', regionName: 'Cursed Wilderness', biome: 'wilderness', description: 'Massive hulking trolls roam this rock-strewn depression.', objective: 'Defeat 2 Swamp Trolls & 6 Minions', recommendedLevel: 16, enemiesCount: 8, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 17, title: 'Blighted Grove', regionName: 'Cursed Wilderness', biome: 'wilderness', description: 'Dead petrified trees warped by demonic contamination.', objective: 'Defeat 11 Blight Creepers', recommendedLevel: 17, enemiesCount: 11, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 18, title: "Witch's Hollow", regionName: 'Cursed Wilderness', biome: 'wilderness', description: 'Hovel of a coven conducting sacrificial dark rites.', objective: 'Interrupt Ritual & Slay 12 Cultists', recommendedLevel: 18, enemiesCount: 12, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 19, title: 'The Gloom Passage', regionName: 'Cursed Wilderness', biome: 'wilderness', description: 'The final barrier before the queen spider nest.', objective: 'Defeat 12 Elite Lurkers', recommendedLevel: 19, enemiesCount: 12, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 20, title: 'Lair of Arachna', regionName: 'Cursed Wilderness', biome: 'wilderness', description: 'The colossal Queen Broodmother Arachna awaits in her giant web sanctuary.', objective: 'Defeat Boss: Queen Arachna', recommendedLevel: 20, bossName: 'Queen Arachna', enemiesCount: 10, isBossLevel: true, unlocked: false, completed: false },

  // Levels 21-30: Frozen Mountains
  { levelNumber: 21, title: 'Snowpeak Footpath', regionName: 'Frozen Mountains', biome: 'mountains', description: 'Climb the frozen ascent through biting winds.', objective: 'Defeat 9 Frost Walkers', recommendedLevel: 21, enemiesCount: 9, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 22, title: 'Howling Ridge', regionName: 'Frozen Mountains', biome: 'mountains', description: 'Wind-whipped razor cliff edges where winter wolves attack.', objective: 'Survive Ridge & Slay 10 Frost Wolves', recommendedLevel: 22, enemiesCount: 10, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 23, title: 'Glacier Crevasse', regionName: 'Frozen Mountains', biome: 'mountains', description: 'Navigate deep blue ice tunnels slick with treacherous frost.', objective: 'Defeat 10 Ice Skeletons', recommendedLevel: 23, enemiesCount: 10, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 24, title: 'Frost Giant Camp', regionName: 'Frozen Mountains', biome: 'mountains', description: 'Towering icy humanoids armed with frozen club boulders.', objective: 'Defeat 3 Frost Giants', recommendedLevel: 24, enemiesCount: 8, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 25, title: 'The Frozen Citadel', regionName: 'Frozen Mountains', biome: 'mountains', description: 'An ancient fortress encased in thousand-year-old permafrost.', objective: 'Breach Gate & Slay 11 Defenders', recommendedLevel: 25, enemiesCount: 11, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 26, title: 'Blizzard Plateau', regionName: 'Frozen Mountains', biome: 'mountains', description: 'Whiteout conditions test your navigation and endurance.', objective: 'Defeat 11 Blizzard Specters', recommendedLevel: 26, enemiesCount: 11, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 27, title: 'Crystal Grotto', regionName: 'Frozen Mountains', biome: 'mountains', description: 'Enchanted glowing blue crystals amplify ice magic.', objective: 'Cleanse 3 Glacial Crystals', recommendedLevel: 27, enemiesCount: 12, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 28, title: 'Avalanche Gorge', regionName: 'Frozen Mountains', biome: 'mountains', description: 'Narrow canyon under threat of falling boulders and ice.', objective: 'Cross Canyon & Defeat 12 Enemies', recommendedLevel: 28, enemiesCount: 12, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 29, title: 'Dragon Nesting Grounds', regionName: 'Frozen Mountains', biome: 'mountains', description: 'Frozen dragon whelps and sentinels defend the approach.', objective: 'Defeat 12 Dragon Guards', recommendedLevel: 29, enemiesCount: 12, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 30, title: 'Summit of Ymir', regionName: 'Frozen Mountains', biome: 'mountains', description: 'The ancient Frost Colossus Ymir awakens to freeze your soul!', objective: 'Defeat Boss: Frost Colossus Ymir', recommendedLevel: 30, bossName: 'Frost Colossus Ymir', enemiesCount: 8, isBossLevel: true, unlocked: false, completed: false },

  // Levels 31-40: Infernal Lands
  { levelNumber: 31, title: 'Brimstone Valley', regionName: 'Infernal Lands', biome: 'infernal', description: 'Descent into the volcanic rifts where lava bubbles at your feet.', objective: 'Defeat 10 Fire Imps', recommendedLevel: 31, enemiesCount: 10, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 32, title: 'Ash Plains', regionName: 'Infernal Lands', biome: 'infernal', description: 'Smoldering ground blanketed by falling embers and cinder.', objective: 'Defeat 11 Magma Fiends', recommendedLevel: 32, enemiesCount: 11, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 33, title: 'Obsidian Rift', regionName: 'Infernal Lands', biome: 'infernal', description: 'Sharp black volcanic glass walls echoing demonic laughter.', objective: 'Navigate Rift & Defeat 11 Demons', recommendedLevel: 33, enemiesCount: 11, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 34, title: 'Molten Bridges', regionName: 'Infernal Lands', biome: 'infernal', description: 'Narrow stone pathways suspended over bubbling magma.', objective: 'Cross Bridges & Slay 12 Fire Warriors', recommendedLevel: 34, enemiesCount: 12, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 35, title: 'Demon Stronghold Gate', regionName: 'Infernal Lands', biome: 'infernal', description: 'Heavily armed demon sentinels guard the lower bastion.', objective: 'Defeat 12 Demon Sentinels', recommendedLevel: 35, enemiesCount: 12, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 36, title: 'Crucible of Souls', regionName: 'Infernal Lands', biome: 'infernal', description: 'Demons forge weapons infused with the souls of the fallen.', objective: 'Destroy 3 Soul Forges', recommendedLevel: 36, enemiesCount: 13, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 37, title: 'Hellfire Bastion', regionName: 'Infernal Lands', biome: 'infernal', description: 'Courtyard of the infernal fortress roaring with hellfire.', objective: 'Defeat 13 Infernal Knights', recommendedLevel: 37, enemiesCount: 13, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 38, title: 'Lava Trench', regionName: 'Infernal Lands', biome: 'infernal', description: 'A chasm where fire geysers blast continuously.', objective: 'Defeat 13 Magma Stalkers', recommendedLevel: 38, enemiesCount: 13, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 39, title: 'Altar of Cinders', regionName: 'Infernal Lands', biome: 'infernal', description: 'The inner ritual chamber feeding heat to Malakar’s armies.', objective: 'Extinguish Altar & Defeat 14 Guardians', recommendedLevel: 39, enemiesCount: 14, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 40, title: 'Caldera of Ignis', regionName: 'Infernal Lands', biome: 'infernal', description: 'Face Pyrolord Ignis, commander of the infernal legions!', objective: 'Defeat Boss: Pyrolord Ignis', recommendedLevel: 40, bossName: 'Pyrolord Ignis', enemiesCount: 10, isBossLevel: true, unlocked: false, completed: false },

  // Levels 41-50: Shadow Realm
  { levelNumber: 41, title: 'Gates of the Void', regionName: 'Shadow Realm', biome: 'shadow', description: 'The boundary between Eldoria and the dark dimensional void.', objective: 'Defeat 12 Shadow Walkers', recommendedLevel: 41, enemiesCount: 12, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 42, title: 'Twilight Abyss', regionName: 'Shadow Realm', biome: 'shadow', description: 'Floating dark islands drifting in infinite starlight and void.', objective: 'Cross Abyss & Slay 13 Void Fiends', recommendedLevel: 42, enemiesCount: 13, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 43, title: 'Citadel of Dread', regionName: 'Shadow Realm', biome: 'shadow', description: 'Towers of pitch-black stone radiating soul-draining energy.', objective: 'Defeat 13 Shadow Knights', recommendedLevel: 43, enemiesCount: 13, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 44, title: 'Hall of Whispers', regionName: 'Shadow Realm', biome: 'shadow', description: 'Corridors echoing with Malakar’s deceptive illusions.', objective: 'Dispel 3 Illusions & Slay 14 Phantoms', recommendedLevel: 44, enemiesCount: 14, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 45, title: 'Phantom Keep', regionName: 'Shadow Realm', biome: 'shadow', description: 'The fortress garrison where Malakar’s elite guards assemble.', objective: 'Defeat 14 Elite Void Stalkers', recommendedLevel: 45, enemiesCount: 14, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 46, title: 'Shadow Colosseum', regionName: 'Shadow Realm', biome: 'shadow', description: 'An arena where dark champions duel for Malakar’s favor.', objective: 'Survive 3 Waves of Champions', recommendedLevel: 46, enemiesCount: 15, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 47, title: 'Eclipse Spire', regionName: 'Shadow Realm', biome: 'shadow', description: 'A towering needle pointing toward the blood-red eclipse.', objective: 'Climb Spire & Slay 15 Voidcasters', recommendedLevel: 47, enemiesCount: 15, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 48, title: 'Gates of Torment', regionName: 'Shadow Realm', biome: 'shadow', description: 'The iron gates guarding the entrance to the Black Fortress.', objective: 'Smash Gates & Slay 15 Demon Generals', recommendedLevel: 48, enemiesCount: 15, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 49, title: 'Inner Sanctum of Malakar', regionName: 'Shadow Realm', biome: 'shadow', description: 'The dark corridor right before the throne of Princess Aria’s prison.', objective: 'Defeat 16 Royal Shadow Sentinels', recommendedLevel: 49, enemiesCount: 16, isBossLevel: false, unlocked: false, completed: false },
  { levelNumber: 50, title: 'The Black Fortress: Malakar', regionName: 'Shadow Realm', biome: 'shadow', description: 'The final showdown! Slay Demon King Malakar across his 4 deadly forms and rescue Princess Aria!', objective: 'Defeat Final Boss: Demon King Malakar', recommendedLevel: 50, bossName: 'Demon King Malakar', enemiesCount: 1, isBossLevel: true, unlocked: false, completed: false },
];

export const INITIAL_ITEMS: Item[] = [
  {
    id: 'weapon_starter',
    name: "Kael's Iron Broadsword",
    type: 'weapon',
    rarity: 'common',
    description: 'A sturdy iron blade carried by Kael from the royal guard.',
    levelReq: 1,
    attack: 18,
    critRate: 5,
    value: 50,
    icon: 'Sword',
    color: '#94a3b8'
  },
  {
    id: 'shield_starter',
    name: 'Lion Crest Buckler',
    type: 'shield',
    rarity: 'common',
    description: 'A round oak shield bound in brass bearing the lion of Eldoria.',
    levelReq: 1,
    defense: 12,
    bonusHp: 40,
    value: 40,
    icon: 'Shield',
    color: '#94a3b8'
  },
  {
    id: 'armor_starter',
    name: 'Leather Guard Cuirass',
    type: 'armor',
    rarity: 'common',
    description: 'Tough boiled leather offering basic protection and agility.',
    levelReq: 1,
    defense: 15,
    bonusHp: 60,
    value: 45,
    icon: 'Shirt',
    color: '#94a3b8'
  },
  {
    id: 'potion_hp_starter',
    name: 'Minor Health Potion',
    type: 'potion',
    rarity: 'common',
    description: 'Restores 120 HP instantly when drunk.',
    levelReq: 1,
    healAmount: 120,
    value: 15,
    icon: 'FlaskConical',
    color: '#ef4444'
  },
  {
    id: 'potion_mana_starter',
    name: 'Minor Mana Elixir',
    type: 'potion',
    rarity: 'common',
    description: 'Restores 80 Mana instantly.',
    levelReq: 1,
    manaAmount: 80,
    value: 15,
    icon: 'FlaskRound',
    color: '#3b82f6'
  }
];

export const ALL_ITEMS_CATALOG: Item[] = [
  ...INITIAL_ITEMS,
  // Rare drops (Forgotten Kingdom)
  {
    id: 'wpn_goblinslayer',
    name: 'Goblinslayer Scimitar',
    type: 'weapon',
    rarity: 'rare',
    description: 'A serrated steel blade that cleaves green skins with ease.',
    levelReq: 4,
    attack: 32,
    critRate: 8,
    value: 140,
    icon: 'Sword',
    color: '#38bdf8'
  },
  {
    id: 'shld_knight',
    name: "Royal Knight's Heater",
    type: 'shield',
    rarity: 'rare',
    description: 'Polished steel kite shield with reinforced boss.',
    levelReq: 5,
    defense: 26,
    bonusHp: 80,
    value: 160,
    icon: 'Shield',
    color: '#38bdf8'
  },
  {
    id: 'arm_chainmail',
    name: 'Eldorian Chainmail Hauberk',
    type: 'armor',
    rarity: 'rare',
    description: 'Interlinked steel rings dampening blade slashes.',
    levelReq: 6,
    defense: 30,
    bonusHp: 110,
    value: 180,
    icon: 'Shirt',
    color: '#38bdf8'
  },
  // Epic drops (Cursed Wilderness & Frozen Mountains)
  {
    id: 'wpn_venom_fang',
    name: 'Fang of Arachna',
    type: 'weapon',
    rarity: 'epic',
    description: 'Forged from the venom glands of the giant spider queen.',
    levelReq: 15,
    attack: 58,
    critRate: 15,
    value: 450,
    icon: 'Sword',
    color: '#a855f7'
  },
  {
    id: 'wpn_frostbrand',
    name: 'Frostbrand Claymore',
    type: 'weapon',
    rarity: 'epic',
    description: 'A greatsword radiating subzero mist that shatters armor.',
    levelReq: 25,
    attack: 85,
    critRate: 18,
    value: 800,
    icon: 'Sword',
    color: '#a855f7'
  },
  {
    id: 'shld_glacier',
    name: 'Aegis of the Glacier',
    type: 'shield',
    rarity: 'epic',
    description: 'Carved from unbreakable blue glacier ice that never melts.',
    levelReq: 25,
    defense: 65,
    bonusHp: 220,
    value: 750,
    icon: 'Shield',
    color: '#a855f7'
  },
  {
    id: 'arm_frostplate',
    name: 'Ymir Frostplate',
    type: 'armor',
    rarity: 'epic',
    description: 'Heavy armor forged by frost giants in mountain peaks.',
    levelReq: 28,
    defense: 72,
    bonusHp: 300,
    value: 920,
    icon: 'Shirt',
    color: '#a855f7'
  },
  // Legendary drops (Infernal Lands & Shadow Realm)
  {
    id: 'wpn_sunfury',
    name: 'Sunfury Volcanic Blade',
    type: 'weapon',
    rarity: 'legendary',
    description: 'Contains a core of living magma that ignites foes on contact.',
    levelReq: 38,
    attack: 135,
    critRate: 24,
    value: 1800,
    icon: 'Flame',
    color: '#f97316'
  },
  {
    id: 'shld_magma',
    name: 'Bulwark of the Inferno',
    type: 'shield',
    rarity: 'legendary',
    description: 'Absorbs destructive impact and reflects fiery backlashes.',
    levelReq: 38,
    defense: 110,
    bonusHp: 450,
    value: 1650,
    icon: 'Shield',
    color: '#f97316'
  },
  {
    id: 'wpn_shadow_reaper',
    name: 'Void Shadowfang',
    type: 'weapon',
    rarity: 'legendary',
    description: 'A blade pulled from the abyss that slices through reality.',
    levelReq: 45,
    attack: 180,
    critRate: 30,
    value: 2800,
    icon: 'Zap',
    color: '#f97316'
  },
  // Mythical drops (Ultimate Malakar Slayers)
  {
    id: 'wpn_eldorian_excalibur',
    name: 'Dawnbreaker: Blade of Eldoria',
    type: 'weapon',
    rarity: 'mythical',
    description: 'The ancient sacred sword of the royal dynasty. Radiant with pure holy light.',
    levelReq: 48,
    attack: 240,
    critRate: 35,
    bonusHp: 500,
    bonusMana: 300,
    value: 6000,
    icon: 'Sparkles',
    color: '#eab308'
  },
  {
    id: 'shld_sacred_aegis',
    name: 'Aegis of the Sun Queen',
    type: 'shield',
    rarity: 'mythical',
    description: 'Divine shield imbued with the blessing of Princess Aria.',
    levelReq: 48,
    defense: 160,
    bonusHp: 650,
    value: 5500,
    icon: 'ShieldAlert',
    color: '#eab308'
  },
  {
    id: 'arm_divine_plate',
    name: 'Celestial Dragon Armor',
    type: 'armor',
    rarity: 'mythical',
    description: 'Impenetrable armor forged from the scales of the heavenly dragon.',
    levelReq: 48,
    defense: 180,
    bonusHp: 800,
    bonusMana: 250,
    value: 6500,
    icon: 'ShieldCheck',
    color: '#eab308'
  },
  {
    id: 'ring_aria',
    name: "Princess Aria's Royal Signet",
    type: 'ring',
    rarity: 'mythical',
    description: 'A ring of pure sapphire and gold carrying Aria’s eternal gratitude.',
    levelReq: 1,
    attack: 40,
    defense: 35,
    critRate: 15,
    bonusHp: 300,
    value: 4000,
    icon: 'Gem',
    color: '#eab308'
  }
];

export const SKILL_TREE_NODES: SkillNode[] = [
  // Warrior Tree
  { id: 'w1', name: 'Iron Will', branch: 'warrior', description: '+20% Defense and +100 Max Health.', cost: 1, unlocked: false, icon: 'Shield', passiveBonus: { defense: 20, maxHp: 100 } },
  { id: 'w2', name: 'Heavy Cleave', branch: 'warrior', description: '+25% Sword combo attack damage.', cost: 1, unlocked: false, reqSkillId: 'w1', icon: 'Sword', passiveBonus: { strength: 15 } },
  { id: 'w3', name: 'Whirlwind Slash', branch: 'warrior', description: 'Empowers spin finisher with a circular shockwave.', cost: 2, unlocked: false, reqSkillId: 'w2', icon: 'RotateCw', passiveBonus: { strength: 25, defense: 10 } },
  { id: 'w4', name: 'Berserker Fortitude', branch: 'warrior', description: 'At low health, increase attack power by 50%.', cost: 3, unlocked: false, reqSkillId: 'w3', icon: 'Flame', passiveBonus: { strength: 40, maxHp: 250 } },

  // Assassin Tree
  { id: 'a1', name: 'Fleet Footwork', branch: 'assassin', description: '+15% Movement speed and dodge stamina cost reduced.', cost: 1, unlocked: false, icon: 'Wind', passiveBonus: { critRate: 5 } },
  { id: 'a2', name: 'Deadly Precision', branch: 'assassin', description: '+12% Critical hit chance.', cost: 1, unlocked: false, reqSkillId: 'a1', icon: 'Target', passiveBonus: { critRate: 12 } },
  { id: 'a3', name: 'Shadow Dash', branch: 'assassin', description: 'Dodge roll turns into a smoke blink that leaves decoys.', cost: 2, unlocked: false, reqSkillId: 'a2', icon: 'Ghost', passiveBonus: { critRate: 10, strength: 20 } },
  { id: 'a4', name: 'Executioner', branch: 'assassin', description: 'Critical hits deal 250% damage instead of 150%.', cost: 3, unlocked: false, reqSkillId: 'a3', icon: 'Zap', passiveBonus: { critRate: 15, strength: 35 } },

  // Mage Tree
  { id: 'm1', name: 'Arcane Affinity', branch: 'mage', description: '+100 Max Mana and +20% Mana regen.', cost: 1, unlocked: false, icon: 'Sparkles', passiveBonus: { maxMana: 100 } },
  { id: 'm2', name: 'Firestorm Mastery', branch: 'mage', description: 'Fireball radius and burn damage increased by 40%.', cost: 1, unlocked: false, reqSkillId: 'm1', icon: 'Flame', passiveBonus: { maxMana: 50 } },
  { id: 'm3', name: 'Frost Nova Blizzard', branch: 'mage', description: 'Frost Nova freezes enemies in ice blocks for 3 seconds.', cost: 2, unlocked: false, reqSkillId: 'm2', icon: 'Snowflake', passiveBonus: { maxMana: 100 } },
  { id: 'm4', name: 'Heavenly Lightning', branch: 'mage', description: 'Calls down 3 consecutive divine lightning bolts.', cost: 3, unlocked: false, reqSkillId: 'm3', icon: 'CloudLightning', passiveBonus: { maxMana: 200, strength: 30 } }
];

import React, { useEffect, useRef, useState } from 'react';
import { GameScene } from './3d/gameScene';
import { ALL_ITEMS_CATALOG, INITIAL_ITEMS, LEVELS } from './game/constants';
import {
  calculateEffectiveStats,
  generateEnemiesForLevel,
  INITIAL_EQUIPMENT,
  INITIAL_PLAYER_STATS,
  loadGameFromStorage,
  processPlayerGainXp,
  saveGameToStorage
} from './game/rules';
import { soundManager } from './audio/soundManager';
import {
  CameraMode,
  EnemyData,
  Equipment,
  GameState,
  Item,
  LevelInfo,
  PlayerStats,
  SavedGameData
} from './types/game';
import { HUD } from './components/HUD';
import { InventoryModal } from './components/InventoryModal';
import { GameOverModal, StageClearModal } from './components/OutcomeModals';
import { PauseModal } from './components/PauseModal';
import { SkillTreeModal } from './components/SkillTreeModal';
import { StoryModal } from './components/StoryModal';
import { TitleScreen } from './components/TitleScreen';
import { WorldMapModal } from './components/WorldMapModal';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<GameScene | null>(null);

  // Game Lifecycle State
  const [gameState, setGameState] = useState<GameState>('title');
  const [cameraMode, setCameraMode] = useState<CameraMode>('tpp');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Player Progression
  const [playerStats, setPlayerStats] = useState<PlayerStats>(INITIAL_PLAYER_STATS);
  const [equipment, setEquipment] = useState<Equipment>(INITIAL_EQUIPMENT);
  const [inventory, setInventory] = useState<Item[]>([
    ...INITIAL_ITEMS,
    ALL_ITEMS_CATALOG.find(i => i.id === 'wpn_goblinslayer')!
  ]);
  const [unlockedSkills, setUnlockedSkills] = useState<string[]>(['w1']);

  // Level Progression across 50 Levels
  const [currentLevelNumber, setCurrentLevelNumber] = useState<number>(1);
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1]);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [activeBossEnemy, setActiveBossEnemy] = useState<EnemyData | null>(null);

  // Modals Visibility
  const [showInventory, setShowInventory] = useState<boolean>(false);
  const [showSkillTree, setShowSkillTree] = useState<boolean>(false);
  const [showWorldMap, setShowWorldMap] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>('');

  // End of level / Run snapshot metrics
  const [lastStageClear, setLastStageClear] = useState<{
    level: LevelInfo;
    goldEarned: number;
    xpEarned: number;
    loot: Item[];
  } | null>(null);

  const hasSaveData = useRef<boolean>(false);
  useEffect(() => {
    hasSaveData.current = !!loadGameFromStorage();
  }, []);

  // Sync gameState with document.body.dataset.state for ultra-mode criteria
  useEffect(() => {
    const datasetState = gameState === 'victory' || gameState === 'gameover'
      ? 'gameover'
      : gameState;
    document.body.dataset.state = datasetState;
  }, [gameState]);

  // Handle URL ?autostart=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      startGame(false);
    }
  }, []);

  // Initialize Three.js Game Engine once in mountRef
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new GameScene(mountRef.current, {
      onPlayerDamage: (damage, isParried) => {
        if (isParried) return;
        setPlayerStats(prev => {
          const newHp = Math.max(0, prev.hp - damage);
          if (newHp <= 0) {
            setGameState('gameover');
          }
          return { ...prev, hp: newHp };
        });
      },
      onEnemyDamage: (enemyId, damage, isCrit) => {
        setActiveBossEnemy(prev => {
          if (prev && prev.id === enemyId) {
            return { ...prev, hp: Math.max(0, prev.hp - damage) };
          }
          return prev;
        });
      },
      onEnemyKilled: enemy => {
        // Gain XP and Gold
        setPlayerStats(prev => {
          const xpResult = processPlayerGainXp(prev, enemy.xpReward);
          const updated = {
            ...xpResult.stats,
            gold: prev.gold + enemy.goldReward
          };
          if (xpResult.leveledUp) {
            soundManager.playLevelUp();
          }
          return updated;
        });
      },
      onLootCollected: items => {
        setInventory(prev => [...prev, ...items]);
        soundManager.playLootPickup();
      },
      onLevelComplete: levelNum => {
        const lvlInfo = LEVELS.find(l => l.levelNumber === levelNum) || LEVELS[0];
        setCompletedLevels(prev => (prev.includes(levelNum) ? prev : [...prev, levelNum]));
        if (levelNum < 50) {
          setUnlockedLevels(prev => (prev.includes(levelNum + 1) ? prev : [...prev, levelNum + 1]));
        }

        // Check if final boss Malakar Level 50 defeated!
        if (levelNum === 50) {
          setGameState('ending');
        } else {
          setLastStageClear({
            level: lvlInfo,
            goldEarned: 50 * levelNum,
            xpEarned: 100 * levelNum,
            loot: []
          });
          setGameState('victory');
        }
      },
      onLevelDefeat: () => {
        setGameState('gameover');
      },
      onBossPhaseChange: phase => {
        // Boss phase notification
      }
    });

    sceneRef.current = scene;

    // Immediately load level 1 into the newly created scene
    const initialLvl = LEVELS[0];
    const enemies = generateEnemiesForLevel(initialLvl);
    scene.loadLevel(initialLvl, enemies);

    return () => {
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  // Update visual equipment when equipment changes
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.updateEquipmentVisuals(equipment);
    }
  }, [equipment]);

  // Setup Level on change
  const setupLevel = (lvlNum: number) => {
    setCurrentLevelNumber(lvlNum);
    const lvlInfo = LEVELS.find(l => l.levelNumber === lvlNum) || LEVELS[0];
    const enemies = generateEnemiesForLevel(lvlInfo);

    const boss = enemies.find(e => e.isBoss) || null;
    setActiveBossEnemy(boss);

    // Reset player HP/Mana to full
    setPlayerStats(prev => ({
      ...prev,
      hp: prev.maxHp,
      stamina: prev.maxStamina,
      mana: prev.maxMana
    }));

    if (sceneRef.current) {
      sceneRef.current.loadLevel(lvlInfo, enemies);
    }
  };

  // Keyboard and Mouse input hygiene
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') {
        if ((e.code === 'Escape' || e.code === 'KeyP') && gameState === 'paused') {
          setGameState('playing');
        }
        return;
      }

      if (e.code === 'KeyV') {
        toggleCamera();
        return;
      }
      if (e.code === 'KeyI' || e.code === 'Tab') {
        e.preventDefault();
        setShowInventory(prev => !prev);
        return;
      }
      if (e.code === 'KeyK') {
        setShowSkillTree(prev => !prev);
        return;
      }
      if (e.code === 'KeyM') {
        setShowWorldMap(prev => !prev);
        return;
      }
      if (e.code === 'Escape' || e.code === 'KeyP') {
        setGameState('paused');
        return;
      }
      if (e.code === 'Digit1') {
        castSkill(1);
        return;
      }
      if (e.code === 'Digit2') {
        castSkill(2);
        return;
      }
      if (e.code === 'Digit3') {
        castSkill(3);
        return;
      }
      if (e.code === 'Digit4') {
        castSkill(4);
        return;
      }
      if (e.code === 'KeyR') {
        castSkill(5);
        return;
      }
      if (e.code === 'Digit5') {
        useHealthPotion();
        return;
      }
      if (e.code === 'Digit6') {
        useManaPotion();
        return;
      }
      if (e.code === 'KeyE') {
        sceneRef.current?.interactNearestObject();
        return;
      }
      if (e.code === 'KeyC') {
        sceneRef.current?.performDodgeRoll();
        return;
      }
      if (e.code === 'KeyQ') {
        sceneRef.current?.setBlocking(true);
        return;
      }
      if (e.code === 'KeyF') {
        sceneRef.current?.performHeavyAttack();
        return;
      }

      sceneRef.current?.keysPressed.add(e.code);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyQ') {
        sceneRef.current?.setBlocking(false);
      }
      sceneRef.current?.keysPressed.delete(e.code);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (gameState === 'playing' && document.pointerLockElement) {
        if (sceneRef.current) {
          sceneRef.current.mouseLookDelta.x += e.movementX;
          sceneRef.current.mouseLookDelta.y += e.movementY;
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (gameState === 'playing') {
        if (e.button === 0) {
          sceneRef.current?.performLightAttack();
        } else if (e.button === 2) {
          sceneRef.current?.setBlocking(true);
        }
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 2) {
        sceneRef.current?.setBlocking(false);
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleBlur = () => {
      sceneRef.current?.keysPressed.clear();
      sceneRef.current?.setBlocking(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('blur', handleBlur);
    };
  }, [gameState]);

  // Start / Load Game Handlers
  const startGame = (showPrologue: boolean = true) => {
    if (showPrologue) {
      setGameState('prologue');
    } else {
      setGameState('playing');
      setupLevel(1);
      mountRef.current?.requestPointerLock();
    }
  };

  const continueSavedGame = () => {
    const saved = loadGameFromStorage();
    if (saved) {
      setPlayerStats(saved.playerStats);
      setEquipment(saved.equipment);
      setInventory(saved.inventory);
      setUnlockedSkills(saved.unlockedSkills);
      setCurrentLevelNumber(saved.currentLevel);
      setUnlockedLevels(saved.unlockedLevels);
      setCompletedLevels(saved.completedLevels);
      setCameraMode(saved.selectedCamera);
      sceneRef.current?.setCameraMode(saved.selectedCamera);

      setGameState('playing');
      setupLevel(saved.currentLevel);
      mountRef.current?.requestPointerLock();
    }
  };

  const saveCurrentGame = () => {
    const data: SavedGameData = {
      playerStats,
      equipment,
      inventory,
      unlockedSkills,
      currentLevel: currentLevelNumber,
      unlockedLevels,
      completedLevels,
      selectedCamera: cameraMode,
      timestamp: Date.now()
    };
    const ok = saveGameToStorage(data);
    setSaveMessage(ok ? 'Game saved to local archive!' : 'Save failed');
    setTimeout(() => setSaveMessage(''), 2500);
  };

  const toggleCamera = () => {
    const nextMode: CameraMode = cameraMode === 'tpp' ? 'fpp' : 'tpp';
    setCameraMode(nextMode);
    sceneRef.current?.setCameraMode(nextMode);
  };

  const toggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const useHealthPotion = () => {
    const potionIdx = inventory.findIndex(i => i.type === 'potion' && i.healAmount);
    if (potionIdx !== -1) {
      const potion = inventory[potionIdx];
      const heal = potion.healAmount || 120;
      setPlayerStats(prev => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + heal) }));
      setInventory(prev => prev.filter((_, idx) => idx !== potionIdx));
      soundManager.playPotion();
    }
  };

  const useManaPotion = () => {
    const potionIdx = inventory.findIndex(i => i.type === 'potion' && i.manaAmount);
    if (potionIdx !== -1) {
      const potion = inventory[potionIdx];
      const manaHeal = potion.manaAmount || 80;
      setPlayerStats(prev => ({ ...prev, mana: Math.min(prev.maxMana, prev.mana + manaHeal) }));
      setInventory(prev => prev.filter((_, idx) => idx !== potionIdx));
      soundManager.playPotion();
    }
  };

  const castSkill = (skillIndex: number) => {
    if (gameState !== 'playing') return;

    if (skillIndex === 1) {
      // Fireball: 25 Mana
      if (playerStats.mana >= 25) {
        setPlayerStats(p => ({ ...p, mana: p.mana - 25 }));
        sceneRef.current?.castFireball();
      }
    } else if (skillIndex === 2) {
      // Bow: 10 Stamina
      if (playerStats.stamina >= 10) {
        setPlayerStats(p => ({ ...p, stamina: p.stamina - 10 }));
        sceneRef.current?.shootBow();
      }
    } else if (skillIndex === 3) {
      // Frost Nova: 35 Mana
      if (playerStats.mana >= 35) {
        setPlayerStats(p => ({ ...p, mana: p.mana - 35 }));
        sceneRef.current?.castFrostNova();
      }
    } else if (skillIndex === 4) {
      // Lightning: 40 Mana
      if (playerStats.mana >= 40) {
        setPlayerStats(p => ({ ...p, mana: p.mana - 40 }));
        sceneRef.current?.castLightning();
      }
    } else if (skillIndex === 5) {
      // Dragon Slash Ult: 60 Mana
      if (playerStats.mana >= 60) {
        setPlayerStats(p => ({ ...p, mana: p.mana - 60 }));
        sceneRef.current?.castDragonSlash();
      }
    }
  };

  const equipItem = (item: Item) => {
    if (item.type === 'weapon') {
      setEquipment(prev => ({ ...prev, weapon: item }));
    } else if (item.type === 'shield') {
      setEquipment(prev => ({ ...prev, shield: item }));
    } else if (item.type === 'armor') {
      setEquipment(prev => ({ ...prev, armor: item }));
    } else if (item.type === 'ring') {
      setEquipment(prev => ({ ...prev, ring: item }));
    }
  };

  const unequipSlot = (slot: keyof Equipment) => {
    setEquipment(prev => ({ ...prev, [slot]: null }));
  };

  const allocateStat = (stat: 'strength' | 'defense' | 'agility' | 'arcane') => {
    if (playerStats.statPoints <= 0) return;
    setPlayerStats(prev => ({
      ...prev,
      statPoints: prev.statPoints - 1,
      [stat]: prev[stat] + 1
    }));
  };

  const unlockSkill = (skillId: string) => {
    setUnlockedSkills(prev => (prev.includes(skillId) ? prev : [...prev, skillId]));
    setPlayerStats(prev => ({ ...prev, skillPoints: prev.skillPoints - 1 }));
    soundManager.playLevelUp();
  };

  const selectLevelFromMap = (lvlNumber: number) => {
    setShowWorldMap(false);
    setupLevel(lvlNumber);
    setGameState('playing');
    mountRef.current?.requestPointerLock();
  };

  const currentLevelInfo = LEVELS.find(l => l.levelNumber === currentLevelNumber) || LEVELS[0];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans select-none">
      {/* 3D WebGL Canvas Mount Container */}
      <div
        ref={mountRef}
        onClick={() => {
          if (gameState === 'playing' && !document.pointerLockElement) {
            mountRef.current?.requestPointerLock();
          }
        }}
        className="w-full h-full cursor-crosshair"
      />

      {/* Title Screen */}
      {gameState === 'title' && (
        <TitleScreen
          onStartGame={() => startGame(true)}
          onContinueGame={continueSavedGame}
          hasSaveGame={hasSaveData.current}
        />
      )}

      {/* Story / Cutscene Modals */}
      {gameState === 'prologue' && (
        <StoryModal
          mode="prologue"
          onFinish={() => {
            setGameState('playing');
            setupLevel(1);
            mountRef.current?.requestPointerLock();
          }}
        />
      )}

      {gameState === 'ending' && (
        <StoryModal
          mode="victory_ending"
          onFinish={() => {
            setGameState('title');
          }}
        />
      )}

      {/* Active In-Game HUD */}
      {gameState === 'playing' && (
        <HUD
          stats={playerStats}
          currentLevel={currentLevelInfo}
          cameraMode={cameraMode}
          bossEnemy={activeBossEnemy}
          onToggleCamera={toggleCamera}
          onOpenInventory={() => setShowInventory(true)}
          onOpenSkillTree={() => setShowSkillTree(true)}
          onOpenWorldMap={() => setShowWorldMap(true)}
          onOpenPause={() => setGameState('paused')}
          onToggleMute={toggleMute}
          isMuted={isMuted}
          onUseHealthPotion={useHealthPotion}
          onUseManaPotion={useManaPotion}
          onCastSkill={castSkill}
          onPerformAttack={() => sceneRef.current?.performLightAttack()}
          onPerformHeavyAttack={() => sceneRef.current?.performHeavyAttack()}
          onPerformDodge={() => sceneRef.current?.performDodgeRoll()}
          onInteract={() => sceneRef.current?.interactNearestObject()}
        />
      )}

      {/* Pause Menu Modal */}
      {gameState === 'paused' && (
        <PauseModal
          onResume={() => {
            setGameState('playing');
            mountRef.current?.requestPointerLock();
          }}
          onRestartLevel={() => {
            setGameState('playing');
            setupLevel(currentLevelNumber);
            mountRef.current?.requestPointerLock();
          }}
          onSaveGame={saveCurrentGame}
          onReturnToTitle={() => setGameState('title')}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          saveMessage={saveMessage}
        />
      )}

      {/* Stage Clear Victory Modal */}
      {gameState === 'victory' && lastStageClear && (
        <StageClearModal
          level={lastStageClear.level}
          goldEarned={lastStageClear.goldEarned}
          xpEarned={lastStageClear.xpEarned}
          lootCollected={lastStageClear.loot}
          onNextLevel={() => {
            const nextLvl = currentLevelNumber + 1;
            setupLevel(nextLvl);
            setGameState('playing');
            mountRef.current?.requestPointerLock();
          }}
          onOpenWorldMap={() => {
            setShowWorldMap(true);
          }}
        />
      )}

      {/* Game Over Defeat Modal */}
      {gameState === 'gameover' && (
        <GameOverModal
          level={currentLevelInfo}
          onRetry={() => {
            setupLevel(currentLevelNumber);
            setGameState('playing');
            mountRef.current?.requestPointerLock();
          }}
          onOpenWorldMap={() => setShowWorldMap(true)}
        />
      )}

      {/* Inventory & Equipment Modal */}
      {showInventory && (
        <InventoryModal
          stats={playerStats}
          equipment={equipment}
          inventory={inventory}
          onClose={() => setShowInventory(false)}
          onEquipItem={equipItem}
          onUnequipSlot={unequipSlot}
          onUseItem={item => {
            if (item.healAmount) useHealthPotion();
            else if (item.manaAmount) useManaPotion();
          }}
          onAllocateStat={allocateStat}
        />
      )}

      {/* Skill Tree Modal */}
      {showSkillTree && (
        <SkillTreeModal
          skillPoints={playerStats.skillPoints}
          unlockedSkills={unlockedSkills}
          onUnlockSkill={unlockSkill}
          onClose={() => setShowSkillTree(false)}
        />
      )}

      {/* 50-Level World Map Modal */}
      {showWorldMap && (
        <WorldMapModal
          currentLevelNumber={currentLevelNumber}
          unlockedLevels={unlockedLevels}
          completedLevels={completedLevels}
          onSelectLevel={selectLevelFromMap}
          onClose={() => setShowWorldMap(false)}
        />
      )}
    </div>
  );
}

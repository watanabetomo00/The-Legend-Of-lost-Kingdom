import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { BIOMES, LEVELS } from '../game/constants';
import { calculateDamage, rollLootDrop } from '../game/rules';
import { soundManager } from '../audio/soundManager';
import {
  CameraMode,
  EnemyData,
  Equipment,
  Item,
  LevelInfo,
  PlayerStats
} from '../types/game';
import { createFppViewModel, createWarriorCharacter, FppViewModel, WarriorRig } from './characterModels';
import { createEnemyMesh, EnemyMeshRig } from './enemyModels';
import { buildEnvironmentForLevel, LevelEnvironment } from './environmentBuilder';

export interface FloatingText {
  id: string;
  text: string;
  worldPos: THREE.Vector3;
  color: string;
  age: number;
}

export interface GameSceneCallbacks {
  onPlayerDamage: (damage: number, isParried: boolean) => void;
  onEnemyDamage: (enemyId: string, damage: number, isCrit: boolean) => void;
  onEnemyKilled: (enemy: EnemyData) => void;
  onLootCollected: (items: Item[]) => void;
  onLevelComplete: (levelNumber: number) => void;
  onLevelDefeat: () => void;
  onBossPhaseChange?: (phase: number) => void;
}

export class GameScene {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private callbacks: GameSceneCallbacks;

  // Environment & Lighting
  private currentEnv: LevelEnvironment | null = null;
  private dirLight: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;

  // Actors
  private warriorRig: WarriorRig;
  private fppModel: FppViewModel;
  private activeCameraMode: CameraMode = 'tpp';

  // Player State
  public playerPos: THREE.Vector3 = new THREE.Vector3(0, 0, 10);
  public playerYaw: number = 0;
  public playerPitch: number = 0;
  private playerVelocity: THREE.Vector3 = new THREE.Vector3();
  private isGrounded: boolean = true;
  private isRolling: boolean = false;
  private rollProgress: number = 0;
  private rollDirection: THREE.Vector3 = new THREE.Vector3();
  private isAttacking: boolean = false;
  private attackTime: number = 0;
  private attackCombo: number = 0;
  private isBlocking: boolean = false;
  private blockStartTime: number = 0;

  // Enemies
  private enemies: {
    data: EnemyData;
    rig: EnemyMeshRig;
    pos: THREE.Vector3;
    yaw: number;
    state: 'idle' | 'chase' | 'windup' | 'attack' | 'stagger' | 'dead';
    stateTimer: number;
    attackCooldown: number;
  }[] = [];

  // Projectiles & Particles
  private projectiles: {
    mesh: THREE.Mesh;
    velocity: THREE.Vector3;
    type: 'fireball' | 'arrow' | 'slash';
    damage: number;
    life: number;
  }[] = [];

  private particles: {
    mesh: THREE.Mesh;
    velocity: THREE.Vector3;
    life: number;
    maxLife: number;
  }[] = [];

  // Floating Damage Numbers
  public floatingTexts: FloatingText[] = [];

  // Loop & Control
  private animFrameId: number = 0;
  private lastTime: number = performance.now();
  private isRunning: boolean = true;
  public keysPressed: Set<string> = new Set();
  public mouseLookDelta: { x: number; y: number } = { x: 0, y: 0 };
  private isSoftwareGl: boolean = false;

  // Current Level
  public currentLevelInfo: LevelInfo = LEVELS[0];
  private levelCleared: boolean = false;

  constructor(container: HTMLElement, callbacks: GameSceneCallbacks) {
    this.container = container;
    this.callbacks = callbacks;

    // Detect software WebGL as per guidelines
    this.isSoftwareGl = (() => {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Renderer Setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance'
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);

    // 2. Scene & Environment Reflection
    this.scene = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. Camera
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );

    // 4. Lighting Rig
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    this.scene.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xfffaed, 2.0);
    this.dirLight.position.set(25, 40, 20);
    this.dirLight.castShadow = !this.isSoftwareGl;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 120;
    const d = 35;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.dirLight.shadow.bias = -0.0005;
    this.scene.add(this.dirLight);

    // 5. Actors
    this.warriorRig = createWarriorCharacter();
    this.scene.add(this.warriorRig.group);

    this.fppModel = createFppViewModel();
    this.fppModel.group.visible = false;
    this.camera.add(this.fppModel.group);
    this.scene.add(this.camera);

    // Event listeners
    window.addEventListener('resize', this.onResize);

    // Start game loop
    this.tick();
  }

  public setCameraMode(mode: CameraMode) {
    this.activeCameraMode = mode;
    if (mode === 'fpp') {
      this.warriorRig.group.visible = false;
      this.fppModel.group.visible = true;
    } else {
      this.warriorRig.group.visible = true;
      this.fppModel.group.visible = false;
    }
  }

  public getCameraMode(): CameraMode {
    return this.activeCameraMode;
  }

  public loadLevel(levelInfo: LevelInfo, enemiesData: EnemyData[]) {
    this.currentLevelInfo = levelInfo;
    this.levelCleared = false;

    // Clean previous environment
    if (this.currentEnv) {
      this.scene.remove(this.currentEnv.group);
      this.currentEnv.dispose();
    }

    // Set Biome Atmospheric Colors & Fog
    const biomeConfig = BIOMES[levelInfo.biome];
    this.scene.background = new THREE.Color(biomeConfig.skyColor);
    this.scene.fog = new THREE.FogExp2(biomeConfig.fogColor, 0.015);
    this.dirLight.color.setHex(levelInfo.biome === 'infernal' ? 0xff7733 : (levelInfo.biome === 'mountains' ? 0xd0e8ff : 0xfffaed));

    // Build Environment
    this.currentEnv = buildEnvironmentForLevel(
      levelInfo.biome,
      levelInfo.levelNumber,
      levelInfo.isBossLevel
    );
    this.scene.add(this.currentEnv.group);

    // Reset player position facing forward into the arena
    this.playerPos.set(0, 0, 16);
    this.playerVelocity.set(0, 0, 0);
    this.playerYaw = 0; // Face forward towards dungeon/gate

    // Clear old enemies & spawn new ones
    this.enemies.forEach(e => this.scene.remove(e.rig.mesh));
    this.enemies = [];

    enemiesData.forEach((ed, idx) => {
      const rig = createEnemyMesh(ed.type, ed.isBoss);
      if (ed.scale) {
        rig.mesh.scale.set(ed.scale, ed.scale, ed.scale);
      }
      this.scene.add(rig.mesh);

      // Distribute enemies across arena
      let ex = 0;
      let ez = -5;
      if (!ed.isBoss) {
        const angle = (idx / enemiesData.length) * Math.PI * 2;
        const rad = 8 + (idx % 3) * 4;
        ex = Math.cos(angle) * rad;
        ez = Math.sin(angle) * rad - 5;
      }

      this.enemies.push({
        data: { ...ed },
        rig,
        pos: new THREE.Vector3(ex, 0, ez),
        yaw: 0,
        state: 'idle',
        stateTimer: 0,
        attackCooldown: 1.0 + Math.random()
      });
    });

    // Start background music
    soundManager.startMusic(levelInfo.biome, levelInfo.isBossLevel);
  }

  public updateEquipmentVisuals(equipment: Equipment) {
    this.warriorRig.updateEquipmentVisuals(equipment);
    this.fppModel.updateEquipmentVisuals(equipment);
  }

  // --- Combat Actions Triggered by Input ---

  public performLightAttack() {
    if (this.isRolling) return;
    this.isAttacking = true;
    this.attackTime = 0;
    this.attackCombo = (this.attackCombo + 1) % 3;
    soundManager.playSwordSwing(this.attackCombo);

    // Check hit against enemies
    this.checkMeleeHit(1.0 + this.attackCombo * 0.25, 3.2);
  }

  public performHeavyAttack() {
    if (this.isRolling) return;
    this.isAttacking = true;
    this.attackTime = 0;
    this.attackCombo = 1;
    soundManager.playSwordSwing(2);

    this.checkMeleeHit(2.0, 3.8);
  }

  public setBlocking(blocking: boolean) {
    if (this.isBlocking !== blocking) {
      this.isBlocking = blocking;
      if (blocking) {
        this.blockStartTime = performance.now();
        soundManager.playShieldBlock();
      }
    }
  }

  public performDodgeRoll() {
    if (this.isRolling || this.isAttacking) return;
    this.isRolling = true;
    this.rollProgress = 0;

    // Roll in facing or movement direction
    this.rollDirection.set(
      -Math.sin(this.playerYaw),
      0,
      -Math.cos(this.playerYaw)
    ).normalize();

    soundManager.playDodge();
  }

  public castFireball() {
    soundManager.playFireball();

    // Spawn fireball projectile
    const ballGeo = new THREE.SphereGeometry(0.35, 8, 8);
    const ballMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
    const mesh = new THREE.Mesh(ballGeo, ballMat);

    const forward = new THREE.Vector3(-Math.sin(this.playerYaw), 0, -Math.cos(this.playerYaw));
    mesh.position.copy(this.playerPos).add(new THREE.Vector3(0, 1.2, 0)).add(forward.clone().multiplyScalar(1.0));
    this.scene.add(mesh);

    this.projectiles.push({
      mesh,
      velocity: forward.clone().multiplyScalar(22),
      type: 'fireball',
      damage: 120,
      life: 2.5
    });
  }

  public castFrostNova() {
    soundManager.playFrostNova();

    // Freeze enemies in 8m radius
    this.enemies.forEach(e => {
      const dist = e.pos.distanceTo(this.playerPos);
      if (dist < 8.0 && e.state !== 'dead') {
        e.data.hp -= 90;
        e.state = 'stagger';
        e.stateTimer = 2.0; // Frozen!
        this.spawnFloatingText(e.pos, '90 (FROZEN!)', '#38bdf8');
        this.callbacks.onEnemyDamage(e.data.id, 90, false);
      }
    });

    // Particle burst ring
    this.spawnParticleBurst(this.playerPos, 0x38bdf8, 30);
  }

  public castLightning() {
    soundManager.playLightning();

    // Strike nearest enemy
    let closestEnemy = null;
    let minDist = 20;
    for (const e of this.enemies) {
      if (e.state === 'dead') continue;
      const d = e.pos.distanceTo(this.playerPos);
      if (d < minDist) {
        minDist = d;
        closestEnemy = e;
      }
    }

    if (closestEnemy) {
      closestEnemy.data.hp -= 180;
      closestEnemy.state = 'stagger';
      closestEnemy.stateTimer = 1.0;
      this.spawnFloatingText(closestEnemy.pos, '180 (LIGHTNING!)', '#facc15');
      this.callbacks.onEnemyDamage(closestEnemy.data.id, 180, true);
      this.spawnParticleBurst(closestEnemy.pos, 0xfacc15, 25);
    }
  }

  public castDragonSlash() {
    soundManager.playDragonSlash();

    // Large blade wave projectile
    const waveGeo = new THREE.BoxGeometry(2.5, 0.4, 0.1);
    const waveMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const mesh = new THREE.Mesh(waveGeo, waveMat);

    const forward = new THREE.Vector3(-Math.sin(this.playerYaw), 0, -Math.cos(this.playerYaw));
    mesh.position.copy(this.playerPos).add(new THREE.Vector3(0, 1.0, 0)).add(forward.clone().multiplyScalar(1.2));
    mesh.rotation.y = this.playerYaw;
    this.scene.add(mesh);

    this.projectiles.push({
      mesh,
      velocity: forward.clone().multiplyScalar(28),
      type: 'slash',
      damage: 320,
      life: 2.0
    });
  }

  public shootBow() {
    soundManager.playBowShoot();

    const arrowGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 6);
    const arrowMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
    const mesh = new THREE.Mesh(arrowGeo, arrowMat);

    const forward = new THREE.Vector3(-Math.sin(this.playerYaw), 0, -Math.cos(this.playerYaw));
    mesh.position.copy(this.playerPos).add(new THREE.Vector3(0, 1.3, 0)).add(forward.clone().multiplyScalar(1.0));
    mesh.rotation.x = Math.PI / 2;
    mesh.rotation.y = this.playerYaw;
    this.scene.add(mesh);

    this.projectiles.push({
      mesh,
      velocity: forward.clone().multiplyScalar(32),
      type: 'arrow',
      damage: 85,
      life: 3.0
    });
  }

  public interactNearestObject() {
    if (!this.currentEnv) return;

    // Check treasure chests
    for (const chest of this.currentEnv.treasureChests) {
      if (!chest.opened && chest.position.distanceTo(this.playerPos) < 3.2) {
        chest.opened = true;
        chest.group.position.y += 0.2;
        soundManager.playLootPickup();

        const loot = rollLootDrop(this.currentLevelInfo.levelNumber, true);
        this.spawnFloatingText(chest.position, 'Treasure Opened! +Loot', '#facc15');
        this.callbacks.onLootCollected(loot);
        return;
      }
    }

    // Check exit portal
    if (this.currentEnv.exitPortal.position.distanceTo(this.playerPos) < 4.0) {
      const allEnemiesDead = this.enemies.every(e => e.state === 'dead');
      if (allEnemiesDead || this.currentLevelInfo.completed) {
        this.callbacks.onLevelComplete(this.currentLevelInfo.levelNumber);
      } else {
        this.spawnFloatingText(this.playerPos, 'Portal Sealed! Slay all enemies first.', '#ef4444');
      }
    }
  }

  // --- Melee Hit Detection ---

  private checkMeleeHit(multiplier: number, range: number) {
    const forward = new THREE.Vector3(-Math.sin(this.playerYaw), 0, -Math.cos(this.playerYaw)).normalize();

    this.enemies.forEach(e => {
      if (e.state === 'dead') return;

      const toEnemy = e.pos.clone().sub(this.playerPos);
      const dist = toEnemy.length();

      if (dist <= range) {
        toEnemy.normalize();
        const dot = forward.dot(toEnemy);

        if (dot > 0.3) {
          // Hit connected!
          const isCrit = Math.random() < 0.2;
          const damageResult = calculateDamage(55, e.data.defense, { isCrit, multiplier });

          e.data.hp -= damageResult.damage;
          e.state = 'stagger';
          e.stateTimer = 0.35;

          soundManager.playHitImpact(isCrit);
          this.spawnParticleBurst(e.pos, 0xdc2626, 12);
          this.spawnFloatingText(
            e.pos,
            `${damageResult.damage}${isCrit ? ' CRIT!' : ''}`,
            isCrit ? '#ef4444' : '#ffffff'
          );

          this.callbacks.onEnemyDamage(e.data.id, damageResult.damage, isCrit);

          // Knockback
          e.pos.add(forward.clone().multiplyScalar(0.4));

          // Boss phase checks for Malakar
          if (e.data.type === 'boss_malakar' && e.rig.setBossPhase) {
            const hpRatio = e.data.hp / e.data.maxHp;
            let phase = 1;
            if (hpRatio <= 0.25) phase = 4;
            else if (hpRatio <= 0.5) phase = 3;
            else if (hpRatio <= 0.75) phase = 2;
            e.rig.setBossPhase(phase);
            if (this.callbacks.onBossPhaseChange) {
              this.callbacks.onBossPhaseChange(phase);
            }
          }

          if (e.data.hp <= 0) {
            e.state = 'dead';
            this.callbacks.onEnemyKilled(e.data);
            this.spawnFloatingText(e.pos, `+${e.data.xpReward} XP`, '#a855f7');

            // Drop loot
            if (e.data.drops.length > 0) {
              this.callbacks.onLootCollected(e.data.drops);
            }

            // Check if all enemies dead to unlock exit portal
            this.checkLevelObjective();
          }
        }
      }
    });
  }

  private checkLevelObjective() {
    const allDead = this.enemies.every(e => e.state === 'dead');
    if (allDead && !this.levelCleared) {
      this.levelCleared = true;
      soundManager.playLevelUp();
      this.spawnFloatingText(new THREE.Vector3(0, 2, -25), 'EXIT PORTAL UNLOCKED!', '#10b981');
    }
  }

  // --- Particles & Floating Text ---

  private spawnParticleBurst(pos: THREE.Vector3, color: number, count: number) {
    const pGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    const pMat = new THREE.MeshBasicMaterial({ color });

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(pGeo, pMat);
      mesh.position.copy(pos).add(new THREE.Vector3(0, 1.0, 0));
      this.scene.add(mesh);

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        Math.random() * 6 + 1,
        (Math.random() - 0.5) * 8
      );

      this.particles.push({
        mesh,
        velocity: vel,
        life: 0.6 + Math.random() * 0.4,
        maxLife: 1.0
      });
    }
  }

  private spawnFloatingText(worldPos: THREE.Vector3, text: string, color: string) {
    this.floatingTexts.push({
      id: `ft_${Date.now()}_${Math.random()}`,
      text,
      worldPos: worldPos.clone().add(new THREE.Vector3(0, 1.8, 0)),
      color,
      age: 0
    });
  }

  // --- Game Loop Update ---

  private tick = () => {
    if (!this.isRunning) return;

    const now = performance.now();
    const rawDt = (now - this.lastTime) / 1000;
    this.lastTime = now;
    const dt = Math.min(rawDt, 0.05);

    this.updateSimulation(dt, now / 1000);
    this.updateCamera(dt);
    this.renderer.render(this.scene, this.camera);

    this.animFrameId = requestAnimationFrame(this.tick);
  };

  private updateSimulation(dt: number, time: number) {
    // 1. Player Movement & Input Handling
    let moveX = 0;
    let moveZ = 0;

    if (this.keysPressed.has('KeyW') || this.keysPressed.has('ArrowUp')) moveZ -= 1;
    if (this.keysPressed.has('KeyS') || this.keysPressed.has('ArrowDown')) moveZ += 1;
    if (this.keysPressed.has('KeyA') || this.keysPressed.has('ArrowLeft')) moveX -= 1;
    if (this.keysPressed.has('KeyD') || this.keysPressed.has('ArrowRight')) moveX += 1;

    // Mouse look
    this.playerYaw -= this.mouseLookDelta.x * 0.003;
    this.playerPitch = Math.max(-0.8, Math.min(0.8, this.playerPitch - this.mouseLookDelta.y * 0.003));
    this.mouseLookDelta = { x: 0, y: 0 };

    const isSprinting = this.keysPressed.has('ShiftLeft') || this.keysPressed.has('ShiftRight');
    const moveSpeed = (isSprinting ? 11 : 6.5) * (this.isBlocking ? 0.45 : 1.0);
    const isMoving = (moveX !== 0 || moveZ !== 0) && !this.isRolling;

    if (this.isRolling) {
      this.rollProgress += dt * 2.8;
      this.playerPos.add(this.rollDirection.clone().multiplyScalar(dt * 13));
      if (this.rollProgress >= 1) {
        this.isRolling = false;
        this.rollProgress = 0;
      }
    } else if (isMoving) {
      const inputVec = new THREE.Vector3(moveX, 0, moveZ).normalize();
      inputVec.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.playerYaw);
      this.playerPos.add(inputVec.multiplyScalar(moveSpeed * dt));
    }

    // Clamp player within arena bounds
    const distFromCenter = Math.sqrt(this.playerPos.x * this.playerPos.x + this.playerPos.z * this.playerPos.z);
    if (distFromCenter > 38) {
      const angle = Math.atan2(this.playerPos.z, this.playerPos.x);
      this.playerPos.x = Math.cos(angle) * 38;
      this.playerPos.z = Math.sin(angle) * 38;
    }

    // Update Warrior Rig position & rotation
    this.warriorRig.group.position.copy(this.playerPos);
    this.warriorRig.group.rotation.y = this.playerYaw;

    // Attack state timer
    if (this.isAttacking) {
      this.attackTime += dt;
      if (this.attackTime > 0.4) {
        this.isAttacking = false;
      }
    }

    // Update Rig Animations
    this.warriorRig.updateAnimation(
      time,
      isMoving,
      isSprinting,
      this.isAttacking,
      this.attackTime,
      this.attackCombo,
      this.isBlocking,
      this.isRolling,
      this.rollProgress
    );

    this.fppModel.updateAnimation(
      time,
      isMoving,
      this.isAttacking,
      this.attackTime,
      this.attackCombo,
      this.isBlocking
    );

    // 2. Enemy AI & Combat Logic
    this.enemies.forEach(e => {
      if (e.state === 'dead') {
        // Sink into ground
        e.rig.mesh.position.y = Math.max(-2.0, e.rig.mesh.position.y - dt * 0.8);
        return;
      }

      const toPlayer = this.playerPos.clone().sub(e.pos);
      const dist = toPlayer.length();

      // Face player
      e.yaw = Math.atan2(-toPlayer.x, -toPlayer.z);
      e.rig.mesh.rotation.y = e.yaw;

      e.attackCooldown -= dt;

      if (e.state === 'stagger') {
        e.stateTimer -= dt;
        if (e.stateTimer <= 0) {
          e.state = 'chase';
        }
      } else if (dist <= e.data.attackRange) {
        // In Attack Range
        if (e.attackCooldown <= 0) {
          // Initiate attack
          e.state = 'attack';
          e.stateTimer = 0.5;
          e.attackCooldown = e.data.attackCooldown;

          // Check if player blocked or parried
          setTimeout(() => {
            if (e.state !== 'dead') {
              const nowMs = performance.now();
              const isParry = this.isBlocking && (nowMs - this.blockStartTime < 250);
              const damageResult = calculateDamage(e.data.attack, 20, {
                isBlocked: this.isBlocking,
                isParried: isParry
              });

              if (isParry) {
                soundManager.playParry();
                e.state = 'stagger';
                e.stateTimer = 1.2;
                this.spawnFloatingText(this.playerPos, 'PARRY!', '#facc15');
              } else {
                if (this.isBlocking) {
                  soundManager.playShieldBlock();
                  this.spawnFloatingText(this.playerPos, `BLOCKED (-${damageResult.damage})`, '#38bdf8');
                } else if (!this.isRolling) {
                  soundManager.playHitImpact(false);
                  this.spawnFloatingText(this.playerPos, `-${damageResult.damage}`, '#ef4444');
                }
              }

              this.callbacks.onPlayerDamage(damageResult.damage, isParry);
            }
          }, 350);
        } else {
          e.state = 'idle';
        }
      } else if (dist < e.data.detectionRange) {
        // Chase player
        e.state = 'chase';
        toPlayer.normalize();
        e.pos.add(toPlayer.multiplyScalar(e.data.speed * dt));
      } else {
        e.state = 'idle';
      }

      e.rig.mesh.position.copy(e.pos);
      e.rig.updateAnimation(
        time,
        e.state === 'chase',
        e.state === 'attack',
        e.state === 'stagger'
      );
    });

    // 3. Projectiles Update
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.life -= dt;
      p.mesh.position.add(p.velocity.clone().multiplyScalar(dt));

      // Check collision against enemies
      let hit = false;
      for (const e of this.enemies) {
        if (e.state === 'dead') continue;
        if (p.mesh.position.distanceTo(e.pos.clone().add(new THREE.Vector3(0, 1.2, 0))) < 1.8) {
          hit = true;
          e.data.hp -= p.damage;
          e.state = 'stagger';
          e.stateTimer = 0.3;
          soundManager.playHitImpact(true);
          this.spawnParticleBurst(e.pos, 0xf97316, 18);
          this.spawnFloatingText(e.pos, `${p.damage}`, '#f97316');
          this.callbacks.onEnemyDamage(e.data.id, p.damage, false);

          if (e.data.hp <= 0) {
            e.state = 'dead';
            this.callbacks.onEnemyKilled(e.data);
            this.spawnFloatingText(e.pos, `+${e.data.xpReward} XP`, '#a855f7');
            this.checkLevelObjective();
          }
          break;
        }
      }

      if (hit || p.life <= 0) {
        this.scene.remove(p.mesh);
        this.projectiles.splice(i, 1);
      }
    }

    // 4. Particles Update
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.life -= dt;
      pt.velocity.y -= 14 * dt; // Gravity
      pt.mesh.position.add(pt.velocity.clone().multiplyScalar(dt));

      if (pt.mesh.position.y < 0) {
        pt.mesh.position.y = 0;
        pt.velocity.y *= -0.3;
      }

      if (pt.life <= 0) {
        this.scene.remove(pt.mesh);
        this.particles.splice(i, 1);
      }
    }

    // 5. Floating text age
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.age += dt;
      ft.worldPos.y += dt * 0.8;
      if (ft.age > 1.4) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // 6. Environment animations
    if (this.currentEnv) {
      this.currentEnv.update(time);
    }
  }

  private updateCamera(dt: number) {
    if (this.activeCameraMode === 'fpp') {
      // First Person Perspective: Camera at eye height
      const eyeHeight = 1.65;
      this.camera.position.set(this.playerPos.x, this.playerPos.y + eyeHeight, this.playerPos.z);
      this.camera.up.set(0, 1, 0);
      this.camera.rotation.set(this.playerPitch, this.playerYaw, 0, 'YXZ');
    } else {
      // Third Person Perspective: Follow camera with smooth damping
      const camDist = 4.8;
      const camHeight = 2.4;

      const targetX = this.playerPos.x + Math.sin(this.playerYaw) * camDist;
      const targetZ = this.playerPos.z + Math.cos(this.playerYaw) * camDist;
      const targetY = this.playerPos.y + camHeight;

      // Exponential damping
      const k = 14;
      const factor = 1 - Math.exp(-k * dt);
      this.camera.position.x += (targetX - this.camera.position.x) * factor;
      this.camera.position.y += (targetY - this.camera.position.y) * factor;
      this.camera.position.z += (targetZ - this.camera.position.z) * factor;

      const lookTarget = this.playerPos.clone().add(new THREE.Vector3(0, 1.3, 0));
      this.camera.lookAt(lookTarget);
    }
  }

  public projectWorldToScreen(worldPos: THREE.Vector3): { x: number; y: number; visible: boolean } {
    const v = worldPos.clone().project(this.camera);
    const visible = v.z >= -1 && v.z <= 1;
    const x = ((v.x + 1) * this.container.clientWidth) / 2;
    const y = ((-v.y + 1) * this.container.clientHeight) / 2;
    return { x, y, visible };
  }

  private onResize = () => {
    if (!this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  public dispose() {
    this.isRunning = false;
    cancelAnimationFrame(this.animFrameId);
    window.removeEventListener('resize', this.onResize);
    soundManager.stopMusic();
    if (this.currentEnv) {
      this.currentEnv.dispose();
    }
    this.renderer.dispose();
    if (this.container && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

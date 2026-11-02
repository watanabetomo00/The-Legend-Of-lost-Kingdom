import * as THREE from 'three';
import { EnemyType } from '../types/game';

export interface EnemyMeshRig {
  mesh: THREE.Group;
  updateAnimation: (time: number, isMoving: boolean, isAttacking: boolean, isHurt: boolean) => void;
  setBossPhase?: (phase: number) => void;
}

export function createEnemyMesh(type: EnemyType, isBoss: boolean = false): EnemyMeshRig {
  const group = new THREE.Group();

  let updateAnimation: (time: number, isMoving: boolean, isAttacking: boolean, isHurt: boolean) => void;
  let setBossPhase: ((phase: number) => void) | undefined;

  // Shared contact shadow disc
  const shadowGeo = new THREE.CircleGeometry(isBoss ? 1.4 : 0.6, 16);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.45,
    depthWrite: false
  });
  const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat);
  shadowDisc.rotation.x = -Math.PI / 2;
  shadowDisc.position.y = 0.02;
  group.add(shadowDisc);

  if (type === 'boss_malakar') {
    // FINAL BOSS MALAKAR - 4 Visual Transformation Stages
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x18181b, // Obsidian black
      roughness: 0.3,
      metalness: 0.8
    });
    const runeMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626, // Crimson glow
      emissive: new THREE.Color(0xdc2626),
      emissiveIntensity: 0.8,
      roughness: 0.2
    });
    const hornMat = new THREE.MeshStandardMaterial({
      color: 0x450a0a,
      roughness: 0.5,
      metalness: 0.4
    });

    // Main Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.4, 0.7), bodyMat);
    torso.position.y = 2.0;
    torso.castShadow = true;
    group.add(torso);

    // Glowing Demon Heart
    const heart = new THREE.Mesh(new THREE.OctahedronGeometry(0.3, 0), runeMat);
    heart.position.set(0, 0.1, 0.38);
    torso.add(heart);

    // Head
    const head = new THREE.Group();
    head.position.set(0, 0.9, 0);
    torso.add(head);

    const skull = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.5), bodyMat);
    head.add(skull);

    // Eyes
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), runeMat);
    eyeR.position.set(0.15, 0.1, 0.26);
    head.add(eyeR);
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), runeMat);
    eyeL.position.set(-0.15, 0.1, 0.26);
    head.add(eyeL);

    // Giant Demon Horns
    const hornR = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.9, 8), hornMat);
    hornR.position.set(0.32, 0.45, -0.05);
    hornR.rotation.z = -0.6;
    head.add(hornR);

    const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.9, 8), hornMat);
    hornL.position.set(-0.32, 0.45, -0.05);
    hornL.rotation.z = 0.6;
    head.add(hornL);

    // Demon Wings
    const wingL = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 0.08), bodyMat);
    wingL.position.set(-1.0, 0.3, -0.45);
    wingL.rotation.y = 0.4;
    torso.add(wingL);

    const wingR = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 0.08), bodyMat);
    wingR.position.set(1.0, 0.3, -0.45);
    wingR.rotation.y = -0.4;
    torso.add(wingR);

    // Giant Sword
    const bossSword = new THREE.Group();
    bossSword.position.set(0.8, -0.2, 0.5);
    torso.add(bossSword);

    const swordBlade = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.2, 0.04), runeMat);
    swordBlade.position.y = 0.8;
    bossSword.add(swordBlade);

    // Limbs
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.14, 1.2, 8), bodyMat);
    armL.position.set(-0.75, 0, 0);
    torso.add(armL);

    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.16, 1.3, 8), bodyMat);
    legL.position.set(-0.35, -1.3, 0);
    group.add(legL);

    const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.16, 1.3, 8), bodyMat);
    legR.position.set(0.35, -1.3, 0);
    group.add(legR);

    // Phase transformations
    setBossPhase = (phase: number) => {
      if (phase === 1) {
        // Sword Combat
        bossSword.visible = true;
        runeMat.color.setHex(0xdc2626); // Red
        runeMat.emissive.setHex(0xdc2626);
      } else if (phase === 2) {
        // Shadow Magic & Teleport
        runeMat.color.setHex(0x9333ea); // Purple void
        runeMat.emissive.setHex(0x9333ea);
      } else if (phase === 3) {
        // Dragon Form
        wingL.scale.set(1.8, 1.8, 1.0);
        wingR.scale.set(1.8, 1.8, 1.0);
        runeMat.color.setHex(0xea580c); // Fiery orange
        runeMat.emissive.setHex(0xea580c);
      } else if (phase === 4) {
        // Ultimate Titan Demon
        group.scale.set(1.35, 1.35, 1.35);
        runeMat.color.setHex(0xef4444); // Blazing red
        runeMat.emissiveIntensity = 1.4;
      }
    };

    updateAnimation = (time, isMoving, isAttacking, isHurt) => {
      // Wings flapping
      wingL.rotation.y = 0.4 + Math.sin(time * 3) * 0.3;
      wingR.rotation.y = -0.4 - Math.sin(time * 3) * 0.3;

      // Heart pulsing
      const pulse = 1.0 + Math.sin(time * 6) * 0.15;
      heart.scale.set(pulse, pulse, pulse);

      if (isAttacking) {
        bossSword.rotation.x = -1.2 + Math.sin(time * 10) * 1.5;
      } else {
        bossSword.rotation.x = 0;
      }

      if (isHurt) {
        torso.position.z = -0.15;
      } else {
        torso.position.z = 0;
      }
    };

    return { mesh: group, updateAnimation, setBossPhase };
  }

  if (type === 'spider' || type === 'boss_arachna') {
    // Multi-legged Arachnid
    const spiderMat = new THREE.MeshStandardMaterial({
      color: type === 'boss_arachna' ? 0x2e1065 : 0x1f2937,
      roughness: 0.7,
      metalness: 0.2
    });
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      emissive: new THREE.Color(0x22c55e),
      emissiveIntensity: 0.8
    });

    // Abdomen
    const abdomen = new THREE.Mesh(new THREE.SphereGeometry(isBoss ? 1.0 : 0.45, 8, 8), spiderMat);
    abdomen.position.set(0, isBoss ? 0.9 : 0.4, -0.5);
    abdomen.scale.set(1.1, 0.9, 1.4);
    abdomen.castShadow = true;
    group.add(abdomen);

    // Thorax & Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(isBoss ? 0.6 : 0.3, 8, 8), spiderMat);
    head.position.set(0, isBoss ? 0.7 : 0.35, 0.3);
    group.add(head);

    // Glowing Eyes
    for (let e = -2; e <= 2; e++) {
      if (e === 0) continue;
      const eye = new THREE.Mesh(new THREE.SphereGeometry(isBoss ? 0.08 : 0.04, 6, 6), eyeMat);
      eye.position.set(e * (isBoss ? 0.12 : 0.06), isBoss ? 0.15 : 0.08, isBoss ? 0.55 : 0.28);
      head.add(eye);
    }

    // 8 Legs
    const legs: THREE.Mesh[] = [];
    for (let l = 0; l < 8; l++) {
      const side = l < 4 ? -1 : 1;
      const legIdx = l % 4;
      const legGeo = new THREE.CylinderGeometry(0.04, 0.02, isBoss ? 1.2 : 0.6, 6);
      const leg = new THREE.Mesh(legGeo, spiderMat);
      leg.position.set(side * (isBoss ? 0.6 : 0.3), isBoss ? 0.4 : 0.2, (legIdx - 1.5) * (isBoss ? 0.4 : 0.2));
      leg.rotation.z = side * 0.9;
      group.add(leg);
      legs.push(leg);
    }

    updateAnimation = (time, isMoving, isAttacking) => {
      legs.forEach((leg, idx) => {
        const side = idx < 4 ? -1 : 1;
        const wave = Math.sin(time * 12 + idx * 0.8);
        leg.rotation.x = isMoving ? wave * 0.4 : 0;
        leg.rotation.z = side * (0.9 + (isMoving ? wave * 0.1 : 0));
      });
      if (isAttacking) {
        head.position.y = (isBoss ? 0.7 : 0.35) + Math.sin(time * 10) * 0.2;
      }
    };

    return { mesh: group, updateAnimation };
  }

  // Bipedal humanoid enemies (Goblin, Skeleton, Troll, Frost Giant, Fire Demon, Shadow Knight)
  let skinColor = 0x22c55e; // Goblin green
  let armorColor = 0x78716c; // Rusty metal
  let weaponType = 'sword';

  if (type === 'skeleton') {
    skinColor = 0xe2e8f0; // Bone white
    armorColor = 0x475569;
  } else if (type === 'troll') {
    skinColor = 0x3f3f46; // Swamp grey
    armorColor = 0x57534e;
    weaponType = 'club';
  } else if (type === 'frost_giant' || type === 'boss_ymir') {
    skinColor = 0x7dd3fc; // Icy blue
    armorColor = 0x0284c7;
    weaponType = 'club';
  } else if (type === 'fire_demon' || type === 'boss_ignis') {
    skinColor = 0xef4444; // Fiery red
    armorColor = 0x7f1d1d;
    weaponType = 'sword';
  } else if (type === 'shadow_knight') {
    skinColor = 0x1e1b4b; // Deep void
    armorColor = 0x09090b;
    weaponType = 'sword';
  } else if (type === 'boss_gortok') {
    skinColor = 0x15803d; // Dark goblin chieftain green
    armorColor = 0xb45309; // Spiked bronze
  }

  const matSkin = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.65, metalness: 0.1 });
  const matArmor = new THREE.MeshStandardMaterial({ color: armorColor, roughness: 0.4, metalness: 0.6 });

  // Torso
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.65, 0.32), matArmor);
  torso.position.y = 1.1;
  torso.castShadow = true;
  group.add(torso);

  // Head
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.32, 0.28), matSkin);
  head.position.y = 0.45;
  torso.add(head);

  // Glowing Eyes
  const eyeMat = new THREE.MeshStandardMaterial({
    color: type === 'frost_giant' ? 0x38bdf8 : (type === 'fire_demon' ? 0xf59e0b : 0xef4444),
    emissive: new THREE.Color(type === 'frost_giant' ? 0x38bdf8 : 0xef4444),
    emissiveIntensity: 0.8
  });
  const eye1 = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), eyeMat);
  eye1.position.set(0.08, 0.05, 0.15);
  head.add(eye1);
  const eye2 = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), eyeMat);
  eye2.position.set(-0.08, 0.05, 0.15);
  head.add(eye2);

  // Right arm with weapon
  const rightArm = new THREE.Group();
  rightArm.position.set(0.36, 0.15, 0);
  torso.add(rightArm);

  const armMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.5, 6), matSkin);
  armMesh.position.y = -0.25;
  rightArm.add(armMesh);

  if (weaponType === 'club') {
    const club = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.04, 0.9, 8),
      new THREE.MeshStandardMaterial({ color: 0x44403c, roughness: 0.9 })
    );
    club.position.set(0, -0.4, 0.2);
    club.rotation.x = Math.PI / 4;
    rightArm.add(club);
  } else {
    const sword = new THREE.Mesh(
      new THREE.BoxGeometry(0.07, 0.8, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.8 })
    );
    sword.position.set(0, -0.35, 0.2);
    sword.rotation.x = Math.PI / 4;
    rightArm.add(sword);
  }

  // Left arm
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.36, 0.15, 0);
  torso.add(leftArm);
  const lArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.5, 6), matSkin);
  lArmMesh.position.y = -0.25;
  leftArm.add(lArmMesh);

  // Legs
  const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.6, 6), matArmor);
  legL.position.set(-0.16, -0.5, 0);
  torso.add(legL);

  const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.6, 6), matArmor);
  legR.position.set(0.16, -0.5, 0);
  torso.add(legR);

  updateAnimation = (time, isMoving, isAttacking, isHurt) => {
    if (isMoving) {
      const walk = Math.sin(time * 8);
      legL.rotation.x = walk * 0.5;
      legR.rotation.x = -walk * 0.5;
      if (!isAttacking) {
        rightArm.rotation.x = -walk * 0.4;
        leftArm.rotation.x = walk * 0.4;
      }
    } else {
      legL.rotation.x = 0;
      legR.rotation.x = 0;
    }

    if (isAttacking) {
      rightArm.rotation.x = -1.2 + Math.sin(time * 12) * 1.0;
    }

    if (isHurt) {
      torso.rotation.x = 0.2;
    } else {
      torso.rotation.x = 0;
    }
  };

  return { mesh: group, updateAnimation };
}

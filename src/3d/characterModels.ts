import * as THREE from 'three';
import { Equipment } from '../types/game';

export interface WarriorRig {
  group: THREE.Group;
  torso: THREE.Mesh;
  head: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  weaponMesh: THREE.Group;
  shieldMesh: THREE.Group;
  cape: THREE.Mesh;
  updateAnimation: (
    time: number,
    isMoving: boolean,
    isSprinting: boolean,
    isAttacking: boolean,
    attackTime: number,
    attackCombo: number,
    isBlocking: boolean,
    isRolling: boolean,
    rollProgress: number
  ) => void;
  updateEquipmentVisuals: (equipment: Equipment) => void;
}

export interface FppViewModel {
  group: THREE.Group;
  rightArm: THREE.Group;
  leftArm: THREE.Group;
  weapon: THREE.Group;
  shield: THREE.Group;
  updateAnimation: (
    time: number,
    isMoving: boolean,
    isAttacking: boolean,
    attackTime: number,
    attackCombo: number,
    isBlocking: boolean
  ) => void;
  updateEquipmentVisuals: (equipment: Equipment) => void;
}

export function createWarriorCharacter(): WarriorRig {
  const group = new THREE.Group();

  // Materials with PBR properties (varying roughness and metalness)
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xdeb887,
    roughness: 0.65,
    metalness: 0.05
  });

  const armorMat = new THREE.MeshStandardMaterial({
    color: 0x475569, // Steel
    roughness: 0.28,
    metalness: 0.85
  });

  const trimMat = new THREE.MeshStandardMaterial({
    color: 0xeab308, // Gold trim
    roughness: 0.35,
    metalness: 0.9
  });

  const leatherMat = new THREE.MeshStandardMaterial({
    color: 0x5c3818, // Brown leather
    roughness: 0.8,
    metalness: 0.1
  });

  const clothMat = new THREE.MeshStandardMaterial({
    color: 0x1e3a8a, // Royal Eldorian blue
    roughness: 0.7,
    metalness: 0.1
  });

  // 1. Torso & Chestplate
  const torsoGeo = new THREE.BoxGeometry(0.5, 0.6, 0.32);
  const torso = new THREE.Mesh(torsoGeo, armorMat);
  torso.position.y = 1.1;
  torso.castShadow = true;
  torso.receiveShadow = true;
  group.add(torso);

  // Chest emblem plate
  const emblemGeo = new THREE.BoxGeometry(0.24, 0.28, 0.05);
  const emblem = new THREE.Mesh(emblemGeo, trimMat);
  emblem.position.set(0, 0.05, 0.17);
  torso.add(emblem);

  // Belt
  const beltGeo = new THREE.BoxGeometry(0.52, 0.1, 0.34);
  const belt = new THREE.Mesh(beltGeo, leatherMat);
  belt.position.y = -0.26;
  torso.add(belt);

  // Cape
  const capeGeo = new THREE.PlaneGeometry(0.46, 0.85);
  const cape = new THREE.Mesh(capeGeo, clothMat);
  cape.position.set(0, -0.05, -0.18);
  cape.rotation.x = 0.05;
  torso.add(cape);

  // 2. Head & Helmet
  const head = new THREE.Group();
  head.position.set(0, 0.38, 0);
  torso.add(head);

  // Face
  const faceGeo = new THREE.BoxGeometry(0.26, 0.28, 0.24);
  const face = new THREE.Mesh(faceGeo, skinMat);
  head.add(face);

  // Warrior Helmet
  const helmetGeo = new THREE.BoxGeometry(0.28, 0.2, 0.26);
  const helmet = new THREE.Mesh(helmetGeo, armorMat);
  helmet.position.set(0, 0.08, -0.01);
  head.add(helmet);

  // Helmet Crest
  const crestGeo = new THREE.BoxGeometry(0.06, 0.15, 0.28);
  const crest = new THREE.Mesh(crestGeo, trimMat);
  crest.position.set(0, 0.2, 0);
  head.add(crest);

  // 3. Right Arm (Sword arm)
  const rightArm = new THREE.Group();
  rightArm.position.set(0.36, 0.2, 0);
  torso.add(rightArm);

  const pauldronR = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), armorMat);
  pauldronR.scale.set(1.1, 1.2, 1.1);
  rightArm.add(pauldronR);

  const armGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.5, 8);
  const rBicep = new THREE.Mesh(armGeo, armorMat);
  rBicep.position.y = -0.22;
  rightArm.add(rBicep);

  const rHand = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.12), leatherMat);
  rHand.position.y = -0.48;
  rightArm.add(rHand);

  // Weapon Group
  const weaponMesh = new THREE.Group();
  weaponMesh.position.set(0, -0.48, 0.1);
  rightArm.add(weaponMesh);

  // Default Sword model
  const bladeGeo = new THREE.BoxGeometry(0.06, 0.85, 0.02);
  const bladeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.15,
    metalness: 0.95
  });
  const blade = new THREE.Mesh(bladeGeo, bladeMat);
  blade.position.set(0, 0.42, 0);
  blade.castShadow = true;
  weaponMesh.add(blade);

  const guardGeo = new THREE.BoxGeometry(0.26, 0.04, 0.06);
  const guard = new THREE.Mesh(guardGeo, trimMat);
  guard.position.set(0, 0.02, 0);
  weaponMesh.add(guard);

  const hiltGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.16, 8);
  const hilt = new THREE.Mesh(hiltGeo, leatherMat);
  hilt.position.set(0, -0.08, 0);
  weaponMesh.add(hilt);

  const pommelGeo = new THREE.SphereGeometry(0.04, 8, 8);
  const pommel = new THREE.Mesh(pommelGeo, trimMat);
  pommel.position.set(0, -0.17, 0);
  weaponMesh.add(pommel);

  // 4. Left Arm (Shield arm)
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.36, 0.2, 0);
  torso.add(leftArm);

  const pauldronL = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), armorMat);
  pauldronL.scale.set(1.1, 1.2, 1.1);
  leftArm.add(pauldronL);

  const lBicep = new THREE.Mesh(armGeo, armorMat);
  lBicep.position.y = -0.22;
  leftArm.add(lBicep);

  const lHand = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.12), leatherMat);
  lHand.position.y = -0.48;
  leftArm.add(lHand);

  // Shield Group
  const shieldMesh = new THREE.Group();
  shieldMesh.position.set(-0.05, -0.32, 0.15);
  shieldMesh.rotation.y = -Math.PI / 2;
  leftArm.add(shieldMesh);

  // Default Shield model
  const shieldBodyGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.04, 16);
  const shieldMat = new THREE.MeshStandardMaterial({
    color: 0x1e3a8a,
    roughness: 0.4,
    metalness: 0.6
  });
  const shieldBody = new THREE.Mesh(shieldBodyGeo, shieldMat);
  shieldBody.rotation.x = Math.PI / 2;
  shieldMesh.add(shieldBody);

  const rimGeo = new THREE.TorusGeometry(0.32, 0.025, 8, 16);
  const rim = new THREE.Mesh(rimGeo, trimMat);
  shieldMesh.add(rim);

  const shieldBoss = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), trimMat);
  shieldBoss.position.z = 0.03;
  shieldMesh.add(shieldBoss);

  // 5. Left Leg
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.16, -0.32, 0);
  torso.add(leftLeg);

  const legGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.55, 8);
  const lThigh = new THREE.Mesh(legGeo, leatherMat);
  lThigh.position.y = -0.26;
  leftLeg.add(lThigh);

  const lBoot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.22, 0.22), armorMat);
  lBoot.position.set(0, -0.45, 0.04);
  leftLeg.add(lBoot);

  // 6. Right Leg
  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.16, -0.32, 0);
  torso.add(rightLeg);

  const rThigh = new THREE.Mesh(legGeo, leatherMat);
  rThigh.position.y = -0.26;
  rightLeg.add(rThigh);

  const rBoot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.22, 0.22), armorMat);
  rBoot.position.set(0, -0.45, 0.04);
  rightLeg.add(rBoot);

  // Contact Shadow grounding disc
  const shadowGeo = new THREE.CircleGeometry(0.55, 16);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.4,
    depthWrite: false
  });
  const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat);
  shadowDisc.rotation.x = -Math.PI / 2;
  shadowDisc.position.y = 0.02;
  group.add(shadowDisc);

  // Rig Animation function
  const updateAnimation = (
    time: number,
    isMoving: boolean,
    isSprinting: boolean,
    isAttacking: boolean,
    attackTime: number,
    attackCombo: number,
    isBlocking: boolean,
    isRolling: boolean,
    rollProgress: number
  ) => {
    if (isRolling) {
      // 360 forward roll
      group.position.y = Math.sin(rollProgress * Math.PI) * 0.4;
      torso.rotation.x = rollProgress * Math.PI * 2;
      leftLeg.rotation.x = -0.8;
      rightLeg.rotation.x = -0.8;
      rightArm.rotation.x = -1.2;
      leftArm.rotation.x = -1.2;
      return;
    } else {
      group.position.y = 0;
      torso.rotation.x = 0;
    }

    const walkSpeed = isSprinting ? 14 : 9;
    const walkAmplitude = isSprinting ? 0.65 : 0.4;

    if (isMoving) {
      // Walk/run cycles
      const cycle = Math.sin(time * walkSpeed);
      leftLeg.rotation.x = cycle * walkAmplitude;
      rightLeg.rotation.x = -cycle * walkAmplitude;
      torso.position.y = 1.1 + Math.abs(Math.sin(time * walkSpeed * 2)) * 0.05;
      cape.rotation.x = 0.2 + (isSprinting ? 0.35 : 0.15) + Math.sin(time * walkSpeed) * 0.1;

      if (!isAttacking && !isBlocking) {
        rightArm.rotation.x = -cycle * (walkAmplitude * 0.7);
        leftArm.rotation.x = cycle * (walkAmplitude * 0.7);
      }
    } else {
      // Idle breathing
      const idle = Math.sin(time * 2.5);
      leftLeg.rotation.x = 0;
      rightLeg.rotation.x = 0;
      torso.position.y = 1.1 + idle * 0.015;
      cape.rotation.x = 0.08 + idle * 0.03;

      if (!isAttacking && !isBlocking) {
        rightArm.rotation.x = 0.1 + idle * 0.05;
        rightArm.rotation.z = -0.05;
        leftArm.rotation.x = 0.1 - idle * 0.05;
        leftArm.rotation.z = 0.05;
      }
    }

    // Blocking animation
    if (isBlocking) {
      leftArm.rotation.set(-0.8, 0.6, 0.4);
      shieldMesh.rotation.set(0.2, 0.3, 0);
      rightArm.rotation.set(0.3, -0.4, 0);
    } else {
      shieldMesh.rotation.set(0, -Math.PI / 2, 0);
    }

    // Attack combo swings
    if (isAttacking) {
      const progress = Math.min(1, attackTime * 4.0); // 0 to 1
      if (attackCombo === 0) {
        // Horizontal right slash
        rightArm.rotation.x = -0.4 + Math.sin(progress * Math.PI) * -0.8;
        rightArm.rotation.y = 0.8 - progress * 1.6;
        weaponMesh.rotation.z = 0.4;
      } else if (attackCombo === 1) {
        // Overhead slash
        rightArm.rotation.x = -1.6 + progress * 2.2;
        rightArm.rotation.y = -0.2;
        weaponMesh.rotation.z = 0.1;
      } else {
        // Spin finisher
        group.rotation.y += 0.35;
        rightArm.rotation.x = -1.2;
        rightArm.rotation.y = 0;
        weaponMesh.rotation.z = 1.2;
      }
    } else {
      weaponMesh.rotation.set(0, 0, 0);
    }
  };

  const updateEquipmentVisuals = (equipment: Equipment) => {
    // Update blade appearance based on equipped weapon
    if (equipment.weapon) {
      const color = equipment.weapon.color ? new THREE.Color(equipment.weapon.color) : new THREE.Color(0xe2e8f0);
      bladeMat.color.copy(color);
      if (equipment.weapon.rarity === 'legendary' || equipment.weapon.rarity === 'mythical') {
        bladeMat.emissive = color.clone().multiplyScalar(0.4);
      } else {
        bladeMat.emissive = new THREE.Color(0x000000);
      }
    }
    // Update armor appearance
    if (equipment.armor) {
      if (equipment.armor.rarity === 'mythical') {
        armorMat.color.setHex(0xeab308); // Gold
      } else if (equipment.armor.rarity === 'legendary') {
        armorMat.color.setHex(0xb91c1c); // Crimson
      } else if (equipment.armor.rarity === 'epic') {
        armorMat.color.setHex(0x38bdf8); // Frost blue
      } else {
        armorMat.color.setHex(0x475569); // Iron steel
      }
    }
  };

  return {
    group,
    torso,
    head,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    weaponMesh,
    shieldMesh,
    cape,
    updateAnimation,
    updateEquipmentVisuals
  };
}

// First-Person Perspective (FPP) Rig visible directly in front of camera
export function createFppViewModel(): FppViewModel {
  const group = new THREE.Group();

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xdeb887,
    roughness: 0.65,
    metalness: 0.05
  });

  const armorMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.28,
    metalness: 0.85
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xeab308,
    roughness: 0.35,
    metalness: 0.9
  });

  // Right Arm (Sword)
  const rightArm = new THREE.Group();
  rightArm.position.set(0.35, -0.32, -0.45);
  group.add(rightArm);

  const rForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.45, 8), armorMat);
  rForearm.position.set(0, -0.15, 0.1);
  rForearm.rotation.x = Math.PI / 4;
  rightArm.add(rForearm);

  const rHand = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.1), skinMat);
  rHand.position.set(0, 0.02, -0.06);
  rightArm.add(rHand);

  // Weapon
  const weapon = new THREE.Group();
  weapon.position.set(0, 0.02, -0.1);
  rightArm.add(weapon);

  const bladeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.15,
    metalness: 0.95
  });
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.75, 0.015), bladeMat);
  blade.position.set(0, 0.35, -0.15);
  blade.rotation.x = -Math.PI / 6;
  weapon.add(blade);

  const guard = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.05), goldMat);
  guard.position.set(0, 0.01, -0.02);
  weapon.add(guard);

  // Left Arm (Shield)
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.35, -0.38, -0.42);
  group.add(leftArm);

  const lForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.45, 8), armorMat);
  lForearm.position.set(0, -0.15, 0.1);
  lForearm.rotation.x = Math.PI / 4;
  leftArm.add(lForearm);

  // Shield
  const shield = new THREE.Group();
  shield.position.set(0.05, 0.05, -0.08);
  leftArm.add(shield);

  const shieldBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 0.03, 16),
    new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.4, metalness: 0.6 })
  );
  shieldBody.rotation.x = Math.PI / 2;
  shield.add(shieldBody);

  const shieldRim = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.02, 8, 16), goldMat);
  shield.add(shieldRim);

  const updateAnimation = (
    time: number,
    isMoving: boolean,
    isAttacking: boolean,
    attackTime: number,
    attackCombo: number,
    isBlocking: boolean
  ) => {
    // Walking weapon bob
    const bob = isMoving ? Math.sin(time * 10) * 0.03 : Math.sin(time * 2.5) * 0.008;
    const sway = isMoving ? Math.cos(time * 5) * 0.02 : 0;

    if (isBlocking) {
      // Raise shield up high into front view
      leftArm.position.set(-0.1, -0.15, -0.38);
      leftArm.rotation.set(-0.2, 0.3, 0.1);
      rightArm.position.set(0.38, -0.4, -0.35);
    } else {
      leftArm.position.set(-0.35 + sway, -0.38 + bob, -0.42);
      leftArm.rotation.set(0, 0, 0);

      rightArm.position.set(0.35 - sway, -0.32 + bob, -0.45);
      rightArm.rotation.set(0, 0, 0);
    }

    if (isAttacking) {
      const p = Math.min(1, attackTime * 4.5);
      if (attackCombo === 0) {
        // Horizontal cleave
        rightArm.position.x = 0.35 - Math.sin(p * Math.PI) * 0.35;
        rightArm.rotation.z = Math.sin(p * Math.PI) * 0.8;
        rightArm.rotation.x = -Math.sin(p * Math.PI) * 0.4;
      } else if (attackCombo === 1) {
        // Downward chop
        rightArm.position.y = -0.32 + Math.sin(p * Math.PI) * 0.25;
        rightArm.position.z = -0.45 - Math.sin(p * Math.PI) * 0.2;
        rightArm.rotation.x = Math.sin(p * Math.PI) * -0.9;
      } else {
        // Thrust
        rightArm.position.z = -0.45 - Math.sin(p * Math.PI) * 0.4;
      }
    }
  };

  const updateEquipmentVisuals = (equipment: Equipment) => {
    if (equipment.weapon) {
      const color = equipment.weapon.color ? new THREE.Color(equipment.weapon.color) : new THREE.Color(0xe2e8f0);
      bladeMat.color.copy(color);
      if (equipment.weapon.rarity === 'legendary' || equipment.weapon.rarity === 'mythical') {
        bladeMat.emissive = color.clone().multiplyScalar(0.4);
      } else {
        bladeMat.emissive = new THREE.Color(0x000000);
      }
    }
  };

  return {
    group,
    rightArm,
    leftArm,
    weapon,
    shield,
    updateAnimation,
    updateEquipmentVisuals
  };
}

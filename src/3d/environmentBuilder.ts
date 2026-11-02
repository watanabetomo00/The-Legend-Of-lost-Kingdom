import * as THREE from 'three';
import { BiomeType } from '../types/game';
import { createGroundTexture, createLavaTexture, createStoneWallTexture } from './textureGenerator';

export interface LevelEnvironment {
  group: THREE.Group;
  interactables: THREE.Object3D[];
  exitPortal: THREE.Group;
  treasureChests: { group: THREE.Group; opened: boolean; position: THREE.Vector3 }[];
  update: (time: number) => void;
  dispose: () => void;
}

export function buildEnvironmentForLevel(
  biome: BiomeType,
  levelNumber: number,
  isBossLevel: boolean
): LevelEnvironment {
  const group = new THREE.Group();
  const interactables: THREE.Object3D[] = [];
  const treasureChests: { group: THREE.Group; opened: boolean; position: THREE.Vector3 }[] = [];

  // 1. Terrain Ground
  const groundSize = 140;
  const groundGeo = new THREE.PlaneGeometry(groundSize, groundSize, 32, 32);
  // Give terrain subtle hills at edges
  const posAttr = groundGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    const distFromCenter = Math.sqrt(x * x + y * y);
    if (distFromCenter > 35) {
      // Rise into natural perimeter mountains/hills
      const elevation = Math.pow((distFromCenter - 35) / 25, 1.8) * 4.0;
      posAttr.setZ(i, elevation + Math.sin(x * 0.2) * Math.cos(y * 0.2) * 1.2);
    }
  }
  groundGeo.computeVertexNormals();

  const groundTexture = createGroundTexture(biome);
  const groundMat = new THREE.MeshStandardMaterial({
    map: groundTexture,
    roughness: 0.85,
    metalness: 0.1
  });
  const groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.receiveShadow = true;
  group.add(groundMesh);

  // 2. Natural Perimeter Barriers & Biome Features
  const rockMat = new THREE.MeshStandardMaterial({
    color: biome === 'mountains' ? 0x94a3b8 : (biome === 'infernal' ? 0x26120e : 0x475569),
    roughness: 0.9,
    metalness: 0.1
  });

  // Perimeter Cliffs / Rocks
  const rockCount = 36;
  const rockGeo = new THREE.DodecahedronGeometry(3.5, 1);
  const rockInstanced = new THREE.InstancedMesh(rockGeo, rockMat, rockCount);
  const dummy = new THREE.Object3D();

  for (let i = 0; i < rockCount; i++) {
    const angle = (i / rockCount) * Math.PI * 2;
    const radius = 38 + (i % 3) * 6;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const scaleY = 1.5 + Math.random() * 2.0;
    const scaleXZ = 1.2 + Math.random() * 0.8;

    dummy.position.set(x, scaleY * 1.5, z);
    dummy.rotation.set(Math.random() * 0.4, Math.random() * Math.PI, Math.random() * 0.4);
    dummy.scale.set(scaleXZ, scaleY, scaleXZ);
    dummy.updateMatrix();
    rockInstanced.setMatrixAt(i, dummy.matrix);
  }
  rockInstanced.instanceMatrix.needsUpdate = true;
  rockInstanced.castShadow = true;
  rockInstanced.receiveShadow = true;
  group.add(rockInstanced);

  // Trees or Spires according to biome
  if (biome === 'kingdom' || biome === 'wilderness') {
    // Medieval / Swamp Trees
    const trunkGeo = new THREE.CylinderGeometry(0.3, 0.45, 3.5, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.9 });
    const foliageGeo = new THREE.ConeGeometry(2.0, 4.0, 7);
    const foliageMat = new THREE.MeshStandardMaterial({
      color: biome === 'kingdom' ? 0x1e3a1e : 0x2e3b23,
      roughness: 0.8
    });

    const treeCount = 20;
    for (let t = 0; t < treeCount; t++) {
      const angle = (t / treeCount) * Math.PI * 2 + Math.random() * 0.2;
      const dist = 16 + (t % 4) * 5;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;

      const tree = new THREE.Group();
      tree.position.set(x, 0, z);

      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.75;
      trunk.castShadow = true;
      tree.add(trunk);

      const foliage = new THREE.Mesh(foliageGeo, foliageMat);
      foliage.position.y = 4.2;
      foliage.castShadow = true;
      tree.add(foliage);

      group.add(tree);
    }
  } else if (biome === 'infernal') {
    // Flowing Lava rivers / pools
    const lavaGeo = new THREE.PlaneGeometry(18, 18);
    const lavaTexture = createLavaTexture();
    const lavaMat = new THREE.MeshBasicMaterial({
      map: lavaTexture
    });
    const lavaPool = new THREE.Mesh(lavaGeo, lavaMat);
    lavaPool.rotation.x = -Math.PI / 2;
    lavaPool.position.set(12, 0.05, 10);
    group.add(lavaPool);
  } else if (biome === 'shadow') {
    // Obsidian Spire monoliths
    const spireGeo = new THREE.ConeGeometry(0.8, 8, 4);
    const spireMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.2,
      metalness: 0.9
    });
    for (let s = 0; s < 8; s++) {
      const angle = (s / 8) * Math.PI * 2;
      const spire = new THREE.Mesh(spireGeo, spireMat);
      spire.position.set(Math.cos(angle) * 22, 4, Math.sin(angle) * 22);
      spire.castShadow = true;
      group.add(spire);
    }
  }

  // 3. Ancient Ruins & Pillars
  const wallTexture = createStoneWallTexture();
  const pillarMat = new THREE.MeshStandardMaterial({
    map: wallTexture,
    roughness: 0.75,
    metalness: 0.2
  });

  const pillarLocations = [
    [-12, -12], [12, -12], [-12, 12], [12, 12]
  ];
  pillarLocations.forEach(([px, pz]) => {
    const pillarGroup = new THREE.Group();
    pillarGroup.position.set(px, 0, pz);

    const base = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 1.6), pillarMat);
    base.position.y = 0.25;
    pillarGroup.add(base);

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 4.2, 8), pillarMat);
    shaft.position.y = 2.4;
    shaft.castShadow = true;
    pillarGroup.add(shaft);

    const capital = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.4, 1.4), pillarMat);
    capital.position.y = 4.6;
    pillarGroup.add(capital);

    // Torch on pillar
    const torch = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.04, 0.5, 6),
      new THREE.MeshStandardMaterial({ color: 0x78350f })
    );
    torch.position.set(0.7, 2.5, 0);
    torch.rotation.z = -0.4;
    pillarGroup.add(torch);

    // Flame light
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), flameMat);
    flame.position.set(0.8, 2.8, 0);
    pillarGroup.add(flame);

    group.add(pillarGroup);
  });

  // 4. Interactive Treasure Chests (1-2 per level)
  const chestLocs = [[-8, 14], [10, -15]];
  chestLocs.forEach(([cx, cz], idx) => {
    const chestGroup = new THREE.Group();
    chestGroup.position.set(cx, 0, cz);

    const chestBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.6, 0.75),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 })
    );
    chestBase.position.y = 0.3;
    chestBase.castShadow = true;
    chestGroup.add(chestBase);

    // Metal bands
    const band = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 0.62, 0.2),
      new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.3, metalness: 0.85 })
    );
    band.position.y = 0.3;
    chestGroup.add(band);

    const lid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.38, 1.1, 8, 1, false, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 })
    );
    lid.rotation.z = Math.PI / 2;
    lid.position.y = 0.6;
    chestGroup.add(lid);

    // Golden Beacon indicator
    const beaconGeo = new THREE.CylinderGeometry(0.05, 0.05, 3.5, 8);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.5
    });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.y = 2.0;
    chestGroup.add(beacon);

    group.add(chestGroup);
    interactables.push(chestGroup);
    treasureChests.push({
      group: chestGroup,
      opened: false,
      position: new THREE.Vector3(cx, 0, cz)
    });
  });

  // 5. Exit Portal Gate (Gateway to Next Level)
  const exitPortal = new THREE.Group();
  exitPortal.position.set(0, 0, -25); // At end of level arena

  // Portal Arch
  const archL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5.0, 0.8), pillarMat);
  archL.position.set(-2.2, 2.5, 0);
  archL.castShadow = true;
  exitPortal.add(archL);

  const archR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5.0, 0.8), pillarMat);
  archR.position.set(2.2, 2.5, 0);
  archR.castShadow = true;
  exitPortal.add(archR);

  const archTop = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.9, 0.9), pillarMat);
  archTop.position.set(0, 5.2, 0);
  exitPortal.add(archTop);

  // Swirling Portal Energy Vortex
  const portalVortexGeo = new THREE.CircleGeometry(2.0, 24);
  const portalVortexMat = new THREE.MeshBasicMaterial({
    color: isBossLevel ? 0xef4444 : 0x38bdf8,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide
  });
  const portalVortex = new THREE.Mesh(portalVortexGeo, portalVortexMat);
  portalVortex.position.set(0, 2.6, 0);
  exitPortal.add(portalVortex);

  group.add(exitPortal);
  interactables.push(exitPortal);

  // Update loop for portal swirl
  const update = (time: number) => {
    portalVortex.rotation.z = time * 1.5;
  };

  const dispose = () => {
    groundGeo.dispose();
    groundMat.dispose();
    rockGeo.dispose();
    rockMat.dispose();
  };

  return {
    group,
    interactables,
    exitPortal,
    treasureChests,
    update,
    dispose
  };
}

import * as THREE from 'three';

export function createGroundTexture(biome: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  let primary = '#3a6631';
  let secondary = '#2a4c23';
  let accent = '#4d7838';

  if (biome === 'wilderness') {
    primary = '#2d2e23';
    secondary = '#1e2118';
    accent = '#3f452a';
  } else if (biome === 'mountains') {
    primary = '#d9e7f5';
    secondary = '#bed6ed';
    accent = '#ffffff';
  } else if (biome === 'infernal') {
    primary = '#2a1410';
    secondary = '#1a0c0a';
    accent = '#701e14';
  } else if (biome === 'shadow') {
    primary = '#111322';
    secondary = '#090a14';
    accent = '#201f3d';
  }

  ctx.fillStyle = primary;
  ctx.fillRect(0, 0, 512, 512);

  // Perlin/Simplex noise-like speckling & stone patterns
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const size = Math.random() * 4 + 1;
    ctx.fillStyle = Math.random() > 0.5 ? secondary : accent;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw tile/crag grid veins
  ctx.strokeStyle = secondary;
  ctx.lineWidth = 2;
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 512, 0);
    ctx.bezierCurveTo(
      Math.random() * 512, 170,
      Math.random() * 512, 340,
      Math.random() * 512, 512
    );
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createStoneWallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#475569';
  ctx.fillRect(0, 0, 512, 512);

  // Brick patterns
  const brickH = 32;
  const brickW = 64;
  ctx.fillStyle = '#64748b';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 3;

  for (let y = 0; y < 512; y += brickH) {
    const row = Math.floor(y / brickH);
    const offsetX = (row % 2) * (brickW / 2);
    for (let x = -brickW; x < 512 + brickW; x += brickW) {
      ctx.fillStyle = (row + Math.floor(x / brickW)) % 3 === 0 ? '#5b697d' : '#64748b';
      ctx.fillRect(x + offsetX, y, brickW - 4, brickH - 4);
      ctx.strokeRect(x + offsetX, y, brickW - 4, brickH - 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createLavaTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
  grad.addColorStop(0, '#fef08a');
  grad.addColorStop(0.3, '#f97316');
  grad.addColorStop(0.7, '#dc2626');
  grad.addColorStop(1, '#450a0a');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

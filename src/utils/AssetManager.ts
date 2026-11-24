import * as THREE from 'three';

/**
 * Centralized Asset Manager for LUMINA
 * Manages 3D models (GLTF/GLB), textures, procedural fallback generators,
 * caching, material sharing, and memory disposal.
 */

export interface AssetItem<T = any> {
  id: string;
  url: string;
  data: T | null;
  status: 'pending' | 'loading' | 'loaded' | 'error';
  error?: string;
}

class AssetManager {
  private cache: Map<string, any> = new Map();
  private textureCache: Map<string, THREE.Texture> = new Map();
  private sharedMaterials: Map<string, THREE.Material> = new Map();

  constructor() {
    this.initSharedMaterials();
  }

  /**
   * Initializes master high-end stylized PBR materials matching the approved color palette:
   * Midnight Navy, Emerald Teal, Luminous Gold, Royal Purple, Lotus Pink, Warm Amber.
   */
  private initSharedMaterials() {
    // 1. Luminous Gold (Temple ornaments, tiaras, pageant accents)
    this.sharedMaterials.set('luminous-gold', new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F59E0B'),
      metalness: 0.88,
      roughness: 0.22,
      envMapIntensity: 1.5,
    }));

    // 2. Imperial Polished Gold (Mirror-like reflective accents)
    this.sharedMaterials.set('polished-gold', new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FBBF24'),
      metalness: 0.95,
      roughness: 0.12,
    }));

    // 3. Teak Wood (Temple pillars, market stalls, river decking)
    this.sharedMaterials.set('warm-teak', new THREE.MeshStandardMaterial({
      color: new THREE.Color('#5A2E0F'),
      roughness: 0.72,
      metalness: 0.08,
    }));

    // 4. Stylized Temple Stone (Stairs, temple foundation, river walls)
    this.sharedMaterials.set('temple-stone', new THREE.MeshStandardMaterial({
      color: new THREE.Color('#334155'),
      roughness: 0.65,
      metalness: 0.15,
    }));

    // 5. Stylized Ground Cobblestone
    this.sharedMaterials.set('ground-cobble', new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1E293B'),
      roughness: 0.80,
      metalness: 0.10,
    }));

    // 6. Sacred Lotus Pink
    this.sharedMaterials.set('lotus-pink', new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F472B6'),
      roughness: 0.45,
      metalness: 0.12,
    }));

    // 7. Fresh Banana Leaf Green
    this.sharedMaterials.set('banana-leaf', new THREE.MeshStandardMaterial({
      color: new THREE.Color('#2E6B34'),
      roughness: 0.55,
      metalness: 0.08,
    }));

    // 8. Glossy Runway Glass / Obsidian
    this.sharedMaterials.set('runway-gloss', new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0A0E1A'),
      metalness: 0.9,
      roughness: 0.15,
    }));
  }

  getMaterial(name: string): THREE.Material {
    if (this.sharedMaterials.has(name)) {
      return this.sharedMaterials.get(name)!;
    }
    return new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.5 });
  }

  /**
   * Helper to generate smooth procedural normal/gradient canvas textures
   */
  createNoiseTexture(width = 256, height = 256): THREE.Texture {
    const key = `noise-${width}x${height}`;
    if (this.textureCache.has(key)) return this.textureCache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    const imgData = ctx.createImageData(width, height);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const val = Math.floor(Math.random() * 255);
      imgData.data[i] = val;
      imgData.data[i + 1] = val;
      imgData.data[i + 2] = val;
      imgData.data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.textureCache.set(key, texture);
    return texture;
  }
}

export const assetManager = new AssetManager();

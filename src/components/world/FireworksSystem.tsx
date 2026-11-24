import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface FireworksHandle {
  launchBurst: (x: number, y: number, z: number, color: string) => void;
}

const MAX_PARTICLES = 300;

export const FireworksSystem = forwardRef<FireworksHandle>((_, ref) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Pre-allocated static buffers for maximum performance (Zero GC pauses)
  const { positions, colors, velocities, activeAlphas, decayRates } = React.useMemo(() => {
    return {
      positions: new Float32Array(MAX_PARTICLES * 3),
      colors: new Float32Array(MAX_PARTICLES * 3),
      velocities: new Float32Array(MAX_PARTICLES * 3),
      activeAlphas: new Float32Array(MAX_PARTICLES),
      decayRates: new Float32Array(MAX_PARTICLES)
    };
  }, []);

  useImperativeHandle(ref, () => ({
    launchBurst: (bx: number, by: number, bz: number, colorHex: string) => {
      const c = new THREE.Color(colorHex);
      let count = 0;
      const burstSize = 45;

      for (let i = 0; i < MAX_PARTICLES && count < burstSize; i++) {
        if (activeAlphas[i] <= 0.02) {
          positions[i * 3] = bx;
          positions[i * 3 + 1] = by;
          positions[i * 3 + 2] = bz;

          colors[i * 3] = c.r;
          colors[i * 3 + 1] = c.g;
          colors[i * 3 + 2] = c.b;

          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);
          const speed = 3.0 + Math.random() * 5.0;

          velocities[i * 3] = speed * Math.sin(phi) * Math.cos(theta);
          velocities[i * 3 + 1] = speed * Math.sin(phi) * Math.sin(theta);
          velocities[i * 3 + 2] = speed * Math.cos(phi);

          activeAlphas[i] = 1.0;
          decayRates[i] = 0.02 + Math.random() * 0.015;
          count++;
        }
      }
    }
  }));

  // Update loop runs directly in WebGL frame without touching React state!
  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const colAttr = pointsRef.current.geometry.attributes.color;
    let needsUpdate = false;

    for (let i = 0; i < MAX_PARTICLES; i++) {
      if (activeAlphas[i] > 0.02) {
        needsUpdate = true;
        positions[i * 3] += velocities[i * 3] * delta;
        positions[i * 3 + 1] += (velocities[i * 3 + 1] - 4.5 * delta) * delta; // Gravity
        positions[i * 3 + 2] += velocities[i * 3 + 2] * delta;

        activeAlphas[i] -= decayRates[i] * delta * 45.0;

        // Dim color as alpha decays
        const alpha = Math.max(0, activeAlphas[i]);
        colors[i * 3] *= alpha;
        colors[i * 3 + 1] *= alpha;
        colors[i * 3 + 2] *= alpha;

        if (activeAlphas[i] <= 0.02) {
          // Reset offscreen
          positions[i * 3 + 1] = -500;
        }
      }
    }

    if (needsUpdate) {
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={MAX_PARTICLES}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={MAX_PARTICLES}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.75}
        vertexColors
        transparent
        opacity={0.95}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
});

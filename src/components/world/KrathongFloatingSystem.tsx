import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { KrathongModel } from './KrathongModel';
import { ActiveKrathong } from '../../types/game';

interface KrathongFloatingSystemProps {
  krathongs: ActiveKrathong[];
  onUpdateKrathongs?: (updater: (prev: ActiveKrathong[]) => ActiveKrathong[]) => void;
}

export const KrathongFloatingSystem: React.FC<KrathongFloatingSystemProps> = ({
  krathongs
}) => {
  const containerRef = useRef<THREE.Group>(null);

  // Buoyancy calculation matching the StylizedBrightWater Gerstner Wave
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!containerRef.current) return;

    containerRef.current.children.forEach((child, index) => {
      const data = krathongs[index];
      if (!data) return;

      // Current flow downwards along Z axis
      const currentZ = data.z + (time - data.spawnTime) * (data.speed * 0.85);
      const currentX = data.x + Math.sin(time * 0.4 + data.swayOffset) * 0.6;

      // Realistic Gerstner Wave elevation approximation at (X, Z)
      const wave1 = Math.sin((currentX * 1.0 + currentZ * 0.3) * (2 * Math.PI / 7.5) - time * 1.6) * 0.15;
      const wave2 = Math.sin((currentX * -0.5 + currentZ * 0.8) * (2 * Math.PI / 4.0) - time * 1.8) * 0.10;
      const waveY = -0.36 + wave1 + wave2;

      // Pitch and roll from wave slopes (gentle natural floating tilt)
      const tiltX = Math.cos(time * 1.6 + data.swayOffset) * 0.08;
      const tiltZ = Math.sin(time * 1.4 + data.swayOffset) * 0.08;

      child.position.set(currentX, waveY, currentZ);
      child.rotation.set(tiltX, data.rotation + time * data.rotSpeed, tiltZ);
    });
  });

  return (
    <group ref={containerRef}>
      {krathongs.map((k) => (
        <group key={k.id} scale={[1.2, 1.2, 1.2]}>
          <KrathongModel typeId={k.typeId} scale={1.0} />
        </group>
      ))}
    </group>
  );
};

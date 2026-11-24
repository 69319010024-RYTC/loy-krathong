import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { KRATHONG_COLLECTION } from '../../data/krathongs';

interface KrathongModelProps {
  typeId?: string;
  scale?: number;
  interactive?: boolean;
}

export const KrathongModel: React.FC<KrathongModelProps> = ({
  typeId = 'banana-leaf',
  scale = 1.0,
  interactive = false
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Mesh>(null);

  const config = useMemo(() => {
    return KRATHONG_COLLECTION.find(k => k.id === typeId) || KRATHONG_COLLECTION[0];
  }, [typeId]);

  // Generate folded petal geometries based on krathong design
  const { petalGeometries, centerDetails } = useMemo(() => {
    const petals: { pos: [number, number, number]; rot: [number, number, number]; scale: [number, number, number]; color: string }[] = [];

    const numLayers = config.layers;
    const petalsPerLayer = config.petalCount;

    for (let layer = 0; layer < numLayers; layer++) {
      const radius = 1.1 - layer * 0.22;
      const height = 0.15 + layer * 0.16;
      const count = petalsPerLayer - layer * 2;
      const angleStep = (Math.PI * 2) / count;
      const layerColor = layer % 2 === 0 ? config.petalColor : config.accentColor;

      for (let i = 0; i < count; i++) {
        const angle = i * angleStep + (layer * 0.3);
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const rotY = -angle - Math.PI / 2;
        const rotX = 0.35 + layer * 0.12;

        const scaleVal: [number, number, number] = config.isGolden
          ? [0.28, 0.42, 0.18]
          : config.hasLotusCenter
          ? [0.35, 0.5, 0.12]
          : [0.26, 0.38, 0.1];

        petals.push({
          pos: [x, height, z],
          rot: [rotX, rotY, 0],
          scale: scaleVal,
          color: layerColor
        });
      }
    }

    return { petalGeometries: petals, centerDetails: config };
  }, [config]);

  // Flame flicker animation using delta time
  useFrame((_, delta) => {
    if (flameRef.current) {
      flameRef.current.scale.y = 1.0 + Math.sin(performance.now() * 0.012) * 0.15;
      flameRef.current.scale.x = 1.0 + Math.cos(performance.now() * 0.015) * 0.1;
    }
    if (interactive && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {/* Base Trunk Float Disc */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[1.15, 1.25, 0.22, 24]} />
        <meshStandardMaterial
          color={config.baseColor}
          roughness={config.isGolden ? 0.3 : 0.8}
          metalness={config.isGolden ? 0.7 : 0.1}
        />
      </mesh>

      {/* Decorative Outer Rim */}
      <mesh position={[0, 0.18, 0]}>
        <torusGeometry args={[1.22, 0.06, 8, 24]} />
        <meshStandardMaterial
          color={config.accentColor}
          roughness={config.isGolden ? 0.2 : 0.6}
          metalness={config.isGolden ? 0.85 : 0.2}
        />
      </mesh>

      {/* Folded Petals Array */}
      {petalGeometries.map((p, idx) => (
        <group key={idx} position={p.pos} rotation={p.rot}>
          <mesh castShadow scale={p.scale}>
            <coneGeometry args={[0.9, 1.6, 4]} />
            <meshStandardMaterial
              color={p.color}
              roughness={config.isGolden ? 0.25 : 0.65}
              metalness={config.isGolden ? 0.8 : 0.1}
            />
          </mesh>
        </group>
      ))}

      {/* Marigold Flower Garland Ring (If configured) */}
      {centerDetails.hasMarigoldRing && (
        <group position={[0, 0.25, 0]}>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(angle) * 0.65, 0.05, Math.sin(angle) * 0.65]}>
                <dodecahedronGeometry args={[0.13, 1]} />
                <meshStandardMaterial color="#F59E0B" roughness={0.7} />
              </mesh>
            );
          })}
        </group>
      )}

      {/* Center Lotus Flower Heart (If configured) */}
      {centerDetails.hasLotusCenter && (
        <group position={[0, 0.32, 0]}>
          <mesh>
            <sphereGeometry args={[0.3, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color={config.isGolden ? "#FEF08A" : "#F472B6"}
              roughness={config.isGolden ? 0.2 : 0.5}
              metalness={config.isGolden ? 0.9 : 0.1}
            />
          </mesh>
        </group>
      )}

      {/* Central Sacred Candle */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.45, 12]} />
        <meshStandardMaterial color={config.candleColor} roughness={0.4} />
      </mesh>

      {/* Candle Flame Mesh with Emissive Glow */}
      <mesh ref={flameRef} position={[0, 0.74, 0]}>
        <coneGeometry args={[0.08, 0.22, 10]} />
        <meshBasicMaterial color="#FDE047" />
      </mesh>

      {/* Flame Inner Core Mesh */}
      <mesh position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshBasicMaterial color="#EA580C" />
      </mesh>

      {/* Only spawn dynamic PointLight if in interactive inspection mode */}
      {interactive && (
        <pointLight
          position={[0, 0.8, 0]}
          color="#F59E0B"
          intensity={1.8}
          distance={5}
          decay={2}
        />
      )}

      {/* 3 Sacred Incense Sticks */}
      {[-0.08, 0.0, 0.08].map((offset, i) => (
        <group key={i} position={[offset, 0.42, 0.18]} rotation={[-0.15, 0, (i - 1) * 0.08]}>
          <mesh>
            <cylinderGeometry args={[0.012, 0.012, 0.52, 6]} />
            <meshStandardMaterial color="#991B1B" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.265, 0]}>
            <sphereGeometry args={[0.018, 6, 6]} />
            <meshBasicMaterial color="#EF4444" />
          </mesh>
        </group>
      ))}

      {/* Subtle Golden Glow Halo on Water (PBR Additive Sprite) */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 16]} />
        <meshBasicMaterial
          color={config.sparkleColor}
          transparent={true}
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

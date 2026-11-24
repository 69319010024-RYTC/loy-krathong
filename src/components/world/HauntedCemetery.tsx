import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const HauntedCemetery: React.FC = () => {
  const ghostRef = useRef<THREE.Group>(null);
  const mistRef = useRef<THREE.Group>(null);

  // Ancient mossy Thai Chedis & Sacred Relic Stupas (เจดีย์อัฐิโบราณ)
  const chedis = [
    { pos: [-42, 0.4, -28], scale: 1.1, rotY: 0.2 },
    { pos: [-48, 0.5, -34], scale: 1.4, rotY: -0.4 },
    { pos: [-52, 0.4, -26], scale: 1.0, rotY: 0.6 },
    { pos: [-45, 0.4, -44], scale: 1.25, rotY: -0.1 },
    { pos: [-50, 0.6, -40], scale: 1.5, rotY: 0.3 },
    { pos: [-54, 0.3, -34], scale: 0.9, rotY: -0.5 },
  ];

  // Ancient sacred Bodhi / Banyan trees with foliage
  const sacredTrees = [
    { pos: [-40, 0, -32], scale: 1.2 },
    { pos: [-49, 0, -29], scale: 1.4 },
    { pos: [-53, 0, -42], scale: 1.15 },
    { pos: [-46, 0, -50], scale: 1.3 },
    { pos: [-38, 0, -45], scale: 1.05 },
  ];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Graceful floating Thai Spirit (นางพราย / แม่นากลอยล่องในสายหมอก)
    if (ghostRef.current) {
      ghostRef.current.position.y = 2.0 + Math.sin(t * 0.8) * 0.3;
      ghostRef.current.position.x = -47 + Math.sin(t * 0.3) * 3.0;
      ghostRef.current.position.z = -38 + Math.cos(t * 0.3) * 3.5;
      ghostRef.current.rotation.y = t * 0.2 + Math.sin(t * 0.5) * 0.1;
    }

    // Drifting ground mist
    if (mistRef.current) {
      mistRef.current.children.forEach((plane, i) => {
        plane.rotation.z = t * 0.03 * (i % 2 === 0 ? 1 : -1);
      });
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Forest Ground (Damp mossy soil, illuminated under moonlight) */}
      <mesh position={[-46, 0.08, -38]} receiveShadow>
        <cylinderGeometry args={[22, 23, 0.35, 24]} />
        <meshStandardMaterial color="#1E2E2A" roughness={0.88} />
      </mesh>

      {/* Ancient Thai Chedis & Stupas (เจดีย์ศิลาแลงโบราณ) */}
      {chedis.map((c, idx) => (
        <group key={`chedi-${idx}`} position={c.pos as [number, number, number]} rotation={[0, c.rotY, 0]} scale={[c.scale, c.scale, c.scale]}>
          {/* Tiered Square Plinth Base */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.5, 1.2]} />
            <meshStandardMaterial color="#334155" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[0.9, 0.4, 0.9]} />
            <meshStandardMaterial color="#1E293B" roughness={0.85} />
          </mesh>
          {/* Bell-shaped Stupa Body (องค์ระฆังคว่ำ) */}
          <mesh position={[0, 1.0, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.65, 0.9, 12]} />
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </mesh>
          {/* Spire Peak (บัลลังก์และปล้องไฉน) */}
          <mesh position={[0, 1.8, 0]} castShadow>
            <coneGeometry args={[0.25, 0.9, 8]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Sacred Ancient Trees with Foliage Canopies */}
      {sacredTrees.map((tree, i) => (
        <group key={`tree-${i}`} position={tree.pos as [number, number, number]} scale={[tree.scale, tree.scale, tree.scale]}>
          {/* Tree Trunk */}
          <mesh castShadow position={[0, 2.8, 0]}>
            <cylinderGeometry args={[0.35, 0.65, 5.6, 8]} />
            <meshStandardMaterial color="#2B1D14" roughness={0.9} />
          </mesh>
          {/* Dense Foliage Clumps */}
          <mesh position={[0, 5.5, 0]}>
            <sphereGeometry args={[2.8, 10, 10]} />
            <meshStandardMaterial color="#0A2A20" roughness={0.85} />
          </mesh>
          <mesh position={[1.2, 4.8, 0.8]}>
            <sphereGeometry args={[1.8, 8, 8]} />
            <meshStandardMaterial color="#0D3629" roughness={0.85} />
          </mesh>
          <mesh position={[-1.2, 4.6, -0.8]}>
            <sphereGeometry args={[1.7, 8, 8]} />
            <meshStandardMaterial color="#0D3629" roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* Ancient Shrine Altar with Glowing Red Incense & Candles */}
      <group position={[-44, 0.4, -36]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.6, 0.8]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>
        {/* Burning Red Candle */}
        <mesh position={[-0.3, 0.45, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.3, 8]} />
          <meshStandardMaterial color="#DC2626" />
        </mesh>
        <mesh position={[-0.3, 0.65, 0]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshBasicMaterial color="#FEF08A" />
        </mesh>
        {/* Candle Glow */}
        <pointLight position={[-0.3, 0.7, 0]} color="#F59E0B" intensity={1.5} distance={4.5} decay={2} />
      </group>

      {/* Graceful Stylized Ethereal Thai Spirit (นางพรายชุดสไบสีขาวบางเบา) */}
      <group ref={ghostRef} position={[-47, 2.0, -38]}>
        {/* Translucent Feminine Head & Flowing Black Hair */}
        <mesh position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#E0F2FE" transparent opacity={0.65} roughness={0.2} />
        </mesh>
        {/* Long Flowing Black Hair */}
        <mesh position={[0, 0.35, -0.1]} rotation={[0.1, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.22, 0.8, 12]} />
          <meshStandardMaterial color="#0A0A0A" transparent opacity={0.75} roughness={0.4} />
        </mesh>
        {/* Graceful Flowing White Sabai Wrap (สไบแพรสีขาวนวล) */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.38, 1.0, 16]} />
          <meshStandardMaterial color="#F0F9FF" transparent opacity={0.55} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <coneGeometry args={[0.42, 1.2, 16]} />
          <meshStandardMaterial color="#BAE6FD" transparent opacity={0.45} roughness={0.3} />
        </mesh>
        {/* Soft Supernatural Pale Blue Aura */}
        <pointLight color="#38BDF8" intensity={2.0} distance={9} decay={2} />
      </group>

      {/* Dancing Green Fireflies Particles */}
      <group position={[-46, 1.5, -38]}>
        {Array.from({ length: 22 }).map((_, i) => {
          const angle = (i / 22) * Math.PI * 2;
          const dist = 3.5 + (i % 4) * 2.8;
          return (
            <mesh key={`ff-${i}`} position={[Math.cos(angle) * dist, 0.6 + (i % 3) * 0.9, Math.sin(angle) * dist]}>
              <sphereGeometry args={[0.05, 6, 6]} />
              <meshBasicMaterial color="#34D399" />
            </mesh>
          );
        })}
      </group>

      {/* Soft Moonlight Illuminating the Cemetery */}
      <pointLight position={[-46, 11.0, -38]} color="#93C5FD" intensity={2.6} distance={30} decay={2} />
    </group>
  );
};

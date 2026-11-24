import React from 'react';

export const RiversideStairs: React.FC = () => {
  // Stepped descent toward the water from ground level (Y: 2.5) down to water level (Y: 0.1)
  const steps = [
    { y: 2.2, z: 0, depth: 4.5, x: -22 },
    { y: 1.7, z: 0, depth: 3.5, x: -19 },
    { y: 1.2, z: 0, depth: 3.2, x: -16.5 },
    { y: 0.7, z: 0, depth: 3.0, x: -14.2 },
    { y: 0.2, z: 0, depth: 3.5, x: -12.0 }, // Bottom riverside boarding deck
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* Stone steps descending from West Bank */}
      {steps.map((st, i) => (
        <group key={i} position={[st.x, st.y, st.z]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[st.depth, 0.45, 42]} />
            <meshStandardMaterial color="#334155" roughness={0.85} metalness={0.15} />
          </mesh>

          {/* Golden edge strip on each step */}
          <mesh position={[st.depth / 2 - 0.05, 0.23, 0]}>
            <boxGeometry args={[0.1, 0.04, 42]} />
            <meshStandardMaterial color="#B45309" roughness={0.4} metalness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Decorative Stone Railings & Lantern Pillars along the stairs */}
      {[-18, -6, 6, 18].map((zPos, idx) => (
        <group key={idx} position={[-10.5, 0.8, zPos]}>
          {/* Stone Balustrade Pillar */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.7, 1.2, 0.7]} />
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.75, 0]}>
            <coneGeometry args={[0.45, 0.4, 4]} />
            <meshStandardMaterial color="#F59E0B" roughness={0.4} metalness={0.5} />
          </mesh>

          {/* Traditional Thai Warm Lantern Glass Box (Emissive) */}
          <mesh position={[0, 1.15, 0]}>
            <boxGeometry args={[0.5, 0.6, 0.5]} />
            <meshStandardMaterial
              color="#FFFBEB"
              emissive="#F59E0B"
              emissiveIntensity={2.5}
              roughness={0.2}
            />
          </mesh>

          {/* Flower Offering Garland at base of pillar */}
          <mesh position={[0, -0.4, 0]}>
            <torusGeometry args={[0.48, 0.08, 8, 16]} />
            <meshStandardMaterial color="#F43F5E" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Riverside Krathong Launching Pier / Altar */}
      <group position={[-10.2, 0.25, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[3.2, 0.4, 14]} />
          <meshStandardMaterial color="#1E293B" roughness={0.7} metalness={0.2} />
        </mesh>

        {/* Sacred Altar Shrine for Prayers */}
        <group position={[-1.0, 0.6, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.0, 0.8, 2.4]} />
            <meshStandardMaterial color="#78350F" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[1.2, 0.08, 2.6]} />
            <meshStandardMaterial color="#F59E0B" roughness={0.3} metalness={0.8} />
          </mesh>

          {/* Altar Golden Buddha Statue Silhouette */}
          <mesh position={[0, 0.9, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.35, 0.8, 12]} />
            <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0, 1.45, 0]}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0, 1.75, 0]}>
            <coneGeometry args={[0.08, 0.3, 8]} />
            <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.9} />
          </mesh>

          {/* Altar Warm Candlelight Aura */}
          <pointLight position={[0, 1.0, 0.5]} color="#F59E0B" intensity={2.5} distance={7} decay={2} />
        </group>
      </group>
      {/* Stairs Unified Ambient Light */}
      <pointLight position={[-14, 3.5, 0]} color="#FBBF24" intensity={2.0} distance={22} decay={2} />
    </group>
  );
};


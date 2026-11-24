import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const FestivalMarket: React.FC = () => {
  const steamRef = useRef<THREE.Group>(null);

  // Animate rising food steam particles
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (steamRef.current) {
      steamRef.current.children.forEach((p, idx) => {
        const offset = (t * 1.6 + idx * 0.45) % 2.8;
        p.position.y = 1.1 + offset;
        p.position.x = Math.sin(t * 2.2 + idx) * 0.14;
        const scale = 0.12 + offset * 0.18;
        p.scale.set(scale, scale, scale);
      });
    }
  });

  const stalls = [
    {
      x: 32, z: 30, rotY: -0.15,
      nameTh: "หมูปิ้งสะเต๊ะเตาถ่าน",
      nameEn: "Charcoal Grilled Satay",
      awningColor: "#DC2626", // Crimson
      stripeColor: "#FEF08A", // Gold Yellow
      hasGrill: true,
      hasBenches: true
    },
    {
      x: 38, z: 42, rotY: 0.12,
      nameTh: "ผัดไทยกุ้งสดโบราณ",
      nameEn: "Traditional Pad Thai",
      awningColor: "#D97706", // Amber
      stripeColor: "#FFFBEB",
      hasGrill: false,
      hasBenches: true
    },
    {
      x: 31, z: 54, rotY: -0.2,
      nameTh: "ข้าวเหนียวมะม่วง & ชาไทย",
      nameEn: "Mango Sticky Rice & Thai Tea",
      awningColor: "#059669", // Emerald
      stripeColor: "#FEF08A",
      hasGrill: false,
      hasBenches: false
    },
    {
      x: 37, z: 66, rotY: 0.22,
      nameTh: "กระทงวิจิตร & ประทีปแก้ว",
      nameEn: "Artisanal Krathongs & Souvenirs",
      awningColor: "#7C3AED", // Royal Violet
      stripeColor: "#F472B6", // Lotus Pink
      hasGrill: false,
      hasBenches: false
    }
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* Cobblestone Market Street Pavement */}
      <mesh position={[34, 0.12, 48]} receiveShadow>
        <boxGeometry args={[18, 0.22, 54]} />
        <meshStandardMaterial color="#222C3D" roughness={0.75} metalness={0.15} />
      </mesh>

      {/* Street Stalls Array */}
      {stalls.map((stall, index) => (
        <group key={index} position={[stall.x, 0, stall.z]} rotation={[0, stall.rotY, 0]}>
          {/* Wooden Counter Table with Teak Texture */}
          <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.8, 1.3, 1.9]} />
            <meshStandardMaterial color="#5A2E0F" roughness={0.7} />
          </mesh>

          {/* Wooden Shelf Display Backboard */}
          <mesh position={[0, 1.5, -0.85]} castShadow>
            <boxGeometry args={[3.6, 0.9, 0.2]} />
            <meshStandardMaterial color="#3E1E09" roughness={0.75} />
          </mesh>

          {/* Thai Name Signboard Above Counter */}
          <group position={[0, 2.5, 0.7]}>
            <mesh castShadow>
              <boxGeometry args={[3.2, 0.5, 0.1]} />
              <meshStandardMaterial color="#1E293B" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0, 0.06]}>
              <boxGeometry args={[3.0, 0.38, 0.02]} />
              <meshStandardMaterial color="#FEF08A" roughness={0.3} metalness={0.8} />
            </mesh>
          </group>

          {/* Teak Awning Support Posts */}
          {[-1.7, 1.7].map((px, i) => (
            <mesh key={i} position={[px, 1.6, 0.85]} castShadow>
              <cylinderGeometry args={[0.045, 0.045, 3.0, 8]} />
              <meshStandardMaterial color="#4A260C" roughness={0.6} />
            </mesh>
          ))}
          {[-1.7, 1.7].map((px, i) => (
            <mesh key={i + 2} position={[px, 1.9, -0.85]} castShadow>
              <cylinderGeometry args={[0.045, 0.045, 3.4, 8]} />
              <meshStandardMaterial color="#4A260C" roughness={0.6} />
            </mesh>
          ))}

          {/* Scalloped Fabric Sloped Awning Roof */}
          <group position={[0, 3.05, 0]} rotation={[0.2, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[4.0, 0.08, 2.3]} />
              <meshStandardMaterial color={stall.awningColor} roughness={0.65} />
            </mesh>
            {/* Awning Stripes */}
            {[-1.3, -0.45, 0.45, 1.3].map((sx, si) => (
              <mesh key={si} position={[sx, 0.05, 0]}>
                <boxGeometry args={[0.38, 0.02, 2.32]} />
                <meshStandardMaterial color={stall.stripeColor} roughness={0.65} />
              </mesh>
            ))}
          </group>

          {/* Warm Edison Light String under Awning (Emissive Mesh - Zero redundant point lights!) */}
          <group position={[0, 2.6, 0.45]}>
            {[-1.2, 0.0, 1.2].map((bx, bi) => (
              <mesh key={bi} position={[bx, 0, 0]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshStandardMaterial color="#FFFBEB" emissive="#F59E0B" emissiveIntensity={3.2} />
              </mesh>
            ))}
          </group>

          {/* Food Displays / Satay Charcoal Grill with Steam */}
          {stall.hasGrill && (
            <group position={[0.7, 1.32, 0.15]}>
              <mesh castShadow>
                <boxGeometry args={[1.3, 0.28, 0.75]} />
                <meshStandardMaterial color="#1E293B" metalness={0.8} />
              </mesh>
              {/* Glowing Charcoal Fire */}
              <mesh position={[0, 0.15, 0]}>
                <boxGeometry args={[1.2, 0.04, 0.65]} />
                <meshBasicMaterial color="#EF4444" />
              </mesh>
              {/* Skewers on Grill */}
              {[-0.3, -0.1, 0.1, 0.3].map((sx, si) => (
                <mesh key={si} position={[sx, 0.2, 0]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.5, 6]} />
                  <meshStandardMaterial color="#D97706" />
                </mesh>
              ))}
              {/* Rising Soft Vapor / Steam */}
              <group ref={steamRef} position={[0, 0.25, 0]}>
                {Array.from({ length: 6 }).map((_, pi) => (
                  <mesh key={pi} position={[0, pi * 0.45, 0]}>
                    <sphereGeometry args={[0.14, 8, 8]} />
                    <meshBasicMaterial color="#E2E8F0" transparent opacity={0.25} />
                  </mesh>
                ))}
              </group>
            </group>
          )}

          {/* Wooden Dining Benches for patrons */}
          {stall.hasBenches && (
            <group position={[0, 0.35, 2.4]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[3.0, 0.12, 0.55]} />
                <meshStandardMaterial color="#4A260C" roughness={0.8} />
              </mesh>
              {[-1.2, 1.2].map((bx, bi) => (
                <mesh key={bi} position={[bx, -0.18, 0]}>
                  <boxGeometry args={[0.12, 0.36, 0.45]} />
                  <meshStandardMaterial color="#301605" roughness={0.9} />
                </mesh>
              ))}
            </group>
          )}
        </group>
      ))}

      {/* Single Unified Market Street Light */}
      <pointLight position={[34, 4.5, 48]} color="#FBBF24" intensity={3.2} distance={28} decay={2} />
    </group>
  );
};

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Luminous Celestial Night Sky Shader (Smooth atmospheric gradient from zenith to horizon)
const BrightNightSkyShader = {
  vertexShader: `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vWorldPosition;
    void main() {
      vec3 dir = normalize(vWorldPosition);
      float h = max(0.0, dir.y);

      // Luminous Night Sky Gradient:
      // Horizon: Luminous moonlit royal indigo-blue
      // Mid-sky: Deep celestial sapphire
      // Zenith: Rich luminous midnight navy (never pitch black!)
      vec3 horizonColor = vec3(0.14, 0.28, 0.50); // Bright moonlit celestial glow
      vec3 midSkyColor  = vec3(0.08, 0.18, 0.36); // Luminous sapphire
      vec3 zenithColor  = vec3(0.04, 0.09, 0.22); // Deep navy

      vec3 sky = mix(horizonColor, midSkyColor, smoothstep(0.0, 0.35, h));
      sky = mix(sky, zenithColor, smoothstep(0.35, 1.0, h));

      gl_FragColor = vec4(sky, 1.0);
    }
  `
};

export const WorldEnvironment: React.FC = () => {
  const lanternsRef = useRef<THREE.Group>(null);
  const skyMatRef = useRef<THREE.ShaderMaterial>(null);

  // Animate floating sky lanterns (Khom Loi) slowly ascending
  useFrame((_, delta) => {
    if (lanternsRef.current) {
      lanternsRef.current.children.forEach((lantern, idx) => {
        const speed = 0.8 + (idx % 5) * 0.2;
        lantern.position.y += delta * speed * 3.5;
        if (lantern.position.y > 85) {
          lantern.position.y = 10;
        }
        lantern.position.x += Math.sin(lantern.position.y * 0.1 + idx) * 0.015;
      });
    }
  });

  return (
    <group>
      {/* 1. Luminous Night Sky Dome (Atmospheric Blue-Sky Gradient) */}
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[220, 32, 24]} />
        <shaderMaterial
          ref={skyMatRef}
          vertexShader={BrightNightSkyShader.vertexShader}
          fragmentShader={BrightNightSkyShader.fragmentShader}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Soft Luminous Atmospheric Fog (Prevents dark void, blends softly with sky) */}
      <fog attach="fog" args={['#182F52', 65, 230]} />

      {/* 3. Primary Hemisphere Fill Light: Luminous Celestial Blue + Warm Ambient Bounce */}
      <hemisphereLight
        color="#88C8FF"       // Luminous celestial sky fill
        groundColor="#3A4D66" // Soft warm slate bounce
        intensity={1.45}      // Moderately brighter night illumination
      />

      {/* 4. Moonlight Directional Key Light with Crisp Soft Shadows */}
      <directionalLight
        position={[-35, 75, -35]}
        intensity={2.2}
        color="#E0F2FE"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0004}
        shadow-camera-near={15}
        shadow-camera-far={190}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
      />

      {/* 5. Radiant Full Moon with Soft Celestial Glow Corona */}
      <group position={[-60, 90, -95]}>
        {/* Full Moon Sphere */}
        <mesh>
          <sphereGeometry args={[8.5, 24, 24]} />
          <meshBasicMaterial color="#FFFDE7" />
        </mesh>
        {/* Soft Moonlight Corona */}
        <mesh position={[0, 0, 1]}>
          <ringGeometry args={[8.8, 22, 28]} />
          <meshBasicMaterial color="#7DD3FC" transparent opacity={0.30} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, 1.2]}>
          <ringGeometry args={[22, 38, 28]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.12} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 6. Distant Twinkling Stars */}
      <group>
        {Array.from({ length: 60 }).map((_, i) => {
          const theta = (i * 0.38) % (Math.PI * 2);
          const phi = 0.2 + ((i * 0.17) % 0.9);
          const rad = 200;
          const x = rad * Math.sin(phi) * Math.cos(theta);
          const y = rad * Math.cos(phi);
          const z = rad * Math.sin(phi) * Math.sin(theta);
          return (
            <mesh key={`star-${i}`} position={[x, y, z]}>
              <sphereGeometry args={[0.45, 6, 6]} />
              <meshBasicMaterial color="#E0F2FE" />
            </mesh>
          );
        })}
      </group>

      {/* 7. Ascending Floating Sky Lanterns (Emissive Warm Amber PBR) */}
      <group ref={lanternsRef}>
        {Array.from({ length: 32 }).map((_, i) => {
          const startX = -50 + (i * 3.4) % 105;
          const startZ = -75 + (i * 4.9) % 145;
          const startY = 10 + (i * 2.4) % 70;
          return (
            <group key={i} position={[startX, startY, startZ]}>
              <mesh>
                <cylinderGeometry args={[0.40, 0.30, 0.80, 8]} />
                <meshStandardMaterial
                  color="#FEF08A"
                  emissive="#F59E0B"
                  emissiveIntensity={3.4}
                  roughness={0.2}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* 8. Stylized Ground Pavements (Elevated top at Y = +0.20) */}
      {/* West Bank (Temple, Riverside, Cemetery) */}
      <group position={[-43, 0.0, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[46, 0.4, 250]} />
          <meshStandardMaterial color="#2E3D52" roughness={0.65} metalness={0.10} />
        </mesh>
        {/* Lawn Verge */}
        <mesh position={[-15, 0.22, 0]} receiveShadow>
          <boxGeometry args={[16, 0.1, 250]} />
          <meshStandardMaterial color="#1C4638" roughness={0.78} metalness={0.05} />
        </mesh>
      </group>

      {/* East Bank (Pageant Stage, Audience, Market) */}
      <group position={[43, 0.0, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[46, 0.4, 250]} />
          <meshStandardMaterial color="#2A384A" roughness={0.65} metalness={0.10} />
        </mesh>
        {/* Lawn Verge */}
        <mesh position={[15, 0.22, 0]} receiveShadow>
          <boxGeometry args={[16, 0.1, 250]} />
          <meshStandardMaterial color="#1C4638" roughness={0.78} metalness={0.05} />
        </mesh>
      </group>

      {/* 9. Unified Promenade Lamp Posts (Emissive Lanterns) */}
      {[-70, -40, -10, 20, 50, 80].map((zPos, idx) => (
        <group key={idx}>
          {/* West Bank Lamp Post */}
          <group position={[-20, 0, zPos]}>
            <mesh position={[0, 2.5, 0]}>
              <cylinderGeometry args={[0.08, 0.14, 5.0, 8]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
            <mesh position={[0, 5.2, 0]}>
              <octahedronGeometry args={[0.45]} />
              <meshStandardMaterial color="#FFFBEB" emissive="#F59E0B" emissiveIntensity={3.2} />
            </mesh>
          </group>

          {/* East Bank Lamp Post */}
          <group position={[32, 0, zPos]}>
            <mesh position={[0, 2.5, 0]}>
              <cylinderGeometry args={[0.08, 0.14, 5.0, 8]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
            <mesh position={[0, 5.2, 0]}>
              <octahedronGeometry args={[0.45]} />
              <meshStandardMaterial color="#FFFBEB" emissive="#F59E0B" emissiveIntensity={3.2} />
            </mesh>
          </group>
        </group>
      ))}

      {/* Consolidated Promenade Fill Lights */}
      <pointLight position={[32, 6, 20]} color="#FBBF24" intensity={2.8} distance={42} decay={2} />
      <pointLight position={[-20, 6, -10]} color="#FBBF24" intensity={2.8} distance={42} decay={2} />

      {/* Perimeter Tropical Foliage */}
      {[-72, 72].map((borderX, bi) => (
        <group key={bi}>
          {[-50, -20, 10, 40, 70, 100].map((treeZ, ti) => (
            <group key={ti} position={[borderX, 0, treeZ]}>
              <mesh position={[0, 5, 0]}>
                <cylinderGeometry args={[0.35, 0.65, 10, 8]} />
                <meshStandardMaterial color="#362920" roughness={0.85} />
              </mesh>
              <mesh position={[0, 10.2, 0]}>
                <sphereGeometry args={[3.8, 10, 10]} />
                <meshStandardMaterial color="#195440" roughness={0.75} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
};

import React from 'react';

export const ThaiTemple: React.FC = () => {
  return (
    <group position={[-38, 0, -8]}>
      {/* 1. Multi-tier Grand Stone Foundation (ฐานปัทม์บัวคว่ำบัวหงาย) */}
      <mesh position={[0, 0.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[18, 1.0, 26]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>
      {/* Upper Red/Gold Terrace Floor */}
      <mesh position={[0, 1.05, 0]} receiveShadow castShadow>
        <boxGeometry args={[16.5, 0.2, 24.5]} />
        <meshStandardMaterial color="#991B1B" roughness={0.5} />
      </mesh>
      {/* Gold Trim around Terrace */}
      <mesh position={[0, 1.16, 0]}>
        <boxGeometry args={[16.6, 0.04, 24.6]} />
        <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* 2. Main Ubosot Sanctuary Hall (พระอุโบสถทรงไทยประณีต) */}
      {/* Cream-White Plastered Walls with Warm Ambient Material */}
      <mesh position={[0, 4.0, 0]} receiveShadow castShadow>
        <boxGeometry args={[11.0, 5.8, 18.0]} />
        <meshStandardMaterial color="#FFFBEB" roughness={0.75} />
      </mesh>

      {/* Front & Back Grand Porch Columns (เสาพาไลเหลี่ยมย่อมุมไม้สิบสองปิดทอง) */}
      {/* Front Colonnade (Z: 9.5m) */}
      {[-4.2, -1.4, 1.4, 4.2].map((x, i) => (
        <group key={`front-col-${i}`} position={[x, 3.8, 9.6]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.32, 0.36, 5.6, 12]} />
            <meshStandardMaterial color="#FFFBEB" roughness={0.6} />
          </mesh>
          {/* Lotus Capital (บัวหัวเสาปิดทองคำเปลว) */}
          <mesh position={[0, 2.6, 0]}>
            <cylinderGeometry args={[0.55, 0.32, 0.45, 12]} />
            <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.92} />
          </mesh>
          <mesh position={[0, -2.6, 0]}>
            <cylinderGeometry args={[0.42, 0.46, 0.3, 12]} />
            <meshStandardMaterial color="#B45309" roughness={0.3} metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Side Windows with Golden Crown Pediments (ซุ้มหน้าต่างทรงมงกุฎ) */}
      {[-6.0, -2.0, 2.0, 6.0].map((z, i) => (
        <group key={`win-left-${i}`}>
          {/* Left Wall Windows (X: -5.55) */}
          <group position={[-5.55, 4.0, z]}>
            <mesh>
              <boxGeometry args={[0.1, 2.2, 1.2]} />
              <meshStandardMaterial color="#78350F" roughness={0.5} />
            </mesh>
            {/* Golden Window Leaf */}
            <mesh position={[-0.06, 0, 0]}>
              <boxGeometry args={[0.04, 2.0, 1.0]} />
              <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.9} />
            </mesh>
          </group>
          {/* Right Wall Windows (X: 5.55) */}
          <group position={[5.55, 4.0, z]}>
            <mesh>
              <boxGeometry args={[0.1, 2.2, 1.2]} />
              <meshStandardMaterial color="#78350F" roughness={0.5} />
            </mesh>
            <mesh position={[0.06, 0, 0]}>
              <boxGeometry args={[0.04, 2.0, 1.0]} />
              <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.9} />
            </mesh>
          </group>
        </group>
      ))}

      {/* Front Entrance Doors with Royal Lacquer & Gold Leaf (ประตูลายรดน้ำ) */}
      <group position={[0, 3.2, 9.02]}>
        <mesh>
          <boxGeometry args={[2.6, 4.2, 0.15]} />
          <meshStandardMaterial color="#451A03" roughness={0.5} />
        </mesh>
        <mesh position={[-0.65, 0, 0.08]}>
          <boxGeometry args={[1.2, 3.9, 0.05]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.95} />
        </mesh>
        <mesh position={[0.65, 0, 0.08]}>
          <boxGeometry args={[1.2, 3.9, 0.05]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.95} />
        </mesh>
      </group>

      {/* 3. Authentic Thai Steep Gabled Roofs (หลังคาทรงจั่วลดหลั่นแบบไทยแท้) */}
      {/* Tier 1: Main Broad Eaves Roof (หลังคาประธานลาดกว้าง) */}
      <group position={[0, 7.5, 0]}>
        {/* Left Slope */}
        <mesh position={[-3.8, 0, 0]} rotation={[0, 0, -0.68]} castShadow>
          <boxGeometry args={[8.8, 0.25, 22.0]} />
          <meshStandardMaterial color="#991B1B" roughness={0.45} />
        </mesh>
        {/* Right Slope */}
        <mesh position={[3.8, 0, 0]} rotation={[0, 0, 0.68]} castShadow>
          <boxGeometry args={[8.8, 0.25, 22.0]} />
          <meshStandardMaterial color="#991B1B" roughness={0.45} />
        </mesh>
        {/* Gold Eaves Ridge */}
        <mesh position={[0, 2.8, 0]}>
          <boxGeometry args={[0.5, 0.5, 22.2]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.95} />
        </mesh>
      </group>

      {/* Tier 2: Upper Overlapping Roof Tier (หลังคาตับที่ 2 ทรงจั่วสูงซ้อนทับ) */}
      <group position={[0, 9.8, 0]}>
        {/* Left Slope */}
        <mesh position={[-2.8, 0, 0]} rotation={[0, 0, -0.72]} castShadow>
          <boxGeometry args={[6.8, 0.25, 17.0]} />
          <meshStandardMaterial color="#7F1D1D" roughness={0.45} />
        </mesh>
        {/* Right Slope */}
        <mesh position={[2.8, 0, 0]} rotation={[0, 0, 0.72]} castShadow>
          <boxGeometry args={[6.8, 0.25, 17.0]} />
          <meshStandardMaterial color="#7F1D1D" roughness={0.45} />
        </mesh>
        {/* Gold Ridge */}
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[0.45, 0.45, 17.2]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.95} />
        </mesh>
      </group>

      {/* Tier 3: Top Ridge Spire Peak with Central Mondop Spire */}
      <group position={[0, 12.2, 0]}>
        <mesh position={[0, 1.8, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.4, 3.8, 12]} />
          <meshStandardMaterial color="#FBBF24" roughness={0.15} metalness={0.95} />
        </mesh>
        <mesh position={[0, 3.8, 0]}>
          <sphereGeometry args={[0.26, 16, 16]} />
          <meshStandardMaterial color="#FBBF24" roughness={0.15} metalness={0.95} />
        </mesh>
      </group>

      {/* 4. Thai Triangular Front & Back Gables with Carved Gold Foliage (หน้าบันสลักลายกนก) */}
      {/* Front Gable (Z: 10.9) */}
      <group position={[0, 8.2, 10.9]}>
        {/* Crimson Wooden Tympanum */}
        <mesh>
          <coneGeometry args={[5.2, 4.0, 3]} />
          <meshStandardMaterial color="#881337" roughness={0.5} />
        </mesh>
        {/* Golden Deity Medallion (เทพพนมปิดทอง) */}
        <mesh position={[0, -0.4, 0.15]}>
          <circleGeometry args={[1.1, 16]} />
          <meshStandardMaterial color="#FBBF24" roughness={0.15} metalness={0.95} />
        </mesh>
        {/* Chofa Spire on Gable Apex (ช่อฟ้า ปลายพุ่งชูขึ้นสู่ฟ้า) */}
        <group position={[0, 2.4, 0.2]} rotation={[-0.35, 0, 0]}>
          <mesh>
            <coneGeometry args={[0.18, 1.8, 8]} />
            <meshStandardMaterial color="#FBBF24" roughness={0.15} metalness={0.95} />
          </mesh>
        </group>
        {/* Hang Hong Tail Finials on Gable Corners (หางหงส์) */}
        <group position={[-4.5, -1.8, 0.1]} rotation={[0, 0, -0.6]}>
          <mesh>
            <coneGeometry args={[0.12, 1.2, 6]} />
            <meshStandardMaterial color="#FBBF24" roughness={0.15} metalness={0.95} />
          </mesh>
        </group>
        <group position={[4.5, -1.8, 0.1]} rotation={[0, 0, 0.6]}>
          <mesh>
            <coneGeometry args={[0.12, 1.2, 6]} />
            <meshStandardMaterial color="#FBBF24" roughness={0.15} metalness={0.95} />
          </mesh>
        </group>
      </group>

      {/* Back Gable (Z: -10.9) */}
      <group position={[0, 8.2, -10.9]} rotation={[0, Math.PI, 0]}>
        <mesh>
          <coneGeometry args={[5.2, 4.0, 3]} />
          <meshStandardMaterial color="#881337" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.4, 0.15]}>
          <circleGeometry args={[1.1, 16]} />
          <meshStandardMaterial color="#FBBF24" roughness={0.15} metalness={0.95} />
        </mesh>
        <group position={[0, 2.4, 0.2]} rotation={[-0.35, 0, 0]}>
          <mesh>
            <coneGeometry args={[0.18, 1.8, 8]} />
            <meshStandardMaterial color="#FBBF24" roughness={0.15} metalness={0.95} />
          </mesh>
        </group>
      </group>

      {/* 5. Grand Front Marble Steps with Golden Naga Railings (บันไดพญานาค) */}
      <group position={[0, 0.5, 13.8]}>
        {/* Marble Steps */}
        <mesh receiveShadow>
          <boxGeometry args={[6.5, 0.9, 3.6]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.6} />
        </mesh>
        {/* Left Naga Railing */}
        <mesh position={[-3.4, 0.7, 0]} rotation={[0.22, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.24, 3.8, 8]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[-3.4, 0.9, 1.8]}>
          <coneGeometry args={[0.32, 0.8, 6]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.15} metalness={0.92} />
        </mesh>
        {/* Right Naga Railing */}
        <mesh position={[3.4, 0.7, 0]} rotation={[0.22, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.24, 3.8, 8]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[3.4, 0.9, 1.8]}>
          <coneGeometry args={[0.32, 0.8, 6]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.15} metalness={0.92} />
        </mesh>
      </group>

      {/* 6. Sacred Glowing Golden Buddha Inside Sanctuary (พระพุทธชินราชจำลอง) */}
      <group position={[0, 3.2, 0]}>
        {/* Golden Lotus Throne */}
        <mesh castShadow>
          <cylinderGeometry args={[1.5, 2.0, 0.8, 16]} />
          <meshStandardMaterial color="#B45309" roughness={0.25} metalness={0.85} />
        </mesh>
        {/* Golden Buddha Meditating Figure */}
        <mesh position={[0, 1.3, 0]} castShadow>
          <coneGeometry args={[1.0, 2.0, 14]} />
          <meshStandardMaterial color="#FBBF24" roughness={0.15} metalness={0.95} />
        </mesh>
        <mesh position={[0, 2.45, 0]} castShadow>
          <sphereGeometry args={[0.45, 16, 16]} />
          <meshStandardMaterial color="#FBBF24" roughness={0.15} metalness={0.95} />
        </mesh>
        <mesh position={[0, 3.0, 0]}>
          <coneGeometry args={[0.15, 0.6, 8]} />
          <meshStandardMaterial color="#FBBF24" roughness={0.15} metalness={0.95} />
        </mesh>
        {/* Warm Golden Halo Aura inside Temple */}
        <pointLight position={[0, 2.4, 1.0]} color="#FBBF24" intensity={4.8} distance={18} decay={2} />
      </group>

      {/* 7. Warm Authentic Temple Courtyard Illumination */}
      <pointLight position={[0, 5.5, 11.5]} color="#FBBF24" intensity={4.5} distance={22} decay={2} />

      {/* 8. Giant Sacred Buddha Statue in the Outer Temple Courtyard */}
      <group position={[-13.5, 0.2, 13.5]}>
        {/* Raised lotus platform */}
        {[0, 0.45, 0.9].map((height, i) => (
          <mesh key={`buddha-base-${i}`} position={[0, height, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[3.8 - i * 0.55, 4.2 - i * 0.55, 0.5, 24]} />
            <meshStandardMaterial color={i === 1 ? '#FBBF24' : '#E7E5E4'} roughness={0.45} metalness={i === 1 ? 0.8 : 0.1} />
          </mesh>
        ))}

        {/* Golden seated Buddha */}
        <mesh position={[0, 4.1, 0]} castShadow>
          <sphereGeometry args={[1.45, 24, 24]} />
          <meshStandardMaterial color="#FBBF24" roughness={0.18} metalness={0.78} />
        </mesh>
        <mesh position={[0, 2.25, 0]} scale={[1.2, 1.75, 0.95]} castShadow>
          <sphereGeometry args={[1.55, 24, 24]} />
          <meshStandardMaterial color="#FBBF24" roughness={0.18} metalness={0.78} />
        </mesh>
        {/* Meditation hands / crossed legs */}
        <mesh position={[0, 1.55, 0.95]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[1.05, 0.22, 12, 24, Math.PI]} />
          <meshStandardMaterial color="#FBBF24" roughness={0.18} metalness={0.78} />
        </mesh>
        {/* Hair curls */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <mesh key={`curl-${i}`} position={[Math.cos(angle) * 1.15, 5.15, Math.sin(angle) * 1.15]}>
              <sphereGeometry args={[0.16, 10, 10]} />
              <meshStandardMaterial color="#B45309" roughness={0.25} metalness={0.7} />
            </mesh>
          );
        })}
        <mesh position={[0, 5.45, 0]} castShadow>
          <coneGeometry args={[0.34, 1.1, 12]} />
          <meshStandardMaterial color="#FBBF24" roughness={0.15} metalness={0.82} />
        </mesh>
        {/* Large glowing halo */}
        <mesh position={[0, 4.25, -0.12]}>
          <torusGeometry args={[2.05, 0.11, 12, 48]} />
          <meshStandardMaterial color="#FDE68A" emissive="#F59E0B" emissiveIntensity={3.2} metalness={0.8} />
        </mesh>
        <pointLight position={[0, 4.2, 1.5]} color="#FBBF24" intensity={5} distance={16} decay={2} />
      </group>

      {/* 9. Ornamental Thai Pavillion / Prayer Pavilion */}
      <group position={[13.5, 0.2, 14.5]}>
        {/* Pavillion platform */}
        <mesh position={[0, 0.45, 0]} receiveShadow castShadow>
          <boxGeometry args={[8.5, 0.9, 7.5]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.6} />
        </mesh>

        {/* Four decorated columns */}
        {[-3.2, 3.2].flatMap((x) => [-2.3, 2.3].map((z) => (
          <group key={`pavilion-${x}-${z}`} position={[x, 3.1, z]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.22, 0.28, 5.2, 12]} />
              <meshStandardMaterial color="#FFF7ED" roughness={0.5} />
            </mesh>
            <mesh position={[0, 2.55, 0]}>
              <cylinderGeometry args={[0.5, 0.22, 0.45, 12]} />
              <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.85} />
            </mesh>
          </group>
        )))}

        {/* Tiered Thai pavilion roof */}
        <mesh position={[0, 6.0, 0]} castShadow>
          <coneGeometry args={[6.2, 2.8, 4]} />
          <meshStandardMaterial color="#991B1B" roughness={0.45} metalness={0.25} />
        </mesh>
        <mesh position={[0, 7.55, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[3.8, 2.2, 4]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.25} metalness={0.85} />
        </mesh>
        <mesh position={[0, 9.1, 0]}>
          <coneGeometry args={[0.25, 2.0, 8]} />
          <meshStandardMaterial color="#FBBF24" emissive="#F59E0B" emissiveIntensity={1.5} metalness={0.9} />
        </mesh>

        {/* Small Buddha shrine inside */}
        <mesh position={[0, 1.25, 0]} castShadow>
          <cylinderGeometry args={[1.2, 1.5, 0.55, 16]} />
          <meshStandardMaterial color="#B45309" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 2.25, 0]} scale={[0.75, 1.15, 0.65]} castShadow>
          <sphereGeometry args={[0.9, 18, 18]} />
          <meshStandardMaterial color="#FBBF24" roughness={0.15} metalness={0.82} />
        </mesh>
        <mesh position={[0, 3.25, 0]}>
          <sphereGeometry args={[0.38, 16, 16]} />
          <meshStandardMaterial color="#FBBF24" roughness={0.15} metalness={0.82} />
        </mesh>
        <pointLight position={[0, 3.2, 0]} color="#FDBA74" intensity={3.5} distance={12} decay={2} />
      </group>
    </group>
  );
};

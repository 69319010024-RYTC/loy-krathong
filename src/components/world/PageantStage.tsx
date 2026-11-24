import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Transparent Glassy LED Screen Runway Floor with Vibrant Ocean Blue Water Waves (จอ LED ใส คลื่นน้ำสีฟ้า)
const TransparentWaterLedFloorShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    void main() {
      vUv = uv;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    float waterWave(vec2 p, float time) {
      vec2 d = p * 4.0;
      float w1 = sin(d.x * 3.0 + d.y * 2.0 + time * 2.5);
      float w2 = cos(d.x * 2.5 - d.y * 3.5 - time * 2.0);
      float w3 = sin(length(p - vec2(0.5, 0.5)) * 12.0 - time * 3.0);
      return (w1 + w2 + w3) / 3.0;
    }

    void main() {
      vec2 uv = vUv;

      // Fluid Blue Water Waves traveling along the runway towards the canal
      vec2 waveCoord = uv * vec2(3.5, 12.0) + vec2(0.0, uTime * 0.40);
      float wavePattern1 = waterWave(waveCoord * 0.5, uTime);
      float wavePattern2 = waterWave(waveCoord * 0.8 + vec2(uTime * 0.25, 0.0), uTime * 1.3);
      float waveCombined = wavePattern1 * 0.5 + wavePattern2 * 0.5;

      // Deep Azure Blue to Electric Cyan Gradient
      vec3 deepOcean = vec3(0.01, 0.12, 0.32);
      vec3 electricCyan = vec3(0.0, 0.85, 1.0);
      vec3 azureBlue = vec3(0.05, 0.45, 0.90);
      vec3 foamWhite = vec3(0.90, 0.98, 1.0);

      vec3 waterColor = mix(deepOcean, azureBlue, smoothstep(-0.6, 0.35, waveCombined));
      waterColor = mix(waterColor, electricCyan, smoothstep(0.15, 0.70, waveCombined));

      // Wave foam crests moving along runway
      float foam = smoothstep(0.65, 0.85, waveCombined);
      waterColor = mix(waterColor, foamWhite, foam * 0.75);

      // Glass sheen & mirror-like reflection
      float glassReflection = pow(1.0 - abs(uv.y - 0.5) * 1.5, 3.0);
      waterColor += electricCyan * glassReflection * 0.15;

      // Glowing Neon Runway Edge Runner (Neon Magenta & Cyan)
      float edgeLeft = smoothstep(0.04, 0.0, uv.x);
      float edgeRight = smoothstep(0.96, 1.0, uv.x);
      vec3 neonEdge = vec3(1.0, 0.08, 0.65); // Neon Magenta border
      waterColor += neonEdge * (edgeLeft + edgeRight) * 2.8;

      // Transparent Look (Alpha ~0.88)
      gl_FragColor = vec4(waterColor, 0.90);
    }
  `
};

// Grand Center Neon Billboard Shader ("Too Grand To Be Ordinary" & Pulsing Stage Visuals)
const GrandNeonBackdropShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      
      // Dynamic Royal Purple to Magenta Gradient
      vec3 deepPurple = vec3(0.12, 0.02, 0.28);
      vec3 electricMagenta = vec3(0.95, 0.05, 0.60);
      vec3 neonViolet = vec3(0.55, 0.08, 0.98);
      vec3 cyanGlow = vec3(0.0, 0.85, 1.0);

      // Vertical rhythmic light beams on LED screen
      float bars = sin(uv.x * 24.0 + uTime * 2.0) * 0.5 + 0.5;
      float sweep = sin(uv.y * 8.0 - uTime * 1.5) * 0.5 + 0.5;

      vec3 col = mix(deepPurple, neonViolet, uv.y);
      col = mix(col, electricMagenta, bars * sweep * 0.65);
      col += cyanGlow * pow(sin(uv.x * 12.0 - uTime), 8.0) * 0.4;

      gl_FragColor = vec4(col, 0.98);
    }
  `
};

export const PageantStage: React.FC = () => {
  const movingBeamsRef = useRef<THREE.Group>(null);
  const floorMatRef = useRef<THREE.ShaderMaterial>(null);
  const backdropMatRef = useRef<THREE.ShaderMaterial>(null);

  const floorUniforms = useMemo(() => ({
    uTime: { value: 0 }
  }), []);

  const backdropUniforms = useMemo(() => ({
    uTime: { value: 0 }
  }), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    floorUniforms.uTime.value = t * 0.25;
    backdropUniforms.uTime.value = t * 0.35;

    // Gentle dynamic sweeping motion of stage volumetric light beams
    if (movingBeamsRef.current) {
      movingBeamsRef.current.children.forEach((beamGroup, idx) => {
        const offset = idx * 0.7;
        beamGroup.rotation.z = Math.sin(t * 0.6 + offset) * 0.12;
        beamGroup.rotation.x = Math.cos(t * 0.5 + offset) * 0.08;
      });
    }
  });

  return (
    <group position={[26, 0, 8]}>
      {/* =========================================================================
          1. MAIN CATWALK RUNWAY (Matching Miss Grand Reference)
          Extends from Backstage (Z: -6) to Canal Apex (Z: 17.5).
          X coordinate in this group is -6.5 -> World X = 26 - 6.5 = 19.5!
          Top surface is at Y = 1.815!
          ========================================================================= */}

      {/* Runway Plinth Foundation (High-Gloss Jet Black with Deep Indigo Rim) */}
      <mesh position={[-6.5, 0.90, 5.5]} receiveShadow>
        <boxGeometry args={[5.6, 1.80, 23]} />
        <meshStandardMaterial color="#06020E" roughness={0.15} metalness={0.85} />
      </mesh>

      {/* Transparent Water Wave LED Screen Floor (จอ LED ใส คลื่นน้ำสีฟ้า) */}
      <mesh position={[-6.5, 1.815, 5.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.4, 22.8]} />
        <shaderMaterial
          ref={floorMatRef}
          vertexShader={TransparentWaterLedFloorShader.vertexShader}
          fragmentShader={TransparentWaterLedFloorShader.fragmentShader}
          uniforms={floorUniforms}
          transparent={true}
        />
      </mesh>

      {/* Neon Edge Light Runners along Runway Borders (Vibrant Magenta & Cyan) */}
      <mesh position={[-9.25, 1.84, 5.5]}>
        <boxGeometry args={[0.12, 0.08, 23]} />
        <meshStandardMaterial color="#FF007F" emissive="#FF007F" emissiveIntensity={3.2} />
      </mesh>
      <mesh position={[-3.75, 1.84, 5.5]}>
        <boxGeometry args={[0.12, 0.08, 23]} />
        <meshStandardMaterial color="#FF007F" emissive="#FF007F" emissiveIntensity={3.2} />
      </mesh>

      {/* Front Runway Apex Platform (Circular Water LED Disc extending overlooking the Canal) */}
      <mesh position={[-6.5, 0.90, 17.5]} receiveShadow>
        <cylinderGeometry args={[4.2, 4.5, 1.80, 36]} />
        <meshStandardMaterial color="#06020E" roughness={0.15} metalness={0.85} />
      </mesh>
      <mesh position={[-6.5, 1.82, 17.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4.1, 36]} />
        <shaderMaterial
          vertexShader={TransparentWaterLedFloorShader.vertexShader}
          fragmentShader={TransparentWaterLedFloorShader.fragmentShader}
          uniforms={floorUniforms}
          transparent={true}
        />
      </mesh>
      {/* Front Apex Glowing Neon Ring Border */}
      <mesh position={[-6.5, 1.84, 17.5]}>
        <torusGeometry args={[4.12, 0.08, 12, 36]} />
        <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={3.0} />
      </mesh>

      {/* Side Stepped Platforms with Glowing Neon Step Risers (as seen in Miss Grand Reference) */}
      {/* Left Stepped Risers */}
      {[-12.2, -11.0, -9.8].map((stepX, idx) => (
        <group key={`l-step-${idx}`} position={[stepX, 0.45 + idx * 0.42, 6.0]}>
          <mesh receiveShadow>
            <boxGeometry args={[1.15, 0.42, 14]} />
            <meshStandardMaterial color="#0C0418" roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[0.55, 0.0, 0]}>
            <boxGeometry args={[0.08, 0.38, 14]} />
            <meshStandardMaterial color="#9333EA" emissive="#C026D3" emissiveIntensity={2.5} />
          </mesh>
        </group>
      ))}

      {/* Right Stepped Risers */}
      {[-0.8, -2.0, -3.2].map((stepX, idx) => (
        <group key={`r-step-${idx}`} position={[stepX, 0.45 + idx * 0.42, 6.0]}>
          <mesh receiveShadow>
            <boxGeometry args={[1.15, 0.42, 14]} />
            <meshStandardMaterial color="#0C0418" roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[-0.55, 0.0, 0]}>
            <boxGeometry args={[0.08, 0.38, 14]} />
            <meshStandardMaterial color="#9333EA" emissive="#C026D3" emissiveIntensity={2.5} />
          </mesh>
        </group>
      ))}

      {/* =========================================================================
          2. GRAND ROTUNDA ARCHITECTURE (Center Pavilion matching "GRAND" in photo)
          ========================================================================= */}
      <group position={[-6.5, 0, -6.5]}>
        {/* Main Center Cylindrical Rotunda Tower Base */}
        <mesh position={[0, 4.5, 0]} receiveShadow>
          <cylinderGeometry args={[4.4, 4.8, 9.0, 32, 1, true]} />
          <meshStandardMaterial color="#0E051D" roughness={0.25} metalness={0.85} />
        </mesh>

        {/* Backstage Entrance Portal (Where Contestants Emerge) */}
        <mesh position={[0, 2.8, 4.2]}>
          <boxGeometry args={[3.2, 4.2, 0.2]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        {/* Glowing Portal Neon Frame */}
        <mesh position={[0, 2.8, 4.3]}>
          <boxGeometry args={[3.4, 4.4, 0.06]} />
          <meshStandardMaterial color="#FF007F" emissive="#FF007F" emissiveIntensity={3.5} />
        </mesh>
        <mesh position={[0, 2.8, 4.32]}>
          <boxGeometry args={[3.15, 4.15, 0.07]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* "GRAND" Crown Drum Sign (Center top of rotunda) */}
        <group position={[0, 9.6, 0]}>
          {/* Glowing Rotunda Drum Ring */}
          <mesh>
            <cylinderGeometry args={[4.2, 4.2, 1.8, 32]} />
            <meshStandardMaterial color="#3B0764" emissive="#581C87" emissiveIntensity={1.5} roughness={0.2} metalness={0.8} />
          </mesh>
          {/* Neon Ring Trim */}
          <mesh position={[0, 0.95, 0]}>
            <torusGeometry args={[4.25, 0.12, 12, 32]} />
            <meshStandardMaterial color="#FF007F" emissive="#FF007F" emissiveIntensity={3.8} />
          </mesh>
          <mesh position={[0, -0.95, 0]}>
            <torusGeometry args={[4.25, 0.12, 12, 32]} />
            <meshStandardMaterial color="#FF007F" emissive="#FF007F" emissiveIntensity={3.8} />
          </mesh>

          {/* Bold Illuminated "GRAND" Sign Board */}
          <mesh position={[0, 0, 4.28]}>
            <boxGeometry args={[4.8, 1.3, 0.15]} />
            <meshStandardMaterial color="#581C87" roughness={0.2} metalness={0.8} />
          </mesh>
          {/* Glowing Neon "GRAND" Letter Blocks */}
          {[-1.6, -0.8, 0.0, 0.8, 1.6].map((lx, li) => (
            <mesh key={`grand-letter-${li}`} position={[lx, 0, 4.38]}>
              <boxGeometry args={[0.55, 0.85, 0.08]} />
              <meshStandardMaterial
                color="#FFFFFF"
                emissive="#FF1493"
                emissiveIntensity={4.5}
                roughness={0.1}
              />
            </mesh>
          ))}
        </group>

        {/* Center Illuminated Slogan Billboard ("Too Grand To Be Ordinary") */}
        <group position={[0, 5.8, 4.2]}>
          <mesh>
            <boxGeometry args={[4.6, 2.4, 0.12]} />
            <shaderMaterial
              ref={backdropMatRef}
              vertexShader={GrandNeonBackdropShader.vertexShader}
              fragmentShader={GrandNeonBackdropShader.fragmentShader}
              uniforms={backdropUniforms}
            />
          </mesh>
          {/* Neon Border around Slogan Box */}
          <mesh position={[0, 0, 0.08]}>
            <boxGeometry args={[4.75, 2.55, 0.04]} />
            <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={3.2} />
          </mesh>
          <mesh position={[0, 0, 0.09]}>
            <boxGeometry args={[4.55, 2.35, 0.05]} />
            <meshBasicMaterial color="#1E0A3C" />
          </mesh>
          {/* Slogan Text Indicator Bars */}
          <mesh position={[0, 0.4, 0.12]}>
            <boxGeometry args={[3.2, 0.28, 0.04]} />
            <meshStandardMaterial color="#FF007F" emissive="#FF007F" emissiveIntensity={4.0} />
          </mesh>
          <mesh position={[0, -0.3, 0.12]}>
            <boxGeometry args={[3.8, 0.28, 0.04]} />
            <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={4.0} />
          </mesh>
        </group>

        {/* Fluted Vertical Glowing Columns */}
        {[-3.6, -2.4, 2.4, 3.6].map((colX, ci) => (
          <group key={`col-${ci}`} position={[colX, 4.5, 3.2]}>
            <mesh>
              <cylinderGeometry args={[0.22, 0.26, 9.0, 14]} />
              <meshStandardMaterial color="#1E0A3C" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Glowing Neon Strip on Column */}
            <mesh position={[0, 0, 0.23]}>
              <boxGeometry args={[0.06, 8.8, 0.04]} />
              <meshStandardMaterial color="#C026D3" emissive="#C026D3" emissiveIntensity={2.8} />
            </mesh>
          </group>
        ))}
      </group>

      {/* =========================================================================
          3. FLANKING CITYSCAPE FACADES & NEON BILLBOARDS (As in Reference Image)
          ========================================================================= */}

      {/* LEFT WING ARCHITECTURAL FACADE */}
      <group position={[-16.5, 0, -5.5]}>
        {/* Tiered Building Block */}
        <mesh position={[0, 5.0, 0]} receiveShadow>
          <boxGeometry args={[8.5, 10.0, 6.0]} />
          <meshStandardMaterial color="#0C0418" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Neon Roofline Cornice (Magenta) */}
        <mesh position={[0, 10.05, 3.02]}>
          <boxGeometry args={[8.6, 0.16, 0.16]} />
          <meshStandardMaterial color="#FF007F" emissive="#FF007F" emissiveIntensity={3.5} />
        </mesh>

        {/* Neon Signboard: "MGI 2026" */}
        <group position={[-1.8, 6.2, 3.1]}>
          <mesh>
            <boxGeometry args={[3.2, 2.2, 0.12]} />
            <meshStandardMaterial color="#1E0A3C" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.08]}>
            <boxGeometry args={[3.0, 2.0, 0.02]} />
            <meshStandardMaterial color="#C026D3" emissive="#C026D3" emissiveIntensity={3.2} />
          </mesh>
          {/* Glowing Letters */}
          <mesh position={[0, 0.3, 0.12]}>
            <boxGeometry args={[2.2, 0.45, 0.04]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#00F0FF" emissiveIntensity={4.0} />
          </mesh>
          <mesh position={[0, -0.3, 0.12]}>
            <boxGeometry args={[1.8, 0.40, 0.04]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#FF007F" emissiveIntensity={4.0} />
          </mesh>
        </group>

        {/* Neon Signboard: "Queenergy" / "Grandtastic!" */}
        <group position={[2.2, 8.2, 3.1]}>
          <mesh>
            <boxGeometry args={[3.4, 1.1, 0.12]} />
            <meshStandardMaterial color="#1E0A3C" />
          </mesh>
          <mesh position={[0, 0, 0.08]}>
            <boxGeometry args={[3.1, 0.32, 0.04]} />
            <meshStandardMaterial color="#FF007F" emissive="#FF007F" emissiveIntensity={3.8} />
          </mesh>
        </group>

        {/* Vertical Glowing LED Louver Strips */}
        {[-3.2, -2.4, -1.6, 1.6, 2.4, 3.2].map((lx, li) => (
          <mesh key={`l-louver-${li}`} position={[lx, 2.4, 3.05]}>
            <boxGeometry args={[0.15, 3.4, 0.05]} />
            <meshStandardMaterial
              color={li % 2 === 0 ? "#9333EA" : "#00F0FF"}
              emissive={li % 2 === 0 ? "#C026D3" : "#00F0FF"}
              emissiveIntensity={2.5}
            />
          </mesh>
        ))}
      </group>

      {/* RIGHT WING ARCHITECTURAL FACADE */}
      <group position={[3.5, 0, -5.5]}>
        {/* Tiered Building Block */}
        <mesh position={[0, 5.0, 0]} receiveShadow>
          <boxGeometry args={[8.5, 10.0, 6.0]} />
          <meshStandardMaterial color="#0C0418" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Neon Roofline Cornice (Magenta) */}
        <mesh position={[0, 10.05, 3.02]}>
          <boxGeometry args={[8.6, 0.16, 0.16]} />
          <meshStandardMaterial color="#FF007F" emissive="#FF007F" emissiveIntensity={3.5} />
        </mesh>

        {/* Neon Signboard: "Slay Hours" */}
        <group position={[-1.8, 8.2, 3.1]}>
          <mesh>
            <boxGeometry args={[3.2, 1.1, 0.12]} />
            <meshStandardMaterial color="#1E0A3C" />
          </mesh>
          <mesh position={[0, 0, 0.08]}>
            <boxGeometry args={[2.8, 0.32, 0.04]} />
            <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={3.8} />
          </mesh>
        </group>

        {/* Neon Signboard: "10! 10! 10!" (Audience Score Billboard) */}
        <group position={[2.0, 6.2, 3.1]}>
          <mesh>
            <boxGeometry args={[3.0, 2.2, 0.12]} />
            <meshStandardMaterial color="#1E0A3C" />
          </mesh>
          <mesh position={[0, 0, 0.08]}>
            <boxGeometry args={[2.8, 2.0, 0.02]} />
            <meshStandardMaterial color="#FF007F" emissive="#FF007F" emissiveIntensity={3.0} />
          </mesh>
          {[-0.6, 0.0, 0.6].map((scoreX, si) => (
            <mesh key={`score-${si}`} position={[scoreX, 0.5 - si * 0.5, 0.12]}>
              <boxGeometry args={[1.2, 0.28, 0.04]} />
              <meshStandardMaterial color="#FFFFFF" emissive="#FDE047" emissiveIntensity={4.2} />
            </mesh>
          ))}
        </group>

        {/* Vertical Glowing LED Louver Strips */}
        {[-3.2, -2.4, -1.6, 1.6, 2.4, 3.2].map((lx, li) => (
          <mesh key={`r-louver-${li}`} position={[lx, 2.4, 3.05]}>
            <boxGeometry args={[0.15, 3.4, 0.05]} />
            <meshStandardMaterial
              color={li % 2 === 0 ? "#00F0FF" : "#9333EA"}
              emissive={li % 2 === 0 ? "#00F0FF" : "#C026D3"}
              emissiveIntensity={2.5}
            />
          </mesh>
        ))}
      </group>

      {/* =========================================================================
          4. OVERHEAD CEILING CONCERT LIGHTING TRUSS & STAGE SPOTS
          Massive overhead rig spanning the entire arena with dense spotlights
          ========================================================================= */}
      <group position={[-6.5, 14.5, 4.0]}>
        {/* Main Transverse Concert Truss Beams */}
        {[-8, -2, 4, 10].map((trussZ, ti) => (
          <group key={`truss-${ti}`} position={[0, 0, trussZ]}>
            {/* Horizontal Box Truss Tubes */}
            <mesh>
              <boxGeometry args={[28, 0.45, 0.45]} />
              <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.25} />
            </mesh>
            {/* Downward Truss Pendants */}
            {[-12, -8, -4, 0, 4, 8, 12].map((px, pi) => (
              <group key={`luminaire-${pi}`} position={[px, -0.4, 0]}>
                <mesh>
                  <cylinderGeometry args={[0.22, 0.28, 0.45, 12]} />
                  <meshStandardMaterial color="#0F172A" metalness={0.9} />
                </mesh>
                {/* Glowing Luminaire Lens (Matching glowing stage lights in reference) */}
                <mesh position={[0, -0.24, 0]}>
                  <circleGeometry args={[0.24, 16]} />
                  <meshBasicMaterial
                    color={pi % 3 === 0 ? "#FF007F" : pi % 3 === 1 ? "#00F0FF" : "#9333EA"}
                  />
                </mesh>
              </group>
            ))}
          </group>
        ))}
      </group>

      {/* =========================================================================
          5. VOLUMETRIC ANGLED LIGHT BEAMS (Dramatic Light Cones shining down)
          Criss-crossing volumetric beams matching the Miss Grand reference photo!
          ========================================================================= */}
      <group ref={movingBeamsRef} position={[-6.5, 14.0, 4.0]}>
        {[
          { pos: [-9.0, 0, 6] as [number, number, number], rot: [0.35, 0, 0.45] as [number, number, number], color: "#00F0FF" },
          { pos: [-4.0, 0, 8] as [number, number, number], rot: [0.25, 0, 0.20] as [number, number, number], color: "#FF007F" },
          { pos: [0.0, 0, 6] as [number, number, number], rot: [0.32, 0, -0.15] as [number, number, number], color: "#A855F7" },
          { pos: [4.0, 0, 8] as [number, number, number], rot: [0.25, 0, -0.25] as [number, number, number], color: "#FF007F" },
          { pos: [9.0, 0, 6] as [number, number, number], rot: [0.35, 0, -0.45] as [number, number, number], color: "#00F0FF" },
          // Back-to-front beams
          { pos: [-6.0, 0, -4] as [number, number, number], rot: [-0.42, 0, 0.28] as [number, number, number], color: "#9333EA" },
          { pos: [6.0, 0, -4] as [number, number, number], rot: [-0.42, 0, -0.28] as [number, number, number], color: "#C026D3" }
        ].map((beam, bi) => (
          <group key={`vol-beam-${bi}`} position={beam.pos} rotation={beam.rot}>
            <mesh position={[0, -9.5, 0]}>
              <cylinderGeometry args={[0.3, 3.2, 19, 24, 1, true]} />
              <meshBasicMaterial
                color={beam.color}
                transparent={true}
                opacity={0.18}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* =========================================================================
          6. REAL-TIME SPOTLIGHTS ON CATWALK RUNWAY
          Targeting the catwalk to brightly illuminate the walking contestants
          ========================================================================= */}
      {/* Lead Follow Spotlight on Front Apex */}
      <spotLight
        position={[-6.5, 14.2, 17.5]}
        target-position={[-6.5, 1.82, 16.5]}
        color="#FFFFFF"
        intensity={10.0}
        angle={0.45}
        penumbra={0.65}
        distance={35}
      />
      {/* Mid Runway Fill Spotlight (Electric Cyan) */}
      <spotLight
        position={[-11.5, 13.8, 8.0]}
        target-position={[-6.5, 1.82, 8.0]}
        color="#00F0FF"
        intensity={7.5}
        angle={0.50}
        penumbra={0.70}
        distance={32}
      />
      {/* Mid Runway Counter Spotlight (Hot Pink / Magenta) */}
      <spotLight
        position={[-1.5, 13.8, 8.0]}
        target-position={[-6.5, 1.82, 8.0]}
        color="#FF007F"
        intensity={7.5}
        angle={0.50}
        penumbra={0.70}
        distance={32}
      />
      {/* Backstage Exit Spotlight (Royal Purple) */}
      <spotLight
        position={[-6.5, 13.5, -2.0]}
        target-position={[-6.5, 1.82, 0.0]}
        color="#A855F7"
        intensity={8.0}
        angle={0.55}
        penumbra={0.70}
        distance={30}
      />
    </group>
  );
};

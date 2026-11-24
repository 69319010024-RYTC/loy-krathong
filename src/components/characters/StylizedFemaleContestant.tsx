import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Contestant } from '../../types/game';

interface StylizedFemaleContestantProps {
  contestant: Contestant;
  phaseOffset: number; // Stagger phase (0.0 to 1.0)
  laneOffset?: number; // Dual-lane lateral offset (+1.25m or -1.25m)
  onFeaturedApex?: (c: Contestant) => void;
}

export const StylizedFemaleContestant: React.FC<StylizedFemaleContestantProps> = ({
  contestant,
  phaseOffset,
  laneOffset = 1.25,
  onFeaturedApex
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const neckRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const pelvisRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftCalfRef = useRef<THREE.Group>(null);
  const rightCalfRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  const cycleDuration = 24.0; // 24 seconds per full runway cycle
  const hasCalledApex = useRef(false);

  // Runway floor Y coordinate (top of runway surface)
  const RUNWAY_FLOOR_Y = 1.815;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!rootRef.current) return;

    // Continuous staggered progress across the runway
    const progress = ((time / cycleDuration) + phaseOffset) % 1.0;

    let zPos = 0;
    let xPos = 19.5;
    let yRot = 0;
    let isWalking = true;
    const walkSpeed = 10.2; // Brisk energetic Miss Grand tempo

    // Runway Navigation Stages:
    // 0.00 -> 0.38: Walking forward from Backstage (Z: -4.0) to Front Apex (Z: 16.5) along Lane A (+laneOffset)
    // 0.38 -> 0.62: Front Apex Center Posing, 360° Crown Spin, Sassy Miss Grand Glamour
    // 0.62 -> 0.94: Strutting back down Lane B (-laneOffset) towards backstage
    // 0.94 -> 1.00: Backstage turnaround & next cycle entrance

    if (progress < 0.38) {
      const f = progress / 0.38;
      zPos = -4.0 + f * 20.5; // -4.0 to 16.5
      // Smoothly converge toward apex center (X: 19.5) when arriving at front platform
      const converge = f > 0.72 ? (f - 0.72) / 0.28 : 0;
      xPos = 19.5 + laneOffset * (1.0 - converge);
      yRot = 0; // Facing front towards audience and canal
      isWalking = true;
      hasCalledApex.current = false;
    } else if (progress < 0.62) {
      // At Front Apex Platform
      zPos = 16.5;
      xPos = 19.5;
      isWalking = false;

      if (!hasCalledApex.current) {
        hasCalledApex.current = true;
        if (onFeaturedApex) onFeaturedApex(contestant);
      }

      const posePhase = (progress - 0.38) / 0.24;
      if (posePhase < 0.25) {
        yRot = 0; // Front pageant pose with sassy hip pop
      } else if (posePhase < 0.50) {
        yRot = Math.PI * 0.28; // 3/4 angle Miss Grand pose
      } else if (posePhase < 0.80) {
        // Dramatic 360-degree power spin
        const spinF = (posePhase - 0.50) / 0.30;
        yRot = Math.PI * 0.28 + spinF * Math.PI * 2.0;
      } else {
        yRot = Math.PI; // Face backstage to start strut back
      }
    } else if (progress < 0.94) {
      // Strutting back down Lane B towards backstage
      const f = (progress - 0.62) / 0.32;
      zPos = 16.5 - f * 20.5;
      const diverge = f < 0.25 ? f / 0.25 : 1.0;
      xPos = 19.5 - laneOffset * diverge;
      yRot = Math.PI; // Facing backstage
      isWalking = true;
      hasCalledApex.current = false;
    } else {
      // Backstage exit & turnaround
      zPos = -4.0;
      xPos = 19.5 - laneOffset;
      yRot = Math.PI;
      isWalking = false;
    }

    // Exact placement on top of runway (heels touch floor without sinking)
    rootRef.current.position.set(xPos, RUNWAY_FLOOR_Y, zPos);
    rootRef.current.rotation.y = yRot;

    // FIERCE MISS GRAND SWIMSUIT CATWALK ANIMATION DYNAMICS ("เดินสับๆ แรงๆ")
    if (isWalking) {
      const cycle = Math.sin(time * walkSpeed);
      const cosCycle = Math.cos(time * walkSpeed);
      const energy = contestant.energyLevel;

      // 1. Exaggerated Hip Sway (สับสะโพก / Pelvic Roll & Twist)
      if (pelvisRef.current) {
        // Strong lateral hip pop (Z rotation)
        pelvisRef.current.rotation.z = cycle * 0.22 * energy;
        // Sassy pelvis twist in sync with stride (Y rotation)
        pelvisRef.current.rotation.y = cosCycle * 0.15 * energy;
        // Vertical step bounce
        pelvisRef.current.position.y = 1.02 + Math.abs(cycle) * 0.035;
      }

      // 2. Torso Counter-Balance (Upper body stays proud & centered)
      if (torsoRef.current) {
        torsoRef.current.rotation.z = -cycle * 0.12 * energy;
        torsoRef.current.rotation.y = -cosCycle * 0.10 * energy;
      }

      // 3. Poised Head & Eye Focus (Chin up, looking fiercely forward)
      if (headRef.current) {
        headRef.current.rotation.y = cosCycle * 0.04;
        headRef.current.rotation.x = -0.04 + Math.sin(time * walkSpeed * 2) * 0.025;
      }

      // 4. Fierce High-Heel Leg Striding with High Knee Lift & Crossover
      if (leftLegRef.current && rightLegRef.current) {
        // High reach forward stride
        leftLegRef.current.rotation.x = cycle * 0.62;
        rightLegRef.current.rotation.x = -cycle * 0.62;
        // Sassy catwalk crossover line
        leftLegRef.current.rotation.z = -cycle * 0.04;
        rightLegRef.current.rotation.z = -cycle * 0.04;
      }

      // 5. Knee Flex during swing phase
      if (leftCalfRef.current && rightCalfRef.current) {
        leftCalfRef.current.rotation.x = Math.max(0, -cycle * 0.68);
        rightCalfRef.current.rotation.x = Math.max(0, cycle * 0.68);
      }

      // 6. Sassy Swimwear Arms: One hand anchored on hip, opposite arm swinging fiercely!
      if (leftArmRef.current) {
        // Left hand on hip / waist (classic swimsuit power walk stance)
        leftArmRef.current.rotation.set(
          -0.52 + cycle * 0.06,
          0.12,
          0.54 + Math.abs(cycle) * 0.08
        );
      }
      if (rightArmRef.current) {
        // Right arm swings with fluid grace and wrist snap
        rightArmRef.current.rotation.set(
          cycle * 0.44,
          -0.10,
          -0.20 - Math.abs(cosCycle) * 0.10
        );
      }
    } else {
      // IN APEX GLAMOUR POSING MODE (Confident Miss Grand Stance)
      const poseTime = time * 2.5;

      if (pelvisRef.current) {
        pelvisRef.current.rotation.set(0, 0.12, 0.14); // Sassy popped hip
        pelvisRef.current.position.y = 1.02;
      }
      if (torsoRef.current) {
        torsoRef.current.rotation.set(0, -0.08, -0.08); // Counter twist
      }
      if (headRef.current) {
        headRef.current.rotation.set(-0.06, 0.14, 0.04 + Math.sin(poseTime) * 0.03);
      }
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.set(0.10, 0.05, 0.06); // Weight-bearing leg
        rightLegRef.current.rotation.set(-0.16, -0.08, -0.08); // Forward pointed toe
      }
      if (leftCalfRef.current) leftCalfRef.current.rotation.x = 0.04;
      if (rightCalfRef.current) rightCalfRef.current.rotation.x = 0.18;

      // Both hands in glamorous poses
      if (leftArmRef.current) {
        // Hand firmly on waist
        leftArmRef.current.rotation.set(-0.62, 0.15, 0.62);
      }
      if (rightArmRef.current) {
        // High Queen's Crown Wave / Touch with delicate hand flair
        rightArmRef.current.rotation.set(
          -1.48 + Math.sin(poseTime) * 0.08,
          0.12,
          -0.65 + Math.sin(poseTime * 1.5) * 0.12
        );
      }
    }
  });

  // HIGH-END PBR MATERIALS FOR CONTESTANT
  const skinMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: contestant.skinTone,
    roughness: 0.52,
    metalness: 0.04,
  }), [contestant.skinTone]);

  const hairMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: contestant.hairColor,
    roughness: 0.28,
    metalness: 0.18,
  }), [contestant.hairColor]);

  // Vibrant, high-fashion metallic swimsuit material
  const swimwearMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: contestant.swimsuitColor,
    roughness: 0.22,
    metalness: 0.55,
  }), [contestant.swimsuitColor]);

  const metallicTrimMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: contestant.swimsuitAccent || '#F59E0B',
    roughness: 0.15,
    metalness: 0.95,
  }), [contestant.swimsuitAccent]);

  const stilettoMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: contestant.swimsuitAccent || '#F59E0B',
    roughness: 0.18,
    metalness: 0.90,
  }), [contestant.swimsuitAccent]);

  const s = contestant.heightScale;

  return (
    <group ref={rootRef} scale={[s, s, s]}>
      {/* 
        LOCAL HIERARCHY WITH ZERO FLOOR PENETRATION:
        The lowest point of the stiletto heel and shoe sole is EXACTLY at local Y = 0.000!
        Therefore, when rootRef.position.y is at runway surface (1.815),
        the shoes rest strictly ON TOP of the floor without any sinking!
      */}

      {/* PELVIS / HIPS ORIGIN (Local Y = 1.02) */}
      <group ref={pelvisRef} position={[0, 1.02, 0]}>
        {/* Curvaceous Miss Grand Swimsuit Bottom (High-Cut Leg Bikini) */}
        <mesh position={[0, 0.02, 0]} castShadow>
          <cylinderGeometry args={[0.23, 0.26, 0.24, 20]} />
          <primitive object={swimwearMaterial} attach="material" />
        </mesh>

        {/* Metallic Accent Rings on Swimsuit Hips */}
        {[-0.26, 0.26].map((hx, hi) => (
          <mesh key={hi} position={[hx, 0.04, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.032, 0.008, 12, 18]} />
            <primitive object={metallicTrimMaterial} attach="material" />
          </mesh>
        ))}

        {/* TORSO & BUST (Extends from Hips to Shoulders) */}
        <group ref={torsoRef} position={[0, 0.14, 0]}>
          {/* Slender Toned Waist & Abs */}
          <mesh position={[0, 0.08, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.22, 0.22, 18]} />
            <primitive object={skinMaterial} attach="material" />
          </mesh>

          {/* Feminine Ribcage & Sweetheart Bikini Top */}
          <mesh position={[0, 0.30, 0]} castShadow>
            <cylinderGeometry args={[0.24, 0.18, 0.26, 20]} />
            <primitive object={swimwearMaterial} attach="material" />
          </mesh>

          {/* Sculpted Bust Cups */}
          {[-0.08, 0.08].map((bx, bi) => (
            <mesh key={bi} position={[bx, 0.32, 0.11]} castShadow>
              <sphereGeometry args={[0.095, 16, 16]} />
              <primitive object={swimwearMaterial} attach="material" />
            </mesh>
          ))}

          {/* Golden Center Clasp on Bikini */}
          <mesh position={[0, 0.32, 0.17]}>
            <octahedronGeometry args={[0.038]} />
            <primitive object={metallicTrimMaterial} attach="material" />
          </mesh>

          {/* Official "MISS LUMINA" Glossy Satin Sash */}
          <mesh position={[0.02, 0.25, 0.14]} rotation={[0, 0, -0.40]}>
            <boxGeometry args={[0.068, 0.64, 0.015]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.25} metalness={0.4} />
          </mesh>
          <mesh position={[0.02, 0.25, 0.146]} rotation={[0, 0, -0.40]}>
            <boxGeometry args={[0.055, 0.62, 0.016]} />
            <meshStandardMaterial color="#B45309" roughness={0.15} metalness={0.85} />
          </mesh>

          {/* Clavicles & Slender Graceful Neck */}
          <group ref={neckRef} position={[0, 0.48, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.072, 0.085, 0.20, 16]} />
              <primitive object={skinMaterial} attach="material" />
            </mesh>

            {/* STYLIZED HIGH-FASHION HEAD */}
            <group ref={headRef} position={[0, 0.22, 0]}>
              {/* Sculpted Face Oval */}
              <mesh castShadow>
                <sphereGeometry args={[0.155, 20, 20]} />
                <primitive object={skinMaterial} attach="material" />
              </mesh>

              {/* Sculpted Chin & Defined Jawline */}
              <mesh position={[0, -0.085, 0.055]}>
                <coneGeometry args={[0.075, 0.11, 14]} />
                <primitive object={skinMaterial} attach="material" />
              </mesh>

              {/* Expressive Pageant Eyes with Eyelashes */}
              {[-0.05, 0.05].map((xOffset, i) => (
                <group key={i} position={[xOffset, 0.02, 0.132]} rotation={[0, xOffset > 0 ? 0.08 : -0.08, 0]}>
                  {/* Eye Sclera */}
                  <mesh>
                    <boxGeometry args={[0.042, 0.022, 0.01]} />
                    <meshBasicMaterial color="#FFFFFF" />
                  </mesh>
                  {/* Iris */}
                  <mesh position={[0, 0, 0.006]}>
                    <circleGeometry args={[0.014, 14]} />
                    <meshBasicMaterial color="#1E1B4B" />
                  </mesh>
                  {/* Eyelash Liner */}
                  <mesh position={[0, 0.015, 0.008]}>
                    <boxGeometry args={[0.05, 0.006, 0.005]} />
                    <meshBasicMaterial color="#0A0A0A" />
                  </mesh>
                </group>
              ))}

              {/* Delicate Contoured Nose */}
              <mesh position={[0, -0.008, 0.16]}>
                <coneGeometry args={[0.015, 0.048, 8]} />
                <primitive object={skinMaterial} attach="material" />
              </mesh>

              {/* Plump Glossy Lipstick */}
              <mesh position={[0, -0.052, 0.146]}>
                <boxGeometry args={[0.045, 0.018, 0.012]} />
                <meshStandardMaterial color="#E11D48" roughness={0.12} metalness={0.15} />
              </mesh>

              {/* Golden Beauty Queen Tiara Crown */}
              <group position={[0, 0.135, 0]}>
                <mesh>
                  <torusGeometry args={[0.125, 0.016, 12, 24]} />
                  <primitive object={metallicTrimMaterial} attach="material" />
                </mesh>
                {[-0.055, -0.02, 0.02, 0.055].map((spX, si) => (
                  <mesh key={si} position={[spX, 0.065 + (si === 1 || si === 2 ? 0.02 : 0), 0.09]}>
                    <coneGeometry args={[0.02, 0.09, 8]} />
                    <primitive object={metallicTrimMaterial} attach="material" />
                  </mesh>
                ))}
              </group>

              {/* Sparkling Golden Earrings */}
              {[-0.145, 0.145].map((eX, ei) => (
                <group key={ei} position={[eX, -0.038, 0]}>
                  <mesh>
                    <sphereGeometry args={[0.014, 8, 8]} />
                    <primitive object={metallicTrimMaterial} attach="material" />
                  </mesh>
                  <mesh position={[0, -0.038, 0]}>
                    <cylinderGeometry args={[0.004, 0.010, 0.065, 8]} />
                    <primitive object={metallicTrimMaterial} attach="material" />
                  </mesh>
                </group>
              ))}

              {/* Volumetric Hairstyles */}
              {contestant.hairStyle === 'long-wavy' && (
                <group position={[0, 0.03, -0.03]}>
                  <mesh>
                    <sphereGeometry args={[0.175, 18, 18]} />
                    <primitive object={hairMaterial} attach="material" />
                  </mesh>
                  <mesh position={[0, -0.30, -0.08]} rotation={[0.08, 0, 0]}>
                    <cylinderGeometry args={[0.17, 0.23, 0.62, 14]} />
                    <primitive object={hairMaterial} attach="material" />
                  </mesh>
                  <mesh position={[-0.12, -0.15, 0.06]} rotation={[0, 0, -0.18]}>
                    <cylinderGeometry args={[0.04, 0.055, 0.36, 8]} />
                    <primitive object={hairMaterial} attach="material" />
                  </mesh>
                  <mesh position={[0.12, -0.15, 0.06]} rotation={[0, 0, 0.18]}>
                    <cylinderGeometry args={[0.04, 0.055, 0.36, 8]} />
                    <primitive object={hairMaterial} attach="material" />
                  </mesh>
                </group>
              )}

              {contestant.hairStyle === 'high-ponytail' && (
                <group position={[0, 0.04, -0.02]}>
                  <mesh>
                    <sphereGeometry args={[0.165, 18, 18]} />
                    <primitive object={hairMaterial} attach="material" />
                  </mesh>
                  <mesh position={[0, 0.15, -0.13]} rotation={[0.42, 0, 0]}>
                    <torusGeometry args={[0.042, 0.014, 8, 16]} />
                    <primitive object={metallicTrimMaterial} attach="material" />
                  </mesh>
                  <mesh position={[0, 0.05, -0.25]} rotation={[0.52, 0, 0]}>
                    <coneGeometry args={[0.10, 0.58, 12]} />
                    <primitive object={hairMaterial} attach="material" />
                  </mesh>
                </group>
              )}

              {contestant.hairStyle === 'sleek-bun' && (
                <group position={[0, 0.03, -0.02]}>
                  <mesh>
                    <sphereGeometry args={[0.165, 18, 18]} />
                    <primitive object={hairMaterial} attach="material" />
                  </mesh>
                  <mesh position={[0, 0.085, -0.13]}>
                    <sphereGeometry args={[0.095, 14, 14]} />
                    <primitive object={hairMaterial} attach="material" />
                  </mesh>
                </group>
              )}

              {contestant.hairStyle === 'voluminous-curls' && (
                <group position={[0, 0.02, -0.02]}>
                  <mesh>
                    <sphereGeometry args={[0.19, 18, 18]} />
                    <primitive object={hairMaterial} attach="material" />
                  </mesh>
                  <mesh position={[0, -0.24, -0.07]}>
                    <cylinderGeometry args={[0.21, 0.26, 0.52, 14]} />
                    <primitive object={hairMaterial} attach="material" />
                  </mesh>
                </group>
              )}

              {contestant.hairStyle === 'short-bob' && (
                <group position={[0, 0.03, -0.02]}>
                  <mesh>
                    <sphereGeometry args={[0.175, 18, 18]} />
                    <primitive object={hairMaterial} attach="material" />
                  </mesh>
                  <mesh position={[0, -0.11, -0.04]}>
                    <cylinderGeometry args={[0.18, 0.19, 0.30, 12]} />
                    <primitive object={hairMaterial} attach="material" />
                  </mesh>
                </group>
              )}

              {contestant.hairStyle === 'braided-updo' && (
                <group position={[0, 0.03, -0.02]}>
                  <mesh>
                    <sphereGeometry args={[0.165, 18, 18]} />
                    <primitive object={hairMaterial} attach="material" />
                  </mesh>
                  <mesh position={[0, 0.13, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.11, 0.045, 10, 20]} />
                    <primitive object={hairMaterial} attach="material" />
                  </mesh>
                </group>
              )}
            </group>
          </group>

          {/* ARMS & SASSY HANDS */}
          {/* Left Arm */}
          <group ref={leftArmRef} position={[-0.24, 0.42, 0]}>
            <mesh position={[0, -0.20, 0]} castShadow>
              <cylinderGeometry args={[0.040, 0.034, 0.42, 10]} />
              <primitive object={skinMaterial} attach="material" />
            </mesh>
            <mesh position={[0, -0.48, 0]} castShadow>
              <cylinderGeometry args={[0.034, 0.028, 0.40, 10]} />
              <primitive object={skinMaterial} attach="material" />
            </mesh>
            {/* Hand */}
            <mesh position={[0, -0.70, 0]}>
              <boxGeometry args={[0.038, 0.065, 0.018]} />
              <primitive object={skinMaterial} attach="material" />
            </mesh>
          </group>

          {/* Right Arm */}
          <group ref={rightArmRef} position={[0.24, 0.42, 0]}>
            <mesh position={[0, -0.20, 0]} castShadow>
              <cylinderGeometry args={[0.040, 0.034, 0.42, 10]} />
              <primitive object={skinMaterial} attach="material" />
            </mesh>
            <mesh position={[0, -0.48, 0]} castShadow>
              <cylinderGeometry args={[0.034, 0.028, 0.40, 10]} />
              <primitive object={skinMaterial} attach="material" />
            </mesh>
            {/* Hand */}
            <mesh position={[0, -0.70, 0]}>
              <boxGeometry args={[0.038, 0.065, 0.018]} />
              <primitive object={skinMaterial} attach="material" />
            </mesh>
          </group>
        </group>

        {/* 
          LEGS & STILETTO HIGH HEELS (EXACT HEIGHT MATHEMATICS)
          Pelvis is at local Y = 1.02.
          Thigh joint is at Y = -0.02 (world height 1.00).
          Thigh length = 0.50 -> knee at local Y = 0.50.
          Calf length = 0.48 -> ankle at local Y = 0.02.
          Stiletto heel & sole extend from 0.02 down to 0.000!
          Floor level is EXACTLY 0.000! ZERO SINKING!
        */}

        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.11, -0.02, 0]}>
          {/* Sculpted Thigh */}
          <mesh position={[0, -0.25, 0]} castShadow>
            <cylinderGeometry args={[0.078, 0.060, 0.50, 14]} />
            <primitive object={skinMaterial} attach="material" />
          </mesh>

          {/* Knee & Calf Group */}
          <group ref={leftCalfRef} position={[0, -0.50, 0]}>
            {/* Toned Calf */}
            <mesh position={[0, -0.24, 0]} castShadow>
              <cylinderGeometry args={[0.060, 0.042, 0.48, 14]} />
              <primitive object={skinMaterial} attach="material" />
            </mesh>

            {/* Ankle & Stiletto High Heel (Bottom touches local Y = 0.000) */}
            <group position={[0, -0.48, 0]}>
              {/* Pointed High-Heel Toe & Sole */}
              <mesh position={[0, 0.012, 0.05]} castShadow>
                <boxGeometry args={[0.058, 0.024, 0.14]} />
                <primitive object={stilettoMaterial} attach="material" />
              </mesh>
              {/* Ankle Strap */}
              <mesh position={[0, 0.035, 0]}>
                <torusGeometry args={[0.042, 0.007, 8, 16]} />
                <primitive object={metallicTrimMaterial} attach="material" />
              </mesh>
              {/* Slender Stiletto Heel (Extends from ankle down to 0.000) */}
              <mesh position={[0, -0.01, -0.03]} castShadow>
                <cylinderGeometry args={[0.008, 0.005, 0.04, 8]} />
                <primitive object={stilettoMaterial} attach="material" />
              </mesh>
            </group>
          </group>
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.11, -0.02, 0]}>
          {/* Sculpted Thigh */}
          <mesh position={[0, -0.25, 0]} castShadow>
            <cylinderGeometry args={[0.078, 0.060, 0.50, 14]} />
            <primitive object={skinMaterial} attach="material" />
          </mesh>

          {/* Knee & Calf Group */}
          <group ref={rightCalfRef} position={[0, -0.50, 0]}>
            {/* Toned Calf */}
            <mesh position={[0, -0.24, 0]} castShadow>
              <cylinderGeometry args={[0.060, 0.042, 0.48, 14]} />
              <primitive object={skinMaterial} attach="material" />
            </mesh>

            {/* Ankle & Stiletto High Heel (Bottom touches local Y = 0.000) */}
            <group position={[0, -0.48, 0]}>
              {/* Pointed High-Heel Toe & Sole */}
              <mesh position={[0, 0.012, 0.05]} castShadow>
                <boxGeometry args={[0.058, 0.024, 0.14]} />
                <primitive object={stilettoMaterial} attach="material" />
              </mesh>
              {/* Ankle Strap */}
              <mesh position={[0, 0.035, 0]}>
                <torusGeometry args={[0.042, 0.007, 8, 16]} />
                <primitive object={metallicTrimMaterial} attach="material" />
              </mesh>
              {/* Slender Stiletto Heel (Extends from ankle down to 0.000) */}
              <mesh position={[0, -0.01, -0.03]} castShadow>
                <cylinderGeometry args={[0.008, 0.005, 0.04, 8]} />
                <primitive object={stilettoMaterial} attach="material" />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

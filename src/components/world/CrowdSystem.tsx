import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type NPCBehaviorState = 'WALK' | 'IDLE' | 'PRAY' | 'CHEER' | 'EAT' | 'PHOTO';

interface Waypoint {
  x: number;
  y: number;
  z: number;
}

interface StylizedNPC {
  id: number;
  zone: 'market' | 'temple' | 'riverside' | 'pageant';
  x: number;
  y: number;
  z: number;
  rotationY: number;
  targetRotationY: number;
  speed: number;
  baseSpeed: number;
  state: NPCBehaviorState;
  stateTimer: number;
  waypointIndex: number;
  waypoints: Waypoint[];
  shirtColor: string;
  pantsColor: string;
  skinTone: string;
  hairColor: string;
  scale: number;
  gender: 'female' | 'male';
  walkCycle: number;
}

export const CrowdSystem: React.FC = () => {
  const crowdGroupRef = useRef<THREE.Group>(null);

  // Calibrated Surface Heights (Exact surface levels to prevent sinking into ground):
  // Ground Top = 0.20
  // Temple Terrace = 0.85
  // Riverside Pier = 0.35
  // Pageant Audience Platform = 1.22
  const waypointsByZone: Record<string, Waypoint[]> = useMemo(() => ({
    market: [
      { x: 33, y: 0.20, z: 28 }, // Market entrance
      { x: 33, y: 0.20, z: 36 }, // Satay stall front
      { x: 36, y: 0.20, z: 44 }, // Pad Thai stall dining area
      { x: 33, y: 0.20, z: 52 }, // Thai tea dessert counter
      { x: 35, y: 0.20, z: 62 }, // Souvenir stall edge
      { x: 38, y: 0.20, z: 70 }, // Far market turn-around
      { x: 34, y: 0.20, z: 50 }, // Return walkway mid
      { x: 35, y: 0.20, z: 32 }  // Return walkway near entrance
    ],
    temple: [
      { x: -24, y: 0.20, z: 12 }, // Front temple stone walkway
      { x: -26, y: 0.20, z: 0 },  // Grand stairs base
      { x: -30, y: 0.85, z: 0 },  // Temple terrace prayer shrine
      { x: -25, y: 0.20, z: -14 },// Lotus pond garden path
      { x: -32, y: 0.20, z: -18 },// Courtyard tree shade
      { x: -27, y: 0.20, z: -4 }  // Front courtyard
    ],
    riverside: [
      { x: -20, y: 2.20, z: 8 },  // Top stone stairs landing
      { x: -16, y: 1.20, z: 4 },  // Mid-flight stairs
      { x: -12, y: 0.35, z: 0 },  // Riverside release pier
      { x: -12, y: 0.35, z: -8 }, // South riverbank viewing deck
      { x: -12, y: 0.35, z: 8 },  // North riverbank viewing deck
      { x: -17, y: 1.70, z: -6 }  // Ascending return path
    ],
    pageant: [
      { x: 26, y: 1.22, z: 24 },  // Audience front row center
      { x: 29, y: 1.22, z: 26 },  // Audience second row left
      { x: 25, y: 1.22, z: 28 },  // Audience second row right
      { x: 30, y: 1.22, z: 30 },  // Back standing terrace
      { x: 27, y: 1.22, z: 32 }   // Rear viewing terrace
    ]
  }), []);

  // Initialize 18 stylized realistic festival NPCs
  const npcs = useMemo<StylizedNPC[]>(() => {
    const list: StylizedNPC[] = [];
    const shirtColors = [
      '#DC2626', '#2563EB', '#16A34A', '#D97706',
      '#9333EA', '#F43F5E', '#0891B2', '#FFFFFF',
      '#E11D48', '#059669', '#F59E0B', '#3B82F6'
    ];
    const pantsColors = ['#1E293B', '#334155', '#475569', '#78350F', '#B45309', '#0F172A'];
    const skinTones = ['#F9DFC8', '#E8CBB3', '#D4A373', '#CFA07E', '#FAEDE2', '#A77047'];
    const hairColors = ['#0F172A', '#3F2E23', '#1F2937', '#271B12'];

    // 1. Market Pedestrians (6 NPCs)
    for (let i = 0; i < 6; i++) {
      const wpList = waypointsByZone.market;
      const startWp = wpList[i % wpList.length];
      list.push({
        id: i,
        zone: 'market',
        x: startWp.x + (Math.random() - 0.5) * 1.5,
        y: startWp.y,
        z: startWp.z + (Math.random() - 0.5) * 1.5,
        rotationY: Math.random() * Math.PI * 2,
        targetRotationY: 0,
        speed: 1.2 + (i % 3) * 0.2,
        baseSpeed: 1.2 + (i % 3) * 0.2,
        state: i % 2 === 0 ? 'WALK' : 'EAT',
        stateTimer: 4 + Math.random() * 5,
        waypointIndex: (i + 1) % wpList.length,
        waypoints: wpList,
        shirtColor: shirtColors[i % shirtColors.length],
        pantsColor: pantsColors[i % pantsColors.length],
        skinTone: skinTones[i % skinTones.length],
        hairColor: hairColors[i % hairColors.length],
        scale: 0.96 + (i % 3) * 0.04,
        gender: i % 2 === 0 ? 'female' : 'male',
        walkCycle: Math.random() * 10
      });
    }

    // 2. Temple Worshippers (4 NPCs)
    for (let i = 6; i < 10; i++) {
      const wpList = waypointsByZone.temple;
      const startWp = wpList[(i - 6) % wpList.length];
      list.push({
        id: i,
        zone: 'temple',
        x: startWp.x + (Math.random() - 0.5) * 1.2,
        y: startWp.y,
        z: startWp.z + (Math.random() - 0.5) * 1.2,
        rotationY: Math.random() * Math.PI * 2,
        targetRotationY: 0,
        speed: 0.9 + (i % 2) * 0.2,
        baseSpeed: 0.9 + (i % 2) * 0.2,
        state: i % 2 === 0 ? 'PRAY' : 'WALK',
        stateTimer: 6 + Math.random() * 6,
        waypointIndex: (i - 5) % wpList.length,
        waypoints: wpList,
        shirtColor: '#FFFFFF', // Traditional white Buddhist temple garb
        pantsColor: '#B45309', // Traditional gold/amber sarong
        skinTone: skinTones[i % skinTones.length],
        hairColor: hairColors[i % hairColors.length],
        scale: 0.98,
        gender: i % 2 === 0 ? 'female' : 'male',
        walkCycle: Math.random() * 10
      });
    }

    // 3. Riverside Krathong Releasers (4 NPCs)
    for (let i = 10; i < 14; i++) {
      const wpList = waypointsByZone.riverside;
      const startWp = wpList[(i - 10) % wpList.length];
      list.push({
        id: i,
        zone: 'riverside',
        x: startWp.x + (Math.random() - 0.5) * 1.2,
        y: startWp.y,
        z: startWp.z + (Math.random() - 0.5) * 1.2,
        rotationY: Math.random() * Math.PI * 2,
        targetRotationY: 0,
        speed: 0.9 + (i % 2) * 0.2,
        baseSpeed: 0.9 + (i % 2) * 0.2,
        state: i % 2 === 0 ? 'PRAY' : 'WALK',
        stateTimer: 5 + Math.random() * 5,
        waypointIndex: (i - 9) % wpList.length,
        waypoints: wpList,
        shirtColor: shirtColors[(i + 4) % shirtColors.length],
        pantsColor: pantsColors[(i + 2) % pantsColors.length],
        skinTone: skinTones[i % skinTones.length],
        hairColor: hairColors[i % hairColors.length],
        scale: 0.97,
        gender: i % 2 === 0 ? 'female' : 'male',
        walkCycle: Math.random() * 10
      });
    }

    // 4. Pageant Audience Members (4 NPCs)
    for (let i = 14; i < 18; i++) {
      const wpList = waypointsByZone.pageant;
      const startWp = wpList[(i - 14) % wpList.length];
      list.push({
        id: i,
        zone: 'pageant',
        x: startWp.x + (Math.random() - 0.5) * 1.0,
        y: startWp.y,
        z: startWp.z + (Math.random() - 0.5) * 1.0,
        rotationY: Math.PI, // Facing the runway
        targetRotationY: Math.PI,
        speed: 0.7,
        baseSpeed: 0.7,
        state: i % 2 === 0 ? 'CHEER' : 'PHOTO',
        stateTimer: 8 + Math.random() * 8,
        waypointIndex: (i - 13) % wpList.length,
        waypoints: wpList,
        shirtColor: shirtColors[(i + 1) % shirtColors.length],
        pantsColor: pantsColors[i % pantsColors.length],
        skinTone: skinTones[i % skinTones.length],
        hairColor: hairColors[i % hairColors.length],
        scale: 0.96,
        gender: i % 2 === 0 ? 'female' : 'male',
        walkCycle: Math.random() * 10
      });
    }

    return list;
  }, [waypointsByZone]);

  useFrame((_, delta) => {
    if (!crowdGroupRef.current) return;

    npcs.forEach((npc, index) => {
      const child = crowdGroupRef.current?.children[index] as THREE.Group;
      if (!child) return;

      npc.stateTimer -= delta;

      if (npc.state === 'WALK') {
        const targetWp = npc.waypoints[npc.waypointIndex];
        const dx = targetWp.x - npc.x;
        const dz = targetWp.z - npc.z;
        const dist = Math.hypot(dx, dz);

        // Smooth elevation tracking along terrain
        npc.y = THREE.MathUtils.lerp(npc.y, targetWp.y, delta * 3.5);

        if (dist > 0.4) {
          const targetAngle = Math.atan2(dx, dz);
          let angleDiff = targetAngle - npc.rotationY;
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
          npc.rotationY += angleDiff * Math.min(1.0, delta * 4.5);

          const moveStep = Math.min(dist, npc.speed * delta);
          npc.x += Math.sin(npc.rotationY) * moveStep;
          npc.z += Math.cos(npc.rotationY) * moveStep;

          // Natural human limb movement during walking
          npc.walkCycle += delta * (npc.speed * 4.8);
          const stride = Math.sin(npc.walkCycle);
          const leftLeg = child.children[1] as THREE.Group;
          const rightLeg = child.children[2] as THREE.Group;
          const leftArm = child.children[3] as THREE.Group;
          const rightArm = child.children[4] as THREE.Group;
          const pelvis = child.children[0] as THREE.Group;

          if (leftLeg && rightLeg) {
            leftLeg.rotation.x = stride * 0.45;
            rightLeg.rotation.x = -stride * 0.45;
          }
          if (leftArm && rightArm) {
            leftArm.rotation.x = -stride * 0.35;
            rightArm.rotation.x = stride * 0.35;
          }
          if (pelvis) {
            pelvis.position.y = 1.0 + Math.abs(Math.sin(npc.walkCycle * 2.0)) * 0.03;
          }
        } else {
          // Arrived at destination waypoint -> Contextual state transition
          if (npc.zone === 'market') {
            npc.state = Math.random() > 0.5 ? 'EAT' : 'IDLE';
            npc.stateTimer = 5 + Math.random() * 5;
          } else if (npc.zone === 'temple') {
            npc.state = Math.random() > 0.4 ? 'PRAY' : 'IDLE';
            npc.stateTimer = 7 + Math.random() * 6;
          } else if (npc.zone === 'riverside') {
            npc.state = Math.random() > 0.5 ? 'PRAY' : 'IDLE';
            npc.stateTimer = 6 + Math.random() * 6;
          } else if (npc.zone === 'pageant') {
            npc.state = Math.random() > 0.5 ? 'CHEER' : 'PHOTO';
            npc.stateTimer = 8 + Math.random() * 6;
          }
          npc.waypointIndex = (npc.waypointIndex + 1) % npc.waypoints.length;
        }
      } else {
        // Idle / Pray / Cheer / Eat / Photo states
        if (npc.stateTimer <= 0) {
          npc.state = 'WALK';
        }

        const leftLeg = child.children[1] as THREE.Group;
        const rightLeg = child.children[2] as THREE.Group;
        const leftArm = child.children[3] as THREE.Group;
        const rightArm = child.children[4] as THREE.Group;
        const pelvis = child.children[0] as THREE.Group;

        if (leftLeg && rightLeg) {
          leftLeg.rotation.x = 0;
          rightLeg.rotation.x = 0;
        }
        if (pelvis) pelvis.position.y = 1.0;

        if (npc.state === 'CHEER') {
          // Cheering audience
          const cheerT = performance.now() * 0.008;
          child.lookAt(19.5, 1.8, 12);
          child.position.y = npc.y + Math.abs(Math.sin(cheerT * 4.0)) * 0.05;
          if (leftArm && rightArm) {
            leftArm.rotation.set(-1.4, 0, 0.35 + Math.sin(cheerT * 6.0) * 0.15);
            rightArm.rotation.set(-1.4, 0, -0.35 - Math.sin(cheerT * 6.0) * 0.15);
          }
        } else if (npc.state === 'PRAY') {
          // Thai Wai prayer
          if (leftArm && rightArm) {
            leftArm.rotation.set(-0.75, 0, 0.32);
            rightArm.rotation.set(-0.75, 0, -0.32);
          }
          if (pelvis) pelvis.rotation.x = 0.05;
        } else if (npc.state === 'EAT') {
          const eatT = performance.now() * 0.004;
          if (rightArm) rightArm.rotation.set(-1.1 + Math.sin(eatT) * 0.18, 0, -0.2);
          if (leftArm) leftArm.rotation.set(0, 0, 0.1);
        } else if (npc.state === 'PHOTO') {
          if (leftArm && rightArm) {
            leftArm.rotation.set(-1.25, 0, 0.2);
            rightArm.rotation.set(-1.25, 0, -0.2);
          }
        } else {
          if (leftArm && rightArm) {
            leftArm.rotation.set(0, 0, 0.08);
            rightArm.rotation.set(0, 0, -0.08);
          }
        }
      }

      // Root position: shoes touch ground without sinking
      child.position.set(npc.x, npc.y, npc.z);
      child.rotation.y = npc.rotationY;
    });
  });

  return (
    <group ref={crowdGroupRef}>
      {npcs.map((npc) => (
        <group
          key={npc.id}
          position={[npc.x, npc.y, npc.z]}
          scale={[npc.scale, npc.scale, npc.scale]}
        >
          {/* 
            LOCAL HIERARCHY:
            Shoes bottom touches local Y = 0.000!
            No floor penetration across any surface!
          */}

          {/* Index 0: Pelvis & Torso */}
          <group position={[0, 1.0, 0]}>
            {/* Torso & Shirt */}
            <mesh position={[0, 0.18, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.19, 0.52, 14]} />
              <meshStandardMaterial color={npc.shirtColor} roughness={0.65} metalness={0.05} />
            </mesh>
            {/* Shoulders */}
            <mesh position={[0, 0.40, 0]}>
              <boxGeometry args={[0.42, 0.10, 0.20]} />
              <meshStandardMaterial color={npc.shirtColor} roughness={0.65} />
            </mesh>
            {/* Neck */}
            <mesh position={[0, 0.49, 0]}>
              <cylinderGeometry args={[0.065, 0.075, 0.12, 12]} />
              <meshStandardMaterial color={npc.skinTone} roughness={0.55} />
            </mesh>
            {/* Head & Hair */}
            <group position={[0, 0.65, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.14, 16, 16]} />
                <meshStandardMaterial color={npc.skinTone} roughness={0.55} />
              </mesh>
              {/* Hair */}
              <mesh position={[0, 0.04, -0.02]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color={npc.hairColor} roughness={0.35} />
              </mesh>
              {/* Eyes */}
              {[-0.045, 0.045].map((ex, ei) => (
                <mesh key={ei} position={[ex, 0.02, 0.12]}>
                  <circleGeometry args={[0.015, 10]} />
                  <meshBasicMaterial color="#1E1B4B" />
                </mesh>
              ))}
            </group>
          </group>

          {/* Index 1: Left Leg (Hip at Y = 0.70, Calf down to Ankle, Shoe bottom at 0.000) */}
          <group position={[-0.10, 0.70, 0]}>
            <mesh position={[0, -0.32, 0]} castShadow>
              <cylinderGeometry args={[0.072, 0.055, 0.64, 10]} />
              <meshStandardMaterial color={npc.pantsColor} roughness={0.75} />
            </mesh>
            {/* Shoe (Extends from -0.64 to -0.70, bottom touches local Y = 0.000) */}
            <mesh position={[0, -0.67, 0.03]} castShadow>
              <boxGeometry args={[0.075, 0.06, 0.15]} />
              <meshStandardMaterial color="#0F172A" roughness={0.4} />
            </mesh>
          </group>

          {/* Index 2: Right Leg (Hip at Y = 0.70, Shoe bottom at 0.000) */}
          <group position={[0.10, 0.70, 0]}>
            <mesh position={[0, -0.32, 0]} castShadow>
              <cylinderGeometry args={[0.072, 0.055, 0.64, 10]} />
              <meshStandardMaterial color={npc.pantsColor} roughness={0.75} />
            </mesh>
            {/* Shoe */}
            <mesh position={[0, -0.67, 0.03]} castShadow>
              <boxGeometry args={[0.075, 0.06, 0.15]} />
              <meshStandardMaterial color="#0F172A" roughness={0.4} />
            </mesh>
          </group>

          {/* Index 3: Left Arm */}
          <group position={[-0.23, 1.35, 0]}>
            <mesh position={[0, -0.20, 0]} castShadow>
              <cylinderGeometry args={[0.040, 0.032, 0.40, 8]} />
              <meshStandardMaterial color={npc.shirtColor} />
            </mesh>
            {/* Hand */}
            <mesh position={[0, -0.44, 0]}>
              <boxGeometry args={[0.035, 0.06, 0.025]} />
              <meshStandardMaterial color={npc.skinTone} />
            </mesh>
          </group>

          {/* Index 4: Right Arm */}
          <group position={[0.23, 1.35, 0]}>
            <mesh position={[0, -0.20, 0]} castShadow>
              <cylinderGeometry args={[0.040, 0.032, 0.40, 8]} />
              <meshStandardMaterial color={npc.shirtColor} />
            </mesh>
            {/* Hand */}
            <mesh position={[0, -0.44, 0]}>
              <boxGeometry args={[0.035, 0.06, 0.025]} />
              <meshStandardMaterial color={npc.skinTone} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
};

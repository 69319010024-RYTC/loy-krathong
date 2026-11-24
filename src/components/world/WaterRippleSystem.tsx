import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface WaterRippleHandle {
  addRipple: (x: number, z: number) => void;
}

interface ActiveRipple {
  x: number;
  z: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
  alive: boolean;
}

const MAX_RIPPLES = 12;

export const WaterRippleSystem = forwardRef<WaterRippleHandle>((_, ref) => {
  const groupRef = useRef<THREE.Group>(null);
  const ripplesRef = useRef<ActiveRipple[]>(
    Array.from({ length: MAX_RIPPLES }, () => ({
      x: 0,
      z: 0,
      radius: 0.1,
      maxRadius: 4.5,
      opacity: 0,
      speed: 1.8,
      alive: false
    }))
  );

  useImperativeHandle(ref, () => ({
    addRipple: (x: number, z: number) => {
      // Find an inactive ripple slot
      const r = ripplesRef.current.find((item) => !item.alive) || ripplesRef.current[0];
      r.x = x;
      r.z = z;
      r.radius = 0.2;
      r.maxRadius = 5.0;
      r.opacity = 0.85;
      r.speed = 2.2;
      r.alive = true;
    }
  }));

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    ripplesRef.current.forEach((r, idx) => {
      const mesh = groupRef.current!.children[idx] as THREE.Mesh;
      if (!mesh) return;

      if (r.alive) {
        r.radius += r.speed * delta;
        r.opacity = Math.max(0, 0.85 * (1.0 - r.radius / r.maxRadius));

        mesh.position.set(r.x, 0, r.z);
        mesh.scale.set(r.radius, r.radius, 1);
        (mesh.material as THREE.MeshBasicMaterial).opacity = r.opacity;
        mesh.visible = r.opacity > 0.01;

        if (r.radius >= r.maxRadius || r.opacity <= 0.01) {
          r.alive = false;
          mesh.visible = false;
        }
      } else {
        mesh.visible = false;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, -0.36, 0]}>
      {Array.from({ length: MAX_RIPPLES }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
          <ringGeometry args={[0.85, 1.0, 32]} />
          <meshBasicMaterial
            color="#FEF08A"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
});

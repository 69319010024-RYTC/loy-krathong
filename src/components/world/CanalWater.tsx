import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const StylizedBrightWaterVertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;

  // Smooth multi-directional Gerstner wave function
  vec3 gerstnerWave(vec2 dir, float steepness, float wavelength, vec3 p, inout vec3 tangent, inout vec3 binormal) {
    float k = 2.0 * 3.14159265 / wavelength;
    float c = sqrt(9.8 / k);
    vec2 d = normalize(dir);
    float f = k * (dot(d, p.xz) - c * uTime * 0.4);
    float a = steepness / k;

    tangent += vec3(
      -d.x * d.x * (steepness * sin(f)),
      d.x * (steepness * cos(f)),
      -d.x * d.y * (steepness * sin(f))
    );
    binormal += vec3(
      -d.x * d.y * (steepness * sin(f)),
      d.y * (steepness * cos(f)),
      -d.y * d.y * (steepness * sin(f))
    );

    return vec3(
      d.x * (a * cos(f)),
      a * sin(f),
      d.y * (a * cos(f))
    );
  }

  void main() {
    vUv = uv;
    vec3 gridPoint = position;
    vec3 tangent = vec3(1.0, 0.0, 0.0);
    vec3 binormal = vec3(0.0, 0.0, 1.0);
    vec3 p = gridPoint;

    // 3 layered organic waves for smooth swelling
    p += gerstnerWave(vec2(1.0, 0.3), 0.15, 7.5, gridPoint, tangent, binormal);
    p += gerstnerWave(vec2(-0.5, 0.8), 0.10, 4.0, gridPoint, tangent, binormal);
    p += gerstnerWave(vec2(0.2, 0.9), 0.06, 2.2, gridPoint, tangent, binormal);

    vNormal = normalize(cross(binormal, tangent));
    vec4 worldPos = modelMatrix * vec4(p, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const StylizedBrightWaterFragmentShader = `
  uniform float uTime;
  uniform vec3 uDeepColor;      // Vibrant Azure Blue
  uniform vec3 uShallowColor;   // Luminous Cyan Aqua
  uniform vec3 uSkyColor;       // Bright Sky Blue
  uniform vec3 uTempleGold;     // Warm Gold reflection
  uniform vec3 uStageCyan;      // Stage reflection
  uniform vec3 uMoonColor;      // Moonlight
  uniform vec3 uCameraPos;

  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;

  void main() {
    vec3 viewDir = normalize(uCameraPos - vWorldPosition);
    vec3 normal = normalize(vNormal);

    // Smooth wave ripple normal distortion
    float waveDistortX = sin(vWorldPosition.x * 0.7 + uTime * 1.4) * 0.09 +
                         cos(vWorldPosition.z * 0.9 - uTime * 1.1) * 0.07;
    float waveDistortZ = cos(vWorldPosition.z * 0.6 + uTime * 1.2) * 0.09 +
                         sin(vWorldPosition.x * 0.8 + uTime * 1.5) * 0.07;
    normal = normalize(normal + vec3(waveDistortX, 0.0, waveDistortZ));

    // Smooth Optical Fresnel Factor
    float NdotV = max(dot(viewDir, normal), 0.0);
    float fresnel = pow(1.0 - NdotV, 3.0);

    // Depth Color Gradient (Bright, luminous, inviting teal & azure tones)
    float distFromCenter = abs(vWorldPosition.x) / 18.0;
    float depthFactor = smoothstep(0.0, 1.0, distFromCenter);
    vec3 waterBody = mix(uDeepColor, uShallowColor, depthFactor * 0.75 + 0.15);

    // Constant luminous base glow so water is NEVER pitch black!
    waterBody += vec3(0.04, 0.22, 0.38);

    // 1. Soft Elongated Moonlight Specular Highlight
    vec3 moonDir = normalize(vec3(-0.35, 0.75, -0.55));
    vec3 halfMoon = normalize(viewDir + moonDir);
    float moonSpec = pow(max(dot(normal, halfMoon), 0.0), 75.0);
    vec3 moonStreak = uMoonColor * moonSpec * 2.5;

    // 2. Warm Golden Light Reflections from Lanterns & Temple (Left Bank: x < -2.0)
    vec3 templeDir = normalize(vec3(-1.0, 0.4, -0.2));
    vec3 halfTemple = normalize(viewDir + templeDir);
    float templeSpec = pow(max(dot(normal, halfTemple), 0.0), 30.0);
    float templeProximity = smoothstep(6.0, -16.0, vWorldPosition.x);
    vec3 templeReflection = uTempleGold * templeSpec * templeProximity * 2.2;

    // 3. Pageant Stage Blue-Cyan LED Light Reflections (Right Bank: x > 2.0)
    vec3 stageDir = normalize(vec3(1.0, 0.4, 0.2));
    vec3 halfStage = normalize(viewDir + stageDir);
    float stageSpec = pow(max(dot(normal, halfStage), 0.0), 28.0);
    float stageProximity = smoothstep(-2.0, 18.0, vWorldPosition.x) * smoothstep(60.0, -20.0, vWorldPosition.z);
    float stagePulse = 0.8 + 0.2 * sin(uTime * 2.0 + vWorldPosition.z * 0.15);
    vec3 stageReflection = uStageCyan * stageSpec * stageProximity * stagePulse * 2.5;

    // 4. Luminous Wave Foam Crests along shoreline
    float shoreEdge = smoothstep(16.2, 17.8, abs(vWorldPosition.x));
    vec3 shoreFoam = vec3(0.75, 0.95, 1.0) * shoreEdge * (0.4 + 0.2 * sin(uTime * 3.0 + vWorldPosition.z));

    // Combine into bright, magical water surface
    vec3 finalColor = waterBody;
    finalColor = mix(finalColor, uSkyColor, fresnel * 0.7);
    finalColor += moonStreak;
    finalColor += templeReflection;
    finalColor += stageReflection;
    finalColor += shoreFoam;

    gl_FragColor = vec4(finalColor, 0.96);
  }
`;

interface CanalWaterProps {
  width?: number;
  length?: number;
}

export const CanalWater: React.FC<CanalWaterProps> = ({ width = 36, length = 260 }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Bright, luminous, inviting water color uniforms!
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uDeepColor: { value: new THREE.Color('#0284C7') },     // Vibrant Azure Blue (Never pitch black!)
    uShallowColor: { value: new THREE.Color('#38BDF8') },  // Luminous Sky Blue
    uSkyColor: { value: new THREE.Color('#06B6D4') },      // Cyan Sheen
    uTempleGold: { value: new THREE.Color('#FBBF24') },    // Luminous Gold reflection
    uStageCyan: { value: new THREE.Color('#00F2FE') },     // Stage Aqua-Cyan reflection
    uMoonColor: { value: new THREE.Color('#E0F2FE') },      // Bright Moonlight
    uCameraPos: { value: new THREE.Vector3(0, 10, 20) }
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.uTime.value = state.clock.getElapsedTime();
      uniforms.uCameraPos.value.copy(state.camera.position);
    }
  });

  return (
    <group position={[0, -0.4, 0]}>
      {/* High-End Luminous Stylized Water Mesh */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length, 48, 96]} />
        <shaderMaterial
          vertexShader={StylizedBrightWaterVertexShader}
          fragmentShader={StylizedBrightWaterFragmentShader}
          uniforms={uniforms}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Canal Stone Embankments */}
      {/* West Bank (Temple & Riverside Steps) */}
      <group position={[-width / 2 - 1.2, 0.8, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[2.5, 3.2, length]} />
          <meshStandardMaterial color="#334155" roughness={0.7} metalness={0.15} />
        </mesh>
        <mesh position={[1.2, 1.62, 0]}>
          <boxGeometry args={[0.3, 0.15, length]} />
          <meshStandardMaterial color="#B45309" roughness={0.4} metalness={0.6} />
        </mesh>
      </group>

      {/* East Bank (Pageant Stage & Market) */}
      <group position={[width / 2 + 1.2, 0.8, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[2.5, 3.2, length]} />
          <meshStandardMaterial color="#2B3648" roughness={0.7} metalness={0.15} />
        </mesh>
        <mesh position={[-1.2, 1.62, 0]}>
          <boxGeometry args={[0.3, 0.15, length]} />
          <meshStandardMaterial color="#B45309" roughness={0.4} metalness={0.6} />
        </mesh>
      </group>
    </group>
  );
};

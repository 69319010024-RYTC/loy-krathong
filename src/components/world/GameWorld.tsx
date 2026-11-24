import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { WorldEnvironment } from './WorldEnvironment';
import { CanalWater } from './CanalWater';
import { RiversideStairs } from './RiversideStairs';
import { PageantStage } from './PageantStage';
import { ContestantSystem } from './ContestantSystem';
import { ThaiTemple } from './ThaiTemple';
import { HauntedCemetery } from './HauntedCemetery';
import { FestivalMarket } from './FestivalMarket';
import { CrowdSystem } from './CrowdSystem';
import { KrathongFloatingSystem } from './KrathongFloatingSystem';
import { PlayerCameraController } from './PlayerCameraController';
import { FireworksSystem, FireworksHandle } from './FireworksSystem';
import { WaterRippleSystem, WaterRippleHandle } from './WaterRippleSystem';
import { CameraViewMode, ActiveKrathong, Contestant, QualityLevel } from '../../types/game';

interface GameWorldProps {
  viewMode: CameraViewMode;
  krathongs: ActiveKrathong[];
  fireworksRef: React.RefObject<FireworksHandle>;
  rippleRef: React.RefObject<WaterRippleHandle>;
  quality: QualityLevel;
  onCurrentContestantChange?: (c: Contestant) => void;
  onPositionChange?: (x: number, z: number) => void;
}

export const GameWorld: React.FC<GameWorldProps> = ({
  viewMode,
  krathongs,
  fireworksRef,
  rippleRef,
  quality,
  onCurrentContestantChange,
  onPositionChange
}) => {
  const dpr = 1.75;

  return (
    <div className="smooth-webgl" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Canvas
        shadows={false}
        dpr={dpr as any}
        camera={{ position: [0, 8, 25], fov: 55, near: 0.1, far: 300 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.12
        }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = false;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.18;
        }}
      >
        <Suspense fallback={null}>
          <WorldEnvironment />
          <CanalWater />
          <RiversideStairs />
          <PageantStage />
          <ContestantSystem onCurrentContestantChange={onCurrentContestantChange} />
          <ThaiTemple />
          <HauntedCemetery />
          <FestivalMarket />
          <CrowdSystem />
          <KrathongFloatingSystem krathongs={krathongs} />
          <WaterRippleSystem ref={rippleRef} />
          <FireworksSystem ref={fireworksRef} />
          <PlayerCameraController viewMode={viewMode} onPositionChange={onPositionChange} />
        </Suspense>
      </Canvas>
    </div>
  );
};


import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CameraViewMode } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';

interface PlayerCameraControllerProps {
  viewMode: CameraViewMode;
  onPositionChange?: (x: number, z: number) => void;
  onViewModeChange?: (mode: CameraViewMode) => void;
}

export const PlayerCameraController: React.FC<PlayerCameraControllerProps> = ({
  viewMode,
  onPositionChange,
  onViewModeChange
}) => {
  const { camera, gl } = useThree();
  const keys = useRef<{ [key: string]: boolean }>({});
  
  // Current 3D camera and target coordinates
  const playerPos = useRef(new THREE.Vector3(19.5, 5.0, 26)); // Default starting near pageant stage
  const currentCamPos = useRef(new THREE.Vector3(19.5, 5.0, 26));
  const currentLookAt = useRef(new THREE.Vector3(19.5, 2.5, 12));

  // Mouse / Touch 360-Degree Free-Look Angles
  const yaw = useRef(Math.PI); // Facing north towards stage
  const pitch = useRef(-0.10);
  const zoomDistance = useRef(1.0); // Zoom multiplier
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const touchStartDist = useRef(0);

  // Track active mode and preset base positions
  const activeModeRef = useRef(viewMode);

  useEffect(() => {
    activeModeRef.current = viewMode;

    // Set intuitive initial look direction when switching preset camera view modes
    if (viewMode === 'pageant') {
      playerPos.current.set(19.5, 4.8, 25.5);
      yaw.current = Math.PI; // Look straight down the catwalk runway
      pitch.current = -0.08;
    } else if (viewMode === 'riverside') {
      playerPos.current.set(-14, 3.2, 4);
      yaw.current = Math.PI * 0.45; // Overlooking canal & floating krathongs
      pitch.current = -0.15;
    } else if (viewMode === 'temple') {
      playerPos.current.set(-22, 5.5, 12);
      yaw.current = -Math.PI * 0.65; // Looking at golden temple facade
      pitch.current = 0.05;
    } else if (viewMode === 'cemetery') {
      playerPos.current.set(-36, 4.2, -26);
      yaw.current = -Math.PI * 0.75; // Looking into mystical cemetery
      pitch.current = -0.05;
    }
  }, [viewMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      // If user presses movement keys while in a preset view, switch to exploration so they can freely roam!
      if (['KeyW', 'KeyS', 'KeyA', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyQ', 'KeyE'].includes(e.code)) {
        if (activeModeRef.current !== 'exploration' && onViewModeChange) {
          onViewModeChange('exploration');
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    // Free 360 Drag Look in ALL modes!
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - previousMouse.current.x;
      const dy = e.clientY - previousMouse.current.y;
      previousMouse.current = { x: e.clientX, y: e.clientY };

      // Free 360-degree rotation across yaw (no limit) & clamped pitch (-85° to +85°)
      yaw.current -= dx * 0.0045;
      pitch.current -= dy * 0.0035;
      pitch.current = THREE.MathUtils.clamp(pitch.current, -1.45, 1.45);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    // Smooth Mouse Wheel Zoom In / Out
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
      zoomDistance.current = THREE.MathUtils.clamp(zoomDistance.current * zoomFactor, 0.4, 2.5);
      
      // Also gently move camera forward/backward along view vector
      const forward = new THREE.Vector3(
        Math.sin(yaw.current) * Math.cos(pitch.current),
        Math.sin(pitch.current),
        -Math.cos(yaw.current) * Math.cos(pitch.current)
      );
      const moveDelta = e.deltaY > 0 ? -1.5 : 1.5;
      playerPos.current.addScaledVector(forward, moveDelta);
      playerPos.current.y = THREE.MathUtils.clamp(playerPos.current.y, 1.5, 35.0);
    };

    // Mobile & Tablet Touch Support (Pinch-to-zoom + 360 Pan)
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        previousMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        isDragging.current = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDist.current = Math.hypot(dx, dy);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging.current) {
        const dx = e.touches[0].clientX - previousMouse.current.x;
        const dy = e.touches[0].clientY - previousMouse.current.y;
        previousMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        yaw.current -= dx * 0.0055;
        pitch.current -= dy * 0.0045;
        pitch.current = THREE.MathUtils.clamp(pitch.current, -1.45, 1.45);
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const delta = (dist - touchStartDist.current) * 0.01;
        touchStartDist.current = dist;

        const forward = new THREE.Vector3(
          Math.sin(yaw.current) * Math.cos(pitch.current),
          Math.sin(pitch.current),
          -Math.cos(yaw.current) * Math.cos(pitch.current)
        );
        playerPos.current.addScaledVector(forward, delta * 2.0);
        playerPos.current.y = THREE.MathUtils.clamp(playerPos.current.y, 1.5, 35.0);
      }
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    const canvas = gl.domElement;
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [gl, onViewModeChange]);

  useFrame((_, delta) => {
    // 360-degree Camera-Relative Movement
    const moveSpeed = 14.0 * delta;

    // Movement vectors relative to current camera yaw angle
    const forward = new THREE.Vector3(Math.sin(yaw.current), 0, -Math.cos(yaw.current));
    const right = new THREE.Vector3(Math.cos(yaw.current), 0, Math.sin(yaw.current));

    // WASD and Arrow Keys Movement in all directions
    if (keys.current['KeyW'] || keys.current['ArrowUp']) {
      playerPos.current.addScaledVector(forward, moveSpeed);
    }
    if (keys.current['KeyS'] || keys.current['ArrowDown']) {
      playerPos.current.addScaledVector(forward, -moveSpeed);
    }
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) {
      playerPos.current.addScaledVector(right, -moveSpeed);
    }
    if (keys.current['KeyD'] || keys.current['ArrowRight']) {
      playerPos.current.addScaledVector(right, moveSpeed);
    }

    // Vertical Camera Elevation (Q: Down, E or Space: Up)
    if (keys.current['KeyE'] || keys.current['Space']) {
      playerPos.current.y += moveSpeed * 0.8;
    }
    if (keys.current['KeyQ'] || keys.current['ShiftLeft']) {
      playerPos.current.y -= moveSpeed * 0.8;
    }

    // World exploration boundaries (generous festival area)
    playerPos.current.x = THREE.MathUtils.clamp(playerPos.current.x, -65, 65);
    playerPos.current.z = THREE.MathUtils.clamp(playerPos.current.z, -65, 85);
    playerPos.current.y = THREE.MathUtils.clamp(playerPos.current.y, 1.6, 40.0);

    // Calculate look target vector from yaw & pitch
    const lookDist = 18.0;
    const lx = playerPos.current.x + Math.sin(yaw.current) * Math.cos(pitch.current) * lookDist;
    const ly = playerPos.current.y + Math.sin(pitch.current) * lookDist;
    const lz = playerPos.current.z - Math.cos(yaw.current) * Math.cos(pitch.current) * lookDist;

    // Smooth Lerp Camera Transition
    currentCamPos.current.lerp(playerPos.current, delta * 6.0);
    currentLookAt.current.lerp(new THREE.Vector3(lx, ly, lz), delta * 7.0);

    camera.position.copy(currentCamPos.current);
    camera.lookAt(currentLookAt.current);

    // Spatial sound & HUD notification
    soundManager.updateSpatialZone(camera.position.x, camera.position.z);
    if (onPositionChange) {
      onPositionChange(camera.position.x, camera.position.z);
    }
  });

  return null;
};

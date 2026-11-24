import React, { useState, useCallback, useRef } from 'react';
import { GameWorld } from './components/world/GameWorld';
import { MainMenu } from './components/ui/MainMenu';
import { HUD } from './components/ui/HUD';
import { KrathongSelectorUI } from './components/ui/KrathongSelectorUI';
import { FortuneCardUI } from './components/ui/FortuneCardUI';
import { FestivalMapModal } from './components/ui/FestivalMapModal';
import { CameraViewMode, ActiveKrathong, FortuneCardData, Contestant, QualityLevel } from './types/game';
import { FireworksHandle } from './components/world/FireworksSystem';
import { WaterRippleHandle } from './components/world/WaterRippleSystem';
import { FORTUNE_DECK } from './data/fortuneCards';
import { KRATHONG_COLLECTION } from './data/krathongs';
import { CONTESTANTS } from './data/contestants';
import { soundManager } from './audio/SoundManager';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [viewMode, setViewMode] = useState<CameraViewMode>('exploration');
  const [quality, setQuality] = useState<QualityLevel>('high');
  const [isMuted, setIsMuted] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState<FortuneCardData | null>(null);
  const [currentContestant, setCurrentContestant] = useState<Contestant | null>(CONTESTANTS[0]);

  const fireworksRef = useRef<FireworksHandle>(null);
  const rippleRef = useRef<WaterRippleHandle>(null);
  const lastCardIdRef = useRef<number | null>(null);

  // Initial ambient floating krathongs along the river (fixed pool to prevent memory leaks)
  const [krathongs, setKrathongs] = useState<ActiveKrathong[]>(() => {
    const list: ActiveKrathong[] = [];
    const types = KRATHONG_COLLECTION.map(k => k.id);
    for (let i = 0; i < 20; i++) {
      list.push({
        id: `ambient-${i}`,
        typeId: types[i % types.length],
        x: (Math.random() - 0.5) * 16,
        y: -0.4,
        z: -85 + i * 8.5,
        speed: 0.8 + Math.random() * 0.4,
        swayOffset: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.15,
        spawnTime: 0,
        candleFlicker: Math.random()
      });
    }
    return list;
  });

  const handleStartGame = () => {
    soundManager.init();
    soundManager.resume();
    setIsGameStarted(true);
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
  };

  const handleReleaseKrathong = useCallback((typeId: string, wishText: string) => {
    soundManager.playKrathongReleaseSound();

    // 1. Transition camera smoothly to riverside view to observe release
    setViewMode('riverside');

    // 2. Trigger expanding golden water ripples at release location
    rippleRef.current?.addRipple(-8.5, 0);
    setTimeout(() => {
      rippleRef.current?.addRipple(-8.5, 0.4);
    }, 280);

    // 3. Spawn new krathong right at riverside pier (X: -8.5, Z: 0)
    const newKrathong: ActiveKrathong = {
      id: `player-krathong-${Date.now()}`,
      typeId,
      x: -8.5,
      y: -0.4,
      z: 0,
      speed: 1.1,
      swayOffset: Math.random() * Math.PI * 2,
      rotation: 0,
      rotSpeed: 0.08,
      spawnTime: performance.now() / 1000,
      candleFlicker: 1.0,
      wishText
    };

    setKrathongs((prev) => [newKrathong, ...prev.slice(0, 30)]);

    // 4. Cinematic observation window: 1.8 seconds of watching it float before Tarot reveal
    setTimeout(() => {
      let candidate = FORTUNE_DECK[Math.floor(Math.random() * FORTUNE_DECK.length)];
      if (candidate.id === lastCardIdRef.current && FORTUNE_DECK.length > 1) {
        candidate = FORTUNE_DECK[(candidate.id + 1) % FORTUNE_DECK.length];
      }
      lastCardIdRef.current = candidate.id;
      soundManager.playCardFlipSound();
      setCurrentCard(candidate);
    }, 1800);
  }, []);

  // Launch fireworks directly in WebGL without React re-renders!
  const handleLaunchFireworks = useCallback(() => {
    soundManager.playFireworkSound();

    const colors = ['#F59E0B', '#EC4899', '#38BDF8', '#10B981', '#A855F7', '#F43F5E'];
    const burstColor = colors[Math.floor(Math.random() * colors.length)];
    const burstX = (Math.random() - 0.5) * 20;
    const burstY = 32 + Math.random() * 10;
    const burstZ = -10 + (Math.random() - 0.5) * 35;

    fireworksRef.current?.launchBurst(burstX, burstY, burstZ, burstColor);
  }, []);

  // Cheer & Vote for Contestant
  const handleCheerContestant = useCallback(() => {
    soundManager.playCheerSound();
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#EC4899', '#FBBF24', '#C084FC']
    });
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* 3D Game World Canvas */}
      <GameWorld
        viewMode={viewMode}
        krathongs={krathongs}
        fireworksRef={fireworksRef}
        rippleRef={rippleRef}
        quality={quality}
        onCurrentContestantChange={setCurrentContestant}
      />

      {/* Main Menu Overlay (shown before starting) */}
      {!isGameStarted && (
        <MainMenu
          onStart={handleStartGame}
          quality={quality}
          onQualityChange={setQuality}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* In-Game HUD UI (shown when playing) */}
      {isGameStarted && (
        <>
          <HUD
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onOpenKrathongSelector={() => setIsSelectorOpen(true)}
            onOpenMenu={() => setIsGameStarted(false)}
            onOpenMap={() => setIsMapOpen(true)}
            onLaunchFireworks={handleLaunchFireworks}
            onCheerContestant={handleCheerContestant}
            currentContestant={currentContestant}
            krathongCount={krathongs.length}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            quality={quality}
            onQualityChange={setQuality}
          />

          {/* 3D Interactive Krathong Selector Dialog */}
          <KrathongSelectorUI
            isOpen={isSelectorOpen}
            onClose={() => setIsSelectorOpen(false)}
            onRelease={handleReleaseKrathong}
          />

          {/* Gypsy Tarot Card Reveal Modal */}
          <FortuneCardUI
            card={currentCard}
            onClose={() => setCurrentCard(null)}
          />

          {/* Festival Spatial Map Modal */}
          <FestivalMapModal
            isOpen={isMapOpen}
            onClose={() => setIsMapOpen(false)}
            onSelectZone={setViewMode}
            currentZone={viewMode}
          />
        </>
      )}
    </div>
  );
};

export default App;

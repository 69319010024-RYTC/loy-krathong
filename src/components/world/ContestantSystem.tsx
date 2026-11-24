import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { CONTESTANTS } from '../../data/contestants';
import { Contestant } from '../../types/game';
import { StylizedFemaleContestant } from '../characters/StylizedFemaleContestant';

interface ContestantSystemProps {
  onCurrentContestantChange?: (contestant: Contestant) => void;
}

export const ContestantSystem: React.FC<ContestantSystemProps> = ({
  onCurrentContestantChange
}) => {
  const [baseIndex, setBaseIndex] = useState(0);
  const cycleTimerRef = useRef(0);
  const cycleDuration = 24.0;

  useFrame((_, delta) => {
    cycleTimerRef.current += delta;
    if (cycleTimerRef.current >= cycleDuration) {
      cycleTimerRef.current = 0;
      setBaseIndex((prev) => (prev + 1) % CONTESTANTS.length);
    }
  });

  // 6 Active Contestants walking simultaneously in rhythmic Miss Grand choreography
  const activeCount = 6;
  const activeContestants = Array.from({ length: activeCount }).map((_, i) => {
    const cIndex = (baseIndex + i) % CONTESTANTS.length;
    return {
      contestant: CONTESTANTS[cIndex],
      phaseOffset: (i / activeCount),
      // Alternate lanes: even indices walk forward on Lane A, odd indices walk on Lane B
      laneOffset: 1.25,
      key: `contestant-${cIndex}-${i}`
    };
  });

  return (
    <group>
      {activeContestants.map((entry) => (
        <StylizedFemaleContestant
          key={entry.key}
          contestant={entry.contestant}
          phaseOffset={entry.phaseOffset}
          laneOffset={entry.laneOffset}
          onFeaturedApex={onCurrentContestantChange}
        />
      ))}
    </group>
  );
};

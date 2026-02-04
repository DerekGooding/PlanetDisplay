import { useState, useCallback } from 'react';
import { planets } from '../data/planets';

export interface OrbitalParameters {
  orbitalRadius: number;
  orbitalSpeed: number;
  initialOrbitalAngle: number;
  planetSize: number;
  rotationSpeed: number;
}

export function useOrbitalSystem() {
  const generateOrbitalParameters = useCallback(() => {
    return planets.map((_, index) => {
      const baseOrbitalRadius = 25 + index * 10;
      const orbitalRadius = baseOrbitalRadius + Math.random() * 15;

      const basePlanetSize = 2;
      const planetSize = basePlanetSize * (1 + (Math.random() * 1.0 - 0.5));

      const rotationSpeed = 0.0001 + Math.random() * 0.0005;

      return {
        orbitalRadius,
        orbitalSpeed: 0.01 + Math.random() * 0.03,
        initialOrbitalAngle: Math.random() * Math.PI * 2,
        planetSize,
        rotationSpeed,
      };
    });
  }, []);

  const [orbitalParameters, setOrbitalParameters] = useState<OrbitalParameters[]>(() => generateOrbitalParameters());

  const regenerateOrbitalSystem = useCallback(() => {
    setOrbitalParameters(generateOrbitalParameters());
  }, [generateOrbitalParameters]);

  return { orbitalParameters, regenerateOrbitalSystem };
}

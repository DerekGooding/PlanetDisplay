import { useState, useCallback } from 'react';
import { Planet as PlanetModel } from './models/Planet';
import { planets } from './data/planets';

import NavigationButtons from './components/ui/NavigationButtons';
import HoverPlanetPanel from './components/ui/HoverPlanetPanel';
import CameraHelp from './components/ui/CameraHelp';
import PlanetCanvas from './components/PlanetCanvas';

import { useOrbitalSystem } from './systems/useOrbitalSystem';
import { useTextureSystem } from './systems/useTextureSystem';

export default function App() {
  const [targetPlanetIndex, setTargetPlanetIndex] = useState(0);
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetModel | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraLocked, setIsCameraLocked] = useState(true);

  const { orbitalParameters, regenerateOrbitalSystem } = useOrbitalSystem();
  const { assignedTextures, randomizeTextures } = useTextureSystem();

  const handlePointerOver = useCallback((planet: PlanetModel) => {
    setHoveredPlanet(planet);
  }, []);

  const handlePointerOut = useCallback(() => {
    setHoveredPlanet(null);
  }, []);

  const nextPlanet = useCallback(() => {
    setTargetPlanetIndex((prevIndex) => (prevIndex + 1) % planets.length);
  }, []);

  const prevPlanet = useCallback(() => {
    setTargetPlanetIndex((prevIndex) => (prevIndex - 1 + planets.length) % planets.length);
  }, []);

  const handleRandomizeSystem = useCallback(() => {
    randomizeTextures();
    regenerateOrbitalSystem();
  }, [randomizeTextures, regenerateOrbitalSystem]);

  const handleResetView = useCallback(() => {
    setTargetPlanetIndex(0);
    setIsCameraLocked(true);
    handleRandomizeSystem();
  }, [handleRandomizeSystem]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <NavigationButtons
        onPrevPlanet={prevPlanet}
        onNextPlanet={nextPlanet}
        onResetView={handleResetView}
        onToggleScan={() => setIsScanning(!isScanning)}
        onToggleCameraLock={() => setIsCameraLocked(!isCameraLocked)}
        onRandomizeSystem={handleRandomizeSystem}
        isScanning={isScanning}
        isCameraLocked={isCameraLocked}
      />
      <CameraHelp isCameraLocked={isCameraLocked} />
      <HoverPlanetPanel hoveredPlanet={hoveredPlanet} />

      <PlanetCanvas
        isCameraLocked={isCameraLocked}
        targetPlanetIndex={targetPlanetIndex}
        orbitalParameters={orbitalParameters}
        assignedTextures={assignedTextures}
        hoveredPlanet={hoveredPlanet}
        isScanning={isScanning}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
    </div>
  );
}

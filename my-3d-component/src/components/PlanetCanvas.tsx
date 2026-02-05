import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Selection, EffectComposer, Outline } from '@react-three/postprocessing';
import { Planet as PlanetModel } from '../models/Planet';
import PlanetComponent from './scene/Planet';
import Star from './scene/Star';
import OrbitRing from './scene/OrbitRing';
import { useCameraFollow } from '../systems/useCameraFollow';
import type { AssignedTextures } from '../systems/useTextureSystem';
import type { OrbitalParameters } from '../systems/useOrbitalSystem';
import { planets } from '../data/planets';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'; // Import OrbitControlsImpl type

export interface PlanetCanvasProps {
  isCameraLocked: boolean;
  targetPlanetIndex: number;
  orbitalParameters: OrbitalParameters[];
  assignedTextures: AssignedTextures;
  hoveredPlanet: PlanetModel | null;
  isScanning: boolean;
  onPointerOver: (planet: PlanetModel) => void;
  onPointerOut: () => void;
}

function PlanetCanvas({
  isCameraLocked,
  targetPlanetIndex,
  orbitalParameters,
  assignedTextures,
  hoveredPlanet,
  isScanning,
  onPointerOver,
  onPointerOut,
}: PlanetCanvasProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null!); // Define controlsRef here
  const { newAssignedPlanetTextures, newAssignedCloudTexture } = assignedTextures;

  // Nested component to call useCameraFollow within the Canvas context
  const CameraFollower = () => {
    useCameraFollow(controlsRef, isCameraLocked, targetPlanetIndex, orbitalParameters);
    return null; // This component doesn't render anything visually
  };

  return (
    <Canvas camera={{ position: [0, 20, 30], fov: 60 }}>
      <color attach="background" args={['#333']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={100} decay={2} color="white" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      <Star />

      <CameraFollower /> {/* Render the CameraFollower component inside Canvas */}

      <Selection>
        <EffectComposer multisampling={8} autoClear={false}>
          <Outline blur visibleEdgeColor={0xffff00} edgeStrength={100} width={1000} selectionLayer={10} />
        </EffectComposer>

        {planets.map((planet, index) => {
          if (!orbitalParameters[index] || !newAssignedPlanetTextures[planet.id]) return null;
          const params = orbitalParameters[index];
          return (
            <PlanetComponent
              key={planet.id}
              planet={planet}
              planetTexturePath={newAssignedPlanetTextures[planet.id].texturePath}
              normalMapPath={newAssignedPlanetTextures[planet.id].normalMapPath} // Pass normal map path
              cloudTexturePath={newAssignedCloudTexture}
              onPointerOver={onPointerOver}
              onPointerOut={onPointerOut}
              isHovered={hoveredPlanet?.id === planet.id}
              isScanning={isScanning}
              index={index}
              targetPlanetIndex={targetPlanetIndex}
              orbitalRadius={params.orbitalRadius}
              orbitalSpeed={params.orbitalSpeed}
              initialOrbitalAngle={params.initialOrbitalAngle}
              planetSize={params.planetSize}
              rotationSpeed={params.rotationSpeed}
            />
          );
        })}

        {planets.map((planet, index) => {
            if (!orbitalParameters[index]) return null;
            const params = orbitalParameters[index];
            return (
              hoveredPlanet?.id === planet.id && <OrbitRing key={`orbit-${planet.id}`} orbitalRadius={params.orbitalRadius} />
            );
        })}
      </Selection>

      <OrbitControls
        ref={controlsRef}
        enableRotate={!isCameraLocked}
        enablePan={!isCameraLocked}
        enableZoom={true}
      />
    </Canvas>
  );
}

export default PlanetCanvas;

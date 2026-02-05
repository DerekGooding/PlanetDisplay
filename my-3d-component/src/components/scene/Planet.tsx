import { useState, useEffect, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Select } from '@react-three/postprocessing';
import * as THREE from 'three';
import { TextureLoader, Texture, RepeatWrapping } from 'three';
import { Planet as PlanetModel } from '../../models/Planet';
import ScanMaterialComponent from '../ScanMaterial';
// @ts-expect-error TS6133: 'OptionalNormalMapLoader' is declared but its value is never read.
import { OptionalNormalMapLoader } from '../OptionalNormalMapLoader'; // NEW IMPORT

// Component for a textured sphere
function TexturedSphere({ texturePath, normalMapPath, isScanning, planetSize }: { texturePath: string; normalMapPath?: string; isScanning: boolean; planetSize: number }) {
  // REMOVED: const _ = OptionalNormalMapLoader;
  const [localScanProgress, setLocalScanProgress] = useState(0);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!); // NEW REF

  const texture = useLoader(TextureLoader, texturePath);
  const [normalMap, setNormalMap] = useState<Texture | null>(null);

  // Apply main texture settings
  useEffect(() => {
    if (texture) {
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;
      texture.repeat.set(1, 1);
      texture.needsUpdate = true;
    }
  }, [texture]); // Re-run when main texture changes

  // NEW useEffect: Reset normalMap when normalMapPath becomes falsy
  useEffect(() => {
    if (!normalMapPath) {
      setNormalMap(null);
    }
  }, [normalMapPath, setNormalMap]); // setNormalMap is a stable function reference
  // NEW useEffect: Directly assign normalMap to material
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.normalMap = normalMap;
      materialRef.current.normalScale = normalMap ? new THREE.Vector2(0.5, 0.5) : new THREE.Vector2(1, 1); // Ensure default scale when no normal map
      materialRef.current.needsUpdate = true; // Essential to signal Three.js to re-render material
    }
  }, [normalMap]); // Re-run when normalMap changes

  useFrame((_state, delta) => {
    if (isScanning) {
      setLocalScanProgress((prev) => (prev + delta * 0.1) % 2);
    } else {
      setLocalScanProgress(0);
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[planetSize, 32, 32]} />
      {texture ? (
        isScanning ? (
          <ScanMaterialComponent map={texture} scanProgress={localScanProgress} isScanning={isScanning} scanLineColor={new THREE.Color(0.0, 1.0, 0.0)} />
        ) : (
          <meshStandardMaterial 
            ref={materialRef} // ASSIGN REF
            map={texture} 
            // normalMap={normalMap} // REMOVED
            // normalScale={normalMap ? new THREE.Vector2(2, 2) : undefined} // REMOVED
          />
        )
      ) : (
        <meshStandardMaterial color="blue" wireframe />
      )}
    </mesh>
  );
}

// Component for rendering clouds
function CloudSphere({ texturePath, isParentPlanetScanning, planetSize }: { texturePath: string; isParentPlanetScanning: boolean; planetSize: number }) {
  const [texture, setTexture] = useState<Texture | null>(null);
  const meshRef = useRef<THREE.Mesh>(null!);

  useEffect(() => {
    if (!texturePath) return;

    const loader = new TextureLoader();
    loader.load(
      texturePath,
      (loadedTexture) => {
        loadedTexture.wrapS = RepeatWrapping;
        loadedTexture.wrapT = RepeatWrapping;
        loadedTexture.repeat.set(1, 1);
        loadedTexture.needsUpdate = true;
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        console.error('Error loading cloud texture:', error);
      }
    );
  }, [texturePath]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  if (isParentPlanetScanning) {
    return null;
  }

  return (
    <mesh position={[0, 0, 0]} ref={meshRef}>
      <sphereGeometry args={[planetSize + 0.03, 32, 32]} />
      {texture ? (
        <meshStandardMaterial
          map={texture}
          transparent
          opacity={0.75}
          alphaTest={0.01}
          color={0xffffff}
        />
      ) : (
        <meshStandardMaterial color="lightgray" wireframe />
      )}
    </mesh>
  );
}

export interface PlanetComponentProps {
    planet: PlanetModel;
    planetTexturePath: string;
    normalMapPath?: string; // Add this line
    cloudTexturePath: string;
    onPointerOver: (planet: PlanetModel) => void;
    onPointerOut: () => void;
    isHovered: boolean;
    isScanning: boolean;
    index: number;
    targetPlanetIndex: number;
    orbitalRadius: number;
    orbitalSpeed: number;
    initialOrbitalAngle: number;
    planetSize: number;
    rotationSpeed: number;
}

function PlanetComponent({
  planet,
  planetTexturePath,
  normalMapPath, // Add this line
  cloudTexturePath,
  onPointerOver,
  onPointerOut,
  isHovered,
  isScanning,
  index,
  targetPlanetIndex,
  orbitalRadius,
  orbitalSpeed,
  initialOrbitalAngle,
  planetSize,
  rotationSpeed
}: PlanetComponentProps) {
  const isTargetPlanet = index === targetPlanetIndex;
  const planetRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (planetRef.current) {
      const angle = initialOrbitalAngle + clock.getElapsedTime() * orbitalSpeed;
      planetRef.current.position.x = orbitalRadius * Math.sin(angle);
      planetRef.current.position.z = orbitalRadius * Math.cos(angle);
      planetRef.current.rotation.y += rotationSpeed; // Self-rotation
    }
  });

  return (
    <Select enabled={isHovered}>
      <group
        ref={planetRef}
        onPointerOver={() => onPointerOver(planet)}
        onPointerOut={onPointerOut}
      >
        <TexturedSphere texturePath={planetTexturePath} normalMapPath={normalMapPath} isScanning={isScanning && isTargetPlanet} planetSize={planetSize} />
        <CloudSphere texturePath={cloudTexturePath} isParentPlanetScanning={isScanning && isTargetPlanet} planetSize={planetSize} />
      </group>
    </Select>
  );
}

export default PlanetComponent;

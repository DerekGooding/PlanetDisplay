import { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Select } from '@react-three/postprocessing';
import * as THREE from 'three';
import { TextureLoader, Texture, RepeatWrapping } from 'three';
import { Planet as PlanetModel } from '../../models/Planet';
import ScanMaterialComponent from '../ScanMaterial';

// Component for a textured sphere
function TexturedSphere({ texturePath, isScanning, planetSize }: { texturePath: string; isScanning: boolean; planetSize: number }) {
  const [texture, setTexture] = useState<Texture | null>(null);
  const [localScanProgress, setLocalScanProgress] = useState(0);

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
        console.error('Error loading texture:', error);
      }
    );
  }, [texturePath]);

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
          <meshStandardMaterial map={texture} transparent alphaTest={0.5} color="white" />
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
        <TexturedSphere texturePath={planetTexturePath} isScanning={isScanning && isTargetPlanet} planetSize={planetSize} />
        <CloudSphere texturePath={cloudTexturePath} isParentPlanetScanning={isScanning && isTargetPlanet} planetSize={planetSize} />
      </group>
    </Select>
  );
}

export default PlanetComponent;

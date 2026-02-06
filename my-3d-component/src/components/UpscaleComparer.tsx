import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import planetConfigsUpscaled from '../utils/planetDataUpscaled';
import { OptionalNormalMapLoader } from './OptionalNormalMapLoader';

function StarField({ count = 1400, radius = 55 }) {
  const pointsRef = useRef(null);

  const { positions } = useMemo(() => {
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = radius * (0.85 + Math.random() * 0.3);

      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }

    return { positions: pos };
  }, [count, radius]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        sizeAttenuation
        color="#ffffff"
        transparent
        opacity={0.75}
        depthWrite={false}
      />
    </points>
  );
}

function PlanetViewer({ 
  texturePath, 
  normalMapPath
}: { 
  texturePath: string; 
  normalMapPath?: string;
}) {
  const globeRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);

  const texture = useLoader(THREE.TextureLoader, texturePath);
  const [loadedNormalMap, setLoadedNormalMap] = useState<THREE.Texture | null>(null);

  // Apply texture settings
  useEffect(() => {
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping; // Clamp at poles to reduce artifacts
      texture.repeat.set(1, 1);
      texture.needsUpdate = true;
    }
  }, [texture]);

  // Reset normal map when path becomes falsy
  useEffect(() => {
    if (!normalMapPath) {
      setLoadedNormalMap(null);
    }
  }, [normalMapPath]);

  // Apply normal map to material with optimized settings
  useEffect(() => {
    if (materialRef.current && loadedNormalMap) {
      loadedNormalMap.wrapS = THREE.RepeatWrapping;
      loadedNormalMap.wrapT = THREE.ClampToEdgeWrapping; // Clamp at poles
      loadedNormalMap.anisotropy = 16; // Maximum anisotropic filtering
      
      materialRef.current.normalMap = loadedNormalMap;
      materialRef.current.normalMapType = THREE.TangentSpaceNormalMap;
      // Reduce normal intensity near poles by using lower scale
      materialRef.current.normalScale.set(0.3, 0.3);
      materialRef.current.needsUpdate = true;
    } else if (materialRef.current && !loadedNormalMap) {
      materialRef.current.normalMap = null;
      materialRef.current.needsUpdate = true;
    }
  }, [loadedNormalMap]);

  useFrame((_, dt) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += dt * 0.06;
    }
  });

  return (
    <group>
      {normalMapPath && (
        <OptionalNormalMapLoader path={normalMapPath} onLoaded={setLoadedNormalMap} />
      )}
      
      <mesh ref={globeRef}>
        {/* High segment count for smoother interpolation */}
        <sphereGeometry args={[1, 256, 256]} />
        <meshStandardMaterial
          ref={materialRef}
          map={texture}
          metalness={0.1}
          roughness={0.8}
          flatShading={false}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh scale={1.04}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#77e6ff"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

export default function UpscaleComparer() {
  const [currentTextureIndex, setCurrentTextureIndex] = useState(0);
  const currentPlanetConfig = planetConfigsUpscaled[currentTextureIndex];

  const handleNextTexture = () => {
    setCurrentTextureIndex((prev) => (prev + 1) % planetConfigsUpscaled.length);
  };

  const handlePrevTexture = () => {
    setCurrentTextureIndex((prev) => (prev - 1 + planetConfigsUpscaled.length) % planetConfigsUpscaled.length);
  };

  return (
    <div style={{ width: '100%', height: '520px', background: 'black', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0.25, 3.2], fov: 45, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false }}
      >
        <StarField />

        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 2, 3]} intensity={1.25} />
        <pointLight position={[-3, -2, -4]} intensity={0.6} />

        {currentPlanetConfig && (
          <PlanetViewer
            texturePath={currentPlanetConfig.texturePath}
            normalMapPath={currentPlanetConfig.normalMapPath}
          />
        )}

        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          enablePan={false}
          rotateSpeed={0.6}
          zoomSpeed={0.8}
          minDistance={1.6}
          maxDistance={8.0}
          target={[0, 0, 0]}
        />
      </Canvas>

      {/* UI Controls */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
          textShadow: '0 2px 4px rgba(0,0,0,0.8)',
          zIndex: 10,
        }}
      >
        {currentPlanetConfig ? currentPlanetConfig.name : 'Loading...'}
      </div>

      <button
        onClick={handlePrevTexture}
        style={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          transform: 'translateY(-50%)',
          zIndex: 10,
          padding: '12px 20px',
          cursor: 'pointer',
          background: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.4)',
          borderRadius: '4px',
          color: 'white',
          fontSize: '14px',
          backdropFilter: 'blur(4px)',
        }}
      >
        ← Previous
      </button>

      <button
        onClick={handleNextTexture}
        style={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          zIndex: 10,
          padding: '12px 20px',
          cursor: 'pointer',
          background: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.4)',
          borderRadius: '4px',
          color: 'white',
          fontSize: '14px',
          backdropFilter: 'blur(4px)',
        }}
      >
        Next →
      </button>
    </div>
  );
}
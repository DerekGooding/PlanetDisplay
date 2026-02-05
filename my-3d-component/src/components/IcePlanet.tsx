// IcePlanet_NoDrei.jsx
// Requires: three, @react-three/fiber
// No @react-three/drei needed.

import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import planetTextures from '../utils/planetData';




function StarField({ count = 1400, radius = 55 }) {
  // Very lightweight static starfield using Points
  const pointsRef = useRef(null);

  const { positions } = useMemo(() => {
    const pos = new Float32Array(count * 3);

    // Random points distributed in a sphere shell-ish
    for (let i = 0; i < count; i++) {
      // random direction
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);

      // random radius (slightly varied around "radius")
      const r = radius * (0.85 + Math.random() * 0.3);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3 + 0] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }

    return { positions: pos };
  }, [count, radius]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        sizeAttenuation
        color={'#ffffff'}
        transparent
        opacity={0.75}
        depthWrite={false}
      />
    </points>
  );
}

function IceGlobe({ texturePath }: { texturePath: string }) {
  const globeRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, texturePath);

  useFrame((_, dt) => {
    if (globeRef.current) globeRef.current.rotation.y += dt * 0.06;
  });

  return (
    <group>
      <mesh ref={globeRef}>
        <sphereGeometry args={[1, 128, 128]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* Atmosphere / glow shell */}
      <mesh scale={1.04}>
        <sphereGeometry args={[1, 128, 128]} />
        <meshBasicMaterial
          color={'#77e6ff'}
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

export default function IcePlanet_NoDrei() {
  const [currentTextureIndex, setCurrentTextureIndex] = useState(0);

  const currentTexture = planetTextures[currentTextureIndex];

  const handleNextTexture = () => {
    setCurrentTextureIndex((prevIndex) => (prevIndex + 1) % planetTextures.length);
  };

  const handlePrevTexture = () => {
    setCurrentTextureIndex((prevIndex) => (prevIndex - 1 + planetTextures.length) % planetTextures.length);
  };

  return (
    <div style={{ width: '100%', height: '520px', background: 'black', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0.25, 3.2], fov: 45, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Star background */}
        <StarField />

        {/* Simple lights (shader does most of the look) */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 2, 3]} intensity={1.25} />
        <pointLight position={[-3, -2, -4]} intensity={0.6} />

        {currentTexture && <IceGlobe texturePath={currentTexture.path} />}

        {/* Mouse/touch orbit + zoom */}
        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          enablePan={false}
          rotateSpeed={0.6}
          zoomSpeed={0.8}
          minDistance={1.6}
          maxDistance={8.0}
          target={[0, 0.0, 0]}
        />
      </Canvas>
      <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'white', zIndex: 10 }}>
        Current Planet: {currentTexture ? currentTexture.name : 'Loading...'}
      </div>
      <button
        onClick={handlePrevTexture}
        style={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          transform: 'translateY(-50%)',
          zIndex: 10,
          padding: '10px',
          cursor: 'pointer',
        }}
      >
        Previous
      </button>
      <button
        onClick={handleNextTexture}
        style={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          zIndex: 10,
          padding: '10px',
          cursor: 'pointer',
        }}
      >
        Next
      </button>
    </div>
  );
}

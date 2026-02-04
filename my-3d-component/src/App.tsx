import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState, useEffect } from 'react';
import { TextureLoader, Texture, RepeatWrapping } from 'three';
import planetTextures from './utils/planetData'; // glob-imported URLs

// Component for a textured sphere
function TexturedSphere({ texturePath }: { texturePath: string }) {
  const [texture, setTexture] = useState<Texture | null>(null);

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

  return (
    <mesh position={[2.2, 0, 0]}>
      <sphereGeometry args={[2, 32, 32]} />
      {texture ? (
        <meshStandardMaterial map={texture} transparent alphaTest={0.5} color="white" />
      ) : (
        <meshStandardMaterial color="blue" wireframe />
      )}
    </mesh>
  );
}

export default function App() {
  // Store the currently selected texture URL (string)
  const [selectedTexture, setSelectedTexture] = useState<string>(planetTextures[0]?.path || '');

  const handlePlanetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTexture(event.target.value); // Always a string URL
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Dropdown to select planet */}
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 100 }}>
        <select
          onChange={handlePlanetChange}
          value={selectedTexture}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          {planetTextures.map((planet, index) => (
            <option key={index} value={planet.path}>
              {planet.name}
            </option>
          ))}
        </select>
      </div>

      <Canvas camera={{ position: [0, 0, 8] }}>
        <color attach="background" args={['#333']} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        {/* Left wireframe sphere */}
        <mesh position={[-2.2, 0, 0]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial color="orange" wireframe />
        </mesh>

        {/* Right sphere: loads selected planet texture */}
        <TexturedSphere texturePath={selectedTexture} />

        <OrbitControls />
      </Canvas>
    </div>
  );
}

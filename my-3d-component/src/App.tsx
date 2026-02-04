import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState, useEffect } from 'react';
import { TextureLoader, Texture, RepeatWrapping } from 'three';
import planetTextures from './utils/planetData'; // your glob-imported textures

// TexturedSphere loads a texture via TextureLoader safely
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
        console.error('Texture load error:', error);
      }
    );
  }, [texturePath]);

  return (
    <mesh position={[2.2, 0, 0]}>
      <sphereGeometry args={[2, 32, 32]} />
      {texture ? (
        <meshStandardMaterial
          map={texture}
          transparent={true}
          alphaTest={0.5}
          color="white"
        />
      ) : (
        <meshStandardMaterial color="blue" wireframe={true} />
      )}
    </mesh>
  );
}

export default function App() {
  // Store selected texture URL (string from planetTextures.path)
  const [selectedTexture, setSelectedTexture] = useState(planetTextures[0]?.path || '');

  const handlePlanetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedTexture(value);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Dropdown for selecting planet */}
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 100 }}>
        <select
          onChange={handlePlanetChange}
          value={selectedTexture}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
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

        {/* Left wireframe sphere (static example) */}
        <mesh position={[-2.2, 0, 0]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial color="orange" wireframe={true} />
        </mesh>

        {/* Right sphere: loads selected planet texture */}
        <TexturedSphere texturePath={selectedTexture} />

        <OrbitControls />
      </Canvas>
    </div>
  );
}

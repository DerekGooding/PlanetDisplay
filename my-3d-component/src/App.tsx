import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState, useEffect } from 'react';
import { TextureLoader, Texture, RepeatWrapping } from 'three'; // Import RepeatWrapping
import planetTextures from './utils/planetData'; // Import planet data

// Component for the textured sphere with safe loading
function TexturedSphere({ texturePath }: { texturePath: string }) {
  const [texture, setTexture] = useState<Texture | null>(null);

  useEffect(() => {
    if (!texturePath) return; // Don't load if path is not provided

    new TextureLoader().load(
      texturePath,
      (loadedTexture) => {
        loadedTexture.wrapS = RepeatWrapping;
        loadedTexture.repeat.set(2, 1);
        loadedTexture.needsUpdate = true;
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        console.error('An error happened loading the texture:', error);
      }
    );
  }, [texturePath]); // Re-run effect if texturePath changes

  return (
    <mesh position={[2.2, 0, 0]}>
      <sphereGeometry args={[2, 32, 32]} />
      {texture ? (
        // Switched back to MeshStandardMaterial with alphaTest for lighting and transparency
        <meshStandardMaterial map={texture} transparent={true} alphaTest={0.5} color="white" />
      ) : (
        <meshStandardMaterial color="blue" wireframe={true} />
      )}
    </mesh>
  );
}

export default function App() {
  const [selectedPlanetTexture, setSelectedPlanetTexture] = useState(planetTextures[0]?.path || '');

  const handlePlanetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlanetTexture(event.target.value);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 100 }}>
        <select onChange={handlePlanetChange} value={selectedPlanetTexture} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
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
        
        {/* Left wireframe sphere (stable) */}
        <mesh position={[-2.2, 0, 0]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial color="orange" wireframe={true} />
        </mesh>

        {/* Right sphere: will start as blue wireframe, then load texture */}
        <TexturedSphere texturePath={selectedPlanetTexture} />

        <OrbitControls />
      </Canvas>
    </div>
  );
}
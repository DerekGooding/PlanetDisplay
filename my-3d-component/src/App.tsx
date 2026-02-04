import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useState, useEffect, useRef } from 'react';
import { TextureLoader, Texture, RepeatWrapping } from 'three';
import planetTextures, { cloudTextures } from './utils/planetData'; // glob-imported URLs

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
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

        {/* Left wireframe sphere */}
        <mesh position={[-2.2, 0, 0]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial color="orange" wireframe />
        </mesh>

        {/* Right sphere: loads selected planet texture */}
        <TexturedSphere texturePath={selectedTexture} />

        {/* Clouds for the selected planet */}
        <CloudSphere texturePath={Object.values(cloudTextures)[0] as string} />

        <OrbitControls />
      </Canvas>clouds
    </div>
  );
}

// Component for rendering clouds
function CloudSphere({ texturePath }: { texturePath: string }) {
  const [texture, setTexture] = useState<Texture | null>(null);
  const meshRef = useRef<THREE.Mesh>(null!); // Ref for the mesh

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

  // Rotate the mesh on each frame
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001; // Adjust rotation speed here
    }
  });

  return (
    <mesh position={[2.2, 0, 0]} ref={meshRef}> {/* Added ref */}
      <sphereGeometry args={[2.03, 32, 32]} /> {/* Slightly larger than the planet */}
      {texture ? (
        <meshStandardMaterial
          map={texture}
          transparent
          opacity={0.75} // Adjusted opacity
          alphaTest={0.01} // Helps with transparent pngs
          color={0xffffff} // Explicitly set color to white
        />
      ) : (
        <meshStandardMaterial color="lightgray" wireframe />
      )}
    </mesh>
  );
}

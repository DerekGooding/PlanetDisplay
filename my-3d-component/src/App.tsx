import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState, useEffect } from 'react';
import { TextureLoader, Texture, RepeatWrapping } from 'three'; // Import RepeatWrapping
import planetTextureUrl from './assets/planet_2d.png'; // Import the texture

// Component for the textured sphere with safe loading
function TexturedSphere() {
  const [texture, setTexture] = useState<Texture | null>(null);

  useEffect(() => {
    // Use the imported URL
    new TextureLoader().load(
      planetTextureUrl,
      (loadedTexture) => {
        // Apply texture transformations here
        loadedTexture.wrapS = RepeatWrapping; // Repeat horizontally
        loadedTexture.repeat.set(2, 1); // Repeat twice horizontally, once vertically
        loadedTexture.needsUpdate = true; // Inform Three.js that the texture needs re-uploading

        setTexture(loadedTexture);
      },
      undefined, // onProgress callback not needed
      (error) => {
        console.error('An error happened loading the texture:', error);
      }
    );
  }, []); // Empty dependency array ensures this runs once

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
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
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
        <TexturedSphere />

        <OrbitControls />
      </Canvas>
    </div>
  );
}
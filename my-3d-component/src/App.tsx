import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 8] }}> {/* Camera pulled back to see both spheres */}
        <color attach="background" args={['#333']} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        
        {/* Left wireframe sphere */}
        <mesh position={[-2.2, 0, 0]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial color="orange" wireframe={true} />
        </mesh>

        {/* Right wireframe sphere */}
        <mesh position={[2.2, 0, 0]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial color="orange" wireframe={true} />
        </mesh>

        <OrbitControls />
      </Canvas>
    </div>
  );
}

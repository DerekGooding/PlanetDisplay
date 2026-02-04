import * as THREE from 'three';

// Component for depicting a planet's orbit
function OrbitRing({ orbitalRadius }: { orbitalRadius: number }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}> {/* Rotate to lie on the XZ plane */}
      <ringGeometry args={[orbitalRadius - 0.2, orbitalRadius + 0.2, 64]} /> {/* innerRadius, outerRadius, thetaSegments */}
      <meshBasicMaterial color="white" side={THREE.DoubleSide} transparent opacity={0.6} />
    </mesh>
  );
}

export default OrbitRing;

// Component for the central star
function Star() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[5, 32, 32]} /> {/* Larger sphere for the star */}
      <meshBasicMaterial color="yellow" /> {/* Solid yellow color */}
    </mesh>
  );
}

export default Star;

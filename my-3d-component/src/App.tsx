import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Selection, EffectComposer, Outline, Select } from '@react-three/postprocessing';
import { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { TextureLoader, Texture, RepeatWrapping } from 'three';
import planetTextures, { cloudTextures } from './utils/planetData';
import { planets } from './data/planets';
import { Planet as PlanetModel } from './models/Planet';
import ScanMaterialComponent from './components/ScanMaterial';

// Component for the central star
function Star() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[5, 32, 32]} /> {/* Larger sphere for the star */}
      <meshBasicMaterial color="yellow" /> {/* Solid yellow color */}
    </mesh>
  );
}

// Component for a textured sphere
function TexturedSphere({ texturePath, isScanning, planetSize }: { texturePath: string; isScanning: boolean; planetSize: number }) {
  const [texture, setTexture] = useState<Texture | null>(null);
  const [localScanProgress, setLocalScanProgress] = useState(0);

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

  useFrame((_state, delta) => {
    if (isScanning) {
      setLocalScanProgress((prev) => (prev + delta * 0.1) % 2); // Adjust speed as needed
    } else {
      setLocalScanProgress(0); // Reset when not scanning
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[planetSize, 32, 32]} />
      {texture ? (
        isScanning ? (
            <ScanMaterialComponent map={texture} scanProgress={localScanProgress} isScanning={isScanning} scanLineColor={new THREE.Color(0.0, 1.0, 0.0)} />
        ) : (
          <meshStandardMaterial map={texture} transparent alphaTest={0.5} color="white" />
        )
      ) : (
        <meshStandardMaterial color="blue" wireframe />
      )}
    </mesh>
  );
}

// Component for rendering clouds
function CloudSphere({ texturePath, isParentPlanetScanning, planetSize }: { texturePath: string; isParentPlanetScanning: boolean, planetSize: number }) {
  const [texture, setTexture] = useState<Texture | null>(null);
  const meshRef = useRef<THREE.Mesh>(null!);

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

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  if (isParentPlanetScanning) {
    return null; // Hide clouds during scan
  }

  return (
    <mesh position={[0, 0, 0]} ref={meshRef}>
      <sphereGeometry args={[planetSize + 0.03, 32, 32]} /> {/* Slightly larger than planet */}
      {texture ? (
        <meshStandardMaterial
          map={texture}
          transparent
          opacity={0.75}
          alphaTest={0.01}
          color={0xffffff}
        />
      ) : (
        <meshStandardMaterial color="lightgray" wireframe />
      )}
    </mesh>
  );
}

function PlanetComponent({
  planet,
  planetTexturePath,
  cloudTexturePath,
  onPointerOver,
  onPointerOut,
  isHovered,
  isScanning,
  index,
  targetPlanetIndex,
  orbitalRadius,
  orbitalSpeed,
  initialOrbitalAngle,
  planetSize,
  rotationSpeed
}: {
  planet: PlanetModel;
  planetTexturePath: string;
  cloudTexturePath: string;
  onPointerOver: (planet: PlanetModel) => void;
  onPointerOut: () => void;
  isHovered: boolean;
  isScanning: boolean;
  index: number;
  targetPlanetIndex: number;
  orbitalRadius: number;
  orbitalSpeed: number;
  initialOrbitalAngle: number;
  planetSize: number;
  rotationSpeed: number;
}) {
  const isTargetPlanet = index === targetPlanetIndex;
  const planetRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (planetRef.current) {
      const angle = initialOrbitalAngle + clock.getElapsedTime() * orbitalSpeed;
      planetRef.current.position.x = orbitalRadius * Math.sin(angle);
      planetRef.current.position.z = orbitalRadius * Math.cos(angle);
      planetRef.current.rotation.y += rotationSpeed; // Self-rotation
    }
  });

  return (
    <Select enabled={isHovered}>
      <group
        ref={planetRef}
        onPointerOver={() => onPointerOver(planet)}
        onPointerOut={onPointerOut}
      >
        <TexturedSphere texturePath={planetTexturePath} isScanning={isScanning && isTargetPlanet} planetSize={planetSize} />
        <CloudSphere texturePath={cloudTexturePath} isParentPlanetScanning={isScanning && isTargetPlanet} planetSize={planetSize} />
      </group>
    </Select>
  );
}

// Component for depicting a planet's orbit
function OrbitRing({ orbitalRadius }: { orbitalRadius: number }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}> {/* Rotate to lie on the XZ plane */}
      <ringGeometry args={[orbitalRadius - 0.2, orbitalRadius + 0.2, 64]} /> {/* innerRadius, outerRadius, thetaSegments */}
      <meshBasicMaterial color="white" side={THREE.DoubleSide} transparent opacity={0.6} />
    </mesh>
  );
}

export default function App() {
  const [targetPlanetIndex, setTargetPlanetIndex] = useState(0);

  const generateRandomTextures = useCallback(() => {
    const newAssignedPlanetTextures: { [key: string]: string } = {};
    planets.forEach(planet => {
      newAssignedPlanetTextures[planet.id] = planetTextures[Math.floor(Math.random() * planetTextures.length)].path;
    });

    const cloudPaths = Object.values(cloudTextures);
    const newAssignedCloudTexture = cloudPaths[Math.floor(Math.random() * cloudPaths.length)] as string;

    return { newAssignedPlanetTextures, newAssignedCloudTexture };
  }, []);

  const [assignedTextures, setAssignedTextures] = useState(() => generateRandomTextures());

  const assignedPlanetTextures = assignedTextures.newAssignedPlanetTextures;
  const assignedCloudTexture = assignedTextures.newAssignedCloudTexture;

  const randomizeTextures = () => {
    setAssignedTextures(generateRandomTextures());
    // Also regenerate orbital parameters to make it dynamic
    setOrbitalParameters(generateOrbitalParameters());
  };

  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetModel | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraLocked, setIsCameraLocked] = useState(true);

  // Generate orbital parameters for each planet
  const generateOrbitalParameters = useCallback(() => {
    return planets.map((_, index) => {
      const baseOrbitalRadius = 25 + index * 10; // Base distance for each planet
      const orbitalRadius = baseOrbitalRadius + Math.random() * 15; // Wider randomized range
      
      const basePlanetSize = 2;
      //const planetSize = basePlanetSize * (1 + (Math.random() * 0.4 - 0.2)); // +/- 20% randomization
      const planetSize = basePlanetSize * (1 + (Math.random() * 1.0 - 0.5)); // +/- 50%

      const rotationSpeed = 0.0001 + Math.random() * 0.0005; // Very slow, non-zero rotation

      return {
        orbitalRadius,
        orbitalSpeed: 0.01 + Math.random() * 0.03, // Adjusted speed
        initialOrbitalAngle: Math.random() * Math.PI * 2,
        planetSize,
        rotationSpeed
      };
    });
  }, []);

  const [orbitalParameters, setOrbitalParameters] = useState(() => generateOrbitalParameters());

  const handlePointerOver = (planet: PlanetModel) => {
    setHoveredPlanet(planet);
  };

  const handlePointerOut = () => {
    setHoveredPlanet(null);
  };

  const controlsRef = useRef<any>(null);

function CameraAnimator() {
    useFrame(({ clock }) => {
      if (isCameraLocked && controlsRef.current) {
        const targetPlanetParams = orbitalParameters[targetPlanetIndex];
        // Calculate the target planet's current angle based on elapsed time
        const angle = targetPlanetParams.initialOrbitalAngle + (clock.getElapsedTime() * targetPlanetParams.orbitalSpeed);
        const targetPlanetX = targetPlanetParams.orbitalRadius * Math.sin(angle);
        const targetPlanetZ = targetPlanetParams.orbitalRadius * Math.cos(angle);
        
        const cameraDistanceFromTarget = targetPlanetParams.planetSize * 4; // Adjust distance based on planet size

        // Smoothly interpolate the target's position
        controlsRef.current.target.x = THREE.MathUtils.lerp(
          controlsRef.current.target.x,
          targetPlanetX,
          0.1
        );
        controlsRef.current.target.y = THREE.MathUtils.lerp(
          controlsRef.current.target.y,
          0,
          0.1
        );
        controlsRef.current.target.z = THREE.MathUtils.lerp(
          controlsRef.current.target.z,
          targetPlanetZ,
          0.1
        );

        // Smoothly interpolate the camera's position
        controlsRef.current.object.position.x = THREE.MathUtils.lerp(
          controlsRef.current.object.position.x,
          targetPlanetX,
          0.1
        );
        controlsRef.current.object.position.y = THREE.MathUtils.lerp(
          controlsRef.current.object.position.y,
          cameraDistanceFromTarget / 2, // Slightly above the planet
          0.1
        );
        controlsRef.current.object.position.z = THREE.MathUtils.lerp(
          controlsRef.current.object.position.z,
          targetPlanetZ + cameraDistanceFromTarget, // Offset from the planet
          0.1
        );

        controlsRef.current.update();
      }
    });

    return null;
  }

  const nextPlanet = () => {
    setTargetPlanetIndex((prevIndex) => (prevIndex + 1) % planets.length);
  };

  const prevPlanet = () => {
    setTargetPlanetIndex((prevIndex) => (prevIndex - 1 + planets.length) % planets.length);
  };

  const handleResetView = () => {
    setTargetPlanetIndex(0); // Reset to the first planet
    setIsCameraLocked(true); // Re-lock camera to focus on the first planet
    // Also reset orbital parameters if desired, or let them continue
    setOrbitalParameters(generateOrbitalParameters());
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Navigation UI */}
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 100 }}>
        <button onClick={prevPlanet} style={{ marginRight: '10px', padding: '8px 15px' }}>
          Previous
        </button>
        <button onClick={nextPlanet} style={{ marginRight: '10px', padding: '8px 15px' }}>
          Next
        </button>
        <button onClick={handleResetView} style={{ marginRight: '10px', padding: '8px 15px' }}>
          Reset View
        </button>
        <button onClick={() => setIsScanning(!isScanning)} style={{ padding: '8px 15px' }}>
          {isScanning ? 'Stop Scan' : 'Start Scan'}
        </button>
        <button onClick={() => setIsCameraLocked(!isCameraLocked)} style={{ marginLeft: '10px', padding: '8px 15px' }}>
          {isCameraLocked ? 'Unlock Camera' : 'Lock Camera'}
        </button>
        <button onClick={randomizeTextures} style={{ marginLeft: '10px', padding: '8px 15px' }}>
          Randomize System
        </button>
      </div>

      {/* Camera Controls Help Box */}
      {!isCameraLocked && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 100,
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            maxWidth: '200px',
            fontSize: '14px',
          }}
        >
          <p><strong>Free Look Controls:</strong></p>
          <p>Left Click + Drag: Rotate</p>
          <p>Right Click + Drag: Pan</p>
          <p>Scroll: Zoom</p>
        </div>
      )}

      <Canvas camera={{ position: [0, 20, 30], fov: 60 }}>
        <color attach="background" args={['#333']} />
        <ambientLight intensity={0.5} /> {/* Reduced ambient light */}
        <pointLight position={[0, 0, 0]} intensity={100} decay={2} color="white" /> {/* Light from the star */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

        <Star /> {/* Render the central star */}

        <CameraAnimator />
        
        <Selection>
          <EffectComposer multisampling={8} autoClear={false}>
            <Outline blur
              visibleEdgeColor={0xffff00} // Yellow
              edgeStrength={100}
              width={1000}
              selectionLayer={10}
            />
          </EffectComposer>

          {planets.map((planet, index) => {
            const params = orbitalParameters[index];
            return (
              <PlanetComponent
                key={planet.id}
                planet={planet}
                planetTexturePath={assignedPlanetTextures[planet.id]}
                cloudTexturePath={assignedCloudTexture}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                isHovered={hoveredPlanet?.id === planet.id}
                isScanning={isScanning}
                index={index}
                targetPlanetIndex={targetPlanetIndex}
                orbitalRadius={params.orbitalRadius}
                orbitalSpeed={params.orbitalSpeed}
                initialOrbitalAngle={params.initialOrbitalAngle}
                planetSize={params.planetSize}
                rotationSpeed={params.rotationSpeed}
              />
            );
          })}
          {planets.map((planet, index) => {
            const params = orbitalParameters[index];
            return (
              hoveredPlanet?.id === planet.id && <OrbitRing key={`orbit-${planet.id}`} orbitalRadius={params.orbitalRadius} />
            );
          })}

        </Selection>

        <OrbitControls
          ref={controlsRef}
          enableRotate={!isCameraLocked}
          enablePan={!isCameraLocked}
          enableZoom={true}
        />
      </Canvas>

      {hoveredPlanet && (
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            zIndex: 100,
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            maxWidth: '300px',
          }}
        >
          <h3>{hoveredPlanet.name}</h3>
          <p><strong>Classification:</strong> {hoveredPlanet.classification}</p>
          <p><strong>Allegiance:</strong> {hoveredPlanet.allegiance}</p>
          <p><strong>Biome:</strong> {hoveredPlanet.biome}</p>
          <p><strong>Threat Level:</strong> {hoveredPlanet.threatLevel}</p>
          <p>{hoveredPlanet.flavorText}</p>
        </div>
      )}
    </div>
  );
}
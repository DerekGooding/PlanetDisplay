import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Selection, EffectComposer, Outline, Select } from '@react-three/postprocessing';
import { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { TextureLoader, Texture, RepeatWrapping } from 'three';
import planetTextures, { cloudTextures } from './utils/planetData';
import { planets } from './data/planets';
import { Planet as PlanetModel } from './models/Planet';

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
    <mesh>
      <sphereGeometry args={[2, 32, 32]} />
      {texture ? (
        <meshStandardMaterial map={texture} transparent alphaTest={0.5} color="white" />
      ) : (
        <meshStandardMaterial color="blue" wireframe />
      )}
    </mesh>
  );
}

// Component for rendering clouds
function CloudSphere({ texturePath }: { texturePath: string }) {
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

  return (
    <mesh position={[0, 0, 0]} ref={meshRef}>
      <sphereGeometry args={[2.03, 32, 32]} />
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
  position,
  onPointerOver,
  onPointerOut,
  isHovered
}: {
  planet: PlanetModel;
  planetTexturePath: string;
  cloudTexturePath: string;
  position: [number, number, number];
  onPointerOver: (planet: PlanetModel) => void;
  onPointerOut: () => void;
  isHovered: boolean;
}) {
  return (
    <Select enabled={isHovered}>
      <group
        position={position}
        onPointerOver={() => onPointerOver(planet)}
        onPointerOut={onPointerOut}
      >
        <TexturedSphere texturePath={planetTexturePath} />
        <CloudSphere texturePath={cloudTexturePath} />
      </group>
    </Select>
  );
}

export default function App() {
  const [currentPlanetIndex, setCurrentPlanetIndex] = useState(0);

  const assignedPlanetTextures = useMemo(() => {
    const assigned: { [key: string]: string } = {};
    planets.forEach(planet => {
      if (!assigned[planet.id]) {
        const randomIndex = Math.floor(Math.random() * planetTextures.length);
        assigned[planet.id] = planetTextures[randomIndex].path;
      }
    });
    return assigned;
  }, []);

const assignedCloudTexture = useMemo(() => {
  console.log('cloudTextures:', cloudTextures);
  console.log('Object.values:', Object.values(cloudTextures));
  const cloudPaths = Object.values(cloudTextures);
  const selected = cloudPaths[Math.floor(Math.random() * cloudPaths.length)];
  console.log('selected:', selected, typeof selected);
  return selected as string;
}, []);

  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetModel | null>(null);

  const handlePointerOver = (planet: PlanetModel) => {
    setHoveredPlanet(planet);
  };

  const handlePointerOut = () => {
    setHoveredPlanet(null);
  };

  const controlsRef = useRef<any>(null); // Ref for OrbitControls

  useEffect(() => {
    if (controlsRef.current) {
      const targetPlanetX = currentPlanetIndex * 12;
      const cameraDistanceFromTarget = 8; // The original Z distance from the central planet

      // Smoothly interpolate the target's X-position
      controlsRef.current.target.x = THREE.MathUtils.lerp(controlsRef.current.target.x, targetPlanetX, 0.1);

      // Smoothly interpolate the camera's X-position to keep it directly above the target
      controlsRef.current.object.position.x = THREE.MathUtils.lerp(controlsRef.current.object.position.x, targetPlanetX, 0.1);

      // Ensure the camera's Y and Z positions remain constant relative to the target (or default view)
      controlsRef.current.object.position.y = THREE.MathUtils.lerp(controlsRef.current.object.position.y, 0, 0.1); // Reset Y to 0
      controlsRef.current.object.position.z = THREE.MathUtils.lerp(controlsRef.current.object.position.z, targetPlanetX + cameraDistanceFromTarget, 0.1); // Correct Z position

      controlsRef.current.update();
    }
  }, [currentPlanetIndex]);

  const nextPlanet = () => {
    setCurrentPlanetIndex((prevIndex) => (prevIndex + 1) % planets.length);
  };

  const prevPlanet = () => {
    setCurrentPlanetIndex((prevIndex) => (prevIndex - 1 + planets.length) % planets.length);
  };

  const handleResetView = () => {
    setCurrentPlanetIndex(0);
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
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
        <button onClick={handleResetView} style={{ padding: '8px 15px' }}>
          Reset View
        </button>
      </div>

      <Canvas camera={{ position: [currentPlanetIndex * 12, 0, 8] }}>
        <color attach="background" args={['#333']} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

        <Selection>
          <EffectComposer multisampling={8} autoClear={false}>
            <Outline blur
              visibleEdgeColor={0xffff00} // Yellow
              edgeStrength={100}
              width={1000}
              selectionLayer={10}
            />
          </EffectComposer>

          {planets.map((planet, index) => (
            <PlanetComponent
              key={planet.id}
              planet={planet}
              planetTexturePath={assignedPlanetTextures[planet.id]}
              cloudTexturePath={assignedCloudTexture}
              position={[index * 12, 0, 0]} // Arrange planets in a line
              onPointerOver={handlePointerOver}
              onPointerOut={handlePointerOut}
              isHovered={hoveredPlanet?.id === planet.id} // Pass hovered state
            />
          ))}
        </Selection>

        <OrbitControls
          ref={controlsRef}
          enableRotate={false}
          enablePan={true}
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
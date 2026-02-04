import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { OrbitalParameters } from './useOrbitalSystem';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'; // Use 'type' for import

export function useCameraFollow(
  controlsRef: React.RefObject<OrbitControlsImpl>, // Accept controlsRef as an argument
  isCameraLocked: boolean,
  targetPlanetIndex: number,
  orbitalParameters: OrbitalParameters[]
) {
  // Removed: const controlsRef = useRef<OrbitControlsImpl>(null!);

  useFrame(({ clock }) => {
    if (isCameraLocked && controlsRef.current) {
      if (!orbitalParameters[targetPlanetIndex]) return;

      const targetPlanetParams = orbitalParameters[targetPlanetIndex];
      const angle = targetPlanetParams.initialOrbitalAngle + (clock.getElapsedTime() * targetPlanetParams.orbitalSpeed);
      const targetPlanetX = targetPlanetParams.orbitalRadius * Math.sin(angle);
      const targetPlanetZ = targetPlanetParams.orbitalRadius * Math.cos(angle);
      
      const cameraDistanceFromTarget = targetPlanetParams.planetSize * 4;

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

      controlsRef.current.object.position.x = THREE.MathUtils.lerp(
        controlsRef.current.object.position.x,
        targetPlanetX,
        0.1
      );
      controlsRef.current.object.position.y = THREE.MathUtils.lerp(
        controlsRef.current.object.position.y,
        cameraDistanceFromTarget / 2,
        0.1
      );
      controlsRef.current.object.position.z = THREE.MathUtils.lerp(
        controlsRef.current.object.position.z,
        targetPlanetZ + cameraDistanceFromTarget,
        0.1
      );

      controlsRef.current.update();
    }
  });

  return controlsRef;
}

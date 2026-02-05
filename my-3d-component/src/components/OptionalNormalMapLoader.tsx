import { useEffect } from 'react';
import * as THREE from 'three';
import { TextureLoader, RepeatWrapping } from 'three'; 
// @ts-expect-error TS6133: 'Texture' is declared but its value is never read.
import type { Texture } from 'three';
import { useLoader } from '@react-three/fiber';

// Helper component to conditionally load normal map
export function OptionalNormalMapLoader({ path, onLoaded }: { path: string; onLoaded: (map: THREE.Texture | null) => void }) {
  const normalMap = useLoader(TextureLoader, path);
  useEffect(() => {
    if (normalMap) {
      normalMap.wrapS = RepeatWrapping;
      normalMap.wrapT = RepeatWrapping;
      normalMap.repeat.set(1, 1);
      normalMap.needsUpdate = true;
      onLoaded(normalMap);
    } else {
      onLoaded(null); // Ensure null is passed if loading fails or path is invalid
    }
  }, [normalMap, onLoaded]);
  return null; // This component doesn't render anything itself
}

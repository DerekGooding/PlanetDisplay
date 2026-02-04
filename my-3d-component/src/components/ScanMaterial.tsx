import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import { useRef, useEffect } from 'react'; // Add useRef and useEffect

import scanVertexShader from '../shaders/scan-vertex.glsl';
import scanFragmentShader from '../shaders/scan-fragment.glsl';

// Define the shader material (once)
const ScanMaterialImpl = shaderMaterial(
  {
    map: new THREE.Texture(),
    scanProgress: 0,
    scanLineColor: new THREE.Color(0.0, 1.0, 0.0), // Green color
    isScanning: false,
  },
  scanVertexShader,
  scanFragmentShader
);

// Extend it into R3F
extend({ ScanMaterialImpl });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      scanMaterialImpl: typeof ScanMaterialImpl;
    }
  }
}

// Create a React component that uses this material
interface ScanMaterialProps {
  map: THREE.Texture;
  scanProgress: number;
  scanLineColor?: THREE.Color;
  isScanning: boolean;
}

const ScanMaterialComponent = ({ map, scanProgress, scanLineColor, isScanning }: ScanMaterialProps) => {
  const materialRef = useRef<any>(null); // Initialize with null


  // Update uniforms directly on the material instance
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.map = map;
      materialRef.current.scanProgress = scanProgress;
      materialRef.current.scanLineColor = scanLineColor || new THREE.Color(0.0, 1.0, 0.0);
      materialRef.current.isScanning = isScanning;
      // Ensure the material knows its uniforms have changed
      materialRef.current.needsUpdate = true;
    }
  }, [map, scanProgress, scanLineColor, isScanning]);

  // @ts-ignore
  return <scanMaterialImpl ref={materialRef} attach="material" />;
};

export default ScanMaterialComponent;

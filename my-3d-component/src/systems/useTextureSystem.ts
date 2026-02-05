import { useState, useCallback } from 'react';
import planetConfigs, { cloudTextures } from '../utils/planetData'; // Renamed import
import { planets } from '../data/planets';

export interface AssignedTextures {
  newAssignedPlanetTextures: { [key: string]: { texturePath: string; normalMapPath?: string } }; // Updated interface
  newAssignedCloudTexture: string;
}

export function useTextureSystem() {
  const generateRandomTextures = useCallback(() => {
    const newAssignedPlanetTextures: { [key: string]: { texturePath: string; normalMapPath?: string } } = {};
    planets.forEach(planet => {
      const randomPlanetConfig = planetConfigs[Math.floor(Math.random() * planetConfigs.length)];
      newAssignedPlanetTextures[planet.id] = {
        texturePath: randomPlanetConfig.texturePath,
        normalMapPath: randomPlanetConfig.normalMapPath,
      };
    });

    const cloudPaths = Object.values(cloudTextures);
    const newAssignedCloudTexture = cloudPaths[Math.floor(Math.random() * cloudPaths.length)] as string;

    return { newAssignedPlanetTextures, newAssignedCloudTexture };
  }, []);

  const [assignedTextures, setAssignedTextures] = useState<AssignedTextures>(() => generateRandomTextures());

  const randomizeTextures = useCallback(() => {
    setAssignedTextures(generateRandomTextures());
  }, [generateRandomTextures]);

  return { assignedTextures, randomizeTextures };
}

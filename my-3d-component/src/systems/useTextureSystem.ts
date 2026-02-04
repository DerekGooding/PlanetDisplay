import { useState, useCallback } from 'react';
import planetTextures, { cloudTextures } from '../utils/planetData';
import { planets } from '../data/planets';

export interface AssignedTextures {
  newAssignedPlanetTextures: { [key: string]: string };
  newAssignedCloudTexture: string;
}

export function useTextureSystem() {
  const generateRandomTextures = useCallback(() => {
    const newAssignedPlanetTextures: { [key: string]: string } = {};
    planets.forEach(planet => {
      newAssignedPlanetTextures[planet.id] = planetTextures[Math.floor(Math.random() * planetTextures.length)].path;
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

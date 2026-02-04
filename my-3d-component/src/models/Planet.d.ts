declare class Planet {
  id: string;
  name: string;
  classification: string;
  allegiance: string;
  biome: string;
  threatLevel: number;
  strategicValue: number;
  population: string;
  environmentalHazards: string[];
  primaryEnemy: string;
  planetaryTraits: string[];
  missionModifiers: {
    visibility?: number;
    reinforcementDelay?: boolean;
    vehicleCostReduction?: boolean;
    randomEncounters?: boolean;
    fatigueRate?: number;
    moraleBonus?: boolean;
    enemyResurrection?: boolean;
    techInterference?: boolean;
  };
  flavorText: string;

  constructor(args: {
    id: string;
    name: string;
    classification: string;
    allegiance: string;
    biome: string;
    threatLevel: number;
    strategicValue: number;
    population: string;
    environmentalHazards?: string[];
    primaryEnemy?: string;
    planetaryTraits?: string[];
    missionModifiers?: object;
    flavorText?: string;
  });
}
export { Planet };

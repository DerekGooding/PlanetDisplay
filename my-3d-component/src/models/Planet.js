export class Planet
{
    constructor({
        id,
        name,
        classification,
        allegiance,
        biome,
        threatLevel,
        strategicValue,
        population,
        environmentalHazards = [],
        primaryEnemy,
        planetaryTraits = [],
        missionModifiers = {},
        flavorText
    })
    {
        this.id = id;
        this.name = name;
        this.classification = classification;
        this.allegiance = allegiance;
        this.biome = biome;
        this.threatLevel = threatLevel;
        this.strategicValue = strategicValue;
        this.population = population;
        this.environmentalHazards = environmentalHazards;
        this.primaryEnemy = primaryEnemy;
        this.planetaryTraits = planetaryTraits;
        this.missionModifiers = missionModifiers;
        this.flavorText = flavorText;
    }
}

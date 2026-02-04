import { Planet } from "../models/Planet";

export var planets =
[
    new Planet({
        id: "karthax-prime",
        name: "Karthax Prime",
        classification: "Hive World",
        allegiance: "Imperium",
        biome: "Polluted Megacity",
        threatLevel: 7,
        strategicValue: 8,
        population: "87 Billion",
        environmentalHazards: ["Toxic Smog", "Hive Quakes", "Radiation Zones"],
        primaryEnemy: "Genestealer Cult",
        planetaryTraits: [
            "Vertical Battlefields",
            "Civilian Density",
            "Collapsed Transit Lines"
        ],
        missionModifiers: {
            visibility: -1,
            reinforcementDelay: true
        },
        flavorText: "Once a shining jewel of Imperial industry, Karthax Prime now groans beneath endless manufactoria and creeping cult infestations."
    }),

    new Planet({
        id: "vorgath-forge",
        name: "Vorgath Forge",
        classification: "Forge World",
        allegiance: "Imperium",
        biome: "Industrial Wastes",
        threatLevel: 6,
        strategicValue: 9,
        population: "12 Billion (mostly servitors)",
        environmentalHazards: ["Magma Vents", "Electro-Storms"],
        primaryEnemy: "Dark Mechanicum",
        planetaryTraits: [
            "Automated Defenses",
            "Machine Worship",
            "Heavy Armor Presence"
        ],
        missionModifiers: {
            vehicleCostReduction: true
        },
        flavorText: "The sacred forges of Vorgath churn out war engines day and night, guarded by Skitarii legions and merciless logic."
    }),

    new Planet({
        id: "helscar",
        name: "Helscar",
        classification: "Death World",
        allegiance: "Contested",
        biome: "Volcanic Jungles",
        threatLevel: 9,
        strategicValue: 5,
        population: "Sparse Tribal Settlements",
        environmentalHazards: ["Predatory Fauna", "Lava Flows", "Spore Clouds"],
        primaryEnemy: "Tyranids",
        planetaryTraits: [
            "Hostile Wildlife",
            "Unstable Terrain",
            "Limited Extraction Zones"
        ],
        missionModifiers: {
            randomEncounters: true,
            fatigueRate: +1
        },
        flavorText: "Helscar devours the unprepared. Even Space Marines tread carefully beneath its burning canopies."
    }),

    new Planet({
        id: "saint-verena",
        name: "Saint Verena’s Rest",
        classification: "Shrine World",
        allegiance: "Imperium",
        biome: "Ash Plains and Cathedrals",
        threatLevel: 5,
        strategicValue: 7,
        population: "4 Billion Pilgrims",
        environmentalHazards: ["Relic Riots", "Faith Storms"],
        primaryEnemy: "Chaos Cultists",
        planetaryTraits: [
            "Fanatical Civilians",
            "Relic Sites",
            "Ecclesiarchy Support"
        ],
        missionModifiers: {
            moraleBonus: true
        },
        flavorText: "Billions come seeking redemption. Many find only martyrdom."
    }),

    new Planet({
        id: "nekros-beta",
        name: "Nekros Beta",
        classification: "Tomb World",
        allegiance: "Unknown",
        biome: "Crystal Deserts",
        threatLevel: 10,
        strategicValue: 10,
        population: "None (Detected)",
        environmentalHazards: ["Reality Distortion", "Phase Storms"],
        primaryEnemy: "Necrons",
        planetaryTraits: [
            "Reawakening Dynasties",
            "Living Metal Structures",
            "Temporal Anomalies"
        ],
        missionModifiers: {
            enemyResurrection: true,
            techInterference: true
        },
        flavorText: "Auspex readings fluctuate wildly. Something ancient stirs beneath the sands."
    })
];

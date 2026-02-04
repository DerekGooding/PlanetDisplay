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
    }),

    new Planet({
        id: "ultrix-reach",
        name: "Ultrix Reach",
        classification: "Frontier World",
        allegiance: "Imperium",
        biome: "Frozen Steppe",
        threatLevel: 4,
        strategicValue: 4,
        population: "900 Million",
        environmentalHazards: ["Blizzards", "Ice Fissures"],
        primaryEnemy: "Ork Raiders",
        planetaryTraits: [
            "Open Battlefields",
            "Sparse Cover",
            "Nomadic Settlements"
        ],
        missionModifiers: {
            movementPenalty: true
        },
        flavorText: "A quiet border world whose defenses are stretched thin by constant greenskin incursions."
    }),

    new Planet({
        id: "malvek-ix",
        name: "Malvek IX",
        classification: "Agri World",
        allegiance: "Imperium",
        biome: "Grain Seas",
        threatLevel: 3,
        strategicValue: 6,
        population: "2 Billion",
        environmentalHazards: ["Dust Storms", "Stampeding Grox"],
        primaryEnemy: "Chaos Marauders",
        planetaryTraits: [
            "Wide Open Fields",
            "Critical Food Production",
            "Minimal Fortifications"
        ],
        missionModifiers: {
            supplyBonus: true
        },
        flavorText: "Its endless crop plains feed three nearby sectors. Losing Malvek would doom millions."
    }),

    new Planet({
        id: "crux-oblivion",
        name: "Crux Oblivion",
        classification: "Daemon World",
        allegiance: "Chaos",
        biome: "Warp-Twisted Badlands",
        threatLevel: 10,
        strategicValue: 9,
        population: "Uncountable",
        environmentalHazards: ["Warp Storms", "Reality Fractures"],
        primaryEnemy: "Chaos Daemons",
        planetaryTraits: [
            "Warp Manifestations",
            "Unstable Physics",
            "Constant Hostile Pressure"
        ],
        missionModifiers: {
            sanityLoss: true,
            enemyBuffs: true
        },
        flavorText: "The planet screams. Even veteran Astartes struggle to distinguish enemy from nightmare."
    }),

    new Planet({
        id: "threxus-hollow",
        name: "Threxus Hollow",
        classification: "Mining World",
        allegiance: "Imperium",
        biome: "Subterranean Caverns",
        threatLevel: 6,
        strategicValue: 7,
        population: "5 Billion",
        environmentalHazards: ["Cave-ins", "Methane Leaks"],
        primaryEnemy: "Drukhari",
        planetaryTraits: [
            "Tunnel Networks",
            "Ambush Corridors",
            "Slave Raids"
        ],
        missionModifiers: {
            closeCombatBonus: true
        },
        flavorText: "Raiders strike from the shadows, vanishing back into the depths with their captives."
    }),

    new Planet({
        id: "elys-var",
        name: "Elys Var",
        classification: "Garden World",
        allegiance: "Contested",
        biome: "Temperate Forests",
        threatLevel: 5,
        strategicValue: 6,
        population: "3 Billion",
        environmentalHazards: ["Spore Bloom", "Psychic Echoes"],
        primaryEnemy: "Aeldari Corsairs",
        planetaryTraits: [
            "Dense Vegetation",
            "Ancient Ruins",
            "Hidden Webway Nodes"
        ],
        missionModifiers: {
            stealthBonus: true
        },
        flavorText: "Once idyllic, now scarred by hit-and-run xenos warfare and forgotten alien structures."
    }),

    new Planet({
        id: "bastion-rho",
        name: "Bastion Rho",
        classification: "Fortress World",
        allegiance: "Imperium",
        biome: "Rocky Plateaus",
        threatLevel: 7,
        strategicValue: 9,
        population: "1.5 Billion (mostly military)",
        environmentalHazards: ["Orbital Debris", "Artillery Zones"],
        primaryEnemy: "Traitor Guard",
        planetaryTraits: [
            "Layered Defenses",
            "Heavy Emplacements",
            "Veteran Garrisons"
        ],
        missionModifiers: {
            defensiveBonus: true
        },
        flavorText: "A bulwark against heresy, its surface is a maze of trenches and gun batteries."
    }),

    new Planet({
        id: "xarthis-deep",
        name: "Xarthis Deep",
        classification: "Ocean World",
        allegiance: "Unknown",
        biome: "Global Ocean",
        threatLevel: 6,
        strategicValue: 5,
        population: "Floating Hab-Clusters",
        environmentalHazards: ["Mega-Tides", "Void Krakens"],
        primaryEnemy: "T’au Expeditionary Force",
        planetaryTraits: [
            "Naval Combat",
            "Limited Landing Zones",
            "Subsurface Facilities"
        ],
        missionModifiers: {
            deploymentRestrictions: true
        },
        flavorText: "Beneath the waves lie research stations and secrets worth killing for."
    }),

    new Planet({
        id: "pyros-kai",
        name: "Pyros Kai",
        classification: "Volcanic World",
        allegiance: "Imperium",
        biome: "Ash Fields",
        threatLevel: 8,
        strategicValue: 6,
        population: "600 Million",
        environmentalHazards: ["Lava Rivers", "Ash Cyclones"],
        primaryEnemy: "World Eaters",
        planetaryTraits: [
            "Extreme Heat",
            "Rapid Attrition",
            "Constant Engagement"
        ],
        missionModifiers: {
            fatigueRate: +2
        },
        flavorText: "The sky burns. The ground burns. The enemy welcomes both."
    }),

    new Planet({
        id: "morvane-spire",
        name: "Morvane Spire",
        classification: "Hive World",
        allegiance: "Chaos",
        biome: "Corrupted Arcologies",
        threatLevel: 8,
        strategicValue: 8,
        population: "Unknown",
        environmentalHazards: ["Warp Plumes", "Civilian Mobs"],
        primaryEnemy: "Word Bearers",
        planetaryTraits: [
            "Mass Cult Presence",
            "Ritual Sites",
            "Vertical Slums"
        ],
        missionModifiers: {
            corruptionGain: true
        },
        flavorText: "Every spire hosts a sermon. Every sermon births another fanatic."
    }),

    new Planet({
        id: "aurelion-fall",
        name: "Aurelion Fall",
        classification: "Ruined World",
        allegiance: "Contested",
        biome: "Orbital Wreckage Fields",
        threatLevel: 7,
        strategicValue: 7,
        population: "Scattered Survivors",
        environmentalHazards: ["Zero-G Zones", "Radiation Bursts"],
        primaryEnemy: "Space Hulk Pirates",
        planetaryTraits: [
            "Floating Terrain",
            "Derelict Megastructures",
            "Salvage Opportunities"
        ],
        missionModifiers: {
            lootBonus: true
        },
        flavorText: "Shattered during a failed Exterminatus, its remains drift in silent orbit."
    })
];

import { Rarity } from "./TMCore/WAILA";

export const Config = {
    app_width: 1920,
    app_height: 1080,

    game_width: 1920,
    game_height: 1080,

    map_scale: 1,
    min_scale: 1,
    max_scale: 7,
    tiles_count_width: 10,
    tiles_count_height: 10,

    map_static_width: 0,
    map_static_height: 0,

    player_scale: 1,

    inventoryCellBorder: 5, // WHY IS IT HERE

    plants: [
        {
            plant: {
                tileset: "FarmingPlants",
                id: 10,
                growTime: 60000,
                animation: [11, 12, 13],
            },
            seed: {
                tileset: "Allitems",
                id: 16,
                price: 42,
                count: 1,
            },
            drop: {
                tileset: "Allitems",
                id: 17,
                price: 32,
                count: 4,
            },
            rarity: Rarity.Rare,
            name: "Carrot",
            description: "A tapering orange-coloured root eaten as a vegetable",
        },
        {
            plant: {
                tileset: "FarmingPlants",
                id: 15,
                growTime: 40000,
                animation: [16, 17, 18],
            },
            seed: {
                tileset: "Allitems",
                id: 24,
                price: 16,
                count: 1,
            },
            drop: {
                tileset: "Allitems",
                id: 25,
                price: 50,
                count: 1,
            },
            rarity: Rarity.Uncommon,
            name: "Cauliflower",
            description:
                "A cabbage of a variety which bears a large immature flower head of small creamy-white flower buds",
        },
        {
            plant: {
                tileset: "FarmingPlants",
                id: 20,
                growTime: 40000,
                animation: [21, 22, 23],
            },
            seed: {
                tileset: "Allitems",
                id: 32,
                price: 17,
                count: 1,
            },
            drop: {
                tileset: "Allitems",
                id: 33,
                price: 17,
                count: 3,
            },
            rarity: Rarity.Uncommon,
            name: "Tomato",
            description:
                "A glossy red, or occasionally yellow, pulpy edible fruit that is eaten as a vegetable or in salad",
        },
        {
            plant: {
                tileset: "FarmingPlants",
                id: 25,
                growTime: 40000,
                animation: [26, 27, 28],
            },
            seed: {
                tileset: "Allitems",
                id: 40,
                price: 16,
                count: 1,
            },
            drop: {
                tileset: "Allitems",
                id: 41,
                price: 25,
                count: 2,
            },
            rarity: Rarity.Uncommon,
            name: "Eggplant",
            description:
                "A widely cultivated perennial Asian herb (Solanum melongena) of the nightshade family yielding edible fruit",
        },
        {
            plant: {
                tileset: "FarmingPlants",
                id: 30,
                growTime: 120000,
                animation: [31, 32, 33],
            },
            seed: {
                tileset: "Allitems",
                id: 48,
                price: 230,
                count: 1,
            },
            drop: {
                tileset: "Allitems",
                id: 49,
                price: 140,
                count: 5,
            },
            rarity: Rarity.Legendary,
            name: "Blue Rose",
            description:
                "A blue rose is a flower of the genus Rosa (family Rosaceae) that presents blue-to-violet pigmentation",
        },
        {
            plant: {
                tileset: "FarmingPlants",
                id: 35,
                growTime: 60000,
                animation: [36, 37, 38],
            },
            seed: {
                tileset: "Allitems",
                id: 56,
                price: 45,
                count: 1,
            },
            drop: {
                tileset: "Allitems",
                id: 57,
                price: 42,
                count: 3,
            },
            rarity: Rarity.Rare,
            name: "Cabbage",
            description: "A cultivated plant eaten as a vegetable",
        },
        {
            plant: {
                tileset: "FarmingPlants",
                id: 40,
                growTime: 1000, // 25000
                animation: [41, 42, 43],
            },
            seed: {
                tileset: "Allitems",
                id: 64,
                price: 7,
                count: 1,
            },
            drop: {
                tileset: "Allitems",
                id: 65,
                price: 4,
                count: 5,
            },
            rarity: Rarity.Common,
            name: "Wheat",
            description: "A cereal grain that yields a fine white flour",
        },
        {
            plant: {
                tileset: "FarmingPlants",
                id: 45,
                growTime: 85000,
                animation: [46, 47, 48],
            },
            seed: {
                tileset: "Allitems",
                id: 72,
                price: 100,
                count: 1,
            },
            drop: {
                tileset: "Allitems",
                id: 73,
                price: 300,
                count: 1,
            },
            rarity: Rarity.Epic,
            name: "Pumpkin",
            description:
                "A large rounded orange-yellow fruit with a thick rind, the flesh of which can be used in sweet or savoury dishes",
        },
        {
            plant: {
                tileset: "FarmingPlants",
                id: 50,
                growTime: 60000,
                animation: [51, 52, 53],
            },
            seed: {
                tileset: "Allitems",
                id: 80,
                price: 40,
                count: 1,
            },
            drop: {
                tileset: "Allitems",
                id: 81,
                price: 62,
                count: 2,
            },
            rarity: Rarity.Rare,
            name: "Turnip",
            description:
                "A round root with white or cream flesh which is eaten as a vegetable and also has edible leaves",
        },
        {
            plant: {
                tileset: "FarmingPlants",
                id: 55,
                growTime: 120000,
                animation: [56, 57, 58],
            },
            seed: {
                tileset: "Allitems",
                id: 88,
                price: 230,
                count: 1,
            },
            drop: {
                tileset: "Allitems",
                id: 89,
                price: 700,
                count: 1,
            },
            rarity: Rarity.Legendary,
            name: "Carnation",
            description:
                "A plant of any of numerous often cultivated and usually double-flowered varieties or subspecies of an Old World pink",
        },
        {
            plant: {
                tileset: "FarmingPlants",
                id: 60,
                growTime: 85000,
                animation: [61, 62, 63],
            },
            seed: {
                tileset: "Allitems",
                id: 96,
                price: 100,
                count: 1,
            },
            drop: {
                tileset: "Allitems",
                id: 97,
                price: 100,
                count: 3,
            },
            rarity: Rarity.Epic,
            name: "Beetroot",
            description:
                "The edible dark red spherical root of a kind of beet, eaten as a vegetable",
        },
        {
            plant: {
                tileset: "FarmingPlants",
                id: 65,
                growTime: 240000,
                animation: [66, 67, 68],
            },
            seed: {
                tileset: "Allitems",
                id: 104,
                price: 740,
                count: 1,
            },
            drop: {
                tileset: "Allitems",
                id: 105,
                price: 2222,
                count: 1,
            },
            rarity: Rarity.Mythic,
            name: "Jelly Star",
            description: "???",
        },
        {
            plant: {
                tileset: "FarmingPlants",
                id: 70,
                growTime: 1000, //25000
                animation: [71, 72, 73],
            },
            seed: {
                tileset: "Allitems",
                id: 112,
                price: 7,
                count: 1,
            },
            drop: {
                tileset: "Allitems",
                id: 113,
                price: 5,
                count: 4,
            },
            rarity: Rarity.Common,
            name: "Cucumber",
            description:
                "A long, green-skinned fruit with watery flesh, usually eaten raw in salads or pickled",
        },
    ],

    trees: {},
};

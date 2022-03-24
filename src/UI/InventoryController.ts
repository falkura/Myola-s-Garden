import TiledMap from "../TMCore/TiledMap";
import { iPlantData } from "../TMCore/TMModel";
import { Rarity } from "../TMCore/WAILA";
import { List } from "./List";

export class InventoryController extends PIXI.Container {
    mapData: TiledMap;
    cellCount = 7;
    list!: List;

    constructor(mapData: TiledMap) {
        super();

        this.mapData = mapData;
        this.constructInventory();
        this.zIndex = 1000;
    }

    constructInventory = () => {
        //     cell.addListener("click", () => {
        //         this.choose(i);
        //     });
        this.list = new List(this.mapData, 7, 1, "inventory");
        this.list.isActive = true;
        this.addChild(this.list);

        setTimeout(() => {
            this.insertItem({
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
                    count: 14,
                },
                rarity: Rarity.Legendary,
                name: "Carnation",
                description:
                    "A plant of any of numerous often cultivated and usually double-flowered varieties or subspecies of an Old World pink",
            });
        }, 300);
    };

    insertItem = (data: iPlantData): boolean => {
        let done = false;
        this.list.cellMatrix.forEach((column) => {
            column.forEach((row) => {
                if (!done)
                    if (!row.item) {
                        row.setItem(data, "drop");
                        done = true;
                    } else {
                        if (row.item!.data.name === data.name) {
                            row.item.count += data.drop.count;
                            done = true;
                        }
                    }
            });
        });
        console.log(done);

        return done;

        console.log("not enough space");
        return false;
    };
}

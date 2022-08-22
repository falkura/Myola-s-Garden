import { List } from "./GameObjects/List/List";
import { iPlantData } from "./Model";
import TiledMap from "./TMCore/TiledMap";

export class ToolController extends PIXI.Container {
    mapData: TiledMap;
    cellCount = 7;
    list!: List;

    constructor(mapData: TiledMap) {
        super();

        this.mapData = mapData;
        this.zIndex = 1000;

        this.list = new List(this.mapData, 1, 3, "tools");
        // this.list.isActive = true;
        this.addChild(this.list);

        this.addTools();
    }

    addTools = () => {
        this.list.cellMatrix[0][0];
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

        return done;
    };
}

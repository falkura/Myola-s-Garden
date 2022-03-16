import TiledMap from "./TMCore/TiledMap";
import { iPlantData } from "./TMCore/TMModel";
import { Item } from "./UI/Item";
import { formatTime } from "./Util";

export class Seed extends Item {
    mapData: TiledMap;
    data: iPlantData;
    additionalData = "";

    constructor(data: iPlantData, mapData: TiledMap) {
        super(data, mapData, "inventory", "seed", true);

        this.data = data;
        this.additionalData = `Grow Time: ${formatTime(data.plant.growTime)}`;
        this.mapData = mapData;
    }
}

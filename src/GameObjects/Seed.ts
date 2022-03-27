import TiledMap from "../TMCore/TiledMap";
import { iPlantData } from "../Model";
import { Item } from "./Item";
import { formatTime } from "../Util";

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

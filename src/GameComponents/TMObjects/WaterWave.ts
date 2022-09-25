import { IObjectData } from "../../Models";
import TiledMap from "../../TMCore/TiledMap";
import TileSet from "../../TMCore/TileSet";
import { AnimatedTMObject } from "./BaseTMObject";

export class WaterWave extends AnimatedTMObject {
    constructor(tileset: TileSet, objectData: IObjectData, map: TiledMap) {
        super(tileset, objectData, map);

        this.sprite.removeInteractivity();

        const filter = new PIXI.filters.BlurFilter(0.5);
        this.sprite.alpha = 0.5;
        this.sprite.filters = [filter];
    }
}

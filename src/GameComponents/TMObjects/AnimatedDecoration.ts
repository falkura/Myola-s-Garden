import { IObjectData } from "../../Models";
import TiledMap from "../../TMCore/TiledMap";
import TileSet from "../../TMCore/TileSet";
import { AnimatedTMObject } from "./BaseTMObject";

export class AnimatedDecoration extends AnimatedTMObject {
    constructor(tileset: TileSet, objectData: IObjectData, map: TiledMap) {
        super(tileset, objectData, map);

        this.sprite.removeInteractivity();
    }
}

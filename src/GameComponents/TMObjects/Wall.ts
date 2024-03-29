import { IObjectData } from "../../Models";
import TiledMap from "../../TMCore/TiledMap";
import TileSet from "../../TMCore/TileSet";
import { StaticTMObject } from "./BaseTMObject";

export class Wall extends StaticTMObject {
    constructor(tileset: TileSet, objectData: IObjectData, map: TiledMap) {
        super(tileset, objectData, map);

        this.sprite.removeInteractivity();
    }
}

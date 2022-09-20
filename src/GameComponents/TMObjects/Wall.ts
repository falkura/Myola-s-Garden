import { IObjectData } from "../../Models";
import TiledMap from "../../TMCore/TiledMap";
import { BaseTMObject } from "./BaseTMObject";

export class Wall extends BaseTMObject {
    constructor(texture: PIXI.Texture, objectData: IObjectData, map: TiledMap) {
        super(texture, objectData, map);

        this.sprite.removeInteractivity();
    }
}

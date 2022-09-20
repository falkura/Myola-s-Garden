import { IObjectData, TileCompTypes } from "../../Models";
import TiledMap from "../../TMCore/TiledMap";
import { Clickable } from "../Clickable";

export class BaseTMObject {
    map: TiledMap;
    sprite!: Clickable;
    source: IObjectData;
    type!: TileCompTypes;
    num?: number;

    constructor(texture: PIXI.Texture, objectData: IObjectData, map: TiledMap) {
        this.source = objectData;
        this.map = map;
        this.setProps();

        this.setSprite(texture);
    }

    private setProps = () => {
        this.source.properties?.forEach(prop => {
            if (prop.name === "type") {
                this.type = prop.value as TileCompTypes;
            }

            if (prop.name === "num") {
                this.num = prop.value as number;
            }
        });
    };

    private setSprite = (texture: PIXI.Texture) => {
        this.sprite = new Clickable(texture);
        this.sprite.anchor.set(0.5);
    };

    public destroy = () => {
        this.sprite.destroy();
    };
}

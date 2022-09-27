import { IObjectData } from "../../Models";
import TiledMap from "../../TMCore/TiledMap";
import TileSet from "../../TMCore/TileSet";
import { StaticTMObject } from "./BaseTMObject";

export class Stone extends StaticTMObject {
    constructor(tileset: TileSet, objectData: IObjectData, map: TiledMap) {
        super(tileset, objectData, map);

        this.setHoverEffect("scale", 1.03);
        this.sprite.addPress(this.onPress);
    }

    onPress = () => {
        const title = "This is stone!";
        const button = {
            "  Log  ": () => {
                console.log(this);
            },
        };

        this.showPopup(title, button);
    };
}

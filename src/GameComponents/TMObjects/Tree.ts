import { IObjectData } from "../../Models";
import TiledMap from "../../TMCore/TiledMap";
import TileSet from "../../TMCore/TileSet";
import { StaticTMObject } from "./BaseTMObject";

export class Tree extends StaticTMObject {
    constructor(tileset: TileSet, objectData: IObjectData, map: TiledMap) {
        super(tileset, objectData, map);

        this.setHoverEffect("saturate");

        this.sprite.addPress(this.onPress);
    }

    onPress = () => {
        const title = "This is tree!";
        const button = {
            "  Log  ": () => {
                console.log(this);
            },
        };

        this.showPopup(title, button);
    };
}

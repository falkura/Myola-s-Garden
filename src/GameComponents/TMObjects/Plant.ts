import { IObjectData } from "../../Models";
import TiledMap from "../../TMCore/TiledMap";
import TileSet from "../../TMCore/TileSet";
import { StaticTMObject } from "./BaseTMObject";

export class Plant extends StaticTMObject {
    constructor(tileset: TileSet, objectData: IObjectData, map: TiledMap) {
        super(tileset, objectData, map);

        this.setHoverEffect("frame");
        this.sprite.addPress(this.onPress);
    }

    onPress = () => {
        const title = "This is Plant!";
        const button = {
            "  Log  ": () => {
                console.log(this);
            },
        };

        this.showPopup(title, button);
    };
}

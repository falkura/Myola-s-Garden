import { EVENTS } from "../../Events";
import { IObjectData } from "../../Models";
import TiledMap from "../../TMCore/TiledMap";
import TileSet from "../../TMCore/TileSet";
import { PopupData } from "../../TMObjectPopupController";
import { StaticTMObject } from "./BaseTMObject";

export class Stone extends StaticTMObject {
    constructor(tileset: TileSet, objectData: IObjectData, map: TiledMap) {
        super(tileset, objectData, map);

        this.sprite.hoverScale = 1.03;
        this.sprite.addPress(this.onPress);
    }

    onPress = () => {
        const event = new CustomEvent<PopupData>(EVENTS.Actions.TMObject.Press, {
            detail: {
                target: this,
                title: "This is stone!",
                buttons: {
                    "  Log  ": () => {
                        console.log(this);
                    },
                },
            },
        });

        document.dispatchEvent(event);
    };
}

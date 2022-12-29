import { EVENTS } from "../../Events";
import { IObjectData } from "../../Models";
import TiledMap from "../../TMCore/TiledMap";
import TileSet from "../../TMCore/TileSet";
import { PopupBase } from "../../TMObjectPopupController";
import { StaticTMObject } from "./BaseTMObject";
import { Plant } from "./Plant";

export class Dirt extends StaticTMObject {
    plant?: Plant;

    constructor(tileset: TileSet, objectData: IObjectData, map: TiledMap) {
        super(tileset, objectData, map);

        this.setHoverEffect("frame");
        this.sprite.addPress(this.onPress);
    }

    onPress = () => {
        const title = "This is dirt!";
        const button = {
            "  Log  ": () => {
                console.log(this);
            },
            "Set plant": this.initOnTilePlant,
        };

        this.showPopup(title, button);
    };

    initOnTilePlant = () => {
        document.dispatchEvent(new Event(EVENTS.Map.Click));

        const event = new CustomEvent<PopupBase>(EVENTS.Actions.Dirt.Seed, {
            detail: {
                target: this,
            },
        });

        document.dispatchEvent(event);
    };
}

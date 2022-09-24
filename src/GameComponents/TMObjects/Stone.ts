import { EVENTS } from "../../Events";
import { IObjectData } from "../../Models";
import TiledMap from "../../TMCore/TiledMap";
import { PopupData } from "../../TMObjectPopupController";
import { BaseTMObject } from "./BaseTMObject";

export class Stone extends BaseTMObject {
    constructor(texture: PIXI.Texture, objectData: IObjectData, map: TiledMap) {
        super(texture, objectData, map);

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

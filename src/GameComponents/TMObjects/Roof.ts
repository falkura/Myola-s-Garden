import { EVENTS } from "../../Events";
import { IObjectData } from "../../Models";
import TiledMap from "../../TMCore/TiledMap";
import { BaseTMObject } from "./BaseTMObject";

export class Roof extends BaseTMObject {
    constructor(texture: PIXI.Texture, objectData: IObjectData, map: TiledMap) {
        super(texture, objectData, map);

        this.sprite.hoverScale = 1;
        this.sprite.hoverAfterUp = false;
        this.sprite.cursor = "auto";
        this.sprite.disableUnpress = true;

        this.sprite.addHover(() => {
            document.dispatchEvent(new CustomEvent(EVENTS.Actions.Roof.Hover, { detail: this.num! }));
        });

        this.sprite.addUnhover(() => {
            document.dispatchEvent(new CustomEvent(EVENTS.Actions.Roof.Unhover, { detail: this.num! }));
        });
    }
}

import { EVENTS } from "../../Events";
import { IObjectData } from "../../Models";
import TiledMap from "../../TMCore/TiledMap";
import TileSet from "../../TMCore/TileSet";
import { StaticTMObject } from "./BaseTMObject";

export class Roof extends StaticTMObject {
    constructor(tileset: TileSet, objectData: IObjectData, map: TiledMap) {
        super(tileset, objectData, map);

        this.sprite.hoverScale = 1;
        this.sprite.hoverAfterUp = false;
        this.sprite.cursor = "auto";
        this.sprite.disableUnpress = true;

        this.sprite.addHover(() => {
            document.dispatchEvent(new CustomEvent(EVENTS.Actions.Roof.Hover, { detail: this.props.num! }));
        });

        this.sprite.addUnhover(() => {
            document.dispatchEvent(new CustomEvent(EVENTS.Actions.Roof.Unhover, { detail: this.props.num! }));
        });
    }
}

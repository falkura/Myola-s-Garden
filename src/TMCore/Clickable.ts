import { ClickableNew } from "../ClickableNew";
import { EVENTS } from "../Events";
import TiledMap from "./TiledMap";
import TileSet from "./TileSet";
import { iPlantData } from "./TMModel";

export class Clickable extends ClickableNew {
    is_hovered = false;
    data: iPlantData;
    additionalData = "";
    mapData: TiledMap;
    tileset: TileSet;

    constructor(
        data: iPlantData,
        id: number,
        tileset: TileSet,
        mapData: TiledMap
    ) {
        super(tileset!.textures[id]);

        this.tileset = tileset;
        this.mapData = mapData;
        this.data = data;

        this.addHover(this.additionalHover);
        this.addUnhover(this.additionalUnhover);
    }

    additionalHover = () => {
        document.dispatchEvent(
            new CustomEvent<{ data: iPlantData; time: string }>(
                EVENTS.WAILA.Set,
                {
                    detail: {
                        data: this.data,
                        time: this.additionalData,
                    },
                }
            )
        );
    };

    additionalUnhover = () => {
        document.dispatchEvent(new Event(EVENTS.WAILA.Clean));
    };
}

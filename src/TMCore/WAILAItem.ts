import { Clickable } from "../Clickable";
import { EVENTS } from "../Events";
import TiledMap from "./TiledMap";
import TileSet from "./TileSet";
import { iPlantData } from "./TMModel";
import { WAILAData } from "./WAILA";

export class WAILAItem extends Clickable {
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
            new CustomEvent<WAILAData>(EVENTS.WAILA.Set, {
                detail: {
                    title: this.data.name,
                    additionalData: this.additionalData,
                },
            })
        );
    };

    additionalUnhover = () => {
        document.dispatchEvent(new Event(EVENTS.WAILA.Clean));
    };
}

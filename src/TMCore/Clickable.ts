import { EVENTS } from "../Events";
import TiledMap from "./TiledMap";
import TileSet from "./TileSet";
import { iPlantData, iRightClick } from "./TMModel";

export interface iClickableEvents {
    left?: () => void;
    right?: iRightClick[];
}

export class Clickable extends PIXI.Sprite {
    is_hovered = false;
    on_click?: () => void;
    data: iPlantData;
    additionalData = "";
    mapData: TiledMap;
    tileset: TileSet;
    defaultScale = 1;

    constructor(
        data: iPlantData,
        id: number,
        tileset: TileSet,
        mapData: TiledMap,
        events?: iClickableEvents
    ) {
        super(tileset!.textures[id]);

        this.tileset = tileset;
        this.mapData = mapData;
        this.data = data;

        this.setupInteractivity(events);
    }

    setupInteractivity = (events?: iClickableEvents) => {
        this.interactive = true;
        this.cursor = "pointer";

        if (events?.left) {
            this.setOnClick(events.left);
        }

        if (events?.right) {
            this.rightClickEvent(events.right);
        }

        this.addListener("click", this.leftClickEvent);
        this.addListener("mouseover", this.hoverEvent);
        this.addListener("mouseout", this.unhoverEvent);
        this.addListener("mouseup", this.unpressEvent);
        this.addListener("mouseupoutside", this.unpressEvent);
    };

    setOnClick = (callback: () => any) => {
        this.on_click = callback;
    };

    addOption = () => {};
    removeOption = () => {};
    changeOption = () => {};

    update = () => {
        console.log(1);
    };

    leftClickEvent = () => {
        console.log(this.data.name);
        this.scale.set(this.defaultScale);

        if (this.on_click) {
            this.on_click();
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rightClickEvent = (events: iRightClick[]) => {
        // events.forEach()
    };

    unpressEvent = () => {
        this.scale.set(this.defaultScale);
        document.dispatchEvent(new Event(EVENTS.WAILA.Clean));
    };

    hoverEvent = () => {
        this.is_hovered = true;
        this.scale.set(this.defaultScale * 1.2);

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

    unhoverEvent = () => {
        this.is_hovered = false;
        this.scale.set(this.defaultScale);

        document.dispatchEvent(new Event(EVENTS.WAILA.Clean));
    };
}

import { EVENTS } from "../Events";
import TiledMap from "./TiledMap";
import TileSet from "./TileSet";
import { iDescription, iPlantData, iRightClick } from "./TMModel";

export interface iClickableEvents {
    left?: () => void;
    right?: iRightClick[];
}

export class Clickable extends PIXI.Sprite {
    is_hovered = false;
    on_click?: () => void;
    description: iDescription;
    mapData: TiledMap;
    tileset: TileSet;

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

        this.description = {
            title: data.name,
            info: data.description,
            rarity: data.rarity,
        };

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

    setOnClick = (callback: () => void) => {
        this.on_click = callback;
    };

    addOption = () => {};
    removeOption = () => {};
    changeOption = () => {};
    update = () => {};

    leftClickEvent = () => {
        console.log(this.description.title);
        this.scale.set(1);
        if (this.on_click) {
            this.on_click();
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rightClickEvent = (events: iRightClick[]) => {
        // events.forEach()
    };

    unpressEvent = () => {
        this.scale.set(1);
        if (this.is_hovered) this.hoverEvent();
    };

    hoverEvent = () => {
        this.is_hovered = true;
        this.scale.set(1.2);

        document.dispatchEvent(
            new CustomEvent<iDescription>(EVENTS.WAILA.Set, {
                detail: {
                    title: this.description.title,
                    info: this.description.info,
                    time: this.description.time,
                },
            })
        );
    };

    unhoverEvent = () => {
        this.is_hovered = false;
        this.scale.set(1);

        document.dispatchEvent(new Event(EVENTS.WAILA.Clean));
    };
}

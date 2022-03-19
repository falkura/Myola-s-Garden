import { InteractionEvent } from "pixi.js";
import TiledMap from "../TMCore/TiledMap";
import { iPlantData } from "../TMCore/TMModel";
import { InventoryItem } from "./InventoryItem";
import { ItemType } from "./Item";

export class ListCell extends PIXI.Container {
    private _isActive = false;
    bg!: PIXI.Graphics;
    item?: InventoryItem;
    mapData: TiledMap;
    size: number;
    isPotential = false;

    id: number;
    dragging = false;
    startX = 0;
    startY = 0;

    constructor(size: number, mapData: TiledMap, id: number) {
        super();

        this.mapData = mapData;
        this.size = size;
        this.id = id;

        // this.interactive = true;
        // this.addListener("mousedown", this.on_click);
        this.createBg();
    }

    hoverEvent = () => {
        if (!this.item) {
            this.isPotential = true;
        }
        this.bg.alpha = 2;
    };

    unhoverEvent = () => {
        this.isPotential = false;
        this.bg.alpha = 1;
    };

    on_click = () => {
        this.isActive = true;
    };

    public set isActive(value: boolean) {
        this._isActive = value;
        if (value) {
            // this.zIndex = 10;
        } else {
            // this.zIndex = 1;
        }

        if (this.item) {
            console.log(this.item.data.name, value);
        }
    }

    public get isActive(): boolean {
        return this._isActive;
    }

    createBg = () => {
        this.bg = new PIXI.Graphics()
            .beginFill(0x222222, 0.1)
            .drawRoundedRect(0, 0, this.size, this.size, 5)
            .endFill();

        this.bg.pivot.set(this.size / 2);

        this.bg.interactive = true;
        // this.bg.zIndex = 1;
        this.bg.addListener("mouseover", this.hoverEvent);
        this.bg.addListener("mouseout", this.unhoverEvent);

        this.addChild(this.bg);
    };

    setItem = (item: iPlantData, type: ItemType, count?: number) => {
        this.item = new InventoryItem(item, this.mapData, type, this.id);

        this.item.setSize((this.width / 3) * 2, (this.height / 3) * 2);
        if (count) {
            this.item.count = count;
        }

        this.item.sprite.anchor.set(0.5);
        this.interactive = true;

        this.setupInteractivity();

        this.unhoverEvent();
        this.addChild(this.item);
    };

    setupInteractivity = () => {
        this.addListener("mousedown", this.pressEvent);
        this.addListener("mousemove", this.moveEvent);
        this.addListener("mouseup", this.upEvent);
        this.addListener("mouseupoutside", this.upEvent);

        this.bg.removeListener("mouseover", this.hoverEvent);
        this.bg.removeListener("mouseout", this.unhoverEvent);
    };

    pressEvent = (e: InteractionEvent) => {
        this.parent.zIndex = 2000;
        this.zIndex = 100;
        this.item!.interactiveChildren = false;

        this.dragging = true;
        this.startX = e.data.global.x - this.item!.x;
        this.startY = e.data.global.y - this.item!.y;
    };

    moveEvent = (e: InteractionEvent) => {
        if (this.dragging) {
            this.item!.x = e.data.global.x - this.startX;
            this.item!.y = e.data.global.y - this.startY;
        }
    };

    upEvent = () => {
        this.zIndex = 0;

        if (!this.item) return;

        this.parent.zIndex = 100;
        this.item!.interactiveChildren = true;
        this.dragging = false;
        this.startX = this.item!.x;
        this.startY = this.item!.y;

        document.dispatchEvent(
            new CustomEvent<ListCell>("dropped", { detail: this })
        );
    };

    cleanup = () => {
        // if (this.item) {
        this.item!.sprite.removeAllListeners();

        this.removeChild(this.item!.sprite);
        this.item!.cleanup();
        this.item = undefined;
        // }

        this.bg.addListener("mouseover", this.hoverEvent);
        this.bg.addListener("mouseout", this.unhoverEvent);
    };
}

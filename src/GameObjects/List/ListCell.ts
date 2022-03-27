import { InteractionEvent } from "pixi.js";
import { LogicState } from "../../logic_state";
import { iPlantData } from "../../Model";
import TiledMap from "../../TMCore/TiledMap";
import { InventoryItem } from "../InventoryItem";
import { ItemType } from "../Item";

export class ListCell extends PIXI.Container {
    private _isActive = false;
    bg!: PIXI.Graphics;
    item?: InventoryItem;
    mapData: TiledMap;
    size: number;
    isPotential = false;

    name: string;
    dragging = false;
    startX = 0;
    startY = 0;

    constructor(size: number, mapData: TiledMap, name: string) {
        super();

        this.mapData = mapData;
        this.size = size;
        this.name = name;

        this.createBg();
    }

    hoverEvent = () => {
        if (this.name === "shopBuy") return;
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
        this.item = new InventoryItem(item, this.mapData, type, this.name);

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

    removeInteractivity = () => {
        this.removeListener("mousedown", this.pressEvent);
        this.removeListener("mousemove", this.moveEvent);
        this.removeListener("mouseup", this.upEvent);
        this.removeListener("mouseupoutside", this.upEvent);

        this.bg.addListener("mouseover", this.hoverEvent);
        this.bg.addListener("mouseout", this.unhoverEvent);
    };

    pressEvent = (e: InteractionEvent) => {
        if (!LogicState.isShift) {
            this.parent.zIndex = 2000;
            this.zIndex = 100;
            this.item!.interactiveChildren = false;
            this.dragging = true;
            this.startX = e.data.global.x - this.item!.x;
            this.startY = e.data.global.y - this.item!.y;
        } else {
            document.dispatchEvent(
                new CustomEvent<ListCell>("shifted", { detail: this })
            );
        }
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
        this.removeChild(this.item!.sprite);
        this.item!.cleanup();
        this.item = undefined;

        this.removeInteractivity();
    };
}

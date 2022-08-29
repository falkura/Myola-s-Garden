import { IGardenItemData, IItemType } from "../../Models";
import TiledMap from "../../TMCore/TiledMap";
import { ListItem } from "./ListItem";

export class ListCell extends PIXI.Container {
    // private _isActive = false;
    bg!: PIXI.Graphics;
    map: TiledMap;
    size: number;
    item?: ListItem;

    isHovered = false;

    dragging = false;
    startX = 0;
    startY = 0;

    constructor(size: number, map: TiledMap, name: string) {
        super();

        this.map = map;
        this.size = size;
        this.name = name;

        this.createCell();
    }

    createCell = () => {
        this.createBg();
        this.addEventListeners();
    };

    createBg = () => {
        this.bg = new PIXI.Graphics().beginFill(0x222222, 0.1).drawRoundedRect(0, 0, this.size, this.size, 5).endFill();
        this.bg.pivot.set(this.size / 2);
        this.bg.interactive = true;
        this.bg.zIndex = -100;

        this.addChild(this.bg);
    };

    hoverEvent = () => {
        this.isHovered = true;
        if (!this.item) this.bg.alpha = 2;
    };

    unhoverEvent = () => {
        this.isHovered = false;
        this.bg.alpha = 1;
    };

    // on_click = () => {
    //     this.isActive = true;
    // };

    // public set isActive(value: boolean) {
    //     this._isActive = value;
    //     if (value) {
    //         // this.zIndex = 10;
    //     } else {
    //         // this.zIndex = 1;
    //     }

    //     if (this.item) {
    //         console.log(this.item.data.name, value);
    //     }
    // }

    // public get isActive(): boolean {
    //     return this._isActive;
    // }

    setItem = (item: IGardenItemData, type?: IItemType, count?: number) => {
        console.log("setted");
        this.cleanUp();
        if (!type) type = "drop";

        this.item = new ListItem(this, item, type);
        this.item.cleanUpCallback = this.cleanUp;

        this.addChild(this.item);

        this.item.setSize((this.size / 3) * 2, (this.size / 3) * 2);

        if (count) {
            this.item.count = count;
        }

        this.unhoverEvent();
        // this.removeEventListeners();
    };

    addEventListeners = () => {
        this.bg.addListener("mouseover", this.hoverEvent);
        this.bg.addListener("mouseout", this.unhoverEvent);
    };

    removeEventListeners = () => {
        this.bg.removeListener("mouseover", this.hoverEvent);
        this.bg.removeListener("mouseout", this.unhoverEvent);
    };

    cleanUp = () => {
        this.item = undefined;
        this.addEventListeners();
        this.unhoverEvent();
    };
}

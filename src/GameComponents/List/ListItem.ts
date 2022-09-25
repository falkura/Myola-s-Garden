import { InteractionEvent } from "pixi.js";
import { EVENTS } from "../../Events";
import { Global_Vars } from "../../GlobalVariables";
import { IGardenItemData, IItemType } from "../../Models";
import { TextStyles } from "../../TextStyles";
import { Clickable } from "../Clickable";
import { ListCell } from "./ListCell";

export class ListItem extends PIXI.Container {
    private _count = 1;

    sprite!: Clickable;
    type: IItemType;
    data: IGardenItemData;
    parentCell: ListCell;

    countText!: PIXI.Text;
    countLimit = 99;

    dragging = false;
    startX = 0;
    startY = 0;

    grandParentZIndex = 0;
    parentZIndex = 0;

    cleanUpCallback?: () => void;

    constructor(cell: ListCell, itemData: IGardenItemData, type: IItemType) {
        super();

        this.parentCell = cell;
        this.type = type;
        this.data = itemData;

        this.createText();
        this.createSprite();
        this.addEventListener();
    }

    createText = () => {
        this.countText = new PIXI.Text("", TextStyles.itemCount);
        this.countText.anchor.set(0.25, 0);
        this.countText.zIndex = 5;

        this.addChild(this.countText);
    };

    createSprite = () => {
        const tileset = this.parentCell.map.getTilesetByName(this.data[this.type].tileset);
        const texture = tileset!.textures[this.data[this.type].id];

        this.sprite = new Clickable(texture);
        this.sprite.anchor.set(0.5);
        this.interactive = true;

        this.addChild(this.sprite);
    };

    addEventListener = () => {
        this.addListener("pointerdown", this.pressEvent);
        this.addListener("pointermove", this.moveEvent);
        this.addListener("pointerup", this.upEvent);
        this.addListener("pointerupoutside", this.upEvent);

        this.sprite.addHover(this.parentCell.hoverEvent);
        this.sprite.addUnhover(this.parentCell.unhoverEvent);
    };

    pressEvent = (e: InteractionEvent) => {
        if (!Global_Vars.is_shift) {
            this.grandParentZIndex = this.parent.parent.zIndex;
            this.parentZIndex = this.parent.zIndex;

            this.parent.parent.zIndex = 10000;
            this.parent.zIndex = 10000;

            this.interactiveChildren = false;
            this.dragging = true;

            this.startX = e.data.global.x - this.x;
            this.startY = e.data.global.y - this.y;
        } else {
            document.dispatchEvent(new CustomEvent<ListItem>(EVENTS.Actions.Inventory.Shifted, { detail: this }));
        }
    };

    moveEvent = (e: InteractionEvent) => {
        if (this.dragging) {
            this.x = e.data.global.x - this.startX;
            this.y = e.data.global.y - this.startY;

            Global_Vars.dragging_item = true;
        }
    };

    upEvent = () => {
        this.parent.parent.zIndex = this.grandParentZIndex;
        this.parent.zIndex = this.parentZIndex;

        this.interactiveChildren = true;
        this.dragging = false;

        Global_Vars.dragging_item = false;

        this.startX = this.x;
        this.startY = this.y;

        document.dispatchEvent(new CustomEvent<ListItem>(EVENTS.Actions.Inventory.Dropped, { detail: this }));
    };

    setSize = (width: number, height: number) => {
        if (!this.sprite) return;

        this.sprite.width = width;
        this.sprite.height = height;
        this.sprite.defaultScale = this.sprite.scale;

        this.countText.scale.set(1 / this.sprite.scale.x);
        this.countText.position.set(this.sprite.width / 2 - this.countText.width / 2, this.countText.height / 2 - 1);
    };

    update = () => {
        // const sum = this.count > 1 ? ` (${this.getPrice() * this.count})` : "";
        // this.additionalData = `Price: ${this.getPrice()}${sum})`;
    };

    public set count(value: number) {
        this._count = value;

        if (value <= 1) {
            this.countText.text = "";
        } else if (value <= this.countLimit) {
            this.countText.text = String(this.count);
        } else {
            this.countText.text = `${this.countLimit}+`;
        }

        this.update();
    }

    public get count(): number {
        return this._count;
    }

    cleanUp = () => {
        if (this.cleanUpCallback) this.cleanUpCallback();

        this.sprite.cleanUp();
        this.destroy();
    };
}

import { TextStyles } from "../TextStyles";
import TiledMap from "../TMCore/TiledMap";
import { iPlantData } from "../TMCore/TMModel";
import { Item, ItemType } from "./Item";

export class ListCell extends PIXI.Container {
    private _isActive = false;
    private _count = 0;
    bg!: PIXI.Graphics;
    item?: Item;
    mapData: TiledMap;
    size: number;
    countText!: PIXI.Text;
    countLimit = 99;

    constructor(size: number, mapData: TiledMap) {
        super();
        this.mapData = mapData;
        this.size = size;

        this.addListener("click", this.on_click);
        this.createBg();
        this.createText();
    }

    on_click = () => {
        this.isActive = true;
    };

    public set isActive(value: boolean) {
        this._isActive = value;
        if (value) {
            this.zIndex = 10;
        } else {
            this.zIndex = 1;
        }

        if (this.item) {
            console.log(this.item.data.name, value);
        }
    }

    public get isActive(): boolean {
        return this._isActive;
    }

    public set count(value: number) {
        this._count = value;

        if (value <= 1) {
            this.countText!.text = "";
        } else if (value <= this.countLimit) {
            this.countText!.text = String(this.count);
        } else {
            this.countText!.text = `${this.countLimit}+`;
        }

        this.update();
    }

    public get count(): number {
        return this._count;
    }

    createBg = () => {
        this.bg = new PIXI.Graphics()
            .beginFill(0x222222, 0.1)
            .drawRoundedRect(0, 0, this.size, this.size, 5)
            .endFill();

        this.bg.pivot.set(this.size / 2);
        this.addChild(this.bg);
    };

    createText = () => {
        this.countText = new PIXI.Text("", TextStyles.itemCount);
        this.countText.anchor.set(1, 0);
        this.countText.zIndex = 5;
        this.countText.position.set(this.size / 2, 8);
        // this.countText.position.set(this.width - 15, this.height - 15);

        this.addChild(this.countText);
    };

    setItem = (item: iPlantData, type: ItemType, count?: number) => {
        this.item = new Item(item, this.mapData, "inventory", type, false);

        this.count = count ? count : item[type].count;

        this.item.sprite.width = (this.width / 3) * 2;
        this.item.sprite.height = (this.height / 3) * 2;
        this.item.sprite.defaultScale = this.item.sprite.scale.x;
        this.item.sprite.anchor.set(0.5);

        this.addChild(this.item.sprite);
        this.update();
    };

    update = () => {
        if (this.item) {
            const sum =
                this.count > 1 ? ` (${this.item.getPrice() * this.count})` : "";

            this.item.additionalData = `Price: ${this.item.getPrice()}${sum})`;
        }
    };

    cleanup = () => {
        if (this.item) {
            this.removeChild(this.item.sprite);
            this.item.cleanup();
            this.item = undefined;
        }
        this.count = 0;
    };
}

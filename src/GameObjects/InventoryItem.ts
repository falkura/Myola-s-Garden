import { TextStyles } from "../Config/TextStyles";
import TiledMap from "../TMCore/TiledMap";
import { iPlantData } from "../Model";
import { Item, ItemType } from "./Item";

export class InventoryItem extends Item {
    private _count = 0;
    countText!: PIXI.Text;
    countLimit = 99;

    name: string;

    constructor(
        item: iPlantData,
        mapData: TiledMap,
        type: ItemType,
        name: string
    ) {
        super(item, mapData, "inventory", type, false);

        this.name = name;
        this.createText();
    }

    createText = () => {
        this.countText = new PIXI.Text("", TextStyles.itemCount);
        this.countText.anchor.set(1, 0);
        this.countText.zIndex = 5;

        this.count = this.data[this.type].count;

        this.sprite.addChild(this.countText);
    };

    setSize = (width: number, height: number) => {
        this.sprite.width = width;
        this.sprite.height = height;
        this.sprite.defaultScale = this.sprite.scale.x;

        this.countText.scale.set(1 / this.sprite.scale.x);
        this.countText.position.set(
            this.sprite.width / 2 - this.countText.width / 2,
            this.countText.height / 2 - 1
        );
    };

    update = () => {
        const sum = this.count > 1 ? ` (${this.getPrice() * this.count})` : "";
        this.additionalData = `Price: ${this.getPrice()}${sum})`;
    };

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
}

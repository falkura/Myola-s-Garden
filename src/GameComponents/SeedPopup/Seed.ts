import { IGardenItemData } from "../../Models";
import { TextStyles } from "../../TextStyles";
import TiledMap from "../../TMCore/TiledMap";
import { Clickable } from "../Clickable";

export class Seed extends PIXI.Container {
    private _count = 1;

    sprite!: Clickable;
    data: IGardenItemData;
    map: TiledMap;

    countText!: PIXI.Text;
    countLimit = 99;

    cleanUpCallback?: () => void;

    constructor(data: IGardenItemData, map: TiledMap) {
        super();

        this.data = data;
        this.map = map;

        this.createSprite();
        this.createText();
        this.addListener("pointerdown", this.pressEvent);
    }

    createText = () => {
        this.countText = new PIXI.Text("", TextStyles.itemCount);
        this.countText.anchor.set(0.25, 0);
        this.countText.zIndex = 5;

        this.addChild(this.countText);
    };

    createSprite = () => {
        const ts = this.map.getTilesetByName(this.data.seed.tileset);
        if (!ts) throw new Error("Incorrect plant config " + this.data);

        const texture = ts.textures[this.data.seed.id];

        this.sprite = new Clickable(texture);
        this.sprite.anchor.set(0.5);
        this.interactive = true;

        this.addChild(this.sprite);
    };

    pressEvent = () => {
        console.log("set this");
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

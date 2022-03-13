import anime, { AnimeTimelineInstance } from "animejs";
import { Config } from "../Config";
import { TextStyles } from "../TextStyles";
import { Clickable } from "../TMCore/Clickable";
import { Drop } from "../TMCore/Drop";
import ObjectTile from "../TMCore/ObjectTile";
import TiledMap from "../TMCore/TiledMap";

export class InventoryCell extends PIXI.Container {
    border!: PIXI.Graphics;
    mapData: TiledMap;
    itemData?: ObjectTile;
    _isActive = false;
    id?: number;
    _count!: number;
    tileset?: string;

    bg?: PIXI.Graphics;
    sprite?: Clickable;
    countText?: PIXI.Text;
    animation!: AnimeTimelineInstance;
    activeItem?: number;
    filter!: PIXI.filters.ColorMatrixFilter;
    countLimit = 99;

    constructor(mapData: TiledMap) {
        super();
        this.mapData = mapData;

        this.createBg();
        this.createBorder();
        this.createText();

        this.addEventListeners();
    }

    createBg = () => {
        this.bg = new PIXI.Graphics()
            .beginFill(0x000000, 0.2)
            .drawRect(0, 0, 60, 60)
            .endFill();

        this.filter = new PIXI.filters.ColorMatrixFilter();
        this.filter.saturate(0.5, true);
        this.filters = [this.filter];

        this.hitArea = this.bg.getBounds();
        this.addChild(this.bg);
    };

    createBorder = () => {
        this.border = new PIXI.Graphics()
            .lineStyle(Config.inventoryCellBorder, 0x00ecfa, 1)
            .drawRect(0, 0, 60, 60)
            .endFill();

        this.animation = anime.timeline({ autoplay: false, loop: true });
        // .add({
        //     duration: 500,
        //     targets: this.filters[0],
        //     easing: "linear",
        //     alpha: [0, 2],
        //     direction: "alternate", //need for reverse
        //     // loop: true,
        //     // autoplay: false,
        // });

        this.addChild(this.border);
    };

    animationStart = () => {
        this.filters = [this.filter];
        this.animation.play();
    };

    animationStop = () => {
        this.filters = [];
        this.animation.restart();
        this.animation.pause();
    };

    createText = () => {
        this.countText = new PIXI.Text("", TextStyles.itemCount);
        this.countText.anchor.set(0.5);
        this.countText.zIndex = 5;
        this.countText.position.set(this.width - 15, this.height - 15);

        this.addChild(this.countText);
    };

    setItem = (item: Drop) => {
        this.cleanUp();

        this.interactive = true;
        this.cursor = "pointer";

        this.count = item.data.drop.count;
        this.countText!.text = String(this.count);
        this.id = item.data.drop.id;
        this.name = item.data.name;

        const tileset = this.mapData.getTileset(item.data.drop.tileset)!;
        this.sprite = new Clickable(
            item.data,
            item.data.drop.id,
            tileset,
            this.mapData
        );

        this.sprite.width = (this.width / 3) * 2;
        this.sprite.height = (this.height / 3) * 2;
        this.sprite.defaultScale = this.sprite.scale.x;
        this.sprite.anchor.set(0.5);
        this.sprite.x = this.bg!.width / 2;
        this.sprite.y = this.bg!.height / 2;
        this.sprite.additionalData = `Price: ${this.sprite.data.drop.price} (${
            this.sprite.data.drop.price * this.count
        })`;
        this.addChild(this.sprite);

        this.animation.add({
            duration: 500,
            delay: 1000,
            targets: this.sprite,
            keyframes: [
                { y: this.sprite.y - 2 },
                { y: this.sprite.y },
                { y: this.sprite.y + 2 },
                { y: this.sprite.y },
            ],
            // loop: true,
            diraction: "alternate",
            // autoplay: false,
        });
    };

    addItem = (count = 1) => {
        this.count += count;
        this.sprite!.additionalData = `Price: ${
            this.sprite!.data.drop.price
        } (${this.sprite!.data.drop.price * this.count})`;
    };

    removeItem = (count = 1) => {
        if (!this.id) return;
        if (this.count - count < 0) {
            throw new Error();
        } else if (this.count - count === 0) {
            this.cleanUp();
        } else {
            this.count -= count;
            this.sprite!.additionalData = `Price: ${
                this.sprite!.data.drop.price
            } (${this.sprite!.data.drop.price * this.count})`;
        }
    };

    addEventListeners = () => {
        this.addListener("click", this.on_click);
    };

    on_click = () => {
        this.isActive = true;
    };

    cleanUp = () => {
        if (this.sprite) {
            this.removeChild(this.sprite);
            this.sprite.destroy();
            this.sprite = undefined;
        }
        this.count = 0;
        this.id = undefined;
        this.name = "";
        this.tileset = "";
        this.interactive = false;
        this.cursor = "auto";
        this.animationStop();
    };

    public set isActive(value: boolean) {
        this._isActive = value;
        if (value) {
            this.zIndex = 10;
            this.animationStart();
        } else {
            this.zIndex = 1;
            this.animationStop();
        }
    }

    public get isActive(): boolean {
        return this._isActive;
    }

    public set count(value: number) {
        this._count = value;
        if (value === 0) {
            this.countText!.text = "";
        } else if (value <= this.countLimit) {
            this.countText!.text = String(this.count);
        } else {
            this.countText!.text = `${this.countLimit}+`;
        }
    }

    public get count(): number {
        return this._count;
    }
}

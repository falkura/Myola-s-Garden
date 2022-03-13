import anime, { AnimeInstance } from "animejs";
import { Config } from "../Config";
import { TextStyles } from "../TextStyles";
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
    sprite?: PIXI.Sprite;
    countText?: PIXI.Text;
    animation!: AnimeInstance;
    dot!: PIXI.Graphics;

    activeItem?: number;

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

        this.hitArea = this.bg.getBounds();
        this.addChild(this.bg);
    };

    createBorder = () => {
        this.border = new PIXI.Graphics()
            .lineStyle(Config.inventoryCellBorder, 0x00ecfa, 1)
            .drawRect(0, 0, 60, 60)
            .endFill();

        this.dot = new PIXI.Graphics()
            .beginFill(0xffffff, 1)
            .drawCircle(0, 0, 3)
            .endFill();
        this.dot.visible = false;

        this.border.addChild(this.dot);

        this.animation = anime({
            duration: 3000,
            targets: this.dot,
            easing: "easeInSine",
            // alpha: 1,
            keyframes: [{ x: 60 }, { y: 60 }, { x: 0 }, { y: 0 }],
            // direction: "alternate", need for reverse
            loop: true,
            autoplay: false,
        });

        this.addChild(this.border);
    };

    animationStart = () => {
        this.dot.visible = true;
        this.animation.play();
    };

    animationStop = () => {
        this.dot.visible = false;
        this.animation.pause();
    };

    createText = () => {
        this.countText = new PIXI.Text("", TextStyles.itemCount);
        this.countText.anchor.set(0.5);
        this.countText.zIndex = 5;
        this.countText.position.set(this.width - 15, this.height - 15);

        this.addChild(this.countText);
    };

    setItem = (data: Drop) => {
        this.cleanUp();

        this.interactive = true;
        this.cursor = "pointer";

        this.count = 1;
        this.countText!.text = String(this.count);
        this.id = data.data.id;
        this.name = data.data.name;

        this.sprite = new PIXI.Sprite(data.texture);
        this.sprite.width = (this.width / 3) * 2;
        this.sprite.height = (this.height / 3) * 2;
        this.sprite.anchor.set(0.5);
        this.sprite.x = this.bg!.width / 2;
        this.sprite.y = this.bg!.height / 2;
        this.addChild(this.sprite);
    };

    addItem = (count = 1) => {
        this.count += count;
    };

    removeItem = (count = 1) => {
        if (!this.id) return;
        if (this.count - count < 0) {
            throw new Error();
        } else if (this.count - count === 0) {
            this.cleanUp();
        } else {
            this.count -= count;
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
            this.animationStart();
        } else {
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

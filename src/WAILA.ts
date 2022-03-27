export const enum Rarity {
    Common = 0x8e8e8e,
    Uncommon = 0x76ba1b,
    Rare = 0x187bcd,
    Epic = 0xcc8899,
    Legendary = 0xffa500,
    Mythic = 0xcc1100,
}

export interface WAILAData {
    title: string;
    additionalData?: string;
    description?: string;
    rarity?: Rarity;
    code?: string;
}

import { EVENTS } from "./Events";
import { TextStyles } from "./Config/TextStyles";

export class WAILA extends PIXI.Container {
    title: PIXI.Text;
    description: PIXI.Text;
    additionalData: PIXI.Text;
    border!: PIXI.Graphics;
    rarity?: Rarity;
    bg: PIXI.Container;
    _width = 300;
    _height = 100;
    border_width = 3;
    offSet = 3;
    plate!: PIXI.Graphics;
    // mapData: TiledMap;

    constructor() {
        super();
        // this.mapData = mapData;
        this.bg = new PIXI.Container();
        this.addChild(this.bg);

        this.title = new PIXI.Text("", TextStyles.WAILATitle);
        this.title.anchor.set(0.5, 0);
        this.title.position.set(
            this._width / 2,
            this.border_width * 2 + this.offSet
        );

        this.additionalData = new PIXI.Text("", TextStyles.WAILAInfo);
        this.additionalData.anchor.set(0, 0.5);
        this.additionalData.position.set(
            this.border_width * 2 + this.offSet * 2,
            45
        );

        this.description = new PIXI.Text("", TextStyles.WAILADescription);
        this.description.style.wordWrapWidth =
            this._width - this.border_width * 4 - this.offSet * 4;
        this.description.position.set(
            this.border_width * 2 + this.offSet * 2,
            60
        );

        this.visible = false;

        document.addEventListener(EVENTS.WAILA.Set, this.setActive);
        document.addEventListener(EVENTS.WAILA.Clean, this.cleanup);
        this.draw();
    }

    draw = () => {
        this.plate = new PIXI.Graphics()
            .beginFill(0xaaaaaa, 0.8)
            .drawRect(0, 0, this._width, this._height)
            .endFill();

        this.border = new PIXI.Graphics();

        this.bg.addChild(this.plate);
        this.bg.addChild(this.border);
        this.bg.addChild(this.title, this.additionalData, this.description);
    };

    setActive = (event: Event) => {
        this.visible = true;
        const detail = (event as CustomEvent<WAILAData>).detail;

        this.title.text = detail.title;

        if (detail.additionalData) {
            this.additionalData.text = detail.additionalData;
        }

        if (detail.description) {
            this.description.text = detail.description;
        }

        if (detail.rarity) {
            this.setRarity(detail.rarity);
        } else {
            this.setRarity(Rarity.Common);
        }
    };

    cleanup = () => {
        this.title.text = "";
        this.additionalData.text = "";
        this.visible = false;
    };

    setRarity = (rarity: Rarity) => {
        this.rarity = rarity;

        this.plate.height =
            this.description.y +
            this.description.height +
            this.border_width * 4;

        this.border.clear();
        this.border = new PIXI.Graphics()
            .lineStyle(this.border_width, this.rarity, 0.9)
            .beginFill(this.rarity, 0.07)
            .drawRect(
                this.border_width * 2,
                this.border_width * 2,
                this._width - this.border_width * 4,
                this.plate.height - this.border_width * 4
            )
            .endFill();

        this.bg.addChildAt(this.border, 1);
    };

    update = () => {};
}

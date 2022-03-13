export const enum Rarity {
    Common = 0x8e8e8e,
    Uncommon = 0x76ba1b,
    Rare = 0x187bcd,
    Epic = 0xcc8899,
    Legendary = 0xffa500,
    Mythic = 0xcc1100,
}

import { EVENTS } from "../Events";
import { iDescription } from "./TMModel";

export class WAILA extends PIXI.Container {
    title: PIXI.Text;
    info: PIXI.Text;
    time: PIXI.Text;
    border?: PIXI.Graphics;
    // mapData: TiledMap;

    constructor() {
        super();
        // this.mapData = mapData;
        this.title = new PIXI.Text("");
        this.info = new PIXI.Text("");
        this.time = new PIXI.Text("");
        this.visible = false;

        document.addEventListener(EVENTS.WAILA.Set, this.setActive);
        document.addEventListener(EVENTS.WAILA.Clean, this.cleanup);
        this.draw();
    }

    draw = () => {
        const bg = new PIXI.Graphics()
            .beginFill(0xaaaaaa)
            .drawRect(0, 0, 100, 100)
            .endFill();

        bg.addChild(this.title);
        this.info.position.y = 60;
        bg.addChild(this.info);
        this.time.position.y = 30;
        bg.addChild(this.time);
        this.addChild(bg);
    };

    setActive = (event: Event) => {
        this.visible = true;
        const description = (event as CustomEvent<iDescription>).detail;

        this.title.text = description.title;

        if (description.info) {
            this.info.text = description.info;
        }

        if (description.time) {
            this.time.text = description.time;
        }
    };

    cleanup = () => {
        this.title.text = "";
        this.time.text = "";
        this.visible = false;
    };

    setRarity = () => {};
    update = () => {};
    resize = () => {};
}

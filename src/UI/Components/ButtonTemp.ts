import * as PIXI from "pixi.js";
import { Observer } from "../../Observer";
import { TextStyles } from "../../TextStyles";

export class ButtonTemp extends PIXI.Container implements Observer {
    event?: Event | CustomEvent;
    text: PIXI.Text;

    on_state_update?: () => void;

    constructor(texture: PIXI.Graphics, text: string) {
        super();
        this.addChild(texture);
        this.cursor = "pointer";
        this.interactive = true;
        this.on("pointerdown", this.press_event);

        this.text = new PIXI.Text(text, TextStyles.ShopInfo);
        this.text.anchor.set(0.5);
        this.text.position.set(texture.width / 2, texture.height / 2);

        this.addChild(this.text);
    }

    press_event = () => {
        if (this.event) {
            document.dispatchEvent(this.event);
        }
    };
}

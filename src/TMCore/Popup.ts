import { TextStyles } from "../TextStyles";

export class Popup extends PIXI.Container {
    graphics!: PIXI.Graphics;
    popupText!: PIXI.Text;
    _height!: number;

    constructor(text: string) {
        super();

        this.createText(text);
        this.createGraphics();

        this.scale.set(0.4);
    }

    createText = (text: string) => {
        this.popupText = new PIXI.Text(text, TextStyles.popup);
        this.popupText.resolution = 3;
        this.popupText.zIndex = 2;
        this.popupText.anchor.set(0.5);

        this.addChild(this.popupText);
    };

    createGraphics = () => {
        const width = this.popupText.width + 30;
        const height = this.popupText.height + 10;

        this.graphics = new PIXI.Graphics()
            .beginFill(0x222222, 0.7)
            .drawRect(-width / 2, -height / 2, width, height)
            .endFill();

        this.graphics.zIndex = 1;
        this._height = height;

        this.addChild(this.graphics);
    };
}

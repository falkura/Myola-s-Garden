import { core } from "../../PIXI/core";

export class BaseComponent extends core.Sprite {
    protected defaultScale = { x: 1, y: 1 };

    constructor(texture: PIXI.Texture) {
        super(texture);
    }

    setSize = (width?: number, height?: number) => {
        if (width) this.width = width;
        if (height) this.height = height;

        this.defaultScale = this.scale;

        return this;
    };

    setScale = (scaleX: number, scaleY?: number) => {
        scaleY = scaleY || scaleX;
        this.scale.set(scaleX, scaleY);
        this.defaultScale = { x: scaleX, y: scaleY };

        return this;
    };

    hide = () => {
        this.visible = false;
    };

    show = () => {
        this.visible = true;
    };
}

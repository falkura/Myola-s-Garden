export class BaseComponent extends PIXI.Sprite {
    protected defaultScale = { x: 1, y: 1 };

    constructor(texture: PIXI.Texture) {
        super(texture);
    }

    setSize = (width?: number, height?: number) => {
        if (width) this.width = width;
        if (height) this.height = height;

        this.defaultScale = this.scale;
    };

    setScale = (scaleX: number, scaleY?: number) => {
        scaleY = scaleY || scaleX;
        this.scale.set(scaleX, scaleY);
        this.defaultScale = { x: scaleX, y: scaleY };
    };

    hide = () => {
        this.visible = false;
    };

    show = () => {
        this.visible = true;
    };
}

import { ClickableNew } from "../ClickableNew";

export interface iListCell {
    count: number;
    name: string;
    index: number;
    type: string;
}
export class ListCell extends ClickableNew {
    constructor(size: number, texture: PIXI.Texture = PIXI.Texture.EMPTY) {
        super(texture);
        this.hoverScale = 1.05;

        const bg = new PIXI.Graphics()
            .beginFill(0x222222, 0.1)
            .drawRoundedRect(0, 0, size, size, 5)
            .endFill();

        bg.pivot.set(size / 2);
        this.addChild(bg);
    }
}

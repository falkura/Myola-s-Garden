import { ButtonList } from "../../GameConfigs/ButtonsList";
import { ResourceController } from "../../ResourceLoader";
import { Button } from "./Button";

export class CheckButton extends Button {
    isChoosen = false;
    checkSprite!: PIXI.Sprite;

    constructor(idleTexture: ButtonList, pressedTexture: ButtonList, isClosedWindow = false, withoutPressed = false) {
        super(idleTexture, pressedTexture, isClosedWindow, withoutPressed);

        this.createCheckSprite();
    }

    private createCheckSprite = () => {
        this.checkSprite = ResourceController.getSprite("check_icon");

        this.checkSprite.visible = false;
        this.checkSprite.anchor.set(0.5);

        this.checkSprite.position.set(this.width / 2 - this.checkSprite.width / 2 - 7, -1);

        const filter = new PIXI.filters.ColorMatrixFilter();
        filter.lsd(true);
        this.checkSprite.filters = [filter];

        this.addChild(this.checkSprite);
    };

    setChoosen = () => {
        if (this.isChoosen) return;

        this.isChoosen = true;
        this.checkSprite.visible = true;
    };

    unsetChoosen = () => {
        if (!this.isChoosen) return;

        this.isChoosen = false;
        this.checkSprite.visible = false;
    };
}

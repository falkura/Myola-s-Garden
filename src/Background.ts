import { Common } from "./Config/Common";

export class Background {
    app: PIXI.Application;
    container: PIXI.Container;
    bg: PIXI.Sprite;

    constructor(app: PIXI.Application) {
        this.app = app;
        this.container = new PIXI.Container();

        this.bg = new PIXI.Sprite(
            PIXI.Loader.shared.resources["map3p"].texture
        );
        this.bg.anchor.set(0.5);
        this.bg.position.set(
            Common.app_width - (this.bg.width / 2) * 4,
            Common.app_height / 2
        );
        // this.bg.interactive = true;
        // this.bg.cursor = "pointer";
        // this.bg.addListener("click", () => {
        //     this.bg.interactive = false;
        //     document.dispatchEvent(new Event(EVENTS.sound_button_clicked));
        // });
        this.bg.scale.set(1);
        this.container.addChild(this.bg);
    }

    resize = () => {
        this.bg.position.x = Common.game_width - this.bg.width / 2;
    };
}

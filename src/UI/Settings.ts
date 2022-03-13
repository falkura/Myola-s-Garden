import { EVENTS } from "../Events";
import { ButtonTemp } from "./Components/ButtonTemp";

export class Settings extends PIXI.Container {
    close: ButtonTemp;
    fps: ButtonTemp;
    bg_grey_tint: PIXI.Sprite;

    constructor() {
        super();

        this.bg_grey_tint = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.bg_grey_tint.interactive = true;
        this.bg_grey_tint.width = 500;
        this.bg_grey_tint.height = 500;
        this.bg_grey_tint.alpha = 0.95;
        this.addChild(this.bg_grey_tint);

        const graphics1 = new PIXI.Graphics()
            .lineStyle(3, 0x000000, 1)
            .beginFill(0x000000, 0.2)
            .drawRect(0, 0, 100, 50)
            .endFill();

        this.close = new ButtonTemp(graphics1, "close");
        this.close.event = new Event(EVENTS.Setting.Close);
        this.close.position.set(250, 350);

        const graphics2 = new PIXI.Graphics()
            .lineStyle(3, 0x000000, 1)
            .beginFill(0x000000, 0.2)
            .drawRect(0, 0, 50, 50)
            .endFill();

        this.fps = new ButtonTemp(graphics2, "FPS");
        this.fps.event = new Event(EVENTS.Setting.ChangeFPS);
        this.fps.position.set(275, 200);

        this.addChild(this.close, this.fps);

        this.add_event_listeners();
    }

    add_event_listeners = () => {
        document.addEventListener(
            EVENTS.Buttons.Settings,
            this.on_settings_open
        );
        document.addEventListener(EVENTS.Setting.Close, this.on_settings_close);

        document.addEventListener(EVENTS.Setting.ChangeFPS, this.on_fps);
    };

    on_settings_open = () => {
        this.visible = true;
    };

    on_fps = () => {
        console.log("fps");
    };

    on_settings_close = () => {
        this.visible = false;
    };
}

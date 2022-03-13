import { Button } from "./Components/Button";

export class InGameUI extends PIXI.Container {
    app: PIXI.Application;

    black_panel?: PIXI.Container;
    bg_black_panel?: PIXI.Sprite;

    sound?: Button;
    sound_off?: Button;
    fullscreen?: Button;

    constructor(app: PIXI.Application) {
        super();
        this.app = app;
        this.visible = false;

        this.add_event_listeners();
        this.on_resize();
    }

    add_event_listeners = () => {};

    on_resize = () => {};
}

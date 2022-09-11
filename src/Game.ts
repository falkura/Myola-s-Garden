import { Config } from "./Config";
import { GuiController } from "./GUI/GUIController";
import { Keyboard } from "./Keyboard";
import { MapController } from "./MapController";

export class Game {
    app: PIXI.Application;
    container = new PIXI.Container();
    MC: MapController;
    GUI: GuiController;

    constructor(app: PIXI.Application) {
        this.app = app;

        this.add_event_listeners();

        this.MC = new MapController(this.container, app);
        this.GUI = new GuiController(app);
        this.container.addChild(this.GUI.container);
        new Keyboard();
        this.resize();
        // this.loadMap();
    }

    add_event_listeners = () => {};

    loadMap = () => {
        this.MC.loadMap("testtiledmap");
    };

    resize = () => {
        this.MC.resize();
        this.GUI.resize();
    };
}

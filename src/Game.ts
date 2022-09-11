import { Config } from "./Config";
import { EVENTS } from "./Events";
import { GuiController } from "./GUI/GUIController";
import { Keyboard } from "./Keyboard";
import { LogicState } from "./logic_state";
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

    add_event_listeners = () => {
        document.addEventListener(EVENTS.GUI.MainScreen.RUS.Yes, this.loadMap);
    };

    loadMap = () => {
        this.MC.loadMap("testtiledmap");
    };

    resize = () => {
        LogicState.notify_all();
        this.MC.resize();
        this.GUI.resize();
    };
}

import { EVENTS } from "./Events";
import { GuiController } from "./GUI/GUIController";
import { Keyboard } from "./Keyboard";
import { Global_Vars } from "./GlobalVariables";
import { MapController } from "./MapController";

export class Game {
    app: PIXI.Application;
    container = new PIXI.Container();
    MC!: MapController;
    GUI!: GuiController;

    constructor(app: PIXI.Application) {
        this.app = app;

        this.add_event_listeners();

        // this.GUI = new GuiController(app);
        // this.container.addChild(this.GUI.container);
        new Keyboard();
        this.resize();
        this.loadMap();
    }

    add_event_listeners = () => {
        document.addEventListener(EVENTS.GUI.MainScreen.RUS.Yes, this.loadMap);
    };

    createMC = () => {
        this.MC = new MapController(this.container, this.app);
    };

    loadMap = () => {
        this.createMC();
        this.MC.loadMap("testtiledmap");
    };

    resize = () => {
        Global_Vars.notify_all();
        this.MC?.resize();
        this.GUI?.resize();
    };
}

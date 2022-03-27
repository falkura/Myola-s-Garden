import { Background } from "./Background";
import { EVENTS } from "./Events";
import { Subject } from "./Observer";
import { MapController } from "./MapController";
import { ControllerUI } from "./UI/ControllerUI";
import { Keyboard } from "./Keyboard";

export class Game extends Subject {
    readonly container: PIXI.Container;
    private readonly app: PIXI.Application;
    bg?: Background;
    controller_ui?: ControllerUI;
    mapController?: MapController;

    constructor(app: PIXI.Application) {
        super();
        this.app = app;
        this.container = new PIXI.Container();
        app.stage.addChild(this.container);

        this.draw_game();
        this.add_event_listeners();

        this.on_resize();
        setTimeout(() => this.draw_map(), 200);
    }

    draw_game = () => {
        this.bg = new Background(this.app);
        this.container.addChild(this.bg.container);

        this.mapController = new MapController(this.app);
        this.container.addChild(this.mapController.container);

        this.controller_ui = new ControllerUI(this.app);
        this.container.addChild(this.controller_ui);
    };

    add_event_listeners = () => {
        document.addEventListener(
            EVENTS.Buttons.Play,
            this.on_sound_button_clicked
        );
        document.addEventListener(EVENTS.Load.Start, () => {
            console.log("load start");
        });
    };

    draw_map = () => {
        this.mapController?.createMap("map3");
        this.controller_ui!.main_menu!.visible = false;
        this.controller_ui!.game_menu!.visible = true;

        new Keyboard();
    };

    remove_map = () => {};

    on_sound_button_clicked = () => {
        this.draw_map();
    };

    on_resize = () => {
        this.mapController!.resize();
        this.bg!.resize();
        this.controller_ui?.on_resize();
    };
}

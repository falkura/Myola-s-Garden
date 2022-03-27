import { WAILA } from "../WAILA";
import { InGameUI } from "./InGameUI";
import { MenuUI } from "./MenuUI";

export class ControllerUI extends PIXI.Container {
    app: PIXI.Application;
    main_menu?: MenuUI;
    game_menu?: InGameUI;
    WAILA: WAILA;

    constructor(app: PIXI.Application) {
        super();
        this.app = app;

        this.init();
        this.add_event_listeners();

        this.WAILA = new WAILA();
        this.addChild(this.WAILA);

        this.on_resize();
    }

    init = () => {
        this.createMenu();
        this.createInGame();
    };

    createMenu = () => {
        this.main_menu = new MenuUI(this.app);
        this.addChild(this.main_menu);
    };

    createInGame = () => {
        this.game_menu = new InGameUI(this.app);
        this.addChild(this.game_menu);
    };

    add_event_listeners = () => {};

    on_resize = () => {
        this.main_menu?.on_resize();
        this.game_menu?.on_resize();
        this.WAILA.x = this.app.screen.width / 2 - this.WAILA.width / 2;
    };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as PIXI from "pixi.js";
import { LogicState, LogicStateClass, change_app_state } from "./logic_state";
import { PrePreloader } from "./PrePreloader";
import { Preloader } from "./Preloader";
import { Game } from "./Game";
import { Common } from "./Config/Common";
import { get_platform } from "./Util";

declare const window: any;

export class App {
    readonly canvas: HTMLCanvasElement;
    readonly app: PIXI.Application;
    readonly is_landscape: boolean = true;
    readonly logic_state: LogicStateClass;

    pre_preloader?: PrePreloader;
    preloader?: Preloader;
    game?: Game;
    on_preloader_loaded_event?: Event;
    on_game_loaded_event?: Event;

    get_pixi_app = () => {
        PIXI.settings.ROUND_PIXELS = true;
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        PIXI.settings.SORTABLE_CHILDREN = true;

        return new PIXI.Application({
            width: Common.game_width,
            height: Common.game_height,
            view: this.canvas,
            sharedLoader: true,
            sharedTicker: true,
            transparent: true,
        });
    };

    on_resize = () => {
        if (window.innerWidth < window.innerHeight) {
            const multiplier = window.innerWidth / LogicState.app_width;
            const target_height = window.innerHeight / multiplier;

            this.app.renderer.resize(LogicState.app_width, target_height);

            LogicState.is_landscape = false;
        } else {
            const multiplier = window.innerHeight / LogicState.app_height;
            const target_width = window.innerWidth / multiplier;

            this.app.renderer.resize(target_width, LogicState.app_height);

            LogicState.is_landscape = true;
        }

        Common.game_width = this.app.view.width;
        Common.game_height = this.app.view.height;

        LogicState.notify_all();

        if (this.game) {
            this.game.on_resize();
        } else if (this.preloader) {
            this.preloader.on_resize();
        } else if (this.pre_preloader) {
            this.pre_preloader.on_resize();
        }
    };

    load_preloader = () => {
        this.pre_preloader = new PrePreloader(
            this.app,
            this.on_preloader_loaded_event!
        );
        this.app.stage.addChild(this.pre_preloader.container);
    };

    on_preloader_loaded = () => {
        this.preloader = new Preloader(this.app, this.on_game_loaded_event!);
        this.app.stage.removeChild(this.pre_preloader!.container);
        this.app.stage.addChild(this.preloader.container);
        change_app_state("pre_loader");
    };

    on_game_loaded = () => {
        this.app.stage.removeChild(this.preloader!.container);

        this.app.renderer.plugins.interaction.cursorStyles.default =
            "url('assets/cursor_normal.png'),auto";
        this.app.renderer.plugins.interaction.cursorStyles.pointer =
            "url('assets/cursor_pointer.png'),auto";
        this.app.renderer.plugins.interaction.cursorStyles.hover =
            "url('assets/cursor_pointer.png'),auto";

        this.game = new Game(this.app);
        this.game.on_resize();

        this.app.stage.addChildAt(this.game.container, 0);
        change_app_state("game");

        Object.assign(window as any, {
            Game: this.game,
            ls: LogicState,
            app: this,
            Common: Common,
        });
    };

    setup_events = () => {
        this.on_preloader_loaded_event = new Event("on_preloader_loaded_event");
        this.on_game_loaded_event = new Event("on_game_loaded_event");

        document.addEventListener(
            "on_preloader_loaded_event",
            this.on_preloader_loaded
        );
        document.addEventListener("on_game_loaded_event", this.on_game_loaded);
    };

    constructor() {
        this.logic_state = LogicState;
        LogicState.is_mobile = get_platform();
        this.canvas = document.getElementById("root") as HTMLCanvasElement;
        this.canvas.focus();
        this.canvas.style.width = `100%`;
        this.canvas.style.height = `100%`;
        this.canvas.style.marginTop = `0`;
        this.canvas.style.marginLeft = `0`;

        document
            .querySelector("body")!
            .addEventListener("contextmenu", (event) => {
                event.preventDefault();
            });

        this.app = this.get_pixi_app();
        window.onresize = this.on_resize;
        this.on_resize();

        this.setup_events();
        this.load_preloader();
    }
}

import * as PIXI from "pixi.js";
import { Global_Vars } from "./GlobalVariables";
import { PrePreloader } from "./PrePreloader";
import { Preloader } from "./Preloader";
import { Game } from "./Game";
import { Config } from "./Config";
import { EVENTS } from "./Events";
import { ResourceController } from "./ResourceLoader";

export class App {
    readonly canvas: HTMLCanvasElement;
    readonly app: PIXI.Application;
    readonly is_landscape: boolean = true;
    pre_preloader?: PrePreloader;
    preloader?: Preloader;
    game?: Game;

    constructor() {
        Global_Vars.is_mobile = PIXI.utils.isMobile.any;
        this.canvas = document.getElementById("root") as HTMLCanvasElement;

        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        this.canvas.style.marginTop = "0";
        this.canvas.style.marginLeft = "0";

        this.app = this.get_pixi_app();

        this.setup_events();
        this.load_preloader();

        window.onresize = this.on_resize;
        this.on_resize();
    }

    get_pixi_app = () => {
        PIXI.settings.ROUND_PIXELS = true;
        PIXI.settings.SORTABLE_CHILDREN = true;
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        return new PIXI.Application({
            width: Config.project_width,
            height: Config.project_height,
            view: this.canvas,
            sharedLoader: true,
            sharedTicker: true,
            transparent: true,
        });
    };

    on_resize = () => {
        const multiplier = window.innerHeight / Global_Vars.app_height;
        const target_width = window.innerWidth / multiplier;

        this.app.renderer.resize(target_width, Global_Vars.app_height);

        if (window.innerWidth < window.innerHeight) {
            Global_Vars.is_landscape = false;
        } else {
            Global_Vars.is_landscape = true;
        }

        Config.project_width = this.app.view.width;
        Config.project_height = this.app.view.height;

        Global_Vars.notify_all();

        if (this.game) {
            this.game.resize();
        } else if (this.preloader) {
            this.preloader.resize();
        } else if (this.pre_preloader) {
            this.pre_preloader.resize();
        }
    };

    load_preloader = () => {
        this.pre_preloader = new PrePreloader(this.app);
        this.app.stage.addChild(this.pre_preloader.container);
    };

    on_preloader_loaded = () => {
        if (this.pre_preloader) {
            this.app.stage.removeChild(this.pre_preloader.container);
        }

        this.preloader = new Preloader(this.app);
        this.app.stage.addChild(this.preloader.container);
        Global_Vars.app_state = "preloader";
        Global_Vars.notify_all();
    };

    on_project_loaded = () => {
        this.app.stage.removeChild(this.preloader!.container);

        this.game = new Game(this.app);

        Object.assign(globalThis, {
            main: this.game,
            ls: Global_Vars,
            app: this,
            rc: ResourceController,
            config: Config,
        });

        this.app.stage.addChildAt(this.game.container, 0);

        Global_Vars.app_state = "idle";
        Global_Vars.notify_all();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Object.assign(window as any, {
            game: this.game,
            ls: Global_Vars,
            app: this,
        });
    };

    setup_events = () => {
        document.addEventListener(EVENTS.loading.preloader_loaded, this.on_preloader_loaded);
        document.addEventListener(EVENTS.loading.project_loaded, this.on_project_loaded);
    };
}

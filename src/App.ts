import * as PIXI from "pixi.js";
import { Global_Vars } from "./GlobalVariables";
import { Preloader } from "./Preloader";
import { Game } from "./Game";
import { Config } from "./Config";
import { EVENTS } from "./Events";
import { ResourceController } from "./ResourceLoader";
import { LoaderScreen } from "./GUI/Screens/LoaderScreen";

export class App {
    readonly canvas: HTMLCanvasElement;
    readonly app: PIXI.Application;
    preloader?: Preloader;
    game?: Game;

    constructor() {
        Global_Vars.is_mobile = PIXI.utils.isMobile.any;
        this.canvas = document.getElementById("root") as HTMLCanvasElement;

        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        this.canvas.style.marginTop = "0";
        this.canvas.style.marginLeft = "0";

        this.app = this.getPixiApp();

        this.loadPreloader();

        window.onresize = this.on_resize;
        window.onorientationchange = this.on_resize;

        this.on_resize();
    }

    getPixiApp = () => {
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

        ResourceController.screen?.resize();

        if (this.game) {
            this.game.resize();
        } else if (this.preloader) {
            this.preloader.resize();
        }
    };

    loadPreloader = () => {
        document.addEventListener(EVENTS.System.PreloaderLoaded, this.on_preloader_loaded);

        this.preloader = new Preloader(this.app);
        this.app.stage.addChild(this.preloader.container);
    };

    on_preloader_loaded = () => {
        if (this.preloader) {
            this.app.stage.removeChild(this.preloader.container);
        }

        ResourceController.screen = new LoaderScreen();
        this.app.stage.addChild(ResourceController.screen);

        Global_Vars.app_state = "preloader";

        ResourceController.addResources("main");
        ResourceController.addMaps();

        ResourceController.loadResources(() => {
            this.onGameLoaded();
        }, "main");

        Global_Vars.notify_all();
    };

    onGameLoaded = () => {
        this.game = new Game(this.app);

        Object.assign(globalThis, {
            game: this.game,
            ls: Global_Vars,
            app: this,
            rc: ResourceController,
            config: Config,
        });

        this.app.stage.addChildAt(this.game.container, 0);

        Global_Vars.app_state = "idle";
        Global_Vars.notify_all();
    };
}

import { SessionConfig } from "./SessionConfig";
import { ATLASES, ASSETS, ANIMATIONS, JPG, PNG } from "./Assets";
import "./AudioManager";

export class Preloader {
    readonly container: PIXI.Container;
    private readonly app: PIXI.Application;
    private bg?: PIXI.Sprite;
    on_game_loaded_event: Event;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    assets: any;

    loader_mask = new PIXI.Graphics();
    loader_width = 0;
    loader_height = 0;

    slider_bg?: PIXI.Sprite;
    slider_fg?: PIXI.Sprite;

    constructor(app: PIXI.Application, on_game_loaded_event: Event) {
        this.app = app;
        this.on_game_loaded_event = on_game_loaded_event;
        this.container = new PIXI.Container();
        this.assets = ASSETS;
        app.stage.addChild(this.container);
        this.draw_loader();
        this.load_assets();
        this.on_resize();
    }

    draw_loader = () => {
        this.bg = new PIXI.Sprite(
            PIXI.Loader.shared.resources["loading_bg"].texture
        );
        this.bg.anchor.set(0.5);
        this.bg.position.set(
            this.app.renderer.width / 2,
            this.app.renderer.height / 2
        );
        this.container.addChild(this.bg);

        this.slider_bg = new PIXI.Sprite(
            PIXI.Loader.shared.resources["load_bar"].texture
        );
        this.container.addChild(this.slider_bg);
        this.slider_bg.position.set(414, 670);

        this.slider_fg = new PIXI.Sprite(
            PIXI.Loader.shared.resources["load_progress"].texture
        );
        this.container.addChild(this.slider_fg);
        this.slider_fg.position.set(427, 688);

        this.loader_width = this.slider_fg.width;
        this.loader_height = this.slider_fg.height;

        this.loader_mask.beginFill(0x000000);
        this.loader_mask.drawRect(0, 0, 0, 0);
        this.loader_mask.endFill();
        this.slider_fg.addChild(this.loader_mask);
        this.slider_fg.mask = this.loader_mask;
    };

    update_mask = (progress: number) => {
        this.loader_mask.clear();
        this.loader_mask.beginFill(0x000000);
        this.loader_mask.drawRect(
            0,
            0,
            this.loader_width * progress,
            this.loader_height
        );
        this.loader_mask.endFill();
    };

    load_assets = () => {
        let result = PIXI.Loader.shared;

        for (const res of ANIMATIONS) {
            result.add(
                res,
                `${SessionConfig.ASSETS_ADDRESS}spine/${res}/skeleton.json`
            );
        }

        for (const res of JPG) {
            result.add(res, `${SessionConfig.ASSETS_ADDRESS}${res}.jpg`);
        }

        for (const res of PNG) {
            result.add(res, `${SessionConfig.ASSETS_ADDRESS}${res}.png`);
        }

        for (const res of ATLASES) {
            result = result.add(
                res,
                `${SessionConfig.ASSETS_ADDRESS}${res}.json`
            );
        }

        result.onProgress.add(() => {
            this.update_mask(result.progress / 100);
        });

        result.load(() => {
            for (const atlas of ATLASES) {
                for (const texture of Object.keys(
                    PIXI.Loader.shared.resources[atlas].textures!
                )) {
                    ASSETS[texture] =
                        PIXI.Loader.shared.resources[atlas].textures![texture];
                }
            }
            PIXI.Loader.shared
                .add("map3", `${SessionConfig.ASSETS_ADDRESS}map3.json`)
                .load();
            ASSETS["map3"] = PIXI.Loader.shared.resources["map3"];
            document.dispatchEvent(this.on_game_loaded_event);
        });
    };

    on_resize = () => {};
}

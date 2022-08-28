import { Config } from "./Config";
import { Keyboard } from "./Keyboard";
import { MapController } from "./MapController";
import { ResourceController } from "./ResourceLoader";

export class Game {
    app: PIXI.Application;
    container = new PIXI.Container();
    bg!: PIXI.Sprite;
    MC: MapController;

    constructor(app: PIXI.Application) {
        this.app = app;

        this.add_event_listeners();
        this.createBG();

        this.MC = new MapController(this.container);
        new Keyboard();
        this.resize();
        this.loadMap();
    }

    createBG = () => {
        this.bg = ResourceController.getSprite("project_bg");
        this.bg.anchor.set(0.5, 0.5);
        this.container.addChild(this.bg);
    };

    add_event_listeners = () => {};

    loadMap = () => {
        this.MC.loadMap("map3").then(() => {
            this.container.addChild(this.MC.map!);
        });
    };

    resize = () => {
        this.MC.resize();
        this.bg.position.set(Config.project_width / 2, Config.project_height / 2);

        this.bg.scale.set(
            Config.project_width / this.bg.texture.width > Config.project_height / this.bg.texture.height
                ? Config.project_width / this.bg.texture.width
                : Config.project_height / this.bg.texture.height,
        );
    };
}

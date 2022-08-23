import { Config } from "./Config";
import { ResourceController } from "./ResourceLoader";
import TiledMap from "./TMCore/TiledMap";

export class Game {
	app: PIXI.Application;
	container = new PIXI.Container();
	bg!: PIXI.Sprite;
	tm?: TiledMap;

	constructor(app: PIXI.Application) {
		this.app = app;

		this.add_event_listeners();
		this.createBG();

		this.resize();

		console.log("Hello World!");
		this.loadMap();
	}

	createBG = () => {
		this.bg = ResourceController.getSprite("project_bg");
		this.bg.anchor.set(0.5, 0.5);
		this.container.addChild(this.bg);
	};

	add_event_listeners = () => {};

	loadMap = () => {
		this.tm = new TiledMap("map3");
	};

	resize = () => {
		this.bg.position.set(Config.project_width / 2, Config.project_height / 2);

		this.bg.scale.set(
			Config.project_width / this.bg.texture.width > Config.project_height / this.bg.texture.height
				? Config.project_width / this.bg.texture.width
				: Config.project_height / this.bg.texture.height,
		);
	};
}

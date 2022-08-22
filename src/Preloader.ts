import { ATLASES } from "./Assets";
import "./AudioManager";
import { EVENTS } from "./Events";
import { ResourceController } from "./ResourceLoader";

export class Preloader {
	readonly container: PIXI.Container;
	private readonly app: PIXI.Application;

	constructor(app: PIXI.Application) {
		this.app = app;
		this.container = new PIXI.Container();

		this.load_assets();
		this.resize();
	}

	load_assets = () => {
		ResourceController.addResources("main");

		ResourceController.loader.onProgress.add(() => {});

		ResourceController.loadResources(() => {
			for (const atlas of ATLASES["main"]) {
				Object.assign(ResourceController.resources, ResourceController.resources[atlas.key].textures);
			}
			document.dispatchEvent(new Event(EVENTS.loading.project_loaded));
		});
	};

	resize = () => {};
}

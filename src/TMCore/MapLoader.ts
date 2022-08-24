import { SessionConfig } from "../Config";
import { ResourceController } from "../ResourceLoader";
import TiledMap from "./TiledMap";

export default class MapLoader {
	map: TiledMap;
	container: PIXI.Container;

	constructor(map: TiledMap) {
		this.map = map;
		this.container = new PIXI.Container();

		this.drawLoader();
	}

	drawLoader = () => {};

	load = (): Promise<void> => {
		const loader = ResourceController.loader;

		for (const tileset of this.map.source.tilesets) {
			loader.add(tileset.name, `${SessionConfig.ASSETS_ADDRESS}${tileset.image}`);
		}

		const onProgress = loader.onProgress.add(() => {
			console.log("Map " + loader.progress);
		});

		const promise = new Promise<void>(resolve => {
			loader.load(() => {
				loader.onProgress.detach(onProgress);
				resolve();
			});
		});

		return promise;
	};

	destroy = () => {
		const loader = ResourceController.loader;

		for (const tileset of this.map.tilesets) {
			tileset.baseTexture.destroy();
			ResourceController.getTexture(tileset.source.name).destroy();
			delete loader.resources[tileset.source.name];
		}

		loader.progress = 0;
		loader.loading = false;
	};
}

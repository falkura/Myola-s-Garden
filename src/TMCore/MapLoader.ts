import { SessionConfig } from "../Config";
import { IMapData } from "../Models";
import { ResourceController } from "../ResourceLoader";

export default class MapLoader {
	source: IMapData;
	container: PIXI.Container;

	constructor(mapData: IMapData) {
		this.source = mapData;
		this.container = new PIXI.Container();

		this.drawLoader();
	}

	drawLoader = () => {};

	load = (): Promise<void> => {
		const loader = ResourceController.loader;

		for (const tileset of this.source.tilesets) {
			if (!loader.resources[tileset.name]) {
				loader.add(tileset.name, `${SessionConfig.ASSETS_ADDRESS}${tileset.image}`);
			}
		}

		loader.onProgress.add(() => {
			console.log(loader.progress);
		});

		const promise = new Promise<void>(resolve => {
			loader.load(() => {
				resolve();
			});
		});

		return promise;
	};

	destroy = () => {
		// const loader = ResourceController.loader;
		// for (const tileset of this.source.tilesets) {
		// 	delete loader.resources[tileset.name];
		// }
		// loader.progress = 0;
		// loader.loading = false;
	};
}

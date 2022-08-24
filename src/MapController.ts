import { Config } from "./Config";
import TiledMap from "./TMCore/TiledMap";
import { waitForEvent } from "./Util";

export class MapController {
	map?: TiledMap;
	constructor() {}

	loadMap = (key: string): Promise<void> => {
		this.map = new TiledMap(key);

		return waitForEvent("map_created").then(() => {
			this.resize();
		});
	};

	destroy = () => {
		this.map?.destroy();
	};

	resize = () => {
		if (this.map) {
			this.map.scale.set(
				Config.project_width / this.map._width > Config.project_height / this.map._height
					? Config.project_width / this.map._width
					: Config.project_height / this.map._height,
			);
		}
	};
}

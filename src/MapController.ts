import { Config } from "./Config";
import { EVENTS } from "./Events";
import { GroundController } from "./GroundController";
import TiledMap from "./TMCore/TiledMap";
import { waitForEvent } from "./Util";

export class MapController {
	map?: TiledMap;
	groundController: GroundController;
	constructor() {
		this.groundController = new GroundController(this);
	}

	loadMap = (key: string): Promise<void> => {
		this.map = new TiledMap(key);

		return waitForEvent(EVENTS.Map.Created).then(() => {
			this.groundController.addCells();
			this.resize();
		});
	};

	destroy = () => {
		if (this.map) {
			this.map.parent.removeChild(this.map);
			this.map.destroy();
			this.map = undefined;
		}
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

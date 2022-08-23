import { IMapData } from "../Models";
import { ResourceController } from "../ResourceLoader";
import MapLoader from "./MapLoader";

export default class TiledMap extends PIXI.Container {
	source: IMapData;
	loader!: MapLoader;

	constructor(resourceId: string) {
		super();

		this.source = ResourceController.getResource(resourceId).data as IMapData;

		this.loadResources().then(() => {
			document.dispatchEvent(new Event("map_created"));
		});
	}

	loadResources = () => {
		this.loader = new MapLoader(this.source);
		this.addChild(this.loader.container); // @TODO loader screen

		return this.loader.load();
	};
}

import { IMapData, ITileset } from "../Models";
import { ResourceController } from "../ResourceLoader";
import MapLoader from "./MapLoader";
import TileSet from "./TileSet";

export default class TiledMap extends PIXI.Container {
	source: IMapData;
	loader!: MapLoader;
	tilesets: TileSet[] = [];

	constructor(resourceId: string) {
		super();

		this.source = ResourceController.getResource(resourceId).data as IMapData;

		this.loadResources().then(() => {
			this.setDataTileSets();

			document.dispatchEvent(new Event("map_created"));
		});
	}

	loadResources = () => {
		this.loader = new MapLoader(this.source);
		this.addChild(this.loader.container); // @TODO loader screen

		return this.loader.load();
	};

	setDataTileSets = () => {
		console.log(this.source.tilesets);
		this.source.tilesets.forEach((tileSetData: ITileset) => this.tilesets.push(new TileSet(tileSetData)));
	};
}

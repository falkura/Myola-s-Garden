import { ILayersData, IMapData, ITileset, LayerType } from "../Models";
import { ResourceController } from "../ResourceLoader";
import MapLoader from "./MapLoader";
import ObjectLayer from "./ObjectLayer";
import TileLayer from "./TileLayer";
import TileSet from "./TileSet";

export default class TiledMap extends PIXI.Container {
	source: IMapData;
	loader!: MapLoader;
	tilesets: TileSet[] = [];
	layers: Array<TileLayer | ObjectLayer> = [];
	mapName: string;

	constructor(resourceId: string) {
		super();
		this.mapName = resourceId;
		this.source = ResourceController.getResource(resourceId).data as IMapData;

		this.loadResources().then(() => {
			this.setTileSets();
			this.setLayers();

			document.dispatchEvent(new Event("map_created"));
		});
	}

	loadResources = () => {
		this.loader = new MapLoader(this.source);
		this.addChild(this.loader.container); // @TODO loader screen

		return this.loader.load();
	};

	setTileSets = () => {
		console.log(this.source.tilesets);
		this.source.tilesets.forEach((tileSetData: ITileset) => this.tilesets.push(new TileSet(tileSetData)));
	};

	setLayers = () => {
		this.source.layers.forEach((layerData: ILayersData, index) => {
			let tileLayer;

			switch (layerData.type) {
				case LayerType.TileLayer:
					tileLayer = new TileLayer(layerData, this);
					break;

				case LayerType.ObjectGroup:
					tileLayer = new ObjectLayer(layerData, this);
					break;

				default:
					throw new Error("Incorrect layer type!");
			}

			tileLayer.index = index;
			this.layers.push(tileLayer);
			this.addLayer(tileLayer);
		});
	};

	addLayer = (layer: TileLayer | ObjectLayer) => {
		this.addChild(layer);
	};
}

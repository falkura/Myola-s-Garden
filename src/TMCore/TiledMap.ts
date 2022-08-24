import { ILayersData, IMapData, ITileset, LayerType } from "../Models";
import { ResourceController } from "../ResourceLoader";
import MapLoader from "./MapLoader";
import TileLayer from "./TileLayer";
import TileSet from "./TileSet";

export default class TiledMap extends PIXI.Container {
	source: IMapData;
	loader!: MapLoader;
	tilesets: TileSet[] = [];
	layers: TileLayer[] = [];
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
					tileLayer.index = index;
					this.layers.push(tileLayer);
					this.addLayer(tileLayer);
					break;

				// case LayerType.ObjectGroup:
				// 	tileLayer = new ObjectLayer(layerData, this);
				// 	break;

				default:
					return;
				// throw new Error("Incorrect layer type!");
			}

			// tileLayer.index = index;
			// this.layers.push(tileLayer);
			// this.addLayer(tileLayer);
		});
	};

	addLayer = (layer: TileLayer) => {
		this.addChild(layer);
	};
}

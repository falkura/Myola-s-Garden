import { EVENTS } from "../Events";
import { ILayersData, IMapData, ITileset, LayerType } from "../Models";
import { ResourceController } from "../ResourceLoader";
import MapLoader from "./MapLoader";
import ObjectLayer from "./ObjectLayer";
import ObjectTile from "./ObjectTile";
import Tile from "./Tile";
import TileLayer from "./TileLayer";
import TileSet from "./TileSet";

// 1.8.1
export default class TiledMap extends PIXI.Container {
    app: PIXI.Application;
    source: IMapData;
    loader!: MapLoader;
    tilesets: TileSet[] = [];
    /**```ts
     * layers: Array<Tile | ObjectTile>; // this is the real type of layers, but STUPID TS can`t work with it 🙃
     * ```*/
    layers: Array<(TileLayer & { tiles: Array<Array<Tile | ObjectTile>> }) | (ObjectLayer & { tiles: Array<Array<Tile | ObjectTile>> })> =
        [];
    mapName: string;

    _width!: number;
    _height!: number;

    constructor(resourceId: string, app: PIXI.Application) {
        super();
        this.app = app;
        this.mapName = resourceId;
        this.source = ResourceController.getResource(resourceId).data as IMapData;

        this.loadResources().then(() => {
            this.setTileSets();
            this.setLayers();

            this.pivot.set(-this.source.tilewidth / 2, -this.source.tileheight / 2);

            this._width = this.width;
            this._height = this.height;

            document.dispatchEvent(new Event(EVENTS.Map.Created));
        });
    }

    loadResources = () => {
        this.loader = new MapLoader(this);
        this.addChild(this.loader.container); // @TODO loader screen

        return this.loader.load();
    };

    setTileSets = () => {
        console.log(this.source.tilesets);
        this.source.tilesets.forEach((tileSetData: ITileset) => this.tilesets.push(new TileSet(tileSetData)));
    };

    setLayers = () => {
        this.source.layers.forEach((layerData: ILayersData, index) => {
            let layer;

            switch (layerData.type) {
                case LayerType.TileLayer:
                    layer = new TileLayer(layerData, this);
                    break;

                case LayerType.ObjectGroup:
                    layer = new ObjectLayer(layerData, this);
                    break;

                default:
                    throw new Error("Incorrect layer type!");
            }

            layer.index = index;
            this.layers.push(layer);
            this.addLayer(layer);

            layer.tiles.logMatrix(layer.source.name);
        });
    };

    addLayer = (layer: TileLayer | ObjectLayer) => {
        this.addChild(layer);
    };

    getTilesetByName = (name: string): TileSet | undefined => {
        for (const tileset of this.tilesets) {
            if (tileset.source.name === name) return tileset;
        }

        return undefined;
    };

    cleanUp = () => {
        super.destroy({ children: true, texture: true, baseTexture: true });
        this.loader.destroy();
    };
}

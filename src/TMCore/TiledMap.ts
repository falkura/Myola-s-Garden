import { EVENTS } from "../Events";
import { IMapData, ITileLayerData, ITileset, TileWithAA } from "../Models";
import { ResourceController } from "../ResourceLoader";
import MapLoader from "./MapLoader";
import TileLayer from "./TileLayer";
import TileSet from "./TileSet";

// 1.8.1
export default class TiledMap extends PIXI.Container {
    app: PIXI.Application;
    source: IMapData;
    loader?: MapLoader;
    tilesets: TileSet[] = [];
    layers: TileLayer[] = [];
    mapName: string;
    /** AA - Animation with autostart */
    AATiles: TileWithAA[] = [];

    _width!: number;
    _height!: number;

    constructor(resourceId: string, app: PIXI.Application) {
        super();
        this.app = app;
        this.mapName = resourceId;
        this.source = ResourceController.getResource(resourceId).data as IMapData;
    }

    load = () => {
        return new Promise<void>(resolve => {
            this.loader = new MapLoader(this);

            this.loader
                .load()
                .then(this.setTileSets)
                .then(this.setLayers)
                .then(() => {
                    this.pivot.set(-this.source.tilewidth / 2, -this.source.tileheight / 2);

                    this._width = this.width;
                    this._height = this.height;

                    document.dispatchEvent(new Event(EVENTS.Map.Created));
                    resolve();
                });
        });
    };

    setTileSets = () => {
        console.log(this.source.tilesets);
        this.source.tilesets.forEach((tileSetData: ITileset) => this.tilesets.push(new TileSet(tileSetData)));
    };

    setLayers = () => {
        this.source.layers.forEach((layerData: ITileLayerData, index) => {
            const layer = new TileLayer(layerData, this);

            layer.index = index;
            this.layers.push(layer);
            this.addLayer(layer);

            layer.tiles.logMatrix(layer.source.name);
        });
    };

    addLayer = (layer: TileLayer) => {
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
        this.loader?.destroy();
    };
}

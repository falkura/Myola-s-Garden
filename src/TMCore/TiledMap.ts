import { EVENTS } from "../Events";
import { IMapData, IObjectLayerData, ITileLayerData, ITileset, LayerType, TileWithAA } from "../Models";
import { ResourceController } from "../ResourceLoader";
import MapLoader from "./MapLoader";
import { ObjectLayers } from "./ObjectLayers";
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
    objectLayers!: ObjectLayers;

    _width!: number;
    _height!: number;

    constructor(resourceId: string, app: PIXI.Application) {
        super();
        this.app = app;
        this.mapName = resourceId;
        this.source = ResourceController.getResource(resourceId).data as IMapData;
        console.log(this.source);
    }

    load = () => {
        return new Promise<void>(resolve => {
            this.loader = new MapLoader(this);

            this.loader
                .load()
                .then(this.setTileSets)
                .then(this.setLayers)
                .then(() => {
                    this.onLoadCallback();
                    resolve();
                });
        });
    };

    private onLoadCallback = () => {
        this.pivot.set(-this.source.tilewidth / 2, -this.source.tileheight / 2);

        this._width = this.width;
        this._height = this.height;

        document.dispatchEvent(new Event(EVENTS.Map.Created));

        this.interactive = true;
        this.addListener("pointerdown", this.onMapClick);
        this.addListener("pointerover", this.onMapHover);
    };

    setTileSets = () => {
        console.log(this.source.tilesets);
        this.source.tilesets.forEach((tileSetData: ITileset) => this.tilesets.push(new TileSet(tileSetData)));
    };

    setLayers = () => {
        this.objectLayers = new ObjectLayers(this);
        this.objectLayers.zIndex = 100;

        this.source.layers.forEach((layerData: ITileLayerData | IObjectLayerData, index) => {
            if (layerData.type == LayerType.TileLayer) {
                const layer = new TileLayer(layerData, this);

                layer.index = index;
                this.layers.push(layer);
                this.addChild(layer);
                // layer.tiles.logMatrix(layer.source.name);
            } else {
                this.objectLayers.addLayer(layerData);
            }
        });
    };

    getTilesetByName = (name: string): TileSet | undefined => {
        for (const tileset of this.tilesets) {
            if (tileset.source.name === name) return tileset;
        }

        return undefined;
    };

    onMapClick = () => {
        document.dispatchEvent(new Event(EVENTS.Map.Click));
    };

    onMapHover = () => {
        document.dispatchEvent(new Event(EVENTS.Map.Hover));
    };

    cleanUp = () => {
        this.removeListener("pointerdown", this.onMapClick);
        this.removeListener("pointerover", this.onMapHover);

        super.destroy({ children: true, texture: true, baseTexture: true });
        this.loader?.destroy();
    };
}

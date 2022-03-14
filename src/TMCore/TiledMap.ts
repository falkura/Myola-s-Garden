import * as PIXI from "pixi.js";

import TileSet from "./TileSet";
import TileLayer from "./TileLayer";
import {
    iObjectLayer,
    iMapData,
    iTileLayer,
    iTileset,
    LayerType,
    iTiledMap,
} from "./TMModel";
import { ASSETS } from "../Assets";
import ObjectLayer from "./ObjectLayer";
import Character from "./Character";
import Loader from "./Loader";
import { Config } from "../Config";
import { CollisionLayer } from "./CollisionLayer";
import { Plant } from "../Plant";
import { Drop } from "./Drop";

export default class TiledMap extends PIXI.Container implements iTiledMap {
    layers: Array<TileLayer | ObjectLayer> = [];
    tilesets: TileSet[] = [];
    drop: Drop[] = [];
    charakters: Character[] = [];
    app: PIXI.Application;
    loader?: Loader;
    collisionLayer?: CollisionLayer;
    source: iMapData;

    plants: Array<{ time: number; plant: Plant }> = [];

    constructor(resourceId: string, app: PIXI.Application) {
        super();

        this.source = ASSETS[resourceId].data as iMapData;

        this.scale.set(Config.map_scale);
        this.app = app;

        this.loadResources().then(() => {
            this.setDataTileSets();
            this.setDataLayers();

            Config.map_static_width = this.width;
            Config.map_static_height = this.height;

            document.dispatchEvent(new Event("map_created"));
        });
    }

    loadResources = async () => {
        this.loader = new Loader(this.source);
        this.addChild(this.loader.container); // @TODO loader screen

        await this.loader.load();
        console.log("load complete");
    };

    setDataTileSets = () => {
        console.log(this.source.tilesets);
        this.source.tilesets.forEach((tileSetData: iTileset) =>
            this.tilesets.push(new TileSet(tileSetData))
        );
    };

    setDataLayers = () => {
        this.source.layers.forEach(
            (layerData: iTileLayer | iObjectLayer, index) => {
                if (layerData.type === LayerType.TileLayer) {
                    this.setTileLayer(layerData as iTileLayer, index);
                    return;
                }

                if (layerData.type === LayerType.ObjectGroup) {
                    this.setObjectLayer(layerData as iObjectLayer, index);
                    return;
                }

                console.log("error");
            }
        );
    };

    getWalkableLayers = (): TileLayer[] => {
        const result = [];
        for (const layer of this.layers) {
            if (
                layer.source.type === LayerType.TileLayer &&
                layer.hasOwnProperty("isWalkable") &&
                (layer as TileLayer).isWalkable === true
            ) {
                result.push(layer);
            }
        }
        return result as TileLayer[];
    };

    setTileLayer = (layerData: iTileLayer, index: number) => {
        const tileLayer = new TileLayer(layerData, this);
        tileLayer.index = index;
        this.layers.push(tileLayer);
        this.addLayer(tileLayer);
    };

    setObjectLayer = (layerData: iObjectLayer, index: number) => {
        const tileLayer = new ObjectLayer(layerData, this);
        tileLayer.index = index;
        this.layers.push(tileLayer);
        this.addLayer(tileLayer);
    };

    addLayer = (layer: TileLayer | ObjectLayer) => {
        this.addChild(layer);
    };

    getTileset = (name: string): TileSet | undefined => {
        for (const tileset of this.tilesets) {
            if (tileset.source.name === name) return tileset;
        }

        return undefined;
    };

    getObjectLayer = (name: string): ObjectLayer | undefined => {
        for (const layer of this.layers) {
            if (layer.source.name === name) return layer as ObjectLayer;
        }

        return undefined;
    };

    findTileSet = (gid: number): TileSet => {
        let tileSet: TileSet | undefined;

        for (let i = this.tilesets.length - 1; i >= 0; i--) {
            tileSet = this.tilesets[i];
            if (tileSet.source.firstgid <= gid) {
                break;
            }
        }
        return tileSet as TileSet;
    };
}

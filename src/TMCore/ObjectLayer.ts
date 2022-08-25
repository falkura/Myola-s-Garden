import { IObjectData, IObjectLayerData } from "../Models";
import ObjectTile from "./ObjectTile";
import TiledMap from "./TiledMap";
import { findTileSet } from "./TMUtils";

export default class ObjectLayer extends PIXI.Container {
    tiles: ObjectTile[] = [];
    source: IObjectLayerData;
    index!: number;

    constructor(layer: IObjectLayerData, map: TiledMap) {
        super();
        this.source = layer;

        this.setLayerTiles(map);
    }

    setLayerTiles(map: TiledMap) {
        for (const objectTile of this.source.objects) {
            if (this.tileExists(objectTile)) {
                const tileSet = findTileSet(map, objectTile.gid);
                const tile = new ObjectTile(objectTile, tileSet, map);

                this.tiles.push(tile);
                this.addTile(tile);
            }
        }
    }

    tileExists(layer: IObjectData): boolean {
        return !!layer.gid;
    }

    addTile(tile: ObjectTile) {
        this.addChild(tile.sprite);
    }
}

import { IObjectData, IObjectLayerData } from "../Models";
import ObjectTile from "./ObjectTile";
import TiledMap from "./TiledMap";
import { findTileSet } from "../TMAdditions/TMUtils";
import { createEmptyMatrix } from "../TMAdditions/MatrixUtils";

export default class ObjectLayer extends PIXI.Container {
    tiles: ObjectTile[][] = [];
    source: IObjectLayerData;
    index!: number;

    constructor(layer: IObjectLayerData, map: TiledMap) {
        super();
        this.source = layer;

        this.setLayerTiles(map);
    }

    setLayerTiles(map: TiledMap) {
        this.tiles = createEmptyMatrix(map.source.width, map.source.height);

        for (const objectTile of this.source.objects) {
            if (this.tileExists(objectTile)) {
                const tileSet = findTileSet(map, objectTile.gid);
                const tile = new ObjectTile(objectTile, tileSet, map);

                this.tiles[tile._y][tile._x] = tile;
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

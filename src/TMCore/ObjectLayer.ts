import { Common } from "../Config/Common";
import ObjectTile from "./ObjectTile";
import TiledMap from "./TiledMap";
import TileSet from "./TileSet";
import { iDataObject, iObjectLayer } from "../Model";

export default class ObjectLayer extends PIXI.Container {
    objects!: iDataObject[];
    source: iObjectLayer;

    tiles: ObjectTile[] = [];
    index!: number;

    constructor(layer: iObjectLayer, mapData: TiledMap) {
        super();
        this.source = layer;

        this.scale.set(Common.map_scale);

        this.setLayerTiles(mapData);
    }

    setLayerTiles(mapData: TiledMap) {
        for (const objectTile of this.source.objects) {
            if (this.tileExists_(objectTile)) {
                const tileSet = mapData.findTileSet(objectTile.gid);
                const tile: ObjectTile = this.createTile(
                    objectTile,
                    tileSet,
                    mapData
                );

                this.tiles.push(tile);
                this.addTile(tile);
            }
        }
    }

    createTile(
        tileData: iDataObject,
        tileSet: TileSet,
        mapData: TiledMap
    ): ObjectTile {
        const tile = new ObjectTile(tileData, tileSet);

        tile.x = tileData.x;
        tile.y = tileData.y - tile.height; //@TODO why?

        tile._x = tile.x / mapData.source.tilewidth;
        tile._y = tile.y / mapData.source.tileheight;

        if (
            tileSet.source.tiles![tile.source.gid - tileSet.source.firstgid] &&
            tileSet.source.tiles![tile.source.gid - tileSet.source.firstgid]
                .objectgroup
        ) {
            mapData.collisionLayer!.addCollision(tile, tileSet);
        }

        return tile as ObjectTile;
    }

    tileExists_(layer: iDataObject): boolean {
        return !!layer.gid;
    }

    tileExists(i: number): boolean {
        for (const tile of this.tiles) {
            if (tile._x + tile._y * 16 === i) return true;
        }
        return false;
    }

    addTile(tile: ObjectTile) {
        this.addChild(tile);
    }
}

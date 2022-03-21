import ObjectTile from "./ObjectTile";
import TiledMap from "./TiledMap";
import TileSet from "./TileSet";
import { iDataObject } from "./TMModel";

export default class Buildings extends ObjectTile {
    isWall = false;

    constructor(tile: iDataObject, tileSet: TileSet, mapData: TiledMap) {
        super(tile, tileSet);

        this.setCollisionTile(mapData);
    }

    setCollisionTile = (mapData: TiledMap) => {
        mapData.collisionLayer!.addCollisionTile(this, this.tileSet);
    };

    // setTileProperties = () => {
    //     if (this.properties) {
    //         for (const prop of this.properties) {
    //             if (prop.name === "isWall") {
    //                 this.isWall = prop.value;
    //             } else {
    //                 console.log("error", prop.name);
    //             }
    //         }
    //     }
    // };

    // getTiles = (): Tile[] => {
    //     const tiles: Tile[] = [];

    //     if (!this.mapData.infinite) {
    //         const tileX = Math.floor(this.x / this.mapData.tilewidth);
    //         const tileY = Math.floor(this.y / this.mapData.tileheight);
    //         const layersLength = this.mapData.layers.length;
    //         // @TODO
    //         for (let i = layersLength / 2; i < layersLength; i++) {
    //             const buf =
    //                 this.mapData.layers[i].tiles[
    //                     tileY * this.mapData._width + tileX
    //                 ];

    //             if (buf) tiles.push(buf);
    //         }
    //     } else {
    //     }

    //     return tiles;
    // };
}

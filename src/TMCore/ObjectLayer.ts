import { Config } from "../Config";
import Buildings from "./Buildings";
import Character from "./Character";
import { CollisionLayer } from "./CollisionLayer";
import ObjectTile from "./ObjectTile";
import TiledMap from "./TiledMap";
import TileSet from "./TileSet";
import { iDataObject, iObjectLayer } from "./TMModel";

export default class ObjectLayer extends PIXI.Container {
    objects!: iDataObject[];
    source: iObjectLayer;

    tiles: ObjectTile[] = [];
    index!: number;

    constructor(layer: iObjectLayer, mapData: TiledMap) {
        super();
        this.source = layer;

        this.scale.set(Config.map_scale);

        this.setLayerTiles(mapData);
    }

    setLayerTiles(mapData: TiledMap) {
        // @TODO
        if (this.source.name === "buildings") {
            mapData.collisionLayer = new CollisionLayer(mapData);
            this.addChild(mapData.collisionLayer);
        }

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
        let tile: ObjectTile;
        switch (this.source.name) {
            case "hero":
                tile = new Character(tileData, tileSet, mapData);
                break;
            case "buildings":
                tile = new Buildings(tileData, tileSet, mapData);
                break;

            default:
                console.log("error");
                tile = new ObjectTile(tileData, tileSet);
                break;
        }

        tile.x = tileData.x;
        tile.y = tileData.y - tile.height; //@TODO why?

        tile._x = tile.x / mapData.source.tilewidth;
        tile._y = tile.y / mapData.source.tileheight;

        // if (tile.textures.length > 1 && tile.props.animations) {
        //     tile.animationSpeed = 1000 / 60 / tile.props.animations[0].duration;
        //     tile.gotoAndPlay(0);
        // }

        return tile as ObjectTile;
    }

    tileExists_(layer: iDataObject) {
        return !!layer.gid;
    }

    tileExists(i: number) {
        for (const tile of this.tiles) {
            if (tile._x + tile._y * 16 === i) return true;
        }
        return false;
    }

    addTile(tile: ObjectTile) {
        this.addChild(tile);
    }
}

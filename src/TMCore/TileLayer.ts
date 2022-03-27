import * as PIXI from "pixi.js";
import { Common } from "../Config/Common";
import Tile from "./Tile";
import TiledMap from "./TiledMap";
import TileSet from "./TileSet";
import { iProperties, iTileData, iTileLayer, iTiles } from "../Model";

export default class TileLayer extends PIXI.Container {
    properties?: iProperties[];
    tiles!: Tile[];
    isWalkable: boolean;
    index!: number;

    source: iTileLayer;

    constructor(layer: iTileLayer, mapData: TiledMap) {
        super();

        this.source = layer;
        this.scale.set(Common.map_scale);

        this.setLayerTiles(mapData);

        if (this.getProperty("isWalkable")) {
            this.isWalkable = true;
        } else {
            this.isWalkable = false;
        }
    }

    getProperty = (name: string): boolean | string | number | undefined => {
        if (!this.source.properties) return undefined;
        for (const prop of this.source.properties) {
            if (prop.name === name) return prop.value;
        }
        return undefined;
    };

    setLayerTiles = (mapData: TiledMap) => {
        this.tiles = [];

        for (let y = 0; y < this.source.height; y++) {
            for (let x = 0; x < this.source.width; x++) {
                const i = x + y * this.source.width;

                if (this.tileExists(i)) {
                    const tileData: iTileData = { i, x, y };
                    const tileSet = mapData.findTileSet(
                        this.source.data[tileData.i]
                    );
                    const tile: Tile = this.createTile(
                        tileSet,
                        tileData,
                        mapData
                    );

                    this.tiles.push(tile);
                    this.addTile(tile);
                } else {
                    // @TODO
                    this.tiles.push(undefined as unknown as Tile);
                }
            }
        }
    };

    createTile = (
        tileSet: TileSet,
        tileData: iTileData,
        mapData: TiledMap
    ): Tile => {
        const { textures, props } = this.constructTileData(
            this.source.data[tileData.i],
            tileSet
        );

        const tile = new Tile(textures, props, mapData, this.source.id);

        tile.x = tileData.x * tileSet.source.tilewidth;
        tile.y = tileData.y * tileSet.source.tileheight;

        tile._x = tileData.x;
        tile._y = tileData.y;

        if (tile.props && tile.props.objectgroup) {
            mapData.collisionLayer!.addCollision(tile);
        }

        if (tile.textures.length > 1 && tile.props.animation) {
            // @TODO
            tile.animationSpeed = 1000 / 60 / tile.props.animation[0].duration;
            tile.gotoAndPlay(0);
        }

        return tile as Tile;
    };

    constructTileData = (tile: number, tileSet: TileSet) => {
        const textures: PIXI.Texture[] = [];
        let props!: iTiles;

        if (tileSet.source.tiles) {
            for (const t of tileSet.source.tiles) {
                if (t.id + tileSet.source.firstgid === tile) props = t;
            }
        }

        if (props?.animation && props?.animation.length > 0) {
            props.animation!.forEach((frame: any) => {
                textures.push(tileSet.textures[frame.tileid]);
            });
        } else {
            textures.push(tileSet.textures[tile - tileSet.source.firstgid]);
        }

        if (textures[0] === undefined) console.log("error");
        return { textures, props };
    };

    tileExists = (i: number) => {
        return this.source.data[i] !== 0;
    };

    addTile = (tile: Tile) => {
        this.addChild(tile);
    };
}

import * as PIXI from "pixi.js";
import Tile from "./Tile";
import TileSet from "./TileSet";
import { iAnimation, iDataObject, iProperties } from "./TMModel";

function setTextures(tile: iDataObject, tileSet: TileSet) {
    const textures: PIXI.Texture[] = [];

    textures.push(tileSet.textures[tile.gid - tileSet.source.firstgid]);

    return textures;
}

export default class ObjectTile extends PIXI.AnimatedSprite {
    id!: number;

    tileSet: TileSet;
    _x!: number;
    _y!: number;
    // textures: PIXI.Texture[];
    properties?: iProperties[];

    tiles!: Tile[];
    animations?: iAnimation[];
    source: iDataObject;

    collisionLayer: PIXI.Graphics[] = [];

    constructor(tileData: iDataObject, tileSet: TileSet) {
        // const { textures, animations } =
        super(setTextures(tileData, tileSet));

        // this.textures = textures;
        // this.animations = animations;
        this.tileSet = tileSet;

        this.source = tileData;
        this.visible = this.source.visible;
        this.rotation = tileData.rotation * (Math.PI / 180);
        this.anchor.set(0.5);
    }
}

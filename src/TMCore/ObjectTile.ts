import * as PIXI from "pixi.js";
import Tile from "./Tile";
import TileSet from "./TileSet";
import { iAnimation, iDataObject, iProperties } from "../Model";

export default class ObjectTile extends PIXI.AnimatedSprite {
    id!: number;

    tileSet: TileSet;
    _x!: number;
    _y!: number;
    properties?: iProperties[];

    tiles!: Tile[];
    animations?: iAnimation[];
    source: iDataObject;

    collisionLayer: PIXI.Graphics[] = [];

    constructor(tileData: iDataObject, tileSet: TileSet) {
        super([tileSet.textures[tileData.gid - tileSet.source.firstgid]]);

        this.tileSet = tileSet;

        this.source = tileData;
        this.visible = this.source.visible;
        this.rotation = tileData.rotation * (Math.PI / 180);
        this.anchor.set(0.5);
    }
}

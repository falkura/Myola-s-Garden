import * as PIXI from "pixi.js";
import Tile from "./Tile";
import TileSet from "./TileSet";
import { iAnimation, iDataObject, iProperties } from "./TMModel";

function setTextures(tile: iDataObject, tileSet: TileSet) {
    const textures: PIXI.Texture[] = [];
    const animations: iAnimation[] = [];

    // let props!: iTiles;

    // if (tileSet.source.tiles) {
    //     for (const t of tileSet.source.tiles) {
    //         if (t.id + tileSet.source.firstgid === tile) props = t;
    //     }
    // }

    // if (props?.animation && props?.animation.length > 0) {
    //     props.animation!.forEach((frame: any) => {
    //         textures.push(tileSet.textures[frame.tileid]);
    //     });
    // } else {
    //     textures.push(tileSet.textures[tile - tileSet.source.firstgid]);
    // }

    if (tileSet.source.name === "Character" && tileSet.source.tiles) {
        const res = tileSet.source.tiles[0];

        if (res.animation && res.animation.length > 0) {
            res.animation!.forEach((frame: iAnimation) => {
                animations.push(frame);
                textures.push(tileSet.textures[frame.tileid]);
            });
        }
    }

    textures.push(tileSet.textures[tile.gid - tileSet.source.firstgid]);

    return { textures, animations };
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

    constructor(tileData: iDataObject, tileSet: TileSet) {
        const { textures, animations } = setTextures(tileData, tileSet);
        super(textures);

        this.textures = textures;
        this.animations = animations;
        this.tileSet = tileSet;

        this.source = tileData;
        this.visible = this.source.visible;
        this.rotation = tileData.rotation * (Math.PI / 180);
        this.anchor.set(0.5);
    }
}

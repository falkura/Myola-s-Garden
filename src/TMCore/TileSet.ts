import * as PIXI from "pixi.js";
import { ASSETS } from "../Assets";
import { iTileset } from "./TMModel";

export default class TileSet {
    textures!: PIXI.Texture[];
    baseTexture: PIXI.Texture;
    source: iTileset;

    constructor(tileSet: iTileset) {
        this.source = tileSet;

        this.baseTexture = ASSETS[tileSet.name].texture.baseTexture;
        this.setTileTextures();
    }

    getPropsNum = (tileId: number): number | undefined => {
        if (!this.source.tiles) return undefined;

        let result: number | undefined;
        for (let i = 0; i < this.source.tiles.length; i++) {
            if (this.source.tiles[i].id === tileId) result = i;
        }

        return result;
    };

    setTileTextures = () => {
        this.textures = [];
        for (
            let y = this.source.margin;
            y < this.source.imageheight;
            y += this.source.tileheight + this.source.spacing
        ) {
            for (
                let x = this.source.margin;
                x < this.source.imagewidth;
                x += this.source.tilewidth + this.source.spacing
            ) {
                const tileRectangle = new PIXI.Rectangle(
                    x,
                    y,
                    this.source.tilewidth,
                    this.source.tileheight
                );

                const texture = new PIXI.Texture(
                    this.baseTexture as unknown as PIXI.BaseTexture,
                    tileRectangle
                );

                this.textures.push(texture);
            }
        }
    };
}

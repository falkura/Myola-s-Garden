import { IObjectData } from "../../Models";
import TiledMap from "../../TMCore/TiledMap";
import TileSet from "../../TMCore/TileSet";
import { StaticTMObject } from "./BaseTMObject";

export class Tree extends StaticTMObject {
    constructor(tileset: TileSet, objectData: IObjectData, map: TiledMap) {
        super(tileset, objectData, map);

        this.sprite.hoverScale = 1.05;
        this.sprite.addHoverHighlight();

        this.sprite.addPress(this.onPress);
    }

    onPress = () => {
        const title = "This is tree!";
        const button = {
            "  Log  ": () => {
                console.log(this);
            },
        };

        // const tempPoint = new PIXI.Point(0, 0);
        // const point = new PIXI.Point(e.data.global.x, e.data.global.y);
        // const hitmap = genHitmap(this.sprite.texture.baseTexture)!;
        // this.sprite.worldTransform.applyInverse(point, tempPoint);

        // const width = this.sprite.texture.orig.width;
        // const height = this.sprite.texture.orig.height;
        // const x1 = -width * this.sprite.anchor.x;
        // const y1 = -height * this.sprite.anchor.y;

        // const tex = this.sprite.texture;
        // const res = this.sprite.texture.baseTexture.resolution;

        // const dx = Math.round((tempPoint.x - x1 + tex.frame.x) * res);
        // const dy = Math.round((tempPoint.y - y1 + tex.frame.y) * res);
        // const ind = dx + dy * this.sprite.texture.baseTexture.realWidth;
        // const ind1 = ind % 32;
        // const ind2 = (ind / 32) | 0;

        // const result = (hitmap[ind2] & (1 << ind1)) !== 0;
        // console.log("Pixel perfect touch", result);

        this.showPopup(title, button);
    };
}

import * as PIXI from "pixi.js";
import { ITile, ITileset } from "../Models";
import { core } from "../PIXI/core";
import { ResourceController } from "../ResourceLoader";
import { genSimpleHitarea as genSimpleHitArea } from "../Util";

type ITMObjectData = { [key: number]: ITile | undefined };
type IHitArea = { [key: number]: PIXI.Rectangle | undefined };

export default class TileSet {
    textures!: PIXI.Texture[];
    baseTexture: PIXI.BaseTexture;
    source: ITileset;

    private hitAreasCache: IHitArea = {};
    private objectsData: ITMObjectData = {};

    constructor(tileSet: ITileset) {
        this.source = tileSet;

        this.baseTexture = ResourceController.getResource(tileSet.name).texture.baseTexture;
        this.setTileTextures();
        this.setTMObjectsProps();
    }

    private setTileTextures = () => {
        this.textures = [];
        for (let y = this.source.margin; y < this.source.imageheight; y += this.source.tileheight + this.source.spacing) {
            for (let x = this.source.margin; x < this.source.imagewidth; x += this.source.tilewidth + this.source.spacing) {
                const tileRectangle = new PIXI.Rectangle(x, y, this.source.tilewidth, this.source.tileheight);

                const texture = new PIXI.Texture(this.baseTexture, tileRectangle);

                this.textures.push(texture);
            }
        }
    };

    private setTMObjectsProps = () => {
        if (!this.source.tiles || this.source.tiles.length === 0) return;

        this.source.tiles.forEach(TMData => {
            this.objectsData[TMData.id] = Object.assign(this.objectsData[TMData.id] || {}, TMData);
        });
    };

    public getTMObjectData = (gid: number): ITMObjectData[number] => {
        const id = gid - this.source.firstgid;

        return this.objectsData[id] ? this.objectsData[id] : undefined;
    };

    public getTMObjectHitArea = (gid: number, sprite?: core.Sprite | core.AnimatedSprite): IHitArea[number] => {
        const id = gid - this.source.firstgid;

        if (this.hitAreasCache[id]) return this.hitAreasCache[id];
        if (!sprite) return;

        const hitArea = genSimpleHitArea(sprite.texture);

        hitArea.x -= sprite.width * sprite.anchor.x;
        hitArea.y -= sprite.height * sprite.anchor.y;

        this.hitAreasCache[id] = hitArea;

        return hitArea;
    };
}

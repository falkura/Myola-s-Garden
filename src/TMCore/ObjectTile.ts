import { IObjectData } from "../Models";
import { TileBase } from "./TileBase";
import TiledMap from "./TiledMap";
import TileSet from "./TileSet";

export default class ObjectTile extends TileBase {
    source: IObjectData;

    constructor(source: IObjectData, tileSet: TileSet, map: TiledMap) {
        super();
        this.source = source;

        this.createTile(tileSet, map);
    }

    createTile = (tileSet: TileSet, map: TiledMap) => {
        this.sprite = new PIXI.AnimatedSprite([tileSet.textures[this.source.gid - tileSet.source.firstgid]]);

        this.sprite.addChild(this);

        this.sprite.visible = this.source.visible;
        this.sprite.rotation = this.source.rotation * (Math.PI / 180);
        this.sprite.anchor.set(0.5);

        this.sprite.x = this.source.x;
        this.sprite.y = this.source.y - this.sprite.height; //@TODO why?

        this._x = this.sprite.x / map.source.tilewidth;
        this._y = this.sprite.y / map.source.tileheight;
    };
}

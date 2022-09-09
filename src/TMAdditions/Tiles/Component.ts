import Tile from "../../TMCore/Tile";
import { TileCompTypes } from "../../TMCore/TileBase";
import TiledMap from "../../TMCore/TiledMap";
import TileSet from "../../TMCore/TileSet";

export default class Component {
    map: TiledMap;
    tileSet!: TileSet;
    sprite!: PIXI.AnimatedSprite | PIXI.Sprite;
    id: number;
    type: TileCompTypes;
    parentTile?: Tile;

    constructor(id: number, tilesetName: string, map: TiledMap, type: TileCompTypes) {
        this.id = id;
        this.map = map;
        this.type = type;

        this.setTileset(tilesetName);
        this.setSprite();
    }

    private setTileset = (tilesetName: string) => {
        const tileset = this.map.getTilesetByName(tilesetName);

        if (!tileset) throw new Error(`There is no tileset with name ${tilesetName}!`);

        this.tileSet = tileset;
    };

    setSprite = () => {
        this.sprite = new PIXI.AnimatedSprite([this.tileSet.textures[this.id]]);
        this.sprite.anchor.set(0.5);
    };

    setInTile = (tile: Tile) => {
        const data = {
            sprite: this.sprite,
            type: this.type,
        };

        tile.addTileComp(data);
        this.parentTile = tile;
    };

    removeFromTile = () => {
        if (!this.parentTile) {
            console.error("NOT IN TILE");
            return;
        }

        this.parentTile.removeTileComp(this.type);
        this.parentTile = undefined;
    };
}

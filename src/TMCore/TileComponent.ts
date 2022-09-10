import { Clickable } from "../GameComponents/Clickable";
import Tile from "./Tile";
import TiledMap from "./TiledMap";
import TileSet from "./TileSet";

type TileCompTypes = "dirt" | "plant" | "chest";

export default class TileComponent {
    map: TiledMap;
    tileSet!: TileSet;
    sprite!: Clickable;
    id: number;
    parentTile?: Tile;
    type: TileCompTypes = "plant";

    constructor(id: number, tilesetName: string, map: TiledMap /*, type: TileCompTypes*/) {
        this.id = id;
        this.map = map;
        // this.type = type;

        this.setTileset(tilesetName);
        this.setSprite();
    }

    private setTileset = (tilesetName: string) => {
        const tileset = this.map.getTilesetByName(tilesetName);

        if (!tileset) throw new Error(`There is no tileset with name ${tilesetName}!`);

        this.tileSet = tileset;
    };

    private setSprite = () => {
        if (!this.tileSet.textures[this.id])
            throw new Error(`There is no texture with id ${this.id} in tileset ${this.tileSet.source.name}!`);

        this.sprite = new Clickable(this.tileSet.textures[this.id]);
        this.sprite.anchor.set(0.5);
    };

    public setInTile = (tile: Tile) => {
        tile.addTileComp(this);
        this.parentTile = tile;
    };

    public removeFromTile = () => {
        if (!this.parentTile) {
            console.error("NOT IN TILE");
            return;
        }

        this.parentTile.removeTileComp();
        this.parentTile = undefined;
    };

    public destroy = () => {
        this.removeFromTile();

        this.sprite.destroy();
    };
}

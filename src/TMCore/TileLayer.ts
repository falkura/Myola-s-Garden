import TiledMap from "./TiledMap";
import { ITileConfig, ITileLayerData } from "../Models";
import { findTileSet } from "../TMAdditions/TMUtils";
import Tile from "./Tile";
import { createEmptyMatrix } from "../TMAdditions/MatrixUtils";

export default class TileLayer extends PIXI.Container {
    tiles: Tile[][] = [];
    source: ITileLayerData;
    index!: number;

    constructor(layer: ITileLayerData, map: TiledMap) {
        super();
        this.source = layer;

        this.setLayerTiles(map);
    }

    setLayerTiles = (map: TiledMap) => {
        this.tiles = createEmptyMatrix<Tile>(this.source.width, this.source.height);

        for (let y = 0; y < this.source.height; y++) {
            for (let x = 0; x < this.source.width; x++) {
                const index = x + y * this.source.width;

                if (this.tileExists(index)) {
                    const tileConfig: ITileConfig = { index, x, y };
                    const tileSet = findTileSet(map, this.source.data[tileConfig.index]);
                    const tile = new Tile(tileSet, tileConfig, this.source);

                    this.addTile(tile, y, x);
                } else {
                    // @TODO infinite map :)
                    // this.tiles[x][y] = null as unknown as Tile;
                }
            }
        }
    };

    tileExists = (i: number) => {
        return this.source.data[i] !== 0;
    };

    addTile = (tile: Tile, x: number, y: number) => {
        this.tiles[x][y] = tile;
        this.addChild(tile.sprite);
    };

    removeTile = (x: number, y: number) => {
        const tile = this.tiles[y][x];

        this.tiles[y][x] = undefined as unknown as Tile;
        this.removeChild(tile.sprite);
    };
}

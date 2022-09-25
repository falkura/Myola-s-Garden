import { IObjectData } from "../Models";
import Tile from "../TMCore/Tile";
import TiledMap from "../TMCore/TiledMap";
import TileSet from "../TMCore/TileSet";

export function findTileSet(map: TiledMap, gid: number): TileSet {
    let tileSet: TileSet | undefined;

    for (let i = map.tilesets.length - 1; i >= 0; i--) {
        tileSet = map.tilesets[i];
        if (tileSet.source.firstgid <= gid) {
            break;
        }
    }

    if (!tileSet) throw new Error(`There is no tilest with gid ${gid} in map ${map.mapName}!`);

    return tileSet;
}

export function getTileBurger(map: TiledMap, x: number, y: number): Tile[] {
    const res: Tile[] = [];

    for (const layer of map.layers) {
        const tile = layer.tiles[y][x];
        if (tile) res.push(tile);
    }

    return res.reverse();
}

export function getTopTile(map: TiledMap, x: number, y: number): Tile {
    let res!: Tile;

    for (let i = map.layers.length - 1; i >= 0; i--) {
        if (map.layers[i].tiles[y][x] && !res) res = map.layers[i].tiles[y][x];
    }

    return res;
}

export function getObjectTileTexture(ts: TileSet, data: IObjectData) {
    return ts.textures[data.gid - ts.source.firstgid];
}

// Boooriiing
export function validateGid(data: IObjectData) {
    if (data.gid > 3221225472) {
        data.gid -= 3221225472;
        data.translate = new PIXI.Point(-1, -1);
    } else if (data.gid > 2147483648) {
        data.gid -= 2147483648;
        data.translate = new PIXI.Point(-1, 1);
    } else if (data.gid > 1073741824) {
        data.gid -= 1073741824;
        data.translate = new PIXI.Point(1, -1);
    } else {
        data.translate = new PIXI.Point(1, 1);
    }
}

export function getItemByName() {}

/**
 * I think this function already exists, but I don't know what it's called, soo
 *
 * I use it to find the right texture, depending on the existence of adjacent tiles
 *
 * It's a simple version, only 4 bit calculation, and checking only 4 sides.
 * Can be upgraded to 8 sides, with 8 bit, but i don't have that many resources
 * for it and also, i have a life (joke, i don't 💋)
 *
 * The first 4 bits are used in calculation - `4️⃣3️⃣2️⃣1️⃣`:
 *
 * - `1️⃣ - Top`
 * - `2️⃣ - Left`
 * - `3️⃣ - Right`
 * - `4️⃣ - Bottom`
 *
 * Before using it, you need to prepare an array of textures, where the index in
 * binary matches the correct texture. For example:
 *
 * Result number is 5. 5 in binary system is 0101.
 * It means, that central element have contact with top (bit number 1) and right
 * (bit number 3) sides, so in the texture array, you need to put a corner texture
 * like  ┚ at position 5.
 *
 * @param field 3x3 matrix (it won't work with other sizes).
 * @returns `number`, where each bit is responsible for an element on each side.
 */
export function GetTileTextureId(field: unknown[][]): number {
    // Check matrix size
    if (!field.checkMatrixSize(3, 3)) throw new Error("GetTileTextureId works only for 3x3 matrix!");

    let result = 0;
    let bIndes = 0;

    field.forEach((row, ri) => {
        row.forEach((elem, ei) => {
            // Skip corner elements
            if (ei - 1 !== 0 && ri - 1 !== 0) return;
            // Skip center element
            if (ei === ri) return;

            // Check for existence
            if (!!elem) {
                // Change side number in result from 0 to 1
                result = result | (1 << bIndes);
            }

            // Increase bit index for next side
            bIndes++;
        });
    });

    return result;
}

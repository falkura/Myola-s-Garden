import ObjectTile from "../TMCore/ObjectTile";
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

export function copyMatrix<T>(source: T[][]) {
    return source.map(arr => {
        return arr.slice();
    });
}

export function subtractMatrix<T, K>(target: T[][], source: K[][]) {
    target = copyMatrix(target);

    for (let i = 0; i < target.length; i++) {
        for (let j = 0; j < target[i].length; j++) {
            if (source[i][j]) target[i][j] = undefined as unknown as T;
        }
    }
    return target;
}

export function concatMatrix<T, K>(target: Array<Array<T | K>>, source: K[][], replace = false) {
    target = copyMatrix(target);

    for (let i = 0; i < target.length; i++) {
        for (let j = 0; j < target[i].length; j++) {
            if (replace) {
                if (source[i][j]) {
                    target[i][j] = source[i][j];
                }
            } else if (!target[i][j]) {
                target[i][j] = source[i][j];
            }
        }
    }
    return target;
}

export function* matrixIterator<T>(matrix: T[][]): IterableIterator<T | undefined> {
    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[x].length; y++) {
            yield matrix[x][y];
        }
    }
}

export function createEmptyMatrix<T>(width: number, height: number): T[][] {
    return Array(width)
        .fill(undefined as unknown as T)
        .map(_a => Array(height).fill(undefined as unknown as T));
}

export function logMatrix<T>(matrix: T[][], matrixName?: string, expand = false): void {
    const label: string[] = [`🔹 Matrix Log${matrixName ? ` for %c${matrixName}` : ""} 🔹`];
    const matrixNameStyle = "color:#90ee90;";

    if (matrixName) label.push(matrixNameStyle);

    let res = "";

    matrix.forEach(row => {
        row.forEach(el => {
            res += el ? "⬜️" : "⬛️";
        });
        res += "\n";
    });

    if (expand) {
        console.group(...label);
    } else {
        console.groupCollapsed(...label);
    }

    console.log(res);
    console.groupCollapsed("%cSource 👇 ", "color:#FFF9A6;");
    console.log(matrix);
    console.groupEnd();
    console.groupEnd();
}

type ITile = Tile | ObjectTile;

export function getTileBurger(map: TiledMap, x: number, y: number): ITile[] {
    const res: ITile[] = [];

    for (const layer of map.layers) {
        const tile = layer.tiles[y][x];
        if (tile) res.push(tile);
    }

    return res.reverse();
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

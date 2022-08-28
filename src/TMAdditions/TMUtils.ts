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

export function* matrixIterator<T>(matrix: T[][]): IterableIterator<T> {
    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[x].length; y++) {
            yield matrix[x][y];
        }
    }
}

export function createEmptyMatrix<T>(width: number, height: number): T[][] {
    return Array(width)
        .fill(null as unknown as T)
        .map(_a => Array(height).fill(null as unknown as T));
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

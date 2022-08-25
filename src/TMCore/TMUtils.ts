import { IMapData, LayerType } from "../Models";
import ObjectLayer from "./ObjectLayer";
import ObjectTile from "./ObjectTile";
import Tile from "./Tile";
import TiledMap from "./TiledMap";
import TileLayer from "./TileLayer";
import TileSet from "./TileSet";

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

export function layerToMatrix(layer: TileLayer | ObjectLayer, mapData: IMapData) {
    let matrix: Array<Array<Tile | ObjectTile>> = [];

    if (layer.source.type === LayerType.TileLayer) {
        for (let i = 0, k = -1; i < layer.tiles.length; i++) {
            if (i % mapData.width === 0) {
                k++;
                matrix[k] = [];
            }

            matrix[k].push(layer.tiles[i]);
        }
    } else if (layer.source.type === LayerType.ObjectGroup) {
        matrix = createEmptyMatrix(mapData.width, mapData.height);

        for (const tile of layer.tiles) {
            matrix[tile._y][tile._x] = tile;
        }
    }

    return matrix;
}

export function subtractMatrix<T, K>(target: T[][], source: K[][]) {
    for (let i = 0; i < target.length; i++) {
        for (let j = 0; j < target[i].length; j++) {
            if (source[i][j]) target[i][j] = undefined as unknown as T;
        }
    }
    return target;
}

export function concatMatrix<T, K>(target: Array<Array<T | K>>, source: K[][], replace = false) {
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

export function createEmptyMatrix(width: number, height: number) {
    return Array(width)
        .fill(null)
        .map(_a => Array(height).fill(null));
}

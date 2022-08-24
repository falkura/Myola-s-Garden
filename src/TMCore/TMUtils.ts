import TiledMap from "./TiledMap";
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

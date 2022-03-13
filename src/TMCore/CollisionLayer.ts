import ObjectTile from "./ObjectTile";
import TiledMap from "./TiledMap";
import TileSet from "./TileSet";

export class CollisionLayer extends PIXI.Container {
    collisionsMap: PIXI.Graphics[] = [];
    mapData: TiledMap;

    constructor(mapData: TiledMap) {
        super();
        this.mapData = mapData;
    }

    addCollisionTile = (tile: ObjectTile, tileSet: TileSet) => {
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xff0000, 0);

        const ob =
            tileSet.source.tiles![tile.source.gid - tileSet.source.firstgid]
                .objectgroup?.objects[0];
        graphics.drawRect(
            tile.source.x + ob!.x - tile.source.width * tile.anchor.x,
            tile.source.y +
                ob!.y -
                tile.source.height * tile.anchor.y -
                this.mapData.source.tileheight,
            ob!.width,
            ob!.height
        );
        graphics.endFill();

        const sprite = new PIXI.Graphics();
        sprite.addChild(graphics);
        this.collisionsMap.push(sprite);
        this.addChild(sprite);
    };
}

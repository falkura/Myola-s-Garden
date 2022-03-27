import { GameObject } from "../GameObjects/GameObject";
import ObjectTile from "./ObjectTile";
import Tile from "./Tile";
import TiledMap from "./TiledMap";
import TileSet from "./TileSet";

export class CollisionLayer extends PIXI.Container {
    collisionsMap: Array<Tile | ObjectTile | GameObject> = [];
    objectsMap: GameObject[] = [];
    mapData: TiledMap;

    constructor(mapData: TiledMap) {
        super();
        this.mapData = mapData;
    }

    addCollision = (tile: Tile | ObjectTile, tileSet?: TileSet) => {
        if (tileSet) {
            this.addObjectTileCollision(tile as ObjectTile, tileSet);
        } else {
            this.addTileCollision(tile as Tile);
        }
    };

    addObjectTileCollision = (tile: ObjectTile, tileSet: TileSet) => {
        const graphics = new PIXI.Graphics();
        const ob =
            tileSet.source.tiles![tile.source.gid - tileSet.source.firstgid]
                .objectgroup?.objects[0];

        graphics.beginFill(0xff0000, 0);
        graphics.drawRect(0, 0, ob!.width, ob!.height);
        graphics.endFill();

        graphics.x = ob!.x - tile.source.width * tile.anchor.x;
        graphics.y = ob!.y - tile.source.height * tile.anchor.y;

        this.collisionsMap.push(tile);
        tile.collisionLayer.push(graphics);
        tile.addChild(graphics);
    };

    addTileCollision = (tile: Tile) => {
        for (const ob of tile.props.objectgroup!.objects) {
            const graphics = new PIXI.Graphics();
            graphics.beginFill(0xff0000, 0);
            graphics.drawRect(0, 0, ob!.width, ob!.height);
            graphics.endFill();

            graphics.x = ob!.x - tile.width * tile.anchor.x;
            graphics.y = ob!.y - tile.height * tile.anchor.y;

            this.collisionsMap.push(tile);
            tile.collisionLayer.push(graphics);
            tile.addChild(graphics);
        }
    };
}

import { IObjectData, TileCompTypes } from "../../Models";
import { findTileSet } from "../../TMAdditions/TMUtils";
import TiledMap from "../../TMCore/TiledMap";
import { BaseTMObject } from "./BaseTMObject";
import { Bed } from "./Bed";
import { Chest } from "./Chest";
import { Roof } from "./Roof";
import { Wall } from "./Wall";

export class ObjectsFactory {
    map: TiledMap;

    constructor(map: TiledMap) {
        this.map = map;
    }

    private getType = (data: IObjectData): TileCompTypes => {
        let type: TileCompTypes | undefined;

        data.properties?.forEach(prop => {
            if (prop.name === "type" && typeof prop.value === "string") {
                type = prop.value as TileCompTypes;
            }
        });

        if (!type) type = "unknown";

        return type;
    };

    createTMObject = (objectData: IObjectData) => {
        const type = this.getType(objectData);
        const TS = findTileSet(this.map, objectData.gid);

        let TMObject;

        switch (type) {
            case "chest":
                TMObject = new Chest(TS, objectData, this.map);
                break;
            case "wall":
                TMObject = new Wall(TS.textures[objectData.gid - TS.source.firstgid], objectData, this.map);
                break;
            case "roof":
                TMObject = new Roof(TS.textures[objectData.gid - TS.source.firstgid], objectData, this.map);
                break;
            case "bed":
                TMObject = new Bed(TS.textures[objectData.gid - TS.source.firstgid], objectData, this.map);
                break;
            default:
                TMObject = new BaseTMObject(TS.textures[objectData.gid - TS.source.firstgid], objectData, this.map);
                console.error("incorrect type of TMObject");
        }

        TMObject.sprite.position.set(objectData.x + objectData.width / 2, objectData.y - objectData.height / 2);

        return TMObject;
    };
}

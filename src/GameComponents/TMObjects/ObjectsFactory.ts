import { IObjectData, TileCompTypes } from "../../Models";
import { findTileSet, validateGid } from "../../TMAdditions/TMUtils";
import TiledMap from "../../TMCore/TiledMap";
import { AnimatedDecoration } from "./AnimatedDecoration";
import { StaticTMObject } from "./BaseTMObject";
import { Bed } from "./Bed";
import { Chest } from "./Chest";
import { Decoration } from "./Decoration";
import { Roof } from "./Roof";
import { Stone } from "./Stone";
import { Wall } from "./Wall";
import { WaterWave } from "./WaterWave";

export class ObjectsFactory {
    map: TiledMap;

    constructor(map: TiledMap) {
        this.map = map;
    }

    private getType = (data: IObjectData): TileCompTypes => {
        if (data.type) return data.type;

        let type: TileCompTypes | undefined;

        data.properties?.forEach(prop => {
            if (prop.name === "type" && typeof prop.value === "string") {
                type = prop.value as TileCompTypes;
            }
        });

        if (!type) {
            const objData = findTileSet(this.map, data.gid)?.getTMObjectData(data.gid);
            if (objData && objData.type) type = objData.type;
        }

        if (!type) {
            console.error("There is no type in tile!\n", data);
            type = "unknown";
        }

        return type;
    };

    createTMObject = (objectData: IObjectData) => {
        validateGid(objectData);

        const type = this.getType(objectData);
        const TS = findTileSet(this.map, objectData.gid);

        let TMObjectConstructor;

        switch (type) {
            case "chest":
                TMObjectConstructor = Chest;
                break;

            case "wall":
                TMObjectConstructor = Wall;
                break;

            case "roof":
                TMObjectConstructor = Roof;
                break;

            case "bed":
                TMObjectConstructor = Bed;
                break;

            case "decoration":
                if (TS.getTMObjectData(objectData.gid)?.animation) {
                    TMObjectConstructor = AnimatedDecoration;
                } else {
                    TMObjectConstructor = Decoration;
                }
                break;

            case "stone":
                TMObjectConstructor = Stone;
                break;

            case "waterwave":
                TMObjectConstructor = WaterWave;
                break;

            default:
                TMObjectConstructor = StaticTMObject;
                console.error("Incorrect type of TMObject!\n", objectData);
        }

        const TMObject = new TMObjectConstructor(TS, objectData, this.map);
        TMObject.type = type;

        TMObject.sprite.position.set(objectData.x + objectData.width / 2, objectData.y - objectData.height / 2);

        return TMObject;
    };
}

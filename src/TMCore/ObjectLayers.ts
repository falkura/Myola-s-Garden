import { Chest } from "../GameComponents/TMObjects/Chest";
import { ObjectsFactory } from "../GameComponents/TMObjects/ObjectsFactory";
import { Roof } from "../GameComponents/TMObjects/Roof";
import { IObjectLayerData } from "../Models";
import TiledMap from "./TiledMap";

export class ObjectLayers extends PIXI.Container {
    map: TiledMap;
    factory: ObjectsFactory;
    roofs: Roof[][] = [];
    chests: Chest[] = [];

    constructor(map: TiledMap) {
        super();
        this.map = map;
        this.factory = new ObjectsFactory(this.map);
        this.map.addChild(this);
        this.position.set(-this.map.source.tilewidth / 2, -this.map.source.tileheight / 2);
    }

    addLayer = (layerData: IObjectLayerData) => {
        console.log(layerData);

        for (const objectData of layerData.objects) {
            const object = this.factory.createTMObject(objectData);

            switch (object.type) {
                case "roof":
                    if (this.roofs[object.num!]) {
                        this.roofs[object.num!].push(object);
                    } else {
                        this.roofs[object.num!] = [object];
                    }
                    break;
                case "chest":
                    this.chests[object.num!] = object as Chest;

                    break;

                default:
                    break;
            }

            this.addChild(object.sprite);
        }
    };
}

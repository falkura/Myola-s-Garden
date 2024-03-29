import { Clickable } from "../GameComponents/Clickable";
import { Chest } from "../GameComponents/TMObjects/Chest";
import { ObjectsFactory } from "../GameComponents/TMObjects/ObjectsFactory";
import { Roof } from "../GameComponents/TMObjects/Roof";
import { Tree } from "../GameComponents/TMObjects/Tree";
import { IObjectLayerData } from "../Models";
import { NonClickableController } from "../NonClickableController";
import TiledMap from "./TiledMap";

export class ObjectLayers extends PIXI.Container {
    map: TiledMap;
    factory: ObjectsFactory;
    roofs: Roof[][] = [];
    chests: Chest[] = [];
    trees: Tree[] = [];
    NCController: NonClickableController;

    constructor(map: TiledMap) {
        super();
        this.map = map;
        this.NCController = new NonClickableController(this.map);
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
                    if (this.roofs[object.props.num!]) {
                        this.roofs[object.props.num!].push(object);
                    } else {
                        this.roofs[object.props.num!] = [object];
                    }
                    break;

                case "chest":
                    this.chests[object.props.num!] = object as Chest;
                    break;

                case "tree":
                    this.trees.push(object as Tree);
                    break;

                default:
                    break;
            }

            // @TODO need automatization
            if (object.props.underroof != undefined) {
                this.NCController.add(object.sprite as Clickable);
            }

            this.addChild(object.sprite);
        }
    };
}

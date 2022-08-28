import TiledMap from "./TMCore/TiledMap";

export class InventoryController extends PIXI.Container {
    map: TiledMap;

    constructor(map: TiledMap) {
        super();

        this.map = map;
        this.constructInventory();
    }

    constructInventory = () => {};
}

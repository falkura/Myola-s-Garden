import { Config } from "./Config";
import { EVENTS } from "./Events";
import { GroundController } from "./GroundController";
import { InventoryController } from "./InventoryController";
import TiledMap from "./TMCore/TiledMap";
import { waitForEvent } from "./Util";

export class MapController {
    map?: TiledMap;
    groundController!: GroundController;
    inventoryController!: InventoryController;
    container: PIXI.Container;

    constructor(container: PIXI.Container) {
        this.container = container;
    }

    loadMap = (key: string): Promise<void> => {
        this.map = new TiledMap(key);

        return waitForEvent(EVENTS.Map.Created).then(() => {
            this.setUp();
        });
    };

    setUp = () => {
        this.groundController = new GroundController(this);
        this.groundController.addCells();

        this.inventoryController = new InventoryController(this.map!);
        this.container.addChild(this.inventoryController);
        this.resize();
    };

    destroy = () => {
        if (this.map) {
            this.map.parent.removeChild(this.map);
            this.map.destroy();
            this.map = undefined;
        }
    };

    resize = () => {
        if (this.map) {
            this.map.scale.set(
                Config.project_width / this.map._width > Config.project_height / this.map._height
                    ? Config.project_width / this.map._width
                    : Config.project_height / this.map._height,
            );
        }
    };
}

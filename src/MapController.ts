import { Config } from "./Config";
import { EVENTS } from "./Events";
import { GroundController } from "./GroundController";
import { InventoryController } from "./InventoryController";
import TiledMap from "./TMCore/TiledMap";
import { logImage, waitForEvent } from "./Util";

export class MapController {
    app: PIXI.Application;
    map?: TiledMap;
    groundController!: GroundController;
    inventoryController!: InventoryController;
    container: PIXI.Container;

    constructor(container: PIXI.Container, app: PIXI.Application) {
        this.container = container;
        this.app = app;
    }

    loadMap = (key: string): Promise<void> => {
        this.map = new TiledMap(key, this.app);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).map = this.map;

        return waitForEvent(EVENTS.Map.Created).then(() => {
            this.setUp();
        });
    };

    setUp = () => {
        this.container.addChild(this.map!);

        this.groundController = new GroundController(this);
        this.groundController.addCells();

        this.inventoryController = new InventoryController(this.map!);
        this.container.addChild(this.inventoryController);
        this.resize();

        logImage(this.map!, this.app);
    };

    cleanUp = () => {
        if (this.map) {
            this.map.parent.removeChild(this.map);
            this.map.cleanUp();
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

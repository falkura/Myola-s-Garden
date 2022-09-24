import { Config } from "./Config";
import { GroundController } from "./GroundController";
import { InventoryController } from "./InventoryController";
import { RoofController } from "./RoofController";
import TiledMap from "./TMCore/TiledMap";
import { TMObjectPopupController } from "./TMObjectPopupController";
import { logImage } from "./Util";

export class MapController {
    app: PIXI.Application;
    map?: TiledMap;
    groundController!: GroundController;
    roofController!: RoofController;
    inventoryController!: InventoryController;
    TMObjectPopupController!: TMObjectPopupController;
    container: PIXI.Container;

    constructor(container: PIXI.Container, app: PIXI.Application) {
        this.container = container;
        this.app = app;
    }

    loadMap = (key: string) => {
        this.map = new TiledMap(key, this.app);
        this.container.addChild(this.map!);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).map = this.map;

        this.map.load().then(this.setUp);
    };

    setUp = () => {
        this.groundController = new GroundController(this);
        this.groundController.addCells();

        this.roofController = new RoofController(this.map!);

        this.inventoryController = new InventoryController(this.map!);
        this.container.addChild(this.inventoryController);

        this.TMObjectPopupController = new TMObjectPopupController(this.map!);
        this.container.addChild(this.TMObjectPopupController);

        this.resize();

        logImage(this.map!, this.app);
    };

    cleanUp = () => {
        if (this.map) {
            this.groundController.cleanUp();
            this.roofController.cleanUp();
            this.inventoryController.cleanUp();
            this.TMObjectPopupController.cleanUp();

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

        this.inventoryController?.resize();
        this.TMObjectPopupController?.resize();
    };
}

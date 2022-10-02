import { GroundController } from "./GroundController";
import { InventoryController } from "./InventoryController";
import { RoofController } from "./RoofController";
import { TMCamera } from "./TMCamera";
import TiledMap from "./TMCore/TiledMap";
import { TMObjectPopupController } from "./TMObjectPopupController";
import { logImage } from "./Util";

export class MapController {
    app: PIXI.Application;
    private _map?: TiledMap;
    groundController!: GroundController;
    roofController!: RoofController;
    inventoryController!: InventoryController;
    TMObjectPopupController!: TMObjectPopupController;
    container: PIXI.Container;
    camera!: TMCamera;

    constructor(container: PIXI.Container, app: PIXI.Application) {
        this.container = container;
        this.app = app;
    }

    public get map(): TiledMap {
        if (!this._map) throw new Error("NO MAP !!!");

        return this._map;
    }

    public set map(_map: TiledMap) {
        this._map = _map;
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

        this.camera = new TMCamera(this.map, this.app);
        this.camera.onResizeCb = this.resize;

        this.resize();

        logImage(this.map!, this.app, undefined, "Map Init");
    };

    cleanUp = () => {
        if (this.map) {
            this.groundController.cleanUp();
            this.roofController.cleanUp();
            this.inventoryController.cleanUp();
            this.TMObjectPopupController.cleanUp();
            this.camera.cleanUp();

            this.map.parent.removeChild(this.map);
            this.map.cleanUp();

            this._map = undefined;
        }
    };

    resize = () => {
        this.camera?.resize();
        this.inventoryController?.resize();
        this.TMObjectPopupController?.resize();
    };
}

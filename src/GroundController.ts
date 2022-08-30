import { EVENTS } from "./Events";
import { LogicState } from "./logic_state";
import { MapController } from "./MapController";
import { LayersArr } from "./Models";
import { TMCellMap } from "./TMAdditions/CellMap";
import { getTileBurger } from "./TMAdditions/TMUtils";

export class GroundController {
    mapController: MapController;
    seedMode = false;
    cellMap?: TMCellMap;

    constructor(mc: MapController) {
        this.mapController = mc;
        this.addEventListeners();
    }

    addCells = () => {
        this.cellMap = new TMCellMap(this.mapController.map!.source);
        this.mapController.map!.addChild(this.cellMap);
    };

    addEventListeners = () => {
        document.addEventListener(EVENTS.Keyboard.Shift.On, this.shiftOn);
        document.addEventListener(EVENTS.Keyboard.Shift.Off, this.shiftOff);
        document.addEventListener(EVENTS.Actions.Tile.Choosen, this.onTileChoose);
    };

    onTileChoose = (e: Event) => {
        const detail = (e as CustomEvent<PIXI.Point>).detail;

        const b = getTileBurger(this.mapController.map!, detail.x, detail.y);
        console.log(b);
    };

    shiftOn = () => {
        if (this.seedMode) return;

        LogicState.isShift = true;
        this.seedMode = true;

        this.onSeed();
    };

    shiftOff = () => {
        LogicState.isShift = false;
        this.seedMode = false;

        this.offSeed();
    };

    onSeed = () => {
        this.mapController.groundController.cellMap!.showByMatrix(
            this.mapController
                .map!.layers[LayersArr.Ground].tiles.concatMatrix(this.mapController.map!.layers[LayersArr.Hills].tiles)
                .subtractMatrix(this.mapController.map!.layers[LayersArr.Buildings].tiles),
        );
        // const walkableLayers = this.mapController.map!.getWalkableLayers();
        // for (let i = 0; i < walkableLayers.length; i++) {
        // 	if (walkableLayers[i].source.id === this.character.activeLayer) {
        // 		for (const tile of walkableLayers[i].tiles) {
        // 			if (tile) {
        // 				const dist = 2;
        // 				if (
        // 					Math.abs(tile._x - this.character!._x) > dist ||
        // 					Math.abs(tile._y - this.character!._y) > dist ||
        // 					!tile.getProperty("canPlant")
        // 				) {
        // 				} else {
        // 					tile.debugGraphics.visible = true;
        // 				}
        // 			}
        // 		}
        // 	}
        // }
    };

    offSeed = () => {
        this.mapController.groundController.cellMap!.hideAll();
        // for (const layer of this.mapController.map!.getWalkableLayers()) {
        // 	for (const tile of layer.tiles) {
        // 		if (tile) tile.debugGraphics.visible = false;
        // 	}
        // }
    };
}

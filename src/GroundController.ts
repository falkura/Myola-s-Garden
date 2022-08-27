import { EVENTS } from "./Events";
import { LogicState } from "./logic_state";
import { MapController } from "./MapController";
import { TMCellMap } from "./TMAdditions/CellMap";
import { concatMatrix, logMatrix, subtractMatrix } from "./TMCore/TMUtils";

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

        const matrix = concatMatrix(
            subtractMatrix(this.mapController.map!.layers[1].tiles, this.mapController.map!.layers[5].tiles),
            this.mapController.map!.layers[3].tiles,
        );

        this.cellMap.showByMatrix(matrix);
        logMatrix(matrix, "Cell Map");
    };

    addEventListeners = () => {
        document.addEventListener(EVENTS.Keyboard.Shift.On, this.shiftOn);
        document.addEventListener(EVENTS.Keyboard.Shift.Off, this.shiftOff);
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
        // for (const layer of this.mapController.map!.getWalkableLayers()) {
        // 	for (const tile of layer.tiles) {
        // 		if (tile) tile.debugGraphics.visible = false;
        // 	}
        // }
    };
}
import { Config } from "../Config";
import { Drop } from "../TMCore/Drop";
import TiledMap from "../TMCore/TiledMap";
import { InventoryCell } from "./InventoryCell";

export class InventoryController extends PIXI.Container {
    mapData: TiledMap;
    cellCount = 7;
    itemCells: InventoryCell[] = [];

    constructor(mapData: TiledMap) {
        super();

        this.mapData = mapData;
        this.constructInventory();
    }

    constructInventory = () => {
        for (let i = 0; i < this.cellCount; i++) {
            const cell = new InventoryCell(this.mapData);
            this.itemCells.push(cell);
            cell.position.x = cell.width * i - Config.inventoryCellBorder * i;
            cell.position.y = Config.inventoryCellBorder / 2;
            this.addChild(cell);
        }
    };

    insertItem = (drop: Drop): boolean => {
        for (const cell of this.itemCells) {
            if (cell.id && cell.id === drop.data.drop.id) {
                cell.addItem();
                return true;
            }
        }

        for (const cell of this.itemCells) {
            if (!cell.id) {
                cell.setItem(drop);
                return true;
            }
        }

        console.log("not enough space");
        return false;
    };
}

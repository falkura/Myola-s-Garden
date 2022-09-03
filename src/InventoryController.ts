import { EVENTS } from "./Events";
import { List } from "./GameComponents/List/List";
import { ListItem } from "./GameComponents/List/ListItem";
import TiledMap from "./TMCore/TiledMap";

export class InventoryController extends PIXI.Container {
    map: TiledMap;
    listArray: List[] = [];
    activeList?: List;
    inventory!: List;

    constructor(map: TiledMap) {
        super();

        this.map = map;
        this.constructInventory();
        this.addEventListeners();
    }

    constructInventory = () => {
        this.inventory = new List(this.map, 8, 1, "inventoryBar");
        this.inventory.position.set(400, 900);
        this.addChild(this.inventory);
        this.listArray.push(this.inventory);
    };

    setActiveList = (list: List) => {
        if (this.inventory.name !== list.name) {
            this.activeList = list;
        } else {
            console.error("Inventory always active!");
        }
    };

    removeActiveList = () => {
        this.activeList = undefined;
    };

    addEventListeners = () => {
        document.addEventListener(EVENTS.Actions.Inventory.Dropped, this.onDrop);
        document.addEventListener(EVENTS.Actions.Inventory.Shifted, this.onShift);
    };

    getHoveredList = (): List | undefined => {
        let hoveredList: List | undefined;

        this.listArray.forEach(list => {
            if (list.isHovered) hoveredList = list;
        });

        return hoveredList;
    };

    onDrop = (e: Event) => {
        const droppedItem = (e as CustomEvent<ListItem>).detail;
        let done = false;

        const hoveredList = this.getHoveredList();

        if (hoveredList) {
            const hoveredCell = hoveredList.getHoveredCell();

            if (hoveredCell && droppedItem.parentCell !== hoveredCell) {
                if (hoveredCell.item) {
                    if (hoveredCell.item.data[hoveredCell.item.type] === droppedItem.data[droppedItem.type]) {
                        // ADD
                        hoveredCell.item.count += droppedItem.count;
                        droppedItem.cleanUp();
                        done = true;
                    } else {
                        // SWAP
                        const savedData = { data: hoveredCell.item.data, type: hoveredCell.item.type, count: hoveredCell.item.count };
                        hoveredCell.item.cleanUp();

                        hoveredCell.setItem(droppedItem.data, droppedItem.type, droppedItem.count);
                        droppedItem.cleanUp();
                        done = true;

                        droppedItem.parentCell.setItem(savedData.data, savedData.type, savedData.count);
                    }
                } else {
                    // SET ITEM IN EMPTY CELL
                    hoveredCell.setItem(droppedItem.data, droppedItem.type, droppedItem.count);
                    droppedItem.cleanUp();
                    done = true;
                }
            }
        }

        if (!done && droppedItem) {
            // RETURN
            droppedItem.x = 0;
            droppedItem.y = 0;
        }
        // this.calculatePrice();
    };

    onShift = (e: Event) => {
        const hoveredList = this.getHoveredList();
        const shiftedItem = (e as CustomEvent<ListItem>).detail;

        if (!hoveredList || !this.inventory) return;

        let targetList: List;

        if (hoveredList !== this.inventory) {
            // FROM HOVERED TO INVENTORY
            targetList = this.inventory;
        } else {
            if (this.activeList) {
                // OR SHOUL I RETURN BEFORE, IF WE DON`T HAVE ACTIVE LIST?

                // FROM INVENTORY TO ACTIVE
                targetList = this.activeList;
            } else {
                return;
            }
        }

        let targetCell = targetList.getCellByData(shiftedItem.data, shiftedItem.type);

        if (!targetCell) {
            targetCell = targetList.getEmptyCell();
        } else {
            targetCell.item!.count += shiftedItem.count;
            shiftedItem.cleanUp();
            return;
        }

        if (targetCell) {
            targetCell.setItem(shiftedItem.data, shiftedItem.type, shiftedItem.count);
            shiftedItem.cleanUp();
        }
    };
}

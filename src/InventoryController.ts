import { EVENTS } from "./Events";
import { List } from "./TMComponents/List/List";
import { ListItem } from "./TMComponents/List/ListItem";
import TiledMap from "./TMCore/TiledMap";

export class InventoryController extends PIXI.Container {
    map: TiledMap;
    listArray: List[] = [];

    constructor(map: TiledMap) {
        super();

        this.map = map;
        this.constructInventory();
        this.addEventListeners();
    }

    constructInventory = () => {
        const list = new List(this.map, 8, 2, "rand");
        list.position.set(400, 200);
        this.addChild(list);
        this.listArray.push(list);

        // (window as any).list = list;

        const list2 = new List(this.map, 8, 2, "anoth");
        list2.position.set(400, 500);
        this.addChild(list2);
        this.listArray.push(list2);

        const list3 = new List(this.map, 8, 1, "anotha");
        list3.position.set(400, 700);
        this.addChild(list3);
        this.listArray.push(list3);
    };

    addEventListeners = () => {
        document.addEventListener(EVENTS.Actions.Inventory.Dropped, this.onDrop);
    };

    onDrop = (e: Event) => {
        const droppedItem = (e as CustomEvent<ListItem>).detail;
        let done = false;

        let hoveredList: List | undefined;

        this.listArray.forEach(list => {
            if (list.isHovered) hoveredList = list;
        });

        if (hoveredList) {
            const hoveredCell = hoveredList.getHoveredCell();

            if (hoveredCell && droppedItem.parentCell !== hoveredCell) {
                if (hoveredCell.item) {
                    if (hoveredCell.item.data[hoveredCell.item.type] === droppedItem.data[droppedItem.type]) {
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
                    // MOVE TO EMPTY CELL
                    hoveredCell.setItem(droppedItem.data, droppedItem.type, droppedItem.count);
                    droppedItem.cleanUp();
                    done = true;
                }
            }
        }

        if (!done && droppedItem) {
            droppedItem.x = 0;
            droppedItem.y = 0;
        }
        // this.calculatePrice();
    };
}

import { Plants } from "../../GameConfigs/Plants";
import TiledMap from "../../TMCore/TiledMap";
import { ListCell } from "./ListCell";

export class List extends PIXI.Container {
    private _isActive = false;
    isHovered = false;
    map: TiledMap;
    columns: number;
    rows: number;
    cellSize = 50;
    padding = 2;
    radius = 6;
    cellMatrix: ListCell[][] = [];

    price = 0;

    changeCallback?: () => void;

    constructor(map: TiledMap, columns: number, rows: number, name: string) {
        super();
        this.zIndex = -100;

        this.rows = rows;
        this.columns = columns;
        this.map = map;
        this.name = name;

        this.createList();
        if (name === "rand") {
            this.cellMatrix[0][0].setItem(Plants[0], "drop", 15);
        } else {
            this.cellMatrix[0][0].setItem(Plants[1], "drop", 50);
        }
    }

    createList = () => {
        this.interactive = true;
        this.interactiveChildren = true;
        this.createBG();
        this.createListCells();
        this.addEventListeners();
    };

    createBG = () => {
        const width = this.radius * 2 + (this.cellSize + this.padding) * this.columns;
        const height = this.radius * 2 + (this.cellSize + this.padding) * this.rows;

        const outterBg = new PIXI.Graphics().beginFill(0xc89d7c).drawRoundedRect(0, 0, width, height, this.radius).endFill();

        this.addChild(outterBg);
    };

    createListCells = () => {
        for (let column = 0; column < this.columns; column++) {
            for (let row = 0; row < this.rows; row++) {
                const cell = new ListCell(this.cellSize, this.map, this.name);
                cell.x = this.radius + column * (this.cellSize + this.padding) + this.cellSize / 2;
                cell.y = this.radius + row * (this.cellSize + this.padding) + this.cellSize / 2;

                if (!this.cellMatrix[row]) {
                    this.cellMatrix[row] = [];
                }

                this.cellMatrix[row][column] = cell;

                this.addChild(cell);
            }
        }
    };

    addEventListeners = () => {
        this.addListener("pointerover", this.hoverEvent);
        this.addListener("pointerout", this.unhoverEvent);

        // document.addEventListener("inventoryVisible", () => (this.visible = !this.visible));
        // document.addEventListener("shifted", this.onShifted)
    };

    hoverEvent = () => {
        this.isHovered = true;
    };

    unhoverEvent = () => {
        this.isHovered = false;
    };

    getHoveredCell = (): ListCell | undefined => {
        let res: ListCell | undefined;

        this.cellMatrix.forEach(row => {
            row.forEach(el => {
                if (el.isHovered) res = el;
            });
        });

        return res;
    };

    // onShifted = (e: Event) => {
    //     const cell = (e as CustomEvent<ListCell>).detail;

    //     if (cell.name !== this.name && this.isActive) {
    //         let done = false;
    //         this.cellMatrix.forEach(column => {
    //             column.forEach(row => {
    //                 if (!done)
    //                     if (!row.item && cell.item) {
    //                         row.setItem(cell.item!.data, cell.item!.type);
    //                         row.item!.count = cell.item!.count;

    //                         cell.cleanup();
    //                         done = true;
    //                     }
    //             });
    //         });
    //     }

    //     this.calculatePrice();
    // };

    // calculatePrice = () => {
    //     let sum = 0;
    //     this.cellMatrix.forEach(column => {
    //         column.forEach(row => {
    //             if (row.item) {
    //                 sum += row.item.data[row.item.type].price * row.item.count;
    //             }
    //         });
    //     });

    //     this.price = sum;
    //     LogicState.notify_all();

    //     if (this.changeCallback) {
    //         this.changeCallback();
    //     }
    // };

    // onDrop = (e: Event) => {
    //     const cell = (e as CustomEvent<ListCell>).detail;
    // let done = false;
    // this.cellMatrix.forEach(column => {
    //     column.forEach(row => {
    //         if (!done)
    //             if (row.isHovered) {
    //                 row.setItem(cell.item!.data, cell.item!.type);
    //                 row.item!.count = cell.item!.count;
    //                 cell.cleanup();
    //                 done = true;
    //             }
    //     });
    // });
    // if (!done && cell.item) {
    //     cell.item!.x = 0;
    //     cell.item!.y = 0;
    // }
    // this.calculatePrice();
    // };

    // insertItem = (data: iPlantData): boolean => {
    //     let done = false;
    //     this.cellMatrix.forEach(column => {
    //         column.forEach(row => {
    //             if (!done)
    //                 if (!row.item) {
    //                     row.setItem(data, "drop"); // @TODO
    //                     done = true;
    //                 } else {
    //                     if (row.item!.data.name === data.name) {
    //                         row.item.count += data.drop.count;
    //                         done = true;
    //                     }
    //                 }
    //         });
    //     });

    //     this.calculatePrice();
    //     return done;
    // };

    // cleanup = () => {
    //     this.cellMatrix.forEach(column => {
    //         column.forEach(row => {
    //             if (row.item) {
    //                 row.cleanup();
    //             }
    //         });
    //     });

    //     this.calculatePrice();
    // };

    // public set isActive(value: boolean) {
    //     this._isActive = value;
    //     // this.interactiveChildren = value;
    // }

    // public get isActive(): boolean {
    //     return this._isActive;
    // }

    // getStorageData = () => {
    //     const data: any = [];

    //     this.cellMatrix.forEach((column, i) => {
    //         column.forEach((row, j) => {
    //             if (row.item) {
    //                 data.push({
    //                     column: i,
    //                     row: j,
    //                     item: row.item.data,
    //                     type: row.item.type,
    //                     count: row.item.count,
    //                 });
    //             }
    //         });
    //     });

    //     return data;
    // };

    // restore = (id: number | string) => {
    //     for (const data of LocalStorage.getDataById(id).data) {
    //         this.cellMatrix[data.column][data.row].setItem(data.item, data.type, data.count);
    //     }
    // };

    // addCell = () => {};
}

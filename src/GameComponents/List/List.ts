import { Plants } from "../../GameConfigs/Plants";
import { IGardenItemData, IItemType } from "../../Models";
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

        this.visible = false;

        if (name === "rand") {
            this.cellMatrix[0][0].setItem(Plants[0], "drop", 15);
        } else {
            this.cellMatrix[0][0].setItem(Plants[1], "drop", 10);
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
        const shadow = new PIXI.Graphics().beginFill(0x444444, 0.65).drawRoundedRect(0, 0, width, height, this.radius).endFill();
        shadow.filters = [new PIXI.filters.BlurFilter(5)];

        this.addChild(shadow);
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
    };

    removeEventListeners = () => {
        this.removeListener("pointerover", this.hoverEvent);
        this.removeListener("pointerout", this.unhoverEvent);
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

    getCellByData = (item: IGardenItemData, type: IItemType): ListCell | undefined => {
        let res: ListCell | undefined;

        this.cellMatrix.forEach(column => {
            column.forEach(row => {
                if (row.item && row.item.data === item && row.item.type === type) {
                    res = row;
                    return;
                }
            });
        });

        return res;
    };

    getEmptyCell = (): ListCell | undefined => {
        let res: ListCell | undefined;

        this.cellMatrix.forEach(column => {
            column.forEach(row => {
                if (!res && !row.item) {
                    res = row;
                }
            });
        });

        return res;
    };

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

    public set isActive(value: boolean) {
        this._isActive = value;
    }

    public get isActive(): boolean {
        return this._isActive;
    }

    cleanUp = () => {
        this.removeEventListeners();

        this.cellMatrix.forEach(row => {
            row.forEach(cell => {
                cell.cleanUp();
            });
        });

        this.destroy();
    };
}

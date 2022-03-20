import { LogicState } from "../logic_state";
import TiledMap from "../TMCore/TiledMap";
import { iPlantData } from "../TMCore/TMModel";
import { ListCell } from "./ListCell";

export class List extends PIXI.Container {
    private _isActive = false;
    mapData: TiledMap;
    columns: number;
    rows: number;
    cellSize = 50;
    padding = 2;
    radius = 6;
    cellMatrix: ListCell[][] = [];

    name: string;
    price = 0;

    constructor(
        mapData: TiledMap,
        columns: number,
        rows: number,
        name: string
    ) {
        super();
        this.zIndex = 100;

        this.rows = rows;
        this.columns = columns;
        this.mapData = mapData;
        this.name = name;

        this.interactiveChildren = true;

        const width =
            this.radius * 2 + (this.cellSize + this.padding) * this.columns;
        const height =
            this.radius * 2 + (this.cellSize + this.padding) * this.rows;

        const outterBg = new PIXI.Graphics()
            .beginFill(0xc89d7c)
            .drawRoundedRect(0, 0, width, height, this.radius)
            .endFill();

        this.addChild(outterBg);

        for (let column = 0; column < this.columns; column++) {
            for (let row = 0; row < this.rows; row++) {
                const cell = new ListCell(
                    this.cellSize,
                    this.mapData,
                    this.name
                );
                cell.x =
                    this.radius +
                    column * (this.cellSize + this.padding) +
                    this.cellSize / 2;
                cell.y =
                    this.radius +
                    row * (this.cellSize + this.padding) +
                    this.cellSize / 2;

                if (!this.cellMatrix[row]) {
                    this.cellMatrix[row] = [];
                }

                this.cellMatrix[row][column] = cell;

                this.addChild(cell);
            }
        }

        document.addEventListener("si", () => (this.visible = !this.visible));
        document.addEventListener("dropped", this.onDrop);
        document.addEventListener("shifted", this.onShifted);
    }

    onShifted = (e: Event) => {
        const cell = (e as CustomEvent<ListCell>).detail;

        if (cell.name !== this.name && this.isActive) {
            let done = false;
            this.cellMatrix.forEach((column) => {
                column.forEach((row) => {
                    if (!done)
                        if (!row.item && cell.item) {
                            row.setItem(cell.item!.data, cell.item!.type);
                            row.item!.count = cell.item!.count;

                            cell.cleanup();
                            done = true;
                        }
                });
            });
        }

        this.calculatePrice();
    };

    calculatePrice = () => {
        let sum = 0;
        this.cellMatrix.forEach((column) => {
            column.forEach((row) => {
                if (row.item) {
                    sum += row.item.data[row.item.type].price * row.item.count;
                }
            });
        });

        this.price = sum;
        LogicState.notify_all();

        console.log(sum, this.name);
    };

    onDrop = (e: Event) => {
        const cell = (e as CustomEvent<ListCell>).detail;

        let done = false;
        this.cellMatrix.forEach((column) => {
            column.forEach((row) => {
                if (!done)
                    if (row.isPotential) {
                        row.setItem(cell.item!.data, cell.item!.type);
                        row.item!.count = cell.item!.count;

                        cell.cleanup();
                        done = true;
                    }
            });
        });

        if (!done && cell.item) {
            cell.item!.x = 0;
            cell.item!.y = 0;
        }

        this.calculatePrice();
    };

    insertItem = (data: iPlantData): boolean => {
        let done = false;
        this.cellMatrix.forEach((column) => {
            column.forEach((row) => {
                if (!done)
                    if (!row.item) {
                        row.setItem(data, "drop"); // @TODO
                        done = true;
                    } else {
                        if (row.item!.data.name === data.name) {
                            row.item.count += data.drop.count;
                            done = true;
                        }
                    }
            });
        });

        this.calculatePrice();
        return done;
    };

    cleanup = () => {
        this.cellMatrix.forEach((column) => {
            column.forEach((row) => {
                if (row.item) {
                    row.cleanup();
                }
            });
        });

        this.calculatePrice();
    };

    public set isActive(value: boolean) {
        this._isActive = value;
        // this.interactiveChildren = value;
    }

    public get isActive(): boolean {
        return this._isActive;
    }

    addCell = () => {};
}

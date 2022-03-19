import TiledMap from "../TMCore/TiledMap";
import { iPlantData } from "../TMCore/TMModel";
import { ListCell } from "./ListCell";

export class List extends PIXI.Container {
    mapData: TiledMap;
    columns: number;
    rows: number;
    cellSize = 50;
    padding = 2;
    radius = 6;
    cellMatrix: ListCell[][] = [];

    id: number;

    constructor(mapData: TiledMap, columns: number, rows: number) {
        super();
        this.zIndex = 100;

        this.rows = rows;
        this.columns = columns;
        this.mapData = mapData;

        this.interactiveChildren = true;

        this.id = Number(
            (Math.random() * Math.random())
                .toString()
                .split("")
                .splice(5, 14)
                .join("")
        );

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
                const cell = new ListCell(this.cellSize, this.mapData, this.id);
                cell.x =
                    this.radius +
                    column * (this.cellSize + this.padding) +
                    this.cellSize / 2;
                cell.y =
                    this.radius +
                    row * (this.cellSize + this.padding) +
                    this.cellSize / 2;

                if (!this.cellMatrix[column]) {
                    this.cellMatrix[column] = [];
                }

                this.cellMatrix[column][row] = cell;

                this.addChild(cell);
            }
        }

        document.addEventListener("si", () => (this.visible = !this.visible));
        document.addEventListener("dropped", this.onDrop);
    }

    onDrop = (e: Event) => {
        const cell = (e as CustomEvent<ListCell>).detail;

        let done = false;
        this.cellMatrix.forEach((column) => {
            column.forEach((row) => {
                if (!done)
                    if (row.isPotential) {
                        row.setItem(cell.item!.data, "drop");
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

        let sum = 0;
        this.cellMatrix.forEach((column) => {
            column.forEach((row) => {
                if (row.item) {
                    sum += row.item.data[row.item.type].price * row.item.count;
                }
            });
        });

        // if (sum) {
        console.log(sum, this.id);
        // }
    };

    insertItem = (data: iPlantData): boolean => {
        let done = false;
        this.cellMatrix.forEach((column) => {
            column.forEach((row) => {
                if (!done)
                    if (!row.item) {
                        row.setItem(data, "drop");
                        done = true;
                    } else {
                        if (row.item!.data.name === data.name) {
                            row.item.count += data.drop.count;
                            done = true;
                        }
                    }
            });
        });
        return done;
    };

    addCell = () => {};
}

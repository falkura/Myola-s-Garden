import TiledMap from "../TMCore/TiledMap";
import { ListCell } from "./ListCell";

export class List extends PIXI.Container {
    mapData: TiledMap;
    columns: number;
    rows: number;
    cellSize = 50;
    padding = 2;
    radius = 6;
    cellMatrix!: PIXI.Graphics[][];

    constructor(mapData: TiledMap, columns: number, rows: number) {
        super();
        this.zIndex = 100;

        this.rows = rows;
        this.columns = columns;
        this.mapData = mapData;

        const width =
            this.radius * 2 + (this.cellSize + this.padding) * this.columns;
        const height =
            this.radius * 2 + (this.cellSize + this.padding) * this.rows;

        const outterBg = new PIXI.Graphics()
            .beginFill(0xc89d7c)
            .drawRoundedRect(0, 0, width, height, this.radius)
            .endFill();

        const mask = new PIXI.Graphics()
            .beginFill(0xc89d7c)
            .drawRoundedRect(0, 0, width, height, this.radius)
            .endFill();
        this.mask = mask;

        this.addChild(outterBg, mask);

        for (let column = 0; column < this.columns; column++) {
            for (let row = 0; row < this.rows; row++) {
                const cell = new ListCell(this.cellSize);
                cell.x =
                    this.radius +
                    column * (this.cellSize + this.padding) +
                    this.cellSize / 2;
                cell.y =
                    this.radius +
                    row * (this.cellSize + this.padding) +
                    this.cellSize / 2;

                outterBg.addChild(cell);
            }
        }

        this.visible = false;
        document.addEventListener("si", () => (this.visible = !this.visible));
    }

    addCell = () => {};
}

import { EVENTS } from "../Events";
import { IMapData } from "../Models";
import { core } from "../PIXI/core";
import { createEmptyMatrix, matrixIterator } from "./MatrixUtils";

export class TMCellMap extends PIXI.Container {
    private mapData: IMapData;
    cellArray: TMCell[][] = [];

    constructor(mapData: IMapData) {
        super();

        this.mapData = mapData;
        this.createMap();
    }

    createMap = () => {
        this.cellArray = createEmptyMatrix(this.mapData.width, this.mapData.height);

        for (let x = 0; x < this.mapData.width; x++) {
            for (let y = 0; y < this.mapData.height; y++) {
                const cell = new TMCell(x, y, this.mapData);

                this.cellArray[x][y] = cell;
                this.addChild(cell);
            }
        }
    };

    showByMatrix = (matrix: unknown[][]) => {
        this.hideAll();

        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
                if (matrix[row][col]) this.cellArray[col][row].show();
            }
        }
    };

    private getCells = () => {
        return matrixIterator(this.cellArray);
    };

    hideAll = () => {
        for (const cell of this.getCells()) {
            cell.hide();
        }
    };

    showAll = () => {
        for (const cell of this.getCells()) {
            cell.show();
        }
    };

    cleanUp = () => {
        if (this.cellArray) {
            this.cellArray.forEach(row => {
                row.forEach(cell => {
                    cell.cleanUp();
                });
            });

            this.cellArray.length = 0;
        }

        this.destroy();
    };
}

class TMCell extends core.Sprite {
    private mapData: IMapData;
    private _alphaStatic = 0.2;
    private _alphaHover = 0.5;

    _x: number;
    _y: number;

    constructor(x: number, y: number, mapData: IMapData) {
        super(PIXI.Texture.WHITE);

        this.mapData = mapData;
        this._x = x;
        this._y = y;

        this.createCell();
        this.addEventListeners();
    }

    createCell = () => {
        const tw = this.mapData.tilewidth;
        const th = this.mapData.tileheight;

        this.interactive = true;
        this.width = tw;
        this.height = th;
        this.position.set(tw * this._x, th * this._y);
        this.anchor.set(0.5);
        this.alpha = this._alphaStatic;
        this.hide();
        // cell.zIndex = 10;
    };

    onPointerDown = () => {
        console.log(this._x, this._y);
        document.dispatchEvent(
            new CustomEvent<PIXI.Point>(EVENTS.Actions.Tile.Choosen, {
                detail: new PIXI.Point(this._x, this._y),
            }),
        );
    };

    onPointerOver = () => {
        this.alpha = this._alphaHover;
    };

    onPointerOut = () => {
        this.alpha = this._alphaStatic;
    };

    addEventListeners = () => {
        this.addListener("pointerover", this.onPointerOver);
        this.addListener("pointerout", this.onPointerOut);
        this.addListener("pointerdown", this.onPointerDown);
    };

    removeEventListeners = () => {
        this.removeListener("pointerover", this.onPointerOver);
        this.removeListener("pointerout", this.onPointerOut);
        this.removeListener("pointerdown", this.onPointerDown);
    };

    hide = () => {
        this.visible = false;
    };

    show = () => {
        this.visible = true;
    };

    cleanUp = () => {
        this.removeEventListeners();
        this.destroy();
    };
}

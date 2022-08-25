import { EVENTS } from "../Events";
import { IMapData } from "../Models";

export class TMCellMap extends PIXI.Container {
	private mapData: IMapData;
	cellArray: TMCell[][] = [];

	constructor(mapData: IMapData) {
		super();

		this.mapData = mapData;
		this.createMap();
	}

	createMap = () => {
		this.cellArray = Array(this.mapData.width)
			.fill(null)
			.map(_a => Array(this.mapData.height).fill(null));

		for (let x = 0; x < this.mapData.width; x++) {
			for (let y = 0; y < this.mapData.height; y++) {
				const cell = new TMCell(x, y, this.mapData);

				this.cellArray[x][y] = cell;
				this.addChild(cell);
			}
		}
	};
}

class TMCell extends PIXI.Sprite {
	private mapData: IMapData;

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
		this.alpha = 0.1;
		this.visible = true;
		// cell.zIndex = 10;
	};

	addEventListeners = () => {
		this.addListener("pointerover", () => {
			this.alpha = 0.5;
		});

		this.addListener("pointerout", () => {
			this.alpha = 0.1;
		});

		this.addListener("pointerdown", () => {
			console.log(this._x, this._y);
			document.dispatchEvent(
				new CustomEvent<PIXI.Point>(EVENTS.Actions.Tile.Choosen, {
					detail: new PIXI.Point(this._x, this._y),
				}),
			);
		});
	};
}

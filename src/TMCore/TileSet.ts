import * as PIXI from "pixi.js";
import { ITileset } from "../Models";
import { ResourceController } from "../ResourceLoader";

export default class TileSet {
	textures!: PIXI.Texture[];
	baseTexture: PIXI.BaseTexture;
	source: ITileset;

	constructor(tileSet: ITileset) {
		this.source = tileSet;

		this.baseTexture = ResourceController.getResource(tileSet.name).texture.baseTexture;
		this.setTileTextures();
	}

	setTileTextures = () => {
		this.textures = [];
		for (let y = this.source.margin; y < this.source.imageheight; y += this.source.tileheight + this.source.spacing) {
			for (let x = this.source.margin; x < this.source.imagewidth; x += this.source.tilewidth + this.source.spacing) {
				const tileRectangle = new PIXI.Rectangle(x, y, this.source.tilewidth, this.source.tileheight);

				const texture = new PIXI.Texture(this.baseTexture as unknown as PIXI.BaseTexture, tileRectangle);

				this.textures.push(texture);
			}
		}
	};
}

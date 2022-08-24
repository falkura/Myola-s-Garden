import { ITile, ITileAnimation, ITileConfig, ITileLayerData, ITileset } from "../Models";
import TileSet from "./TileSet";

export default class Tile {
	_x!: number;
	_y!: number;
	sprite!: PIXI.AnimatedSprite;

	layerData: ITileLayerData;
	props?: ITile;

	constructor(tileSet: TileSet, tileConfig: ITileConfig, layerData: ITileLayerData) {
		this.layerData = layerData;

		this.createTile(tileSet, tileConfig);
	}

	createTile = (tileSet: TileSet, tileConfig: ITileConfig) => {
		const tileNumber = this.layerData.data[tileConfig.index];

		this.setTileProps(tileSet.source, tileNumber);
		this.setTileTexture(tileSet, tileNumber);

		this.sprite.x = tileConfig.x * tileSet.source.tilewidth;
		this.sprite.y = tileConfig.y * tileSet.source.tileheight;

		this._x = tileConfig.x;
		this._y = tileConfig.y;

		if (this.sprite.textures.length > 1 && this.props && this.props.animation) {
			// @TODO what ttto dddo?? ?
			this.sprite.animationSpeed = 1000 / 60 / this.props.animation[0].duration;
			this.sprite.gotoAndPlay(0);
		}

		this.sprite.anchor.set(0.5);
	};

	setTileProps = (source: ITileset, tileNumber: number) => {
		if (source.tiles) {
			for (const tileProps of source.tiles) {
				if (tileProps.id + source.firstgid === tileNumber) this.props = tileProps;
			}
		}
	};

	setTileTexture = (tileSet: TileSet, tileNumber: number) => {
		const textures: PIXI.Texture[] = [];

		if (this.props && this.props.animation && this.props.animation.length > 0) {
			this.props.animation.forEach((frame: ITileAnimation) => {
				textures.push(tileSet.textures[frame.tileid]);
			});
		} else {
			textures.push(tileSet.textures[tileNumber - tileSet.source.firstgid]);
		}

		if (textures[0] === undefined) console.error("There is no textures for tile");

		this.sprite = new PIXI.AnimatedSprite(textures);
		// this.sprite.textures = textures; // I dono way i did it
	};
}

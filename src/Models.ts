export type AppState = "pre_preloader" | "preloader" | "idle";

export interface IMapData {
	width: number;
	height: number;
	tilewidth: number;
	tileheight: number;
	tilesets: ITileset[];
	// layers: Array<iTileLayer | iObjectLayer>;
	/** Not implemented! */
	compressionlevel: number;
	/** Not implemented! */
	infinite: boolean;
	/** Not implemented! */
	nextlayerid: number;
	/** Not implemented! */
	nextobjectid: number;
	/** Not implemented! */
	orientation: string;
	/** Not implemented! */
	renderorder: string;
	/** Not implemented! */
	tiledversion: string;
	/** Not implemented! */
	type: string;
	/** Not implemented! */
	version: string;
}

export interface ITileset {
	firstgid: number;
	image: string;
	imageheight: number;
	imagewidth: number;
	margin: number;
	name: string;
	spacing: number;
	tileheight: number;
	tilewidth: number;
	// tiles?: iTiles[];
	// textures: PIXI.Texture[];
	/** Not implemented! */
	columns: number;
	/** Not implemented! */
	tilecount: number;
}

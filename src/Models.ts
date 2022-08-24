export type AppState = "pre_preloader" | "preloader" | "idle";

export interface IMapData {
	width: number;
	height: number;
	tilewidth: number;
	tileheight: number;
	tilesets: ITileset[];
	layers: ILayersData[];
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
	tiles?: ITile[];
	/** Not implemented! */
	columns: number;
	/** Not implemented! */
	tilecount: number;
}

export interface ITileLayerData extends ILayer {
	type: LayerType.TileLayer;
	data: number[];
	width: number;
	height: number;
	// properties?: iProperties[];
	// tiles: Tile[];
}

export interface IObjectLayerData extends ILayer {
	type: LayerType.ObjectGroup;
	objects: IObjectData[];
	// tiles: ObjectTile[];
	/** Not implemented! */
	draworder: string;
}

export interface ILayer {
	id: number;
	name: string;
	type: LayerType;
	x: number;
	y: number;
	/** Not implemented! */
	opacity: number;
	/** Not implemented! */
	visible: boolean;
}

export type ILayersData = ITileLayerData | IObjectLayerData;

export const enum LayerType {
	TileLayer = "tilelayer",
	ObjectGroup = "objectgroup",
}

export interface ITile {
	animation?: ITileAnimation[];
	properties?: ITileProperties[];
	objectgroup?: ITileObjectGroup;
	id: number;
}

export interface ITileAnimation {
	duration: number;
	tileid: number;
}

export interface ITileProperties {
	name: string;
	type: ITilePropTypes;
	value: boolean | string | number;
}

export const enum ITilePropTypes {
	bool = "boolean",
	string = "string",
	float = "number",
	int = "number",
	color = "string",
	// object = "Object", // NOT IMPLEMENTSED
	// file = "Object", // NOT IMPLEMENTSED
}

export interface ITileObjectGroup {
	id: string;
	objects: IDefaultTileProperty[];
	x: string;
	y: string;
	/** Not implemented! */
	draworder: string;
	/** Not implemented! */
	name: string;
	/** Not implemented! */
	opacity: string;
	/** Not implemented! */
	type: string;
	/** Not implemented! */
	visible: boolean;
}

export interface ITileConfig {
	index: number;
	x: number;
	y: number;
}

export interface ITileConstructInfo extends ITileConfig {
	textures: PIXI.Texture[];
	props?: ITile;
}

export interface IObjectData extends IDefaultTileProperty {
	gid: number;
}

export interface IDefaultTileProperty {
	id: string;
	rotation: number;
	width: number;
	height: number;
	x: number;
	y: number;
	/** Not implemented! */
	name: string;
	/** Not implemented! */
	type: string;
	/** Not implemented! */
	visible: boolean;
}
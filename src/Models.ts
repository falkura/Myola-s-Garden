export type AppState = "pre_preloader" | "preloader" | "idle";

export interface IMapData {
    width: number;
    height: number;
    tilewidth: number;
    tileheight: number;
    tilesets: ITileset[];
    layers: ITileLayerData[];
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

export interface ITileLayerData {
    data: number[];
    width: number;
    height: number;
    id: number;
    name: string;
    type: "tilelayer";
    x: number;
    y: number;
    /** Not implemented! */
    opacity: number;
    /** Not implemented! */
    visible: boolean;
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

export const movePath = {
    KeyW: { x: 0, y: -1, dir: Direction.Up },
    KeyS: { x: 0, y: 1, dir: Direction.Down },
    KeyA: { x: -1, y: 0, dir: Direction.Left },
    KeyD: { x: 1, y: 0, dir: Direction.Right },
    ArrowUp: { x: 0, y: -1, dir: Direction.Up },
    ArrowDown: { x: 0, y: 1, dir: Direction.Down },
    ArrowLeft: { x: -1, y: 0, dir: Direction.Left },
    ArrowRight: { x: 1, y: 0, dir: Direction.Right },
};

export interface IMovePath {
    x: number;
    y: number;
    dir: Direction;
}

export const enum Direction {
    Up = "up",
    Down = "down",
    Left = "left",
    Right = "right",
}

export interface IGardenItemData {
    plant: IPlantData;
    seed: ISeedData;
    drop: IDropData;
    rarity: Rarity;
    name: string;
    description: string;
}

export interface IItemDefaultData {
    tileset: string;
    id: number;
}

export interface IPlantData extends IItemDefaultData {
    growTime: number;
    animation: number[];
}

export interface ISeedData extends IItemDefaultData {
    price: number;
    count: number;
}

export type IItemType = "plant" | "drop" | "seed";

export type IDropData = ISeedData;

export const enum Rarity {
    Common = 0x8e8e8e,
    Uncommon = 0x76ba1b,
    Rare = 0x187bcd,
    Epic = 0xcc8899,
    Legendary = 0xffa500,
    Mythic = 0xcc1100,
}

/** !!! UNIQUE FOR ALL MAPS !!! */
export const enum LayersArr {
    Water = 0,
    Ground = 1,
    Hills = 2,
    /** NOT IMPLEMENTED */
    Garden = 3,
    Buildings = 4,
}

import { CollisionLayer } from "./TMCore/CollisionLayer";
import ObjectLayer from "./TMCore/ObjectLayer";
import ObjectTile from "./TMCore/ObjectTile";
import Tile from "./TMCore/Tile";
import TileLayer from "./TMCore/TileLayer";
import TileSet from "./TMCore/TileSet";
import { Rarity } from "./WAILA";

export interface iTileLayer extends iLayer {
    data: number[];
    height: number;
    width: number;
    properties?: iProperties[];
    tiles: Tile[];
}

export interface iObjectLayer extends iLayer {
    draworder: string; // NOT IMPLEMENTSED
    objects: iDataObject[];
    tiles: ObjectTile[];
}

export interface iLayer {
    id: number;
    name: string;
    type: LayerType;
    opacity: number; // NOT IMPLEMENTSED
    visible: boolean; // NOT IMPLEMENTSED
    x: number;
    y: number;
}

export const enum LayerType {
    TileLayer = "tilelayer",
    ObjectGroup = "objectgroup",
}

export interface iDataObject {
    gid: number;
    height: number;
    id: number;
    name: string; // NOT IMPLEMENTSED
    rotation: number;
    type: string; // NOT IMPLEMENTSED
    visible: true; // NOT IMPLEMENTSED
    width: number;
    x: number;
    y: number;
}

export interface iTiledMap {
    layers: Array<TileLayer | ObjectLayer>;
    tilesets: TileSet[];
    collisionLayer?: CollisionLayer;
    source: iMapData;
}

export interface iMapData {
    compressionlevel: number; // NOT IMPLEMENTSED
    height: number;
    infinite: boolean; // NOT IMPLEMENTSED
    layers: Array<iTileLayer | iObjectLayer>;
    nextlayerid: number; // NOT IMPLEMENTSED
    nextobjectid: number; // NOT IMPLEMENTSED
    orientation: string; // NOT IMPLEMENTSED
    renderorder: string; // NOT IMPLEMENTSED
    tiledversion: string; // NOT IMPLEMENTSED
    tileheight: number;
    tilesets: iTileset[];
    tilewidth: number;
    type: string; // NOT IMPLEMENTSED
    version: string; // NOT IMPLEMENTSED
    width: number;
}

export interface iCollisionLayer {
    tilesMap: iTiles[];
    width: number;
    height: number;
    tileWidth: number;
    tileHeight: number;
    collisionsMap: boolean[];
}

export interface iTileset {
    columns: number; // NOT IMPLEMENTSED
    firstgid: number;
    image: string;
    imageheight: number;
    imagewidth: number;
    margin: number;
    name: string;
    spacing: number;
    tilecount: number; // NOT IMPLEMENTSED
    tileheight: number;
    tilewidth: number;
    tiles?: iTiles[];

    textures: PIXI.Texture[];
}

export interface iTiles {
    animation?: iAnimation[];
    properties?: iProperties[];
    objectgroup?: iObjectGroup;
    id: number;
}

export interface iPlantData {
    plant: iPlantInfo;
    seed: iItemData;
    drop: iItemData;
    name: string;
    description: string;
    rarity: Rarity;
}
export interface iItemData {
    tileset: string;
    id: number;
    price: number;
    count: number;
}
export interface iPlantInfo {
    tileset: string;
    id: number;
    growTime: number;
    animation: number[];
}

export interface iObjectGroup {
    draworder: string; // NOT IMPLEMENTSED
    id: string;
    name: string; // NOT IMPLEMENTSED
    objects: iTileObject[];
    opacity: string; // NOT IMPLEMENTSED
    type: string; // NOT IMPLEMENTSED
    visible: boolean; // NOT IMPLEMENTSED
    x: string;
    y: string;
}

export interface iTileObject {
    height: number;
    id: string;
    name: string; // NOT IMPLEMENTSED
    rotation: number;
    type: string; // NOT IMPLEMENTSED
    visible: boolean; // NOT IMPLEMENTSED
    width: number;
    x: number;
    y: number;
}

export interface iProperties {
    name: string;
    type: iPropTypes;
    value: boolean | string | number;
}

export const enum iPropTypes {
    bool = "boolean",
    string = "string",
    // float = "number", // NOT IMPLEMENTSED
    int = "number",
    // object = "Object", // NOT IMPLEMENTSED
    // color = "any", // NOT IMPLEMENTSED
    // file = "any", // NOT IMPLEMENTSED
}

export interface iAnimation {
    duration: number;
    tileid: number;
}

export interface iTileData {
    i: number;
    x: number;
    y: number;
}

export interface iRightClick {
    name: string;
    event: string;
}

export interface iMovePath {
    x: number;
    y: number;
    animNum: number;
}

export type AppState = "pre_pre_loader" | "pre_loader" | "continue" | "game";
export type GameState = "base" | "bonus";

export const movePath = {
    KeyW: { x: 0, y: -1, animNum: 1 },
    KeyS: { x: 0, y: 1, animNum: 0 },
    KeyA: { x: -1, y: 0, animNum: 2 },
    KeyD: { x: 1, y: 0, animNum: 3 },
    ArrowUp: { x: 0, y: -1, animNum: 1 },
    ArrowDown: { x: 0, y: 1, animNum: 0 },
    ArrowLeft: { x: -1, y: 0, animNum: 2 },
    ArrowRight: { x: 1, y: 0, animNum: 3 },
};

import * as PIXI from "pixi.js";
import { EVENTS } from "../Events";
import { Plant } from "../GameObjects/Plant";
import TiledMap from "./TiledMap";
import { iTiles } from "../Model";

export default class Tile extends PIXI.AnimatedSprite {
    _x!: number;
    _y!: number;
    props: iTiles;
    mapData: TiledMap;
    debugGraphics!: PIXI.Sprite;
    layerId: number;

    Plant?: Plant;
    Dirt?: PIXI.Sprite;

    collisionLayer: PIXI.Graphics[] = [];

    constructor(
        textures: PIXI.Texture[],
        props: iTiles,
        mapData: TiledMap,
        layerId: number
    ) {
        super(textures);

        this.mapData = mapData;
        this.textures = textures;
        this.layerId = layerId;
        this.props = props;
        this.anchor.set(0.5);

        this.createMask();
    }

    getProperty = (name: string): boolean | string | number | undefined => {
        if (!this.props?.properties) return undefined;
        for (const prop of this.props.properties) {
            if (prop.name === name) return prop.value;
        }
        return undefined;
    };

    setDirt = (texture: PIXI.Texture) => {
        const sprite = new PIXI.Sprite(texture);
        sprite.zIndex = 1;
        sprite.anchor = this.anchor;

        this.Dirt = sprite;

        this.addChild(this.Dirt);
        this.save();
    };

    removeDirt = () => {
        this.removeChild(this.Dirt!);
        this.Dirt = undefined;
    };

    setPlant = (id: number) => {
        const sprite = new Plant(id, this.mapData, this);
        sprite.zIndex = 2;
        sprite.anchor = this.anchor;

        this.Plant = sprite;
        this.Dirt!.visible = false;

        this.addChild(sprite);
        console.log(sprite);
        this.save();
    };

    save = () => {
        // LocalStorage.data = {
        //     id: char.id,
        //     detail: char.getStorageData(),
        // };
    };

    createMask = () => {
        this.debugGraphics = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.debugGraphics.interactive = true;
        this.debugGraphics.width = this.width;
        this.debugGraphics.height = this.height;
        this.debugGraphics.anchor.set(0.5);
        this.debugGraphics.alpha = 0.1;
        this.debugGraphics.visible = false;
        this.debugGraphics.zIndex = 10;

        this.debugGraphics.addListener("pointerover", () => {
            this.debugGraphics.alpha = 0.5;
        });
        this.debugGraphics.addListener("pointerout", () => {
            this.debugGraphics.alpha = 0.1;
        });
        this.debugGraphics.addListener("pointerdown", () => {
            document.dispatchEvent(
                new CustomEvent<Tile>(EVENTS.Action.Tile.Choose, {
                    detail: this,
                })
            );
        });

        this.addChild(this.debugGraphics);
    };
}

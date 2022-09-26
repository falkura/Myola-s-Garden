import { EVENTS } from "../../Events";
import { IObjectData, ITile, ObjectProps, TileCompTypes } from "../../Models";
import { getObjectTileTexture } from "../../TMAdditions/TMUtils";
import TiledMap from "../../TMCore/TiledMap";
import TileSet from "../../TMCore/TileSet";
import { PopupData } from "../../TMObjectPopupController";
import { Clickable } from "../Clickable";

export class BaseTMObject {
    map: TiledMap;
    sprite!: Clickable;
    source: IObjectData;
    type!: TileCompTypes;
    props: ObjectProps = {};
    tileset: TileSet;

    constructor(texture: PIXI.Texture, tileset: TileSet, objectData: IObjectData, map: TiledMap) {
        this.source = objectData;
        this.map = map;
        this.tileset = tileset;
        this.setProps();

        this.setSprite(texture);
    }

    private setProps = () => {
        this.source.properties?.forEach(prop => {
            Object.assign(this.props, { [prop.name]: prop.value });
        });
    };

    private setSprite = (texture: PIXI.Texture) => {
        this.sprite = new Clickable(texture);
        this.sprite.anchor.set(0.5);

        if (this.source.translate) {
            this.sprite.scale = this.sprite.defaultScale = this.source.translate;
        }

        this.sprite.visible = this.source.visible;
        this.sprite.rotation = this.source.rotation * (Math.PI / 180);
    };

    protected showPopup = (title?: string, buttons?: { [key: string]: () => void }) => {
        const event = new CustomEvent<PopupData>(EVENTS.Actions.TMObject.Press, {
            detail: {
                target: this,
                title: title,
                buttons: buttons,
            },
        });

        document.dispatchEvent(event);
    };

    public destroy = () => {
        this.sprite.destroy();
    };
}

export class StaticTMObject extends BaseTMObject {
    constructor(tileset: TileSet, objectData: IObjectData, map: TiledMap) {
        super(getObjectTileTexture(tileset, objectData), tileset, objectData, map);
    }
}

export class AnimatedTMObject extends BaseTMObject {
    constructor(tileset: TileSet, objectData: IObjectData, map: TiledMap) {
        super(getObjectTileTexture(tileset, objectData), tileset, objectData, map);

        if (!tileset.source.tiles || tileset.source.tiles.length === 0) {
            console.error("Incorrect tileset!\n", tileset);
            return;
        }

        let animData;

        tileset.source.tiles.forEach(tile => {
            if (tile.id === objectData.gid - tileset.source.firstgid) animData = tile;
        });

        if (!animData) {
            console.error("Incorrect animation in tile!\n", objectData);
            return;
        }

        this.setAnimation(animData);
    }

    setAnimation = (animData: ITile) => {
        const textures = [];

        if (!animData.animation || animData.animation.length === 0) {
            console.error("There is no animation in tile!\n", this.source);
            return;
        }

        for (let i = 0; i < animData.animation.length; i++) {
            textures.push(this.tileset.textures[animData.animation[i].tileid]);
        }

        this.sprite.textures = textures;
        this.sprite.animationSpeed = 1000 / 60 / animData.animation[0].duration;
        this.sprite.loop = true;

        this.sprite.gotoAndPlay(0);
    };
}

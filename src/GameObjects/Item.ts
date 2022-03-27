import { Clickable } from "./Clickable";
import { EVENTS } from "../Events";
import TiledMap from "../TMCore/TiledMap";
import { iPlantData } from "../Model";
import { WAILAData } from "../WAILA";

export type ItemState = "inventory" | "drop";
export type ItemType = "drop" | "seed";

export class Item extends PIXI.Container {
    private _state!: ItemState;
    private _type!: ItemType;

    sprite!: Clickable;
    mapData: TiledMap;
    data: iPlantData;

    additionalData?: string;

    constructor(
        data: iPlantData,
        mapData: TiledMap,
        state: ItemState,
        type: ItemType,
        waila: boolean
    ) {
        super();
        this.mapData = mapData;
        this.data = data;
        this.type = type;
        this.state = state;

        if (waila) {
            this.sprite.addHover(this.wailaHover);
            this.sprite.addUnhover(this.wailaUnhover);
        }
    }

    public set type(t: ItemType) {
        const data = this.data[t];
        const tileset = this.mapData.getTileset(data.tileset);
        const texture = tileset!.textures[data.id];

        if (this.sprite) {
            this.sprite.texture = texture;
        } else {
            this.sprite = new Clickable(texture);
            this.addChild(this.sprite);
        }
        this._type = t;
    }

    public get type(): ItemType {
        return this._type;
    }

    public set state(s: ItemState) {
        this._state = s;
    }

    public get state(): ItemState {
        return this._state;
    }

    getPrice = (): number => {
        return this.data[this.type].price;
    };

    getItemCode = (): string => {
        // return `${this.data[this.type].tileset}${this.data[this.type].id}`;
        return this.data.name;
    };

    wailaHover = () => {
        document.dispatchEvent(
            new CustomEvent<WAILAData>(EVENTS.WAILA.Set, {
                detail: {
                    title: this.data.name,
                    description: this.data.description,
                    additionalData: this.additionalData,
                    rarity: this.data.rarity,
                },
            })
        );
    };

    wailaUnhover = () => {
        document.dispatchEvent(new Event(EVENTS.WAILA.Clean));
    };

    inventoryHover = () => {
        console.log("inv hover");
    };

    inventoryUnhover = () => {
        console.log("inv unhover");
    };

    cleanup = () => {
        this.sprite.cleanUp();
    };
}

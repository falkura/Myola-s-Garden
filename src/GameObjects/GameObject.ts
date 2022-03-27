import { LocalStorage } from "../LocalStorage";
import TiledMap from "../TMCore/TiledMap";

export class GameObject extends PIXI.Sprite {
    private __x?: number;
    private __y?: number;

    name: string;
    id!: string;

    mapData: TiledMap;
    isCharacter: boolean;
    collisionLayer: PIXI.Graphics[] = [];

    constructor(mapData: TiledMap, name: string, isCharacter = false) {
        super();

        this.mapData = mapData;
        this.name = name;

        this.id = LocalStorage.getId();
        this.isCharacter = isCharacter;
        this.anchor.set(0.5);
        this.setHitArea();
    }

    setHitArea = () => {
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xff0000, 0.0001);

        graphics.drawRect(
            0,
            0,
            this.mapData.source.tilewidth,
            this.mapData.source.tileheight
        );
        graphics.endFill();

        graphics.x = -this.anchor.x * this.mapData.source.tilewidth;
        graphics.y = -this.anchor.y * this.mapData.source.tileheight;

        graphics.zIndex = 1000;
        this.collisionLayer.push(graphics);

        this.addChild(this.collisionLayer[0]);

        if (!this.isCharacter) {
            this.mapData.collisionLayer!.collisionsMap.push(this);
        }
    };

    public get _x(): number {
        return this.__x ? this.__x : this.x / this.mapData.source.tilewidth;
    }

    public set _x(v: number) {
        this.__x = v;
    }

    public get _y(): number {
        return this.__y ? this.__y : this.y / this.mapData.source.tileheight;
    }

    public set _y(v: number) {
        this.__y = v;
    }
}

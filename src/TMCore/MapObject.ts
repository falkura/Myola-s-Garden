import TiledMap from "./TiledMap";

export class MapObject extends PIXI.Sprite {
    mapData: TiledMap;
    isCharacter: boolean;
    collisionLayer: PIXI.Graphics[] = [];

    constructor(mapData: TiledMap, isCharacter = false) {
        super();
        this.mapData = mapData;
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
}

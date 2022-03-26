import anime from "animejs";
import { List } from "../UI/List";
import TiledMap from "./TiledMap";

export class Chest extends PIXI.Sprite {
    mapData: TiledMap;
    collisionLayer!: PIXI.Graphics;
    animations!: PIXI.AnimatedSprite;
    animSpeed = 5000;
    animKeys = 5;
    _isOpen = false;

    _x!: number;
    _y!: number;

    list!: List;

    constructor(mapData: TiledMap) {
        super();
        this.mapData = mapData;

        this.init();
        this.anchor.set(0.5);

        // this.interactive = true;
        // this.cursor = "pointer";
        // this.addListener("click", this.onClick);

        this.setHitArea();

        this.list = new List(this.mapData, 4, 3, "chest");
        this.list.alpha = 0;
        this.list.scale.set(0.5);

        this.list.pivot.set(
            this.list.width,
            this.list.height * 2 + (this.animations.height / 2) * 1.2
        );
        // this.list.x = -this.list.width / 2;
        // this.list.y = -this.list.height - this.animations.height / 2;

        this.addChild(this.list);
    }

    init = () => {
        const tileset = this.mapData.getTileset("Chest")!;
        const textures = [];

        for (let i = 0; i < this.animKeys; i++) {
            textures.push(tileset.textures[i]);
        }

        this.animations = new PIXI.AnimatedSprite(textures);
        this.animations.animationSpeed = 1000 / this.animSpeed;
        this.animations.loop = false;
        this.animations.onComplete = () => {
            if (!this.isOpen) {
                this.animations.textures.reverse();
                this.animations.gotoAndStop(0);
            }
        };

        this.animations.anchor.set(0.5, 0.5);
        this.addChild(this.animations);
    };

    onClick = () => {
        this.isOpen = !this.isOpen;
        console.log("chest");
    };

    public set isOpen(value: boolean) {
        this._isOpen = value;

        if (value) {
            this.open();
        } else {
            this.close();
        }
    }

    public get isOpen() {
        return this._isOpen;
    }

    open = () => {
        this.list.isActive = true;
        this.animations.play();

        anime({
            targets: this.list,
            alpha: 1,
            duration: 1000,
        });

        anime({
            targets: this.list.scale,
            x: [0, 0.5],
            y: [0, 0.5],
            // easing: "linear",
            duration: 600,
        });
    };

    close = () => {
        this.list.isActive = false;

        this.animations.textures.reverse();
        this.animations.gotoAndStop(0);
        this.animations.play();

        anime({
            targets: this.list,
            alpha: 0,
            duration: 1000,
        });

        anime({
            targets: this.list.scale,
            x: [0.5, 0],
            y: [0.5, 0],
            // easing: "linear",
            duration: 600,
        });
    };

    setHitArea = () => {
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xff0000, 0.00001);

        graphics.drawRect(
            -this.anchor.x * this.mapData.source.tilewidth,
            -this.anchor.y * this.mapData.source.tileheight,
            this.mapData.source.tilewidth,
            this.mapData.source.tileheight
        );
        graphics.endFill();

        graphics.zIndex = 1000;
        this.collisionLayer = graphics;

        this.collisionLayer.interactive = true;
        this.collisionLayer.cursor = "pointer";
        this.collisionLayer.addListener("click", this.onClick);

        this.addChild(this.collisionLayer);

        this.mapData.collisionLayer!.collisionsMap.push(graphics);
    };
}

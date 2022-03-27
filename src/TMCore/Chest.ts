import anime from "animejs";
import { List } from "../UI/List";
import { MapObject } from "./MapObject";
import TiledMap from "./TiledMap";

export class Chest extends MapObject {
    // mapData: TiledMap;
    // collisionLayer!: PIXI.Graphics;
    animation!: PIXI.AnimatedSprite;
    animSpeed = 5000;
    animKeys = 5;
    _isOpen = false;

    _x!: number;
    _y!: number;

    list!: List;

    constructor(mapData: TiledMap) {
        super(mapData);

        this.collisionLayer[0].interactive = true;
        this.collisionLayer[0].cursor = "pointer";
        this.collisionLayer[0].addListener("mousedown", this.onClick);

        this.addAnimations();
        this.addList();
    }

    addList = () => {
        this.list = new List(this.mapData, 4, 3, "chest");
        this.list.alpha = 0;
        this.list.scale.set(0.5);

        this.list.pivot.set(
            this.list.width,
            this.list.height * 2 + (this.animation.height / 2) * 1.2
        );

        this.addChild(this.list);
    };

    addAnimations = () => {
        const tileset = this.mapData.getTileset("Chest")!;
        const textures = [];

        for (let i = 0; i < this.animKeys; i++) {
            textures.push(tileset.textures[i]);
        }

        this.animation = new PIXI.AnimatedSprite(textures);
        this.animation.animationSpeed = 1000 / this.animSpeed;
        this.animation.loop = false;
        this.animation.onComplete = () => {
            if (!this.isOpen) {
                this.animation.textures.reverse();
                this.animation.gotoAndStop(0);
            }
        };

        this.animation.anchor.set(0.5, 0.5);
        this.addChild(this.animation);
    };

    onClick = () => {
        this.isOpen = !this.isOpen;
        console.log("chest");
    };

    public set isOpen(value: boolean) {
        if (this.animation.playing) {
            return;
        }
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
        this.animation.play();

        anime({
            targets: this.list,
            alpha: [0, 1],
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

        this.animation.textures.reverse();
        this.animation.gotoAndStop(0);
        this.animation.play();

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
}

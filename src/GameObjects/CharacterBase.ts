import { GameObject } from "./GameObject";
import { Skins } from "../Config/Skins";
import TiledMap from "../TMCore/TiledMap";

export enum AnimationTypes {
    Idle = 0,
    Move = 1,
    Run = 2,
    Hoe = 3,
    Axe = 4,
    Bailer = 5,
}

export enum AnimationDirectoins {
    Down = 0,
    Up = 1,
    Left = 2,
    Right = 3,
}

export class CharacterBase extends GameObject {
    private _direction: AnimationDirectoins = AnimationDirectoins.Down;

    animations: PIXI.AnimatedSprite[][] = [];
    animSpeed = 5000;
    animKeys = 8;
    type: AnimationTypes = AnimationTypes.Idle;

    activeLayer = 2;
    filter!: PIXI.filters.ColorMatrixFilter;
    color = 0;

    inAction = false;

    onClick?: () => void;

    constructor(mapData: TiledMap, name: string) {
        super(mapData, name);

        this.addAnimations();
        this.direction = 0;
        this.addFilter();

        this.collisionLayer[0].interactive = true;
        this.collisionLayer[0].cursor = "pointer";
        this.collisionLayer[0].addListener("click", this.onCharClick);
    }

    addAnimations = () => {
        const tileset = this.mapData.getTileset("char")!;

        for (
            let animType = 0;
            animType < Object.keys(AnimationTypes).length / 2;
            animType++
        ) {
            for (
                let animDir = 0;
                animDir < Object.keys(AnimationDirectoins).length / 2;
                animDir++
            ) {
                const textures = [];

                // @TODO kostyl because of broken resources
                let buf = animDir;
                if (
                    animType === AnimationTypes.Move ||
                    animType === AnimationTypes.Run
                ) {
                    if (animDir === AnimationDirectoins.Right) {
                        buf = 2;
                    }
                    if (animDir === AnimationDirectoins.Left) {
                        buf = 3;
                    }
                }

                for (let i = 0; i < this.animKeys; i++) {
                    textures.push(
                        tileset.textures[animType * 32 + buf * 8 + i]
                    );
                }

                const sprite = new PIXI.AnimatedSprite(textures);
                sprite.anchor.set(0.5, 0.5);
                sprite.animationSpeed = 1000 / this.animSpeed;

                if (!this.animations[animType]) {
                    this.animations[animType] = [];
                }

                this.animations[animType].push(sprite);
            }
        }
    };

    addFilter = () => {
        this.filter = new PIXI.filters.ColorMatrixFilter();
        this.filters = [this.filter];
    };

    public set direction(dir: AnimationDirectoins) {
        const activeAnim = this.animations[this.type][this._direction];

        this.removeChild(activeAnim);

        const newAnim = this.animations[this.type][dir];
        this._direction = dir;

        if (!newAnim.playing) {
            newAnim.gotoAndPlay(0);
        }
        this.addChild(newAnim);
    }

    public get direction() {
        return this._direction;
    }

    setType = (type: AnimationTypes) => {
        if (type > 2) {
            this.inAction = true;
        } else {
            this.inAction = false;
        }

        const activeAnim = this.animations[this.type][this.direction];

        this.removeChild(activeAnim);

        const newAnim = this.animations[type][this.direction];
        this.type = type;
        if (!newAnim.playing) {
            newAnim.gotoAndPlay(0);
        }
        this.addChild(newAnim);
    };

    onCharClick = () => {
        if (this.onClick) {
            this.onClick();
        }
    };

    setNewColor = (color?: number) => {
        this.filter.matrix = [...Skins.normalMatrix];
        if (!color) {
            this.color++;

            if (this.color >= Skins.characterSkin.length) {
                this.color = 0;
                return;
            }
        } else {
            this.color = color;
        }

        for (const skinProp of Skins.characterSkin[this.color]) {
            this.filter.matrix[skinProp.index] = skinProp.color;
        }
    };
}

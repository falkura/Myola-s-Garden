import anime from "animejs";
import { hitTestRectangle } from "../Util";
import { GameObject } from "./GameObject";
import { Skins } from "../Config/Skins";
import Tile from "../TMCore/Tile";
import TiledMap from "../TMCore/TiledMap";
import { Common } from "../Config/Common";

export enum AnimationTypes {
    Idle = 0,
    Move = 1,
    Run = 2,
    Bailer = 3,
    Axe = 4,
    Hoe = 5,
}

export enum AnimationDirectoins {
    Down = 0,
    Up = 1,
    Left = 2,
    Right = 3,
}

export class Character extends GameObject {
    animations: PIXI.AnimatedSprite[][] = [];
    animSpeed = 5000;
    animKeys = 8;
    direction: AnimationDirectoins = AnimationDirectoins.Down;
    type: AnimationTypes = AnimationTypes.Idle;

    activeLayer = 2;
    filter!: PIXI.filters.ColorMatrixFilter;
    color = 0;

    isRunning = false;
    toRun = 0;

    constructor(mapData: TiledMap) {
        super(mapData, true);
        this.mapData.charakter = this;

        this.addAnimations();
        this.setDirection(0);
        this.addFilter();

        this.collisionLayer[0].interactive = true;
        this.collisionLayer[0].cursor = "pointer";
        this.collisionLayer[0].addListener("click", this.onCharClick);

        document.addEventListener("newcolor", this.setNewColor);
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

    setDirection = (dir: AnimationDirectoins) => {
        const activeAnim = this.animations[this.type][this.direction];

        this.removeChild(activeAnim);

        const newAnim = this.animations[this.type][dir];
        this.direction = dir;

        if (!newAnim.playing) {
            newAnim.gotoAndPlay(0);
        }
        this.addChild(newAnim);
    };

    setType = (type: AnimationTypes) => {
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
        this.cameraMove();
    };

    setNewColor = () => {
        this.filter.matrix = [...Skins.normalMatrix];
        this.color++;

        if (this.color >= Skins.characterSkin.length) {
            this.color = 0;
            return;
        }

        for (const skinProp of Skins.characterSkin[this.color]) {
            this.filter.matrix[skinProp.index] = skinProp.color;
        }
    };

    move = (movePath: { x: number; y: number }) => {
        let hit = false;

        for (const tile of this.mapData.collisionLayer!.collisionsMap) {
            for (const collisionArea of tile.collisionLayer) {
                if (!hit) {
                    hit = hitTestRectangle(
                        {
                            x: this.x + movePath.x,
                            y: this.y + movePath.y,
                            width: this.collisionLayer[0].width,
                            height: this.collisionLayer[0].height,
                            anchor: this.anchor,
                        },
                        {
                            x: tile.x + collisionArea.x,
                            y: tile.y + collisionArea.y,
                            width: collisionArea.width,
                            height: collisionArea.height,
                        }
                    );
                }

                if (hit) break;
            }
        }

        if (!hit) {
            const floor = this.getTiles(movePath.x, movePath.y);

            for (const element of floor) {
                if (!element.tile) return;
                const isStepIn = element.tile.getProperty("isStepIn");
                const isStepOut = element.tile.getProperty("isStepOut");

                if (element.id > this.activeLayer && !isStepIn && !isStepOut)
                    return;

                if (isStepIn) {
                    this.activeLayer = 2;
                }

                if (isStepOut) {
                    this.activeLayer = element.id;
                }
            }

            if (this.isRunning) {
                this.x += movePath.x;
                this.y += movePath.y;
            } else {
                this.x += movePath.x / 1.5;
                this.y += movePath.y / 1.5;
            }

            this._x = this.x / this.mapData.source.tilewidth;
            this._y = this.y / this.mapData.source.tileheight;
        }

        this.cameraMove();
    };

    setPosition = (x: number, y: number): Promise<void> => {
        return new Promise<void>((resolve) => {
            const tw = this.mapData.source.tilewidth;
            const th = this.mapData.source.tileheight;

            let corX = this.x - x > 0 ? -tw : tw;
            let corY = this.y - y > 0 ? -th : th;

            if (Math.abs(this.x - x) > Math.abs(this.y - y)) {
                corY = 0;
            } else {
                corX = 0;
            }

            const timeCor =
                corX === 0
                    ? Math.abs(this.y - y) / th
                    : Math.abs(this.x - x) / tw;

            anime({
                duration: 80 * timeCor,
                targets: this,
                x: x - corX,
                y: y - corY,
                easing: "easeOutQuad",
                // update: (anim) => { // @TODO
                //     this.cameraMove();
                // },
                complete: () => {
                    this._x = this.x / tw;
                    this._y = this.y / th;

                    resolve();
                },
            });
        });
    };

    cameraMove = () => {
        const border = 400 / Common.map_scale;

        const minX = Common.game_width - this.mapData.width;
        const minY = Common.game_height - this.mapData.height;

        const corX = (this.mapData.source.tilewidth / 2) * Common.map_scale;
        const corY = (this.mapData.source.tileheight / 2) * Common.map_scale;

        let nextX = Common.game_width / 2 - this.getBounds().x + this.mapData.x;

        let nextY =
            Common.game_height / 2 - this.getBounds().y + this.mapData.y;

        nextX = +nextX.toFixed(0);
        nextY = +nextY.toFixed(0);

        let stepX = this.mapData.x;
        let stepY = this.mapData.y;

        if (stepX - nextX > border && nextX >= minX - corX - border) {
            stepX = nextX + border;
        } else if (stepX + border < nextX && nextX - border <= corX) {
            stepX = nextX - border;
        }

        if (stepY - nextY > border && nextY >= minY - corY - border) {
            stepY = nextY + border;
        } else if (stepY + border < nextY && nextY - border <= corY) {
            stepY = nextY - border;
        }

        this.mapData.x = stepX;
        this.mapData.y = stepY;
    };

    getTiles = (x: number, y: number) => {
        const tiles: Array<{ tile?: Tile; id: number; x: number; y: number }> =
            [];
        const cor = 0.1;

        let notX = 0;
        let notX_ = 0;
        let notY = 0;
        let notY_ = 0;

        const tileX =
            (this.x + x + this.collisionLayer[0].width * this.anchor.x) /
            this.mapData.source.tilewidth;
        const tileY =
            (this.y + y + this.collisionLayer[0].height * this.anchor.y) /
            this.mapData.source.tileheight;

        if ((tileX % 1) - 0.5 >= 0 && (tileX % 1) - 0.5 <= cor) {
            notX = 1;
        } else if ((tileX % 1) - 0.5 < 0 && (tileX % 1) - 0.5 >= -cor) {
            notX_ = 1;
        }

        if ((tileY % 1) - 0.5 >= 0 && (tileY % 1) - 0.5 <= cor) {
            notY = 1;
        } else if ((tileY % 1) - 0.5 < 0 && (tileY % 1) - 0.5 >= -cor) {
            notY_ = 1;
        }
        for (const layer of this.mapData.getWalkableLayers()) {
            for (let j = 0 + notY; j < 2 - notY_; j++) {
                for (let k = 0 + notX; k < 2 - notX_; k++) {
                    const tile =
                        layer.tiles[
                            Math.round(tileX) -
                                k +
                                (Math.round(tileY) - j) *
                                    this.mapData.source.width
                        ];
                    if (tile) {
                        tiles.push({
                            tile: tile,
                            id: layer.source.id,
                            x: Math.round(tileX),
                            y: Math.round(tileY),
                        });
                    } else {
                        if (layer.source.id === this.activeLayer) {
                            tiles.push({
                                tile: undefined,
                                id: layer.source.id,
                                x: Math.round(tileX),
                                y: Math.round(tileY),
                            });
                        }
                    }
                }
            }
        }

        return tiles.reverse();
    };
}

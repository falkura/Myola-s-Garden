import anime from "animejs";
import { Config } from "../Config";
import { hitTestRectangle } from "../Util";
import TiledMap from "./TiledMap";

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

export class CharacterBase extends PIXI.Sprite {
    mapData: TiledMap;
    animations: PIXI.AnimatedSprite[][] = [];
    animSpeed = 5000;
    animKeys = 8;
    direction: AnimationDirectoins = AnimationDirectoins.Down;
    type: AnimationTypes = AnimationTypes.Idle;

    isActive = false;
    collisionLayer!: PIXI.Graphics;
    activeLayer = 2;
    filter: PIXI.filters.ColorMatrixFilter;
    color = 0;
    _x!: number;
    _y!: number;

    isRunning = false;
    toRun = 0;

    constructor(mapData: TiledMap) {
        super();
        this.mapData = mapData;

        this.init();

        this.mapData.charakters.push(this);
        this.filter = new PIXI.filters.ColorMatrixFilter();
        this.filters = [this.filter];
        this.interactive = true;
        this.cursor = "pointer";
        this.addListener("click", this.onCharClick);
        this.anchor.set(0.5);
        this.setHitArea();

        document.addEventListener("newcolor", this.setNewColor);
    }

    init = () => {
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

                // @TODO
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

        this.setDirection(0);
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
        for (const char of this.mapData.charakters) {
            char.isActive = false;
        }

        this.isActive = true;
        this.cameraMove();
    };

    setNewColor = () => {
        const colorsArray = [
            [
                { index: 4, color: 0.721504807472229 },
                { index: 12, color: 0.03713098168373108 },
            ],
            [
                { index: 0, color: 0.046515580266714096 },
                { index: 13, color: 0.3200368881225586 },
            ],
            [
                { index: 10, color: 0.26166051626205444 },
                { index: 12, color: 0.4550018310546875 },
            ],
            [
                { index: 16, color: 0.546566367149353 },
                { index: 17, color: 0.8070115447044373 },
                { index: 18, color: 0.6011194586753845 },
            ],
            [
                { index: 2, color: 0.04603690281510353 },
                { index: 4, color: 0.12762226164340973 },
                { index: 11, color: 0.7707859873771667 },
            ],
            [{ index: 2, color: 0.7962536215782166 }],
            [
                { index: 4, color: 0.7491387128829956 },
                { index: 12, color: 0.38632670044898987 },
            ],
            [
                { index: 1, color: 0.33144813776016235 },
                { index: 12, color: 0.4202705919742584 },
            ],
            [{ index: 5, color: 0.4460449814796448 }],
            [{ index: 1, color: 0.4219434857368469 }],
        ];

        const normalMatrix = [
            1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
        ];

        this.filter.matrix = normalMatrix;
        this.color++;
        if (this.color >= colorsArray.length) {
            this.color = 0;
        }
        for (const skin of colorsArray[this.color]) {
            this.filter.matrix[skin.index] = skin.color;
        }
    };

    setHitArea = () => {
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xff0000, 0);

        graphics.drawRect(
            -this.anchor.x * this.mapData.source.tilewidth,
            -this.anchor.y * this.mapData.source.tileheight,
            this.mapData.source.tilewidth,
            this.mapData.source.tileheight
        );
        graphics.endFill();

        // this.collisionLayer.addChild(graphics);
        this.collisionLayer = graphics;
        graphics.zIndex = 5000;
        this.addChild(this.collisionLayer);
    };

    move = (movePath: { x: number; y: number }) => {
        let hit = false;

        for (const tile of this.mapData.collisionLayer!.collisionsMap) {
            hit = hitTestRectangle(
                {
                    x: this.x + movePath.x,
                    y: this.y + movePath.y,
                    width: this.collisionLayer.width,
                    height: this.collisionLayer.height,
                    anchor: this.anchor,
                },
                {
                    x: tile.getLocalBounds().x,
                    y: tile.getLocalBounds().y,
                    width: tile.width,
                    height: tile.height,
                }
            );

            if (hit) {
                break;
            }
        }

        if (!hit) {
            // for (const tile of (this.mapData.layers[1] as TileLayer).tiles) {
            //     if (tile) tile.visible = true;
            // }

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
        const border = 400 / Config.map_scale;

        const minX = Config.game_width - this.mapData.width;
        const minY = Config.game_height - this.mapData.height;

        const corX = (this.mapData.source.tilewidth / 2) * Config.map_scale;
        const corY = (this.mapData.source.tileheight / 2) * Config.map_scale;

        let nextX = Config.game_width / 2 - this.getBounds().x + this.mapData.x;

        let nextY =
            Config.game_height / 2 - this.getBounds().y + this.mapData.y;

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
        const tiles: any[] = [];
        const cor = 0.1;

        let notX = 0;
        let notX_ = 0;
        let notY = 0;
        let notY_ = 0;

        const tileX =
            (this.x + x + this.collisionLayer.width * this.anchor.x) /
            this.mapData.source.tilewidth;
        const tileY =
            (this.y + y + this.collisionLayer.height * this.anchor.y) /
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

import anime, { AnimeInstance } from "animejs";
import { hitTestRectangle } from "../Util";
import Tile from "../TMCore/Tile";
import TiledMap from "../TMCore/TiledMap";
import { Common } from "../Config/Common";
import { LocalStorage } from "../LocalStorage";
import { LogicState } from "../logic_state";
import { AnimationDirectoins, CharacterBase } from "./CharacterBase";

export type CharActions = "set_dirt" | "water_plant";
export class Character extends CharacterBase {
    isRunning = false;
    toRun = 0;
    currentAnim?: AnimeInstance;

    constructor(mapData: TiledMap) {
        super(mapData, "character");
        this.mapData.charakter = this;
        this.onClick = this.onCharClick;
    }

    onCharClick = () => {
        console.log("it's me");
        this.cameraMove();
    };

    setAction = (action: CharActions, target: Tile) => {
        return new Promise<(() => void) | void>((resolve) => {
            let anim: AnimeInstance;
            let esc: () => void;

            switch (action) {
                case "set_dirt":
                    anim = anime({
                        targets: target.Dirt!.scale,
                        x: [0, 1],
                        y: [0, 1],
                        easing: "linear",
                        duration: 2400,
                        endDelay: 200,
                        complete: () => {
                            resolve(esc);
                        },
                    });

                    esc = () => {
                        anim.pause();
                        target.removeDirt();
                        resolve();
                    };
                    break;

                default:
                    anim = anime({});
                    esc = () => {};
                    break;
            }

            document.dispatchEvent(
                new CustomEvent<() => void>("setEscape", { detail: esc })
            );
        }).then((esc: (() => void) | void) => {
            if (esc) {
                document.dispatchEvent(
                    new CustomEvent<() => void>("removeEscape", {
                        detail: esc,
                    })
                );
            }
        });
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

            if (corX !== 0) {
                this.direction =
                    corX > 0
                        ? AnimationDirectoins.Right
                        : AnimationDirectoins.Left;
            } else {
                this.direction =
                    corY > 0
                        ? AnimationDirectoins.Down
                        : AnimationDirectoins.Up;
            }

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

    restore = (id: number | string) => {
        const charData = LocalStorage.getDataById(id);
        Object.assign(this, charData);
        LogicState.balance = charData.balance;
        LogicState.notify_all();
    };

    getStorageData = () => {
        const data = {
            name: this.name,
            x: this.x,
            y: this.y,
            id: this.id,
            activeLayer: this.activeLayer,
            direction: this.direction,
            balance: LogicState.balance,
        };

        return data;
    };
}

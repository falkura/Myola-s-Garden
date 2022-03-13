import anime from "animejs";
import { Config } from "../Config";
import { hitTestRectangle } from "./Bump";
import { CollisionLayer } from "./CollisionLayer";
import ObjectTile from "./ObjectTile";
import TiledMap from "./TiledMap";
import TileLayer from "./TileLayer";
import TileSet from "./TileSet";
import { iDataObject } from "./TMModel";

export default class Character extends ObjectTile {
    isActive = false;
    collisionLayer?: CollisionLayer;
    anchor!: PIXI.ObservablePoint;
    activeLayer = 2;
    nextX = 0;
    nextY = 0;
    mapData: TiledMap;

    constructor(tile: iDataObject, tileSet: TileSet, mapData: TiledMap) {
        super(tile, tileSet);
        this.mapData = mapData;
        this.mapData.charakters.push(this);

        this.interactive = true;
        // @TODO
        // this.activeLayer = 2;
        this.cursor = "pointer";
        this.addListener("click", this.onCharClick);
        this.setCollisionLayer();
        this.gotoAndPlay(3);

        this.onFrameChange = function () {
            this.stop();
        };
    }

    onCharClick = () => {
        for (const char of this.mapData.charakters) {
            char.isActive = false;
        }

        this.isActive = true;
        this.cameraMove();
    };

    setCollisionLayer = () => {
        this.collisionLayer = new CollisionLayer(this.mapData);
        this.addChild(this.collisionLayer);
    };

    move = (movePath: { x: number; y: number }) => {
        let hit = false;

        for (const tile of this.mapData.collisionLayer!.collisionsMap) {
            hit = hitTestRectangle(
                {
                    x: this.x + movePath.x,
                    y: this.y + movePath.y,
                    width: this.width,
                    height: this.height,
                    anchor: this.anchor,
                },
                {
                    x: tile.getLocalBounds().x,
                    y: tile.getLocalBounds().y,
                    width: tile.width,
                    height: tile.height,
                }
            );

            if (hit) break;
        }

        if (!hit) {
            for (const tile of (this.mapData.layers[1] as TileLayer).tiles) {
                if (tile) tile.visible = true;
            }

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

            this.x += movePath.x;
            this.y += movePath.y;

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
            (this.x + x + this.width * this.anchor.x) /
            this.mapData.source.tilewidth;
        const tileY =
            (this.y + y + this.height * this.anchor.y) /
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

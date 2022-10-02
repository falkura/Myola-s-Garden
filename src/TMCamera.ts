import anime from "animejs";
import { Config } from "./Config";
import { BaseTMObject } from "./GameComponents/TMObjects/BaseTMObject";
import TiledMap from "./TMCore/TiledMap";
import { clamp, distanceBetweenTwoPoints } from "./Util";

export class TMCamera {
    private readonly app: PIXI.Application;
    private target: TiledMap;

    private lastMovePath: PIXI.Point = new PIXI.Point(0, 0);
    private fastCameraMoveSpeed = 6;
    private slowCameraMoveSpeed = 2;
    private minMapScale = 1;
    private maxMapScale = 5;
    private wheelScaleMultiplier = 1 / 1000;
    private mapZoomStep = 0.1;
    private lastMapScale = 0;

    private cameraMoveProcess?: { destroy: () => void; process: () => void };
    private cameraMoveAnim?: anime.AnimeInstance;

    public mapScale = 1;
    public onResizeCb?: () => void;

    constructor(target: TiledMap, app: PIXI.Application) {
        this.target = target;
        this.app = app;

        this.initCamera();
    }

    private initCamera = () => {
        this.target.addListener("pointermove", this.onMapMove);
        document.addEventListener("pointerleave", this.onMapLeave);
        document.addEventListener("wheel", this.onWheel, { passive: false });

        const ticker = PIXI.Ticker.shared;

        const process = () => {
            this.moveCamera();
        };

        const destroy = () => {
            ticker.remove(process);
        };

        this.cameraMoveProcess = { process, destroy };

        ticker.add(process);
    };

    private onMapLeave = () => {
        this.lastMovePath = new PIXI.Point(0, 0);
    };

    private onMapMove = (e: PIXI.InteractionEvent) => {
        const borderSize = 80;
        const inputX = e.data.global.x;
        const inputY = e.data.global.y;
        const path: PIXI.Point = new PIXI.Point(0, 0);

        if (inputX < borderSize) {
            path.x = -this.slowCameraMoveSpeed;

            if (inputX < borderSize / 2) {
                path.x = -this.fastCameraMoveSpeed;
            }
        } else if (inputX > Config.project_width - borderSize) {
            path.x = this.slowCameraMoveSpeed;

            if (inputX > Config.project_width - borderSize / 2) {
                path.x = this.fastCameraMoveSpeed;
            }
        } else {
            path.x = 0;
        }

        if (inputY < borderSize) {
            path.y = -this.slowCameraMoveSpeed;

            if (inputY < borderSize / 2) {
                path.y = -this.fastCameraMoveSpeed;
            }
        } else if (inputY > Config.project_height - borderSize) {
            path.y = this.slowCameraMoveSpeed;

            if (inputY > Config.project_height - borderSize / 2) {
                path.y = this.fastCameraMoveSpeed;
            }
        } else {
            path.y = 0;
        }

        if (this.lastMovePath.x !== path.x || this.lastMovePath.y !== path.y) {
            this.lastMovePath = path;
        }
    };

    private get paddingX(): number {
        return this.target.pivot.x * this.target.scale.x;
    }

    private get paddingY(): number {
        return this.target.pivot.y * this.target.scale.y;
    }

    private get input(): PIXI.Point {
        return new PIXI.Point(
            this.app.renderer.plugins.interaction.mouse.global.x as number,
            this.app.renderer.plugins.interaction.mouse.global.y as number,
        );
    }

    private onWheel = (e: WheelEvent) => {
        e.preventDefault();
        const deltaY = e.deltaY * this.wheelScaleMultiplier;

        if (deltaY === 0) return;

        this.updateZoom(deltaY);
    };

    /** Set point in the middle of screen
     *
     * @param point If undefiend - target point will be mouse position
     */
    public centerCamera = (cameraTarget?: BaseTMObject, force = false) => {
        const moveTo = new PIXI.Point(0, 0);

        if (!cameraTarget) {
            moveTo.x = this.target.x + Config.project_width / 2 - this.input.x - this.paddingX;
            moveTo.y = this.target.y + Config.project_height / 2 - this.input.y - this.paddingY;
        } else {
            moveTo.x = -cameraTarget.sprite.x * this.mapScale + Config.project_width / 2;
            moveTo.y = -cameraTarget.sprite.y * this.mapScale + Config.project_height / 2;
        }

        this.moveCamera(moveTo, true, force);
    };

    private updateZoom = (deltaY: number) => {
        this.lastMapScale = this.mapScale;

        this.mapScale -= deltaY > 0 ? this.mapZoomStep : -this.mapZoomStep;

        this.mapScale = clamp(this.mapScale, this.minMapScale, this.maxMapScale);

        if (this.mapScale === this.lastMapScale) return;

        this.target.scale.set(this.mapScale);

        const moveTo = new PIXI.Point(0, 0);

        const k = this.target._width * (this.mapScale - this.lastMapScale);
        const u = this.target._height * (this.mapScale - this.lastMapScale);

        // const inputCoefX = (Config.project_width / 2 - input.x - paddingX) / -Config.project_width + 0.5;
        // const k2 = ((-inputCoefX + 1) * 2 - 1) * k;
        // moveTo.x = this.map.x - k / 2 + k2 / 2;
        moveTo.x = this.target.x - (k * (this.input.x + this.paddingX)) / Config.project_width;
        moveTo.y = this.target.y - (u * (this.input.y + this.paddingY)) / Config.project_height;

        this.moveCamera(moveTo);
    };

    public moveCamera = (point?: PIXI.Point, showAnim = false, force = false) => {
        if (!point) {
            point = this.lastMovePath;
            if (!force) {
                if ((point.x !== 0 || point.y !== 0) && this.cameraMoveAnim) this.cameraMoveAnim.pause();
                this.target.x -= point.x;
                this.target.y -= point.y;
            }
        } else {
            if (showAnim) {
                if (this.cameraMoveAnim) this.cameraMoveAnim.pause();
                const dis = distanceBetweenTwoPoints(this.target as unknown as PIXI.Point, point);
                const duration = clamp(dis / 2, 100, 800);

                this.cameraMoveAnim = anime({
                    targets: this.target,
                    x: point.x,
                    y: point.y,
                    duration: duration,
                    easing: "linear",
                    update: () => {
                        this.normalizeCameraPostion();
                    },
                });
            } else {
                this.target.x = point!.x;
                this.target.y = point!.y;
            }
        }

        if (point.x !== 0 || point.y !== 0) this.resize(true);
    };

    private normalizeCameraPostion = () => {
        let X = this.target.x;
        let Y = this.target.y;

        if (Config.project_width - this.target.width > this.target.x) {
            X = Math.max(this.target.x, Config.project_width - this.target.width);
        } else if (this.target.x > 0) {
            X = Math.min(this.target.x, 0);
        }

        if (Config.project_height - this.target.height > this.target.y) {
            Y = Math.max(this.target.y, Config.project_height - this.target.height);
        } else if (this.target.y > 0) {
            Y = Math.min(this.target.y, 0);
        }

        this.target.position.set(X, Y);
    };

    public cleanUp = () => {
        document.removeEventListener("pointerleave", this.onMapLeave);
        document.removeEventListener("wheel", this.onWheel);

        this.target.removeListener("pointermove", this.onMapMove);

        if (this.cameraMoveProcess) {
            this.cameraMoveProcess.destroy();
            this.cameraMoveProcess = undefined;
        }
    };

    public resize = (useOutterResize = false) => {
        this.minMapScale = Math.min(
            Config.project_width / this.target._width > Config.project_height / this.target._height
                ? Config.project_width / this.target._width
                : Config.project_height / this.target._height,
            this.maxMapScale,
        );

        if (this.mapScale < this.minMapScale) {
            this.updateZoom(1);
        } else {
            this.normalizeCameraPostion();
        }

        if (useOutterResize && this.onResizeCb) {
            this.onResizeCb();
        }
    };
}

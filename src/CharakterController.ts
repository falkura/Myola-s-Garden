import { EVENTS } from "./Events";
import Character from "./TMCore/Character";
import TiledMap from "./TMCore/TiledMap";
import { movePath } from "./TMCore/TMModel";

export default class CharakterController {
    map: TiledMap;
    minFPS = 10;
    maxFPS = 144;
    activeMoves: Array<{ x: number; y: number; animNum: number }> = [];
    lastMove = 4;
    animDuration = 300;
    elapsedTime = 0;
    c = false;
    seedMode = false;

    constructor(map: TiledMap) {
        this.map = map;

        this.addEventListeners();

        this.addTicker();
        this.map.app.ticker.maxFPS = this.maxFPS;

        // PIXI.Ticker.shared.add(this.update);
        // PIXI.Ticker.shared.speed = 1;
        // PIXI.Ticker.shared.add(this.update1);
    }

    addEventListeners = () => {
        document.addEventListener("keydown", this.processKeyDown);
        document.addEventListener("keyup", this.processKeyUp);
    };

    processKeyDown = (e: KeyboardEvent) => {
        if (movePath.hasOwnProperty(e.code)) {
            if (this.seedMode) return;

            const targetPath = movePath[e.code as keyof typeof movePath];
            const pathExist = this.activeMoves.includes(targetPath);
            this.lastMove = targetPath.animNum;
            this.updatePosition();

            if (!pathExist) {
                this.activeMoves.push(targetPath);
            }
        } else {
            switch (e.code) {
                case "ShiftLeft":
                case "ShiftRight":
                    if (!this.seedMode) {
                        this.seedMode = true;
                        this.activeMoves = [];

                        document.dispatchEvent(new Event(EVENTS.Seed.On));
                    }
                    break;

                default:
                    console.log(e.code);
                    break;
            }
        }
    };

    processKeyUp = (e: KeyboardEvent) => {
        if (movePath.hasOwnProperty(e.code)) {
            const targetPath = movePath[e.code as keyof typeof movePath];
            const targetIndex = this.activeMoves.indexOf(targetPath);

            if (targetIndex > -1) {
                this.activeMoves.splice(targetIndex, 1);
            }
        } else {
            switch (e.code) {
                case "ShiftLeft":
                case "ShiftRight":
                    this.seedMode = false;
                    document.dispatchEvent(new Event(EVENTS.Seed.Off));
                    break;

                default:
                    // console.log(e.code);
                    break;
            }
        }
    };

    addTicker = () => {
        const destroy = false;
        let elapsedTime = 0;
        this.map.app.ticker.add((delta) => {
            if (!destroy) {
                elapsedTime += delta;

                if (elapsedTime >= this.maxFPS / 1000) {
                    this.update(delta);
                    elapsedTime = 0;
                }
                // destroy = true;
                // this.app.ticker.destroy();
            }
        });
    };

    update = (delta: number) => {
        const char = this.getActiveCharakter();
        this.elapsedTime += delta;

        this.map.plants.forEach((plant) => {
            plant.plant.update();
        });

        if (char) {
            for (const mp of this.activeMoves) {
                char.move(mp);
                // char.gotoAndStop(mp.animNum);
                // this.lastMove = mp.animNum;
                // this.updatePosition();
            }

            if (this.elapsedTime >= this.animDuration / 18) {
                this.updatePosition();
            }
        }
    };

    updatePosition = () => {
        const char = this.getActiveCharakter()!;

        if (char) {
            if (this.activeMoves.length === 0) {
                if (!this.c) {
                    char.gotoAndStop(this.lastMove);
                } else {
                    char.gotoAndStop(this.lastMove + 1);
                }
            } else {
                if (!this.c) {
                    char.gotoAndStop(this.lastMove + 2);
                } else {
                    char.gotoAndStop(this.lastMove + 3);
                }
            }

            this.c = !this.c;
            this.elapsedTime = 0;
        }
    };

    activateCharakter = () => {};

    getActiveCharakter = (): Character | undefined => {
        for (const char of this.map!.charakters) {
            if (char.isActive) {
                return char;
            }
        }

        return undefined;
    };

    moveCharakter = () => {};
}

import { EVENTS } from "./Events";
import { LogicState } from "./logic_state";
import { CharacterBase } from "./TMCore/CharacterBase";
import TiledMap from "./TMCore/TiledMap";
import { movePath } from "./TMCore/TMModel";

export default class CharakterController {
    map: TiledMap;
    minFPS = 10;
    maxFPS = 144;
    activeMoves: Array<{ x: number; y: number; animNum: number }> = [];
    lastMove = 0;
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
                        LogicState.isShift = true;
                        this.seedMode = true;
                        this.activeMoves = [];

                        document.dispatchEvent(new Event(EVENTS.Seed.On));
                    }
                    break;
                case "KeyI":
                    document.dispatchEvent(new Event("si"));
                    break;
                case "KeyP":
                    document.dispatchEvent(new Event("pi"));
                    break;
                case "KeyC":
                    document.dispatchEvent(new Event("newcolor"));
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
            if (this.activeMoves.length === 0) {
                const char = this.getActiveCharakter()!;
                char.setType(0);
                char.isRunning = false;
            }
        } else {
            switch (e.code) {
                case "ShiftLeft":
                case "ShiftRight":
                    LogicState.isShift = false;
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
            if (this.activeMoves.length > 0) {
                // char.setType(2);

                if (this.elapsedTime >= 20) {
                    this.elapsedTime = 0;
                    char.isRunning = true;
                }

                if (char.isRunning) {
                    char.setType(2);
                } else {
                    char.setType(1);
                }

                for (const mp of this.activeMoves) {
                    char.move(mp);
                    // char.gotoAndStop(mp.animNum);
                    // this.lastMove = mp.animNum;
                    // this.updatePosition();
                }
            }
        }
    };

    updatePosition = () => {
        const char = this.getActiveCharakter()!;

        if (char) {
            if (this.activeMoves.length === 0) {
                if (!this.c) {
                    char.setDirection(this.lastMove);
                } else {
                    char.setDirection(this.lastMove);
                }
            } else {
                if (!this.c) {
                    char.setDirection(this.lastMove);
                } else {
                    char.setDirection(this.lastMove);
                }
            }
            this.c = !this.c;
            this.elapsedTime = 0;
        }
    };

    activateCharakter = () => {};

    getActiveCharakter = (): CharacterBase | undefined => {
        for (const char of this.map!.charakters) {
            if (char.isActive) {
                return char;
            }
        }

        return undefined;
    };

    moveCharakter = () => {};
}

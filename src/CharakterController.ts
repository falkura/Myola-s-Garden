import { EVENTS } from "./Events";
import { LogicState } from "./logic_state";
import TiledMap from "./TMCore/TiledMap";
import { iMovePath } from "./Model";

export default class CharakterController {
    map: TiledMap;
    minFPS = 10;
    maxFPS = 144;
    activeMoves: iMovePath[] = [];
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
    }

    addEventListeners = () => {
        document.addEventListener("keyMoveOn", this.keyMoveOn);
        document.addEventListener("keyMoveOff", this.keyMoveOff);
        document.addEventListener("shiftOn", this.shiftOn);
        document.addEventListener("shiftOff", this.shiftOff);
    };

    keyMoveOn = (e: Event) => {
        if (this.seedMode) return;

        const targetPath = (e as CustomEvent<iMovePath>).detail;
        const pathExist = this.activeMoves.includes(targetPath);

        this.lastMove = targetPath.animNum;
        this.updatePosition();

        if (!pathExist) {
            this.activeMoves.push(targetPath);
        }
    };

    keyMoveOff = (e: Event) => {
        const targetPath = (e as CustomEvent<iMovePath>).detail;
        const targetIndex = this.activeMoves.indexOf(targetPath);

        if (targetIndex > -1) {
            this.activeMoves.splice(targetIndex, 1);
        }

        if (this.activeMoves.length === 0) {
            this.map.charakter.setType(0);
            this.map.charakter.isRunning = false;
        }
    };

    shiftOn = () => {
        if (!this.seedMode) {
            LogicState.isShift = true;
            this.seedMode = true;
            this.activeMoves = [];

            document.dispatchEvent(new Event(EVENTS.Seed.On));
        }
    };

    shiftOff = () => {
        LogicState.isShift = false;
        this.seedMode = false;
        document.dispatchEvent(new Event(EVENTS.Seed.Off));
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
        const char = this.map.charakter;
        this.elapsedTime += delta;

        this.map.plants.forEach((plant) => {
            plant.plant.update();
        });

        if (this.activeMoves.length > 0) {
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
            }
        }
    };

    updatePosition = () => {
        const char = this.map.charakter;

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
}

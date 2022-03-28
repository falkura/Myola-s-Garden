import { EVENTS } from "./Events";
import { LogicState } from "./logic_state";
import TiledMap from "./TMCore/TiledMap";
import { iMovePath } from "./Model";
import { LocalStorage } from "./LocalStorage";

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
        document.addEventListener("save_character", this.saveCharacter);
    };

    keyMoveOn = (e: Event) => {
        if (this.seedMode || this.map.charakter.inAction) return;

        const targetPath = (e as CustomEvent<iMovePath>).detail;
        const pathExist = this.activeMoves.includes(targetPath);

        this.lastMove = targetPath.animNum;
        this.updatePosition();

        if (!pathExist) {
            this.activeMoves.push(targetPath);
        }
    };

    keyMoveOff = (e: Event) => {
        if (this.map.charakter.inAction) return;

        const targetPath = (e as CustomEvent<iMovePath>).detail;
        const targetIndex = this.activeMoves.indexOf(targetPath);
        const char = this.map.charakter;

        if (targetIndex > -1) {
            this.activeMoves.splice(targetIndex, 1);
        }

        if (this.activeMoves.length === 0) {
            char.setType(0);
            char.isRunning = false;
        }

        document.dispatchEvent(new Event("save_character"));
    };

    saveCharacter = () => {
        LocalStorage.data = {
            id: this.map.charakter.id,
            detail: this.map.charakter.getStorageData(),
        };
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
            char.direction = this.lastMove;
            this.elapsedTime = 0;
        }
    };
}

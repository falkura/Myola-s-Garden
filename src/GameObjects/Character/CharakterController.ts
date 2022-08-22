import { EVENTS } from "../../Events";
import { LogicState } from "../../logic_state";
import { iMovePath } from "../../Model";
import { LocalStorage } from "../../LocalStorage";
import { AnimationTypes } from "./CharacterBase";
import Tile from "../../TMCore/Tile";
import { MapController } from "../../MapController";
import { Character } from "./Character";

export default class CharakterController {
    mapController: MapController;
    minFPS = 10;
    maxFPS = 144;
    activeMoves: iMovePath[] = [];
    lastMove = 0;
    animDuration = 300;
    elapsedTime = 0;
    c = false;
    seedMode = false;
    character!: Character;

    constructor(mapController: MapController) {
        this.mapController = mapController;

        this.addEventListeners();

        this.addTicker();
        this.mapController.map!.app.ticker.maxFPS = this.maxFPS;

        this.setCharacter();
    }

    setCharacter = () => {
        this.character = new Character(this.mapController.map!);
        this.character.position.set(130, 250);
        this.character.zIndex = 10000;
        this.mapController.map!.addChild(this.character);
    };

    addEventListeners = () => {
        document.addEventListener("keyMoveOn", this.keyMoveOn);
        document.addEventListener("keyMoveOff", this.keyMoveOff);
        document.addEventListener("shiftOn", this.shiftOn);
        document.addEventListener("shiftOff", this.shiftOff);
        document.addEventListener("save_character", this.saveCharacter);
        document.addEventListener(EVENTS.Action.Tile.Choose, this.tileChoose);
        document.addEventListener(EVENTS.Seed.On, this.onSeed);
        document.addEventListener(EVENTS.Seed.Off, this.offSeed);
    };

    tileChoose = async (e: Event) => {
        if (this.character.inAction) return;

        const tile: Tile = (e as CustomEvent<Tile>).detail;

        await this.character.setPosition(tile.x, tile.y);
        this.offSeed();
        this.onSeed();

        if (!tile.Dirt) {
            const texture =
                this.mapController.map!.getTileset("Dirt")?.textures[35];
            // this.map?.getTileset(Config.dirt.tileset)?.textures[
            //     Config.dirt.base
            // ];
            this.character.setType(AnimationTypes.Hoe);
            tile.setDirt(texture!);
            // tile.Dirt!.scale.set(0);
            // const promise = new Promise((resolve, reject) => {
            // this.character.setAction("set_dirt", tile);
            await this.character.setAction("set_dirt", tile);
            // });

            // await sleep(1000);
            this.character.setType(AnimationTypes.Idle);
        } else if (!tile.Plant) {
            this.mapController.se.position.set(tile.x, tile.y);
            const plant = await this.mapController.se.drawOptions();

            if (isNaN(plant)) {
                console.log("rejected");
            } else {
                tile.setPlant(plant);
            }
        } else {
            console.log("dirt and plant exist");
        }
    };

    onSeed = () => {
        const walkableLayers = this.mapController.map!.getWalkableLayers();

        for (let i = 0; i < walkableLayers.length; i++) {
            if (walkableLayers[i].source.id === this.character.activeLayer) {
                for (const tile of walkableLayers[i].tiles) {
                    if (tile) {
                        const dist = 2;

                        if (
                            Math.abs(tile._x - this.character!._x) > dist ||
                            Math.abs(tile._y - this.character!._y) > dist ||
                            !tile.getProperty("canPlant")
                        ) {
                        } else {
                            tile.debugGraphics.visible = true;
                        }
                    }
                }
            }
        }
    };

    offSeed = () => {
        for (const layer of this.mapController.map!.getWalkableLayers()) {
            for (const tile of layer.tiles) {
                if (tile) tile.debugGraphics.visible = false;
            }
        }
    };

    keyMoveOn = (e: Event) => {
        if (this.seedMode || this.character.inAction) return;

        const targetPath = (e as CustomEvent<iMovePath>).detail;
        const pathExist = this.activeMoves.includes(targetPath);

        this.lastMove = targetPath.animNum;
        this.updatePosition();

        if (!pathExist) {
            this.activeMoves.push(targetPath);
        }
    };

    keyMoveOff = (e: Event) => {
        if (this.character.inAction) return;

        const targetPath = (e as CustomEvent<iMovePath>).detail;
        const targetIndex = this.activeMoves.indexOf(targetPath);

        if (targetIndex > -1) {
            this.activeMoves.splice(targetIndex, 1);
        }

        if (this.activeMoves.length === 0) {
            this.character.setType(0);
            this.character.isRunning = false;
        }

        document.dispatchEvent(new Event("save_character"));
    };

    saveCharacter = () => {
        LocalStorage.data = {
            id: this.character.id,
            detail: this.character.getStorageData(),
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
        this.mapController.map!.app.ticker.add((delta) => {
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
        this.elapsedTime += delta;

        this.mapController.map!.plants.forEach((plant) => {
            plant.plant.update();
        });

        if (this.activeMoves.length > 0) {
            if (this.elapsedTime >= 20) {
                this.elapsedTime = 0;
                this.character.isRunning = true;
            }

            if (this.character.isRunning) {
                this.character.setType(2);
            } else {
                this.character.setType(1);
            }

            for (const mp of this.activeMoves) {
                this.character.move(mp);
            }
        }
    };

    updatePosition = () => {
        if (this.character) {
            this.character.direction = this.lastMove;
            this.elapsedTime = 0;
        }
    };
}

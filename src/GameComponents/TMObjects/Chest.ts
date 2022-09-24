import anime from "animejs";
import { EVENTS } from "../../Events";
import { IObjectData } from "../../Models";
import { getObjectTileTexture } from "../../TMAdditions/TMUtils";
import TiledMap from "../../TMCore/TiledMap";
import TileSet from "../../TMCore/TileSet";
import { List } from "../List/List";
import { BaseTMObject } from "./BaseTMObject";

export class Chest extends BaseTMObject {
    tileset: TileSet;
    list!: List;

    isOpen = false;

    inAction = false;

    constructor(tileset: TileSet, objectData: IObjectData, map: TiledMap) {
        super(getObjectTileTexture(tileset, objectData), objectData, map);

        this.tileset = tileset;

        this.sprite.hitArea = new PIXI.Rectangle(
            -this.sprite.width * this.sprite.anchor.x + this.sprite.width / 3,
            -this.sprite.height * this.sprite.anchor.y + this.sprite.height / 3,
            this.sprite.width / 3,
            this.sprite.height / 3,
        );

        this.setAnimation();

        this.sprite.addPress(() => {
            if (this.inAction) return;

            if (this.isOpen) {
                document.dispatchEvent(new CustomEvent(EVENTS.Actions.Inventory.HideChest, { detail: this.num! }));
            } else {
                document.dispatchEvent(new CustomEvent(EVENTS.Actions.Inventory.ShowChest, { detail: this.num! }));
            }
        });
    }

    open = (): Promise<void> => {
        if (this.isOpen) return new Promise(resolve => resolve);

        this.isOpen = true;

        this.inAction = true;
        this.sprite.gotoAndPlay(0);

        return new Promise(resolve => {
            this.list.visible = true;
            anime({
                targets: this.list,
                duration: 150,
                easing: "linear",
                alpha: [0, 1],
            });

            this.sprite.onComplete = () => {
                this.sprite.textures.reverse();
                this.sprite.onComplete = () => {};
                this.inAction = false;

                console.log("chest opened");
                resolve();
            };
        });
    };

    close = (): Promise<void> => {
        if (!this.isOpen) return new Promise(resolve => resolve);

        this.isOpen = false;

        this.inAction = true;
        this.sprite.gotoAndPlay(0);

        return new Promise(resolve => {
            this.list.visible = true;
            anime({
                targets: this.list,
                duration: 150,
                easing: "linear",
                alpha: [1, 0],
                complete: () => {
                    this.list.visible = false;
                },
            });

            this.sprite.onComplete = () => {
                this.sprite.textures.reverse();
                this.sprite.onComplete = () => {};
                this.inAction = false;

                console.log("chest closed");
                resolve();
            };
        });
    };

    setAnimation = () => {
        this.sprite.loop = false;
        this.sprite.animationSpeed = 0.4;

        const textures = [];

        for (let i = 0; i < 5; i++) {
            textures.push(this.tileset.textures[i]);
        }

        this.sprite.textures = textures;
    };
}

import { EVENTS } from "../../Events";
import { IObjectData } from "../../Models";
import TiledMap from "../../TMCore/TiledMap";
import TileSet from "../../TMCore/TileSet";
import { List } from "../List/List";
import { StaticTMObject } from "./BaseTMObject";

export class Chest extends StaticTMObject {
    list!: List;

    isOpen = false;
    inAction = false;

    constructor(tileset: TileSet, objectData: IObjectData, map: TiledMap) {
        super(tileset, objectData, map);

        this.setAnimation();

        this.sprite.addPress(() => {
            if (this.inAction) return;

            if (this.isOpen) {
                document.dispatchEvent(new CustomEvent(EVENTS.Actions.Inventory.HideChest, { detail: this.props.num! }));
            } else {
                document.dispatchEvent(new CustomEvent(EVENTS.Actions.Inventory.ShowChest, { detail: this.props.num! }));
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
            this.list.alpha = 0;

            gsap.to(this.list, { duration: 150 / 1000, ease: "none", alpha: 1 });

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
            gsap.to(this.list, {
                duration: 150 / 1000,
                ease: "none",
                alpha: 0,
                onComplete: () => {
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

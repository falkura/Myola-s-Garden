import { Clickable } from "./GameComponents/Clickable";
import TiledMap from "./TMCore/TiledMap";

export class NonClickableController {
    sprites: Clickable[] = [];
    hoveredSprite?: Clickable;
    checkList: Clickable[] = [];
    map: TiledMap;

    constructor(map: TiledMap) {
        this.map = map;

        this.addEventListeners();
    }

    addEventListeners = () => {
        this.map.addListener("pointermove", this.onMapPointerMove);
        this.map.addListener("pointerdown", this.onMapPointerDown);
        this.map.addListener("pointerup", this.onMapPointerUp);
    };

    removeEventListeners = () => {
        this.map.removeListener("pointermove", this.onMapPointerMove);
        this.map.removeListener("pointerdown", this.onMapPointerDown);
        this.map.removeListener("pointerup", this.onMapPointerUp);
    };

    onMapPointerMove = (e: PIXI.InteractionEvent) => {
        if (this.hoveredSprite) {
            if (!this.hoveredSprite.getBounds().contains(e.data.global.x, e.data.global.y)) {
                this.hoveredSprite.emit("pointerout");
                this.hoveredSprite = undefined;

                this.map.app.renderer.plugins.interaction.interactionDOMElement.style.cursor = "default";
            } else {
                this.map.app.renderer.plugins.interaction.interactionDOMElement.style.cursor = "pointer";
            }
        } else {
            this.sprites.forEach(sprite => {
                // TODO add hit area
                if (sprite.getBounds().contains(e.data.global.x, e.data.global.y)) {
                    this.hoveredSprite = sprite;
                    sprite.emit("pointerover");
                }
            });
        }
    };

    onMapPointerDown = (e: PIXI.InteractionEvent) => {
        if (this.hoveredSprite && this.hoveredSprite.getBounds().contains(e.data.global.x, e.data.global.y)) {
            this.hoveredSprite.emit("pointerdown");
        }
    };

    onMapPointerUp = (e: PIXI.InteractionEvent) => {
        if (this.hoveredSprite && this.hoveredSprite.getBounds().contains(e.data.global.x, e.data.global.y)) {
            this.hoveredSprite.emit("pointerup");
        }
    };

    add = (sprite: Clickable) => {
        if (!this.sprites.includes(sprite)) {
            this.sprites.push(sprite);
        }
    };

    remove = (sprite: Clickable) => {
        if (this.sprites.includes(sprite)) {
            this.sprites.splice(this.sprites.indexOf(sprite), 1);
        }
    };

    cleanUp = () => {
        this.removeEventListeners();
    };
}

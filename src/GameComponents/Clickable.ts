import { InteractionEvent } from "pixi.js";

export class Clickable extends PIXI.AnimatedSprite {
    is_hovered = false;
    pressEvents: Array<{ (e: InteractionEvent): void }> = [];
    hoverEvents: Array<{ (e: InteractionEvent): void }> = [];
    unhoverEvents: Array<{ (e: InteractionEvent): void }> = [];
    defaultScale = new PIXI.Point(1, 1);
    /** Default: 1.1 */
    hoverScale = 1.1;
    isActive = true;
    deactivateFilter: PIXI.filters.ColorMatrixFilter;
    /** Dispatch hover event if mouse is over the sprite after click */
    hoverAfterUp = true;
    disableUnpress = false;

    constructor(...textures: PIXI.Texture[]) {
        super([...textures]);

        this.deactivateFilter = new PIXI.filters.ColorMatrixFilter();
        this.deactivateFilter.desaturate();

        this.setupInteractivity();
    }

    setupInteractivity = () => {
        this.interactive = true;
        this.cursor = "pointer";

        this.addListener("pointerdown", this.pressEvent);
        this.addListener("pointerover", this.hoverEvent);
        this.addListener("pointerout", this.unhoverEvent);
        this.addListener("pointerup", this.unpressEvent);
        this.addListener("pointerupoutside", this.unpressEvent);
    };

    removeInteractivity = () => {
        this.interactive = false;
        this.cursor = "none";

        this.removeListener("pointerdown", this.pressEvent);
        this.removeListener("pointerover", this.hoverEvent);
        this.removeListener("pointerout", this.unhoverEvent);
        this.removeListener("pointerup", this.unpressEvent);
        this.removeListener("pointerupoutside", this.unpressEvent);
    };

    activate = () => {
        this.isActive = true;
        this.interactive = true;

        this.filters = [];
    };

    deactivate = () => {
        this.isActive = false;
        this.interactive = false;

        this.filters = [this.deactivateFilter];
    };

    addHover = (callback: (e: InteractionEvent) => void) => {
        this.hoverEvents.push(callback);
    };

    removeHover = (callback: (e: InteractionEvent) => void) => {
        this.hoverEvents.splice(this.hoverEvents.indexOf(callback), 1);
    };

    addUnhover = (callback: (e: InteractionEvent) => void) => {
        this.unhoverEvents.push(callback);
    };

    removeUnhover = (callback: (e: InteractionEvent) => void) => {
        this.unhoverEvents.splice(this.hoverEvents.indexOf(callback), 1);
    };

    addPress = (callback: (e: InteractionEvent) => void) => {
        this.pressEvents.push(callback);
    };

    removePress = (callback: (e: InteractionEvent) => void) => {
        this.pressEvents.splice(this.pressEvents.indexOf(callback), 1);
    };

    pressEvent = (e: InteractionEvent) => {
        this.scale.set(this.defaultScale.x, this.defaultScale.y);

        this.pressEvents.forEach(callback => {
            callback(e);
        });
    };

    unpressEvent = (e: InteractionEvent) => {
        this.scale.set(this.defaultScale.x, this.defaultScale.y);
        if (this.disableUnpress) return;

        if (this.is_hovered && this.hoverAfterUp) {
            this.hoverEvent(e);
        } else {
            this.unhoverEvent(e);
        }
    };

    hoverEvent = (e: InteractionEvent) => {
        this.is_hovered = true;
        this.scale.set(this.defaultScale.x * this.hoverScale, this.defaultScale.y * this.hoverScale);

        this.hoverEvents.forEach(callback => {
            // callback.apply(this);
            callback(e);
        });
    };

    unhoverEvent = (e: InteractionEvent) => {
        this.is_hovered = false;
        this.scale.set(this.defaultScale.x, this.defaultScale.y);

        this.unhoverEvents.forEach(callback => {
            callback(e);
        });
    };

    disableHoverScale = () => {
        this.hoverScale = 1;
    };

    enableHoverScale = () => {
        this.hoverScale = 1.1;
    };

    cleanUp = () => {
        this.removeInteractivity();

        this.destroy();
    };
}

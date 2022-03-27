export class Clickable extends PIXI.Sprite {
    is_hovered = false;
    pressEvents: Array<{ (): void }> = [];
    hoverEvents: Array<{ (): void }> = [];
    unhoverEvents: Array<{ (): void }> = [];
    defaultScale = 1;
    hoverScale = 1.2;
    isActive = true;
    deactivateFilter: PIXI.filters.ColorMatrixFilter;

    constructor(texture: PIXI.Texture, disableHover = false) {
        super(texture);

        if (disableHover) {
            this.hoverScale = 1;
        }

        this.deactivateFilter = new PIXI.filters.ColorMatrixFilter();
        this.deactivateFilter.desaturate();

        this.setupInteractivity();
    }

    setupInteractivity = () => {
        this.interactive = true;
        this.cursor = "pointer";

        this.addListener("mousedown", this.pressEvent);
        this.addListener("mouseover", this.hoverEvent);
        this.addListener("mouseout", this.unhoverEvent);
        this.addListener("mouseup", this.unpressEvent);
        this.addListener("mouseupoutside", this.unpressEvent);
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

    addHover = (callback: () => void) => {
        this.hoverEvents.push(callback);
    };

    removeHover = (callback: () => void) => {
        this.hoverEvents.splice(this.hoverEvents.indexOf(callback), 1);
    };

    addUnhover = (callback: () => void) => {
        this.unhoverEvents.push(callback);
    };

    removeUnhover = (callback: () => void) => {
        this.unhoverEvents.splice(this.hoverEvents.indexOf(callback), 1);
    };

    addPress = (callback: () => void) => {
        this.pressEvents.push(callback);
    };

    removePress = (callback: () => void) => {
        this.pressEvents.splice(this.pressEvents.indexOf(callback), 1);
    };

    pressEvent = () => {
        this.scale.set(this.defaultScale);

        this.pressEvents.forEach((callback) => {
            callback();
        });
    };

    unpressEvent = () => {
        this.scale.set(this.defaultScale);
        if (this.is_hovered) {
            this.hoverEvent();
        } else {
            this.unhoverEvent();
        }
    };

    hoverEvent = () => {
        this.is_hovered = true;
        this.scale.set(this.defaultScale * this.hoverScale);

        this.hoverEvents.forEach((callback) => {
            callback.apply(this);
        });
    };

    unhoverEvent = () => {
        this.is_hovered = false;
        this.scale.set(this.defaultScale);

        this.unhoverEvents.forEach((callback) => {
            callback();
        });
    };

    cleanUp = () => {
        this.removeListener("mousedown", this.pressEvent);
        this.removeListener("mouseover", this.hoverEvent);
        this.removeListener("mouseout", this.unhoverEvent);
        this.removeListener("mouseup", this.unpressEvent);
        this.removeListener("mouseupoutside", this.unpressEvent);

        this.destroy();
    };
}

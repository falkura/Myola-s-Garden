import anime from "animejs";
import { Howl } from "howler";
import { Observer } from "../../Observer";
import { AUDIO_MANAGER } from "../../AudioManager";
import { InteractionEvent } from "pixi.js";
import { ResourceController } from "../../ResourceLoader";
import { ButtonList } from "../../GameConfigs/ButtonsList";
import { BaseComponent } from "./BaseComponent";

export class Button extends BaseComponent implements Observer {
    private currentAnim?: anime.AnimeInstance;
    idleTexture: PIXI.Texture;
    pressedTexture: PIXI.Texture;
    event?: string | CustomEvent;
    callback?: (e: PIXI.InteractionEvent) => void;
    isClosedWindow: boolean;
    withoutPressed: boolean;

    isHovered = false;
    isActive = false;

    deactivateFilter: PIXI.filters.ColorMatrixFilter;
    hoverFilter: PIXI.filters.ColorMatrixFilter;

    on_state_update?: () => void;
    sound_name = "click_sound";

    constructor(idleTexture: ButtonList, pressedTexture: ButtonList, isClosedWindow = false, withoutPressed = false) {
        super(ResourceController.getTexture(idleTexture));
        this.idleTexture = this.texture;
        this.pressedTexture = ResourceController.getTexture(pressedTexture);

        this.deactivateFilter = new PIXI.filters.ColorMatrixFilter();
        this.deactivateFilter.desaturate();

        this.hoverFilter = new PIXI.filters.ColorMatrixFilter();
        this.hoverFilter.saturate(0.5);

        this.anchor.set(0.5, 0.5);

        this.isClosedWindow = isClosedWindow;
        this.withoutPressed = withoutPressed;

        this.activate();
    }

    activate = () => {
        if (this.isActive) return;

        this.isActive = true;
        this.filters = [];

        this.interactive = true;
        this.cursor = "pointer";

        this.addListener("pointerdown", this.pressEvent);
        this.addListener("pointerover", this.hoverEvent);
        this.addListener("pointerout", this.unhoverEvent);
        this.addListener("pointerup", this.unpressEvent);
        this.addListener("pointerupoutside", this.unpressEvent);

        this.setScale(this.defaultScale.x, this.defaultScale.y);
    };

    deactivate = () => {
        if (!this.isActive) return;

        this.isActive = false;
        this.filters = [this.deactivateFilter];

        this.interactive = false;
        this.cursor = "auto";

        this.removeListener("pointerdown", this.pressEvent);
        this.removeListener("pointerover", this.hoverEvent);
        this.removeListener("pointerout", this.unhoverEvent);
        this.removeListener("pointerup", this.unpressEvent);
        this.removeListener("pointerupoutside", this.unpressEvent);
    };

    hoverEvent = () => {
        this.isHovered = true;
        this.filters = [this.hoverFilter];
    };

    unhoverEvent = () => {
        this.isHovered = false;
        this.filters = [];
    };

    pressEvent = (e: InteractionEvent) => {
        let sound;

        if (this.sound_name) {
            sound = AUDIO_MANAGER[this.sound_name as keyof typeof AUDIO_MANAGER];
        }

        if (sound instanceof Howl) {
            sound.play();
        }

        if (this.pressedTexture) {
            this.texture = this.pressedTexture;
        }

        if (this.event) {
            if (typeof this.event == "string") {
                document.dispatchEvent(new Event(this.event));
            } else {
                document.dispatchEvent(this.event);
            }
        }

        if (this.callback) {
            this.callback(e);
        }
    };

    unpressEvent = () => {
        this.texture = this.idleTexture;

        if (this.isHovered) {
            this.hoverEvent();
        } else {
            this.unhoverEvent();
        }
    };

    set_normal_texture = (texture: PIXI.Texture) => {
        this.idleTexture = texture;
        this.texture = texture;
    };
}

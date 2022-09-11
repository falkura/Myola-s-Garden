import { Howl } from "howler";
import { Observer } from "../../Observer";
import { AUDIO_MANAGER } from "../../AudioManager";
import { InteractionEvent } from "pixi.js";
import { ResourceController } from "../../ResourceLoader";
import { ButtonList } from "../../GameConfigs/ButtonsList";
import { BaseComponent } from "./BaseComponent";
import { TextStyles } from "../../TextStyles";
import { rescale_to_width } from "../../Util";

export class Button extends BaseComponent implements Observer {
    private idleTexture: PIXI.Texture;
    private pressedTexture: PIXI.Texture;
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

    text?: PIXI.Text;
    textScale = 1;

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

    public setText = (text: string) => {
        this.text = new PIXI.Text(text, TextStyles.buttonText);
        this.text.position.y = -1;
        this.text.anchor.set(0.5, 0.5);

        rescale_to_width(this.text, this.width * 0.5);

        this.textScale = this.text.scale.x;
        this.addChild(this.text);

        return this;
    };

    public removeText = () => {
        if (!this.text) return this;

        this.removeChild(this.text);
        this.text = undefined;

        return this;
    };

    public setEvent = (event?: typeof this.event) => {
        this.event = event;

        return this;
    };

    public activate = () => {
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

        return this;
    };

    public deactivate = () => {
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

        return this;
    };

    private hoverEvent = () => {
        this.isHovered = true;
        this.filters = [this.hoverFilter];
    };

    private unhoverEvent = () => {
        this.isHovered = false;
        this.filters = [];
    };

    private pressEvent = (e: InteractionEvent) => {
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

        if (this.text) {
            this.text.scale.set(this.textScale * 0.9);
            this.text.anchor.y = 0.4;
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

    private unpressEvent = () => {
        this.texture = this.idleTexture;

        if (this.text) {
            this.text.scale.set(this.textScale);
            this.text.anchor.y = 0.5;
        }

        if (this.isHovered) {
            this.hoverEvent();
        } else {
            this.unhoverEvent();
        }
    };

    public setDefaultTexture = (texture: PIXI.Texture) => {
        this.idleTexture = texture;
        this.texture = texture;

        return this;
    };
}

import { Config } from "../../Config";
import { EVENTS } from "../../Events";
import { IScreen } from "../../Models";
import { TextStyles } from "../../TextStyles";
import { rescale_to_width } from "../../Util";
import { BaseScreen } from "../Components/BaseScreen";
import { Button } from "../Components/Button";
import { CheckButton } from "../Components/CheckButton";

export const Languages = {
    English: "en",
    Ukrainian: "ua",
    Russian: "terrorist",
};

type Lang = keyof typeof Languages;

interface LangButton {
    button: CheckButton;
    lang: Lang;
}

export class ChooseLang extends BaseScreen implements IScreen {
    langButtons: CheckButton[] = [];
    okButton!: Button;
    lang: Lang = "English";

    constructor() {
        super("Select Language");
        this.exit.hide();

        document.addEventListener(EVENTS.GUI.Lang.Choose, this.onLangChoosen);
        this.createButtons();
        this.resize();
    }

    private onLangChoosen = (e: Event) => {
        const detail = (e as CustomEvent<LangButton>).detail;

        this.langButtons.forEach(btn => {
            btn.unsetChoosen();
        });

        detail.button.setChoosen();

        this.okButton.activate();
        console.log(detail);
    };

    private createButtons = () => {
        for (const lang of Object.keys(Languages)) {
            const button = this.createLangButton(lang);
            this.langButtons.push(button);

            button.event = new CustomEvent<LangButton>(EVENTS.GUI.Lang.Choose, { detail: { lang: lang as Lang, button: button } });

            this.addChild(button);
        }

        this.createOkButton();
    };

    private createLangButton = (lang: string) => {
        const button = new CheckButton("empty_long_on", "empty_long_off");
        const text = new PIXI.Text(lang, TextStyles.buttonText);
        text.position.y = -1;
        text.anchor.set(0.5, 0.5);

        rescale_to_width(text, button.width * 0.5);

        button.addChild(text);

        button.setScale(3);
        return button;
    };

    private createOkButton = () => {
        this.okButton = new Button("empty_big_on", "empty_big_off");

        const text = new PIXI.Text("OK", TextStyles.buttonText);
        text.position.y = -1;
        text.anchor.set(0.5, 0.5);
        rescale_to_width(text, this.okButton.width * 0.4);

        this.okButton.addChild(text);

        this.okButton.setScale(3.5);
        this.okButton.deactivate();

        this.okButton.event = EVENTS.GUI.Lang.Ok;

        this.addChild(this.okButton);
    };

    show = () => {
        this.visible = true;
    };

    hide = () => {
        this.visible = false;
    };

    resize = () => {
        this.baseResize();

        this.langButtons.forEach((btn, i) => {
            btn.position.set(Config.project_width / 2, this.plate.y - this.plate.height / 2 + 250 + btn.height * 1.05 * i);
        });

        this.okButton.position.set(Config.project_width / 2, this.plate.y + this.plate.height / 2 - this.okButton.height - 20);
    };
}

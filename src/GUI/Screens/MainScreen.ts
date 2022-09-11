import { Config } from "../../Config";
import { EVENTS } from "../../Events";
import { Global_Vars } from "../../GlobalVariables";
import { IScreen } from "../../Models";
import { Button } from "../Components/Button";

export class MainScreen extends PIXI.Container implements IScreen {
    buttons: Button[] = [];

    constructor() {
        super();

        this.createButtons();
        this.resize();
    }

    private createButtons = () => {
        this.createButton("New Game", EVENTS.GUI.MainScreen.NewGame);
        const continueButton = this.createButton("Continue", EVENTS.GUI.MainScreen.Continue);

        Global_Vars.add_observer(continueButton);

        continueButton.on_state_update = () => {
            if (Global_Vars.game_exist) {
                continueButton.activate();
            } else {
                continueButton.deactivate();
            }
        };
        this.createButton("Settings", EVENTS.GUI.MainScreen.Settings);
        this.createButton("Credits", EVENTS.GUI.MainScreen.Credits);
    };

    private createButton = (text: string, event: string) => {
        const button = new Button("empty_long_on", "empty_long_off").setText(text).setScale(3).setEvent(event);

        this.addChild(button);
        this.buttons.push(button);

        return button;
    };

    show = () => {
        this.visible = true;
    };

    hide = () => {
        this.visible = false;
    };

    resize = () => {
        this.buttons.forEach((btn, i) => {
            btn.position.set(Config.project_width / 2, Config.project_height / 2 + btn.height * 1.05 * i);
        });
    };
}

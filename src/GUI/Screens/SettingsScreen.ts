import { IScreen } from "../../Models";
import { BaseScreen } from "../Components/BaseScreen";

export class SettingsScreen extends BaseScreen implements IScreen {
    constructor() {
        super("Settings");

        this.resize();
    }

    show = () => {
        this.visible = true;
    };

    hide = () => {
        this.visible = false;
    };

    resize = () => {
        this.baseResize();
    };
}

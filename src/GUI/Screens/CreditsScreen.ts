import { IScreen } from "../../Models";
import { BaseScreen } from "../Components/BaseScreen";

export class CreditsScreen extends BaseScreen implements IScreen {
    constructor() {
        super("Credits");

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

import { Config } from "../Config";
import { EVENTS } from "../Events";
import { ResourceController } from "../ResourceLoader";
import { Button } from "./Components/Buttons";
import { Plate } from "./Components/Plate";
import { ChooseLang } from "./Screens/ChooseLang";
import { MainScreen } from "./Screens/MainScreen";

export class GuiController {
    app: PIXI.Application;
    container: PIXI.Container = new PIXI.Container();
    bg!: PIXI.Sprite;
    btn!: Button;
    plate!: Plate;
    chooseLangScreen!: ChooseLang;
    mainScreen!: MainScreen;

    constructor(app: PIXI.Application) {
        this.app = app;

        this.bg = ResourceController.getSprite("city");
        this.bg.anchor.set(0.5, 0.5);
        this.container.addChild(this.bg);

        this.showChooseLang();
        document.addEventListener(EVENTS.GUI.Lang.Ok, this.onLangChoosen);
    }

    showChooseLang = () => {
        this.chooseLangScreen = new ChooseLang();
        this.container.addChild(this.chooseLangScreen);
    };

    onLangChoosen = () => {
        this.chooseLangScreen.visible = false;
    };

    resize = () => {
        this.chooseLangScreen.resize();
        this.bg.position.set(Config.project_width / 2, Config.project_height / 2);

        this.bg.scale.set(
            Config.project_width / this.bg.texture.width > Config.project_height / this.bg.texture.height
                ? Config.project_width / this.bg.texture.width
                : Config.project_height / this.bg.texture.height,
        );
    };
}

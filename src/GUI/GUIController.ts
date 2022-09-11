import anime from "animejs";
import { Config } from "../Config";
import { EVENTS } from "../Events";
import { LogicState } from "../logic_state";
import { IScreen } from "../Models";
import { ResourceController } from "../ResourceLoader";
import { Button } from "./Components/Buttons";
import { Plate } from "./Components/Plate";
import { ChooseLang } from "./Screens/ChooseLang";
import { CreditsScreen } from "./Screens/CreditsScreen";
import { MainScreen } from "./Screens/MainScreen";
import { RUSureScreen } from "./Screens/RUSureScreen";
import { SettingsScreen } from "./Screens/SettingsScreen";

export type Screens = "chooseLang" | "main" | "credits" | "settings" | "rusure";
export type ScreensArray = Array<PIXI.Container & IScreen>;

export class GuiController {
    app: PIXI.Application;
    container: PIXI.Container = new PIXI.Container();
    bg!: PIXI.Sprite;
    btn!: Button;
    plate!: Plate;
    screens: ScreensArray = [];
    currentScreen!: Screens;

    chooseLangScreen!: ChooseLang;
    mainScreen!: MainScreen;
    creditsScreen!: CreditsScreen;
    settingsScreen!: SettingsScreen;
    rusureScreen!: RUSureScreen;

    constructor(app: PIXI.Application) {
        this.app = app;

        this.createBg();
        this.createScreens();
        this.addEventListeners();

        if (LogicState.language_choosen) {
            this.showScreen("main");
        } else {
            this.showScreen("chooseLang");
        }
    }

    createBg = () => {
        this.bg = ResourceController.getSprite("city");
        this.bg.anchor.set(0.5, 0.5);
        this.container.addChild(this.bg);
    };

    createScreens = () => {
        this.chooseLangScreen = new ChooseLang();
        this.chooseLangScreen.hide();
        this.container.addChild(this.chooseLangScreen);

        this.mainScreen = new MainScreen();
        this.mainScreen.hide();
        this.container.addChild(this.mainScreen);

        this.creditsScreen = new CreditsScreen();
        this.creditsScreen.hide();
        this.container.addChild(this.creditsScreen);

        this.settingsScreen = new SettingsScreen();
        this.settingsScreen.hide();
        this.container.addChild(this.settingsScreen);

        this.rusureScreen = new RUSureScreen();
        this.rusureScreen.hide();
        this.container.addChild(this.rusureScreen);

        this.screens.push(this.chooseLangScreen, this.mainScreen, this.creditsScreen, this.settingsScreen, this.rusureScreen);
    };

    hideAllScreens = () => {
        return new Promise<void>(resolve => {
            anime({
                targets: this.screens,
                duration: 100,
                easing: "linear",
                alpha: [1, 0],
                complete: () => {
                    this.screens.forEach(screen => {
                        screen.hide();
                        screen.alpha = 1;
                        resolve();
                    });
                },
            });
        });
    };

    showScreen = async (target: Screens) => {
        if (LogicState.game_started || this.currentScreen === target) return;
        this.currentScreen = target;

        console.log("Show:", target, "screen");

        await this.hideAllScreens();

        this[`${target}Screen`].show();

        anime({
            targets: this[`${target}Screen`],
            duration: 100,
            easing: "linear",
            alpha: [0, 1],
            complete: () => {
                this[`${target}Screen`].alpha = 1;
            },
        });
    };

    addEventListeners = () => {
        document.addEventListener(EVENTS.GUI.Lang.Ok, this.onLangChoosen);
        document.addEventListener(EVENTS.GUI.MainScreen.Credits, this.onCredits);
        document.addEventListener(EVENTS.GUI.MainScreen.Settings, this.onSettings);
        document.addEventListener(EVENTS.GUI.MainScreen.NewGame, this.onNewGame);
        document.addEventListener(EVENTS.GUI.MainScreen.Exit, this.onExit);
    };

    onCredits = () => {
        this.showScreen("credits");
    };

    onSettings = () => {
        this.showScreen("settings");
    };

    onNewGame = () => {
        if (LogicState.game_exist) {
            this.showScreen("rusure");
        } else {
            this.hideAllScreens();
            document.dispatchEvent(new Event(EVENTS.GUI.MainScreen.RUS.Yes));
        }
    };

    onExit = () => {
        this.showScreen("main");
    };

    onLangChoosen = () => {
        document.removeEventListener(EVENTS.GUI.Lang.Choose, this.onLangChoosen);
        this.showScreen("main");
    };

    resize = () => {
        this.chooseLangScreen.resize();
        this.mainScreen.resize();
        this.creditsScreen.resize();

        this.bg.position.set(Config.project_width / 2, Config.project_height / 2);

        this.bg.scale.set(
            Config.project_width / this.bg.texture.width > Config.project_height / this.bg.texture.height
                ? Config.project_width / this.bg.texture.width
                : Config.project_height / this.bg.texture.height,
        );
    };
}

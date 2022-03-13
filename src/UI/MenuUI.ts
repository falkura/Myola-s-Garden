import anime from "animejs";
import { EVENTS } from "../Events";
import { TextStyles } from "../TextStyles";
import { ButtonTemp } from "./Components/ButtonTemp";
import { Settings } from "./Settings";

export class MenuUI extends PIXI.Container {
    app: PIXI.Application;
    play_button?: ButtonTemp;
    settings_button?: ButtonTemp;
    settingsWindow?: Settings;

    constructor(app: PIXI.Application) {
        super();
        this.app = app;
        this.createInterface();

        this.test();
        this.add_event_listeners();
        this.on_resize();
    }

    test = () => {
        const btns: PIXI.Sprite[] = [];

        btns.push(this.createButton("option 1", "k"));
        btns.push(this.createButton("option 2", "d"));
        btns.push(this.createButton("option 3", "s"));
        btns.push(this.createButton("option 4", "a"));

        const rect = new PIXI.Graphics()
            .beginFill(0xc39b77, 1)
            .drawRoundedRect(0, 0, 150, btns.length * 33, 5)
            .endFill();
        rect.interactiveChildren = true;
        rect.interactive = true;
        rect.zIndex = 10000;

        btns.forEach((btn, i) => {
            btn.position.set(0, i * 33);
            rect.addChild(btn);
        });
        rect.addListener("click", () => {
            rect.interactive = false;
            rect.interactiveChildren = false;

            anime({
                duration: 100,
                update: (anim) => {
                    rect.scale.set(1 - anim.progress / 100);
                },

                complete: () => {
                    anime({
                        duration: 100,
                        update: (anim) => {
                            rect.scale.set(anim.progress / 100);
                        },
                        complete: () => {
                            rect.interactive = true;
                            rect.interactiveChildren = true;
                            // document.addEventListener(
                            //     "click",
                            //     (e) => {
                            //         e.preventDefault();
                            //         rect.visible = false;
                            //     },
                            //     { once: true }
                            // );
                        },
                    });
                },
            });
        });

        rect.position.set(100, 100);
        this.addChild(rect);
    };

    createButton = (text: string, event: string) => {
        const btn = new PIXI.Sprite();

        const bg = new PIXI.Graphics()
            .beginFill(0xc4a484, 1)
            .drawRoundedRect(0, 0, 150, 33, 5)
            .endFill();
        bg.alpha = 0;
        bg.interactive = true;
        bg.cursor = "pointer";

        btn.addChild(bg);

        const btntext = new PIXI.Text(text, TextStyles.contextMenuText);
        btntext.position.set(8, btntext.height / 2);
        btntext.resolution = 2;

        btn.addChild(btntext);

        bg.addListener("mouseover", () => {
            bg.alpha = 1;
        });
        bg.addListener("mouseout", () => {
            bg.alpha = 0;
        });
        bg.addListener("mousedown", () => {
            console.log(event);
            document.dispatchEvent(new Event(event));
        });

        return btn;
    };

    createInterface = () => {
        const graphics = new PIXI.Graphics()
            .lineStyle(3, 0x000000, 1)
            .beginFill(0x000000, 0.2)
            .drawRect(0, 0, 200, 50)
            .endFill();

        this.play_button = new ButtonTemp(graphics, "PLAY");
        this.play_button.event = new Event(EVENTS.Buttons.Play);
        this.play_button.position.set(200, 200);

        const graphics_ = new PIXI.Graphics()
            .lineStyle(3, 0x000000, 1)
            .beginFill(0x000000, 0.2)
            .drawRect(0, 0, 200, 50)
            .endFill();

        this.settings_button = new ButtonTemp(graphics_, "SETTINGS");
        this.settings_button.event = new Event(EVENTS.Buttons.Settings);
        this.settings_button.position.set(200, 350);

        this.settingsWindow = new Settings();
        this.settingsWindow.visible = false;

        this.addChild(
            this.play_button,
            this.settings_button,
            this.settingsWindow
        );
    };

    add_event_listeners = () => {};

    on_resize = () => {};
}

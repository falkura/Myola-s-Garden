import { Button } from "./GUI/Components/Button";
import { TextStyles } from "./TextStyles";
import TiledMap from "./TMCore/TiledMap";

export class TMObjectPopup extends PIXI.Container {
    map: TiledMap;
    isShown = false;

    private radius = 6;
    private padding = 5;
    private title!: PIXI.Text;
    private buttons: Button[] = [];
    private bg!: PIXI.Graphics;
    private shadow!: PIXI.Graphics;
    private defaultWidth = 150;
    private defaultHeight = 50;

    constructor(map: TiledMap) {
        super();
        this.map = map;

        this.createPopup();
        this.visible = false;
        this.alpha = 0;
    }

    createPopup = () => {
        this.createBG();
        this.createTitle();
        this.updateGraphics();
    };

    createBG = () => {
        this.bg = new PIXI.Graphics().beginFill(0xc89d7c).drawRoundedRect(0, 0, 100, 100, this.radius).endFill();
        this.shadow = new PIXI.Graphics().beginFill(0x444444, 0.65).drawRoundedRect(0, 0, 100, 100, this.radius).endFill();

        this.shadow.filters = [new PIXI.filters.BlurFilter(5)];
        this.addChild(this.shadow);
        this.addChild(this.bg);
    };

    createTitle = () => {
        const titleTextStyleExtension = {
            wordWrap: true,
            wordWrapWidth: this.defaultWidth - this.padding * 2,
            fontSize: 20,
            breakWords: true,
        };

        this.title = new PIXI.Text("", { ...TextStyles.title, ...titleTextStyleExtension });
        this.title.anchor.set(0.5, 0.5);
        this.addChild(this.title);
    };

    setTitle = (title: string) => {
        this.title.text = title;
        this.updateGraphics();
    };

    addButtons = (buttons: { [key: string]: () => void }) => {
        Object.entries(buttons).forEach(buttonConfig => {
            const label = buttonConfig[0];
            const cb = buttonConfig[1];

            const button = new Button("empty_long_on", "empty_long_off").setText(label).setScale(1.2);
            button.callback = cb;
            button.position.set(this.padding + button.width / 2, button.height / 2 + button.height * this.buttons.length + this.padding);
            this.buttons.push(button);
            this.addChild(button);
        });

        this.updateGraphics();
    };

    removeButtons = (...args: Array<string | number>) => {
        args.forEach(key => {
            const button = this.getButton(key);

            if (button) {
                this.buttons.splice(this.buttons.indexOf(button), 1);
                this.removeChild(button);
            }
        });

        this.updateGraphics();
    };

    getButton = (key: string | number): Button | undefined => {
        let result: Button | undefined = undefined;

        if (typeof key === "number") {
            result = this.buttons[key] ? this.buttons[key] : undefined;
        } else {
            this.buttons.forEach(button => {
                if (button.text && button.text.text === key) {
                    result = button;
                }
            });
        }

        return result;
    };

    updateGraphics = () => {
        let width = this.defaultWidth;
        let height = this.defaultHeight;

        if (this.buttons.length > 0) {
            width = this.buttons[0].width + this.padding * 2;
            height = this.buttons[0].height * this.buttons.length + this.padding * 2;
        }

        if (this.title.text) {
            if (this.buttons.length > 0) {
                height += this.title.height + this.padding;

                this.title.position.set(width / 2, this.title.height / 2 + this.padding);

                this.buttons.forEach((button, index) => {
                    button.position.y = this.title.height + button.height / 2 + button.height * index + this.padding * 2;
                });
            } else {
                height = this.title.height + this.padding * 2;

                this.title.position.set(width / 2, this.title.height / 2 + this.padding);
            }
        }

        this.bg.clear().beginFill(0xc89d7c).drawRoundedRect(0, 0, width, height, this.radius).endFill();
        this.shadow.clear().beginFill(0x444444, 0.65).drawRoundedRect(0, 0, width, height, this.radius).endFill();
    };

    show = () => {
        if (this.isShown) return;

        this.visible = true;

        return gsap.to(this, { duration: 100 / 1000, ease: "none", alpha: 1 }).then(() => {
            this.isShown = true;
        });
    };

    hide = () => {
        if (!this.isShown) return;

        this.visible = true;

        return gsap.to(this, { duration: 100 / 1000, ease: "none", alpha: 0 }).then(() => {
            this.isShown = false;
            this.visible = false;
        });
    };

    clearPopup = () => {
        this.buttons.forEach(button => {
            this.removeChild(button);
            button.destroy();
        });

        this.buttons.length = 0;
        this.title.text = "";

        this.updateGraphics();
    };

    cleanUp = () => {
        this.clearPopup();
        this.destroy();
    };
}

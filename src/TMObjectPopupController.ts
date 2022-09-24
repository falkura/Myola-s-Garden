import { EVENTS } from "./Events";
import { BaseTMObject } from "./GameComponents/TMObjects/BaseTMObject";
import TiledMap from "./TMCore/TiledMap";
import { TMObjectPopup } from "./TMObjectPopup";

export interface PopupData {
    target: BaseTMObject;
    title?: string;
    buttons?: { [key: string]: () => void };
}

export class TMObjectPopupController extends PIXI.Container {
    map: TiledMap;
    popup!: TMObjectPopup;
    activePopup?: TMObjectPopup;
    target?: BaseTMObject;

    constructor(map: TiledMap) {
        super();

        this.map = map;
        this.createPopup();

        document.addEventListener(EVENTS.Actions.TMObject.Press, this.showPopup);

        this.resize();
    }

    createPopup = () => {
        this.popup = new TMObjectPopup(this.map);
        this.popup.position.set(100, 100);
        this.addChild(this.popup);
    };

    showPopup = async (e: Event) => {
        await this.popup.hide();
        this.popup.clearPopup();

        const detail = (e as CustomEvent<PopupData>).detail;
        this.target = detail.target;

        if (detail.buttons) {
            this.popup.addButtons(detail.buttons);
        }

        if (detail.title) {
            this.popup.setTitle(detail.title);
        }

        this.popup.show()?.then(() => {
            document.addEventListener(EVENTS.Map.Click, this.hidePopup);
        });

        this.resize();
    };

    hidePopup = () => {
        if (this.popup.isShown) {
            document.removeEventListener(EVENTS.Map.Click, this.hidePopup);

            this.target = undefined;
            this.popup.hide()?.then(() => {
                // this.popup.clearPopup();
            });
        }
    };

    cleanUp = () => {
        this.popup.cleanUp();
    };

    resize = () => {
        if (this.target) {
            this.popup.position.set(
                this.target.sprite.getGlobalPosition().x - this.popup.width / 2,
                this.target.sprite.getBounds().y - this.target.sprite.height + this.target.sprite.height / 2 - this.popup.height,
            );
        }
    };
}

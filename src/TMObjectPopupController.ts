import { EVENTS } from "./Events";
import { SeedOptionsPopup } from "./GameComponents/SeedPopup/SeedOptionsPopup";
import { BaseTMObject } from "./GameComponents/TMObjects/BaseTMObject";
import TiledMap from "./TMCore/TiledMap";
import { TMObjectPopup } from "./TMObjectPopup";

export interface PopupBase {
    target: BaseTMObject;
}

export interface PopupData extends PopupBase {
    title?: string;
    buttons?: { [key: string]: () => void };
}

export class TMObjectPopupController extends PIXI.Container {
    map: TiledMap;
    popup!: TMObjectPopup;
    seedPopup!: SeedOptionsPopup;
    activePopup?: TMObjectPopup;
    target?: BaseTMObject;

    constructor(map: TiledMap) {
        super();

        this.map = map;
        this.createPopups();

        document.addEventListener(EVENTS.Actions.TMObject.Press, this.showOptionPopup);
        document.addEventListener(EVENTS.Actions.Dirt.Seed, this.showSeedPopup);

        this.resize();
    }

    createPopups = () => {
        this.popup = new TMObjectPopup(this.map);
        this.popup.position.set(100, 100);
        this.addChild(this.popup);

        this.seedPopup = new SeedOptionsPopup(this.map);
        this.seedPopup.position.set(100, 100);
        this.addChild(this.seedPopup);
    };

    showOptionPopup = async (e: Event) => {
        await this.hidePopup();

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
            return this.popup.hide();
        }

        if (this.seedPopup.isShown) {
            document.removeEventListener(EVENTS.Map.Click, this.hidePopup);

            this.target = undefined;
            return this.seedPopup.hide();
        }

        return Promise.resolve();
    };

    showSeedPopup = async (e: Event) => {
        await this.hidePopup();

        const detail = (e as CustomEvent<PopupBase>).detail;
        this.target = detail.target;

        this.seedPopup.show()?.then(() => {
            document.addEventListener(EVENTS.Map.Click, this.hidePopup);
        });

        this.resize();
    };

    cleanUp = () => {
        document.removeEventListener(EVENTS.Actions.TMObject.Press, this.showOptionPopup);
        document.removeEventListener(EVENTS.Actions.Dirt.Seed, this.showSeedPopup);

        this.popup.cleanUp();
        this.seedPopup.cleanUp();
    };

    resize = () => {
        if (this.target) {
            const hitArea = this.target.tileset.getTMObjectHitArea(this.target.source.gid);
            let y = 0;

            if (hitArea) {
                y = this.target.sprite.getGlobalPosition().y - this.popup.height - hitArea.height - 10;
            } else {
                y = this.target.sprite.getBounds().y - this.popup.height;
            }

            this.popup.position.set(this.target.sprite.getGlobalPosition().x - this.popup.width / 2, y);

            this.seedPopup.position.set(this.target.sprite.getGlobalPosition().x, this.target.sprite.getGlobalPosition().y);
        }
    };
}
